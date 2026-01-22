// Lovable Cloud backend function: create alerts for high-severity wildfire events.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type SeverityThreshold = "moderate" | "high" | "critical";

function severitiesFromThreshold(threshold: SeverityThreshold): string[] {
  if (threshold === "critical") return ["critical"];
  if (threshold === "high") return ["high", "critical"];
  return ["moderate", "high", "critical"];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) {
      return new Response(JSON.stringify({ error: "Missing backend configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const threshold = (body?.severityThreshold ?? "high") as SeverityThreshold;
    const allowedSeverities = severitiesFromThreshold(threshold);

    // Find candidate events
    const { data: events, error: eventsError } = await supabase
      .from("wildfire_events")
      .select("id, title, severity, status, detected_at, latitude, longitude")
      .eq("status", "active")
      .in("severity", allowedSeverities)
      .order("detected_at", { ascending: false })
      .limit(200);

    if (eventsError) throw eventsError;

    if (!events?.length) {
      return new Response(JSON.stringify({ createdAlerts: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find existing alert links to dedupe
    const ids = events.map((e) => e.id);
    const { data: existing, error: existingError } = await supabase
      .from("wildfire_alerts")
      .select("event_id")
      .in("event_id", ids);
    if (existingError) throw existingError;

    const existingSet = new Set((existing ?? []).map((r) => r.event_id));
    const toCreate = events.filter((e) => !existingSet.has(e.id));

    let createdAlerts = 0;
    for (const evt of toCreate) {
      const sev = String(evt.severity).toLowerCase();
      const priority = sev === "critical" ? "critical" : sev === "high" ? "high" : "medium";

      const { data: alertRow, error: alertErr } = await supabase
        .from("alert_queue")
        .insert({
          alert_type: "wildfire",
          priority,
          title: `Wildfire: ${evt.title}`,
          description: `Active wildfire event detected (${String(evt.severity)}).`,
          entity_type: "wildfire",
          entity_id: evt.id,
          status: "pending",
          metadata: {
            wildfire_event_id: evt.id,
            detected_at: evt.detected_at,
            lat: evt.latitude,
            lng: evt.longitude,
            source: "csi_afis",
          },
        })
        .select("id")
        .single();

      if (alertErr) throw alertErr;

      const { error: linkErr } = await supabase.from("wildfire_alerts").insert({
        event_id: evt.id,
        alert_id: alertRow.id,
      });
      if (linkErr) throw linkErr;

      createdAlerts += 1;
    }

    return new Response(JSON.stringify({ createdAlerts }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
