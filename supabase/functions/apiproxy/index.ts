const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const service = url.searchParams.get("service");

    // ---------- ESP: Load Shedding Status ----------
    if (service === "esp-status") {
      const espKey = Deno.env.get("ESP_API_KEY");
      if (!espKey) {
        return new Response(
          JSON.stringify({
            status: "demo",
            stage: 0,
            stage_updated: new Date().toISOString(),
            note: "Demo data - Add ESP_API_KEY secret for live EskomSePush data",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const resp = await fetch("https://developer.sepush.co.za/business/2.0/status", {
        headers: { Token: espKey },
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`ESP API error: ${resp.status} ${body}`);
      }
      const data = await resp.json();

      return new Response(
        JSON.stringify({
          status: "live",
          eskom_stage: parseInt(data.status.eskom.stage, 10),
          eskom_updated: data.status.eskom.stage_updated,
          capetown_stage: data.status.capetown ? parseInt(data.status.capetown.stage, 10) : null,
          capetown_updated: data.status.capetown?.stage_updated || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---------- ESP: Area Schedule ----------
    if (service === "esp-area") {
      const areaId = url.searchParams.get("area_id");
      if (!areaId) {
        return new Response(JSON.stringify({ error: "area_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const espKey = Deno.env.get("ESP_API_KEY");
      if (!espKey) {
        return new Response(
          JSON.stringify({
            status: "demo",
            area_id: areaId,
            events: [],
            next_outage: null,
            note: "Demo data - Add ESP_API_KEY for live schedule",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const resp = await fetch(
        `https://developer.sepush.co.za/business/2.0/area?id=${encodeURIComponent(areaId)}`,
        { headers: { Token: espKey } }
      );
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`ESP Area API error: ${resp.status} ${body}`);
      }
      const data = await resp.json();
      const nextEvent = data.events?.[0] || null;

      return new Response(
        JSON.stringify({
          status: "live",
          area_id: areaId,
          area_name: data.info?.name || areaId,
          region: data.info?.region || "Western Cape",
          events: data.events || [],
          next_outage: nextEvent
            ? { start: nextEvent.start, end: nextEvent.end, note: nextEvent.note }
            : null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---------- OpenWeather ----------
    if (service === "weather") {
      const lat = url.searchParams.get("lat") || "-33.9649";
      const lon = url.searchParams.get("lon") || "18.6017";
      const owKey = Deno.env.get("OPENWEATHER_API_KEY");

      if (!owKey) {
        return new Response(
          JSON.stringify({
            status: "demo",
            temp: 24,
            feels_like: 22,
            wind_speed: 15,
            wind_direction: "SE",
            description: "Clear sky",
            icon: "01d",
            humidity: 55,
            wind_alert: false,
            note: "Demo data - Add OPENWEATHER_API_KEY for live weather",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owKey}&units=metric`
      );
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`OpenWeather error: ${resp.status} ${body}`);
      }
      const data = await resp.json();
      const windKmh = Math.round((data.wind?.speed || 0) * 3.6);

      return new Response(
        JSON.stringify({
          status: "live",
          temp: Math.round(data.main?.temp),
          feels_like: Math.round(data.main?.feels_like),
          wind_speed: windKmh,
          wind_direction: data.wind?.deg || 0,
          description: data.weather?.[0]?.description || "N/A",
          icon: data.weather?.[0]?.icon || "01d",
          humidity: data.main?.humidity,
          wind_alert: windKmh > 40,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown service. Use: esp-status, esp-area, weather" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("API Proxy error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
