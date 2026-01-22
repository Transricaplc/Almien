import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WildfireSeverity = "low" | "moderate" | "high" | "critical";
export type WildfireStatus = "active" | "contained" | "extinguished";

export interface WildfireEventRow {
  id: string;
  title: string;
  severity: WildfireSeverity | string;
  status: WildfireStatus | string;
  detected_at: string;
  last_seen_at: string;
  latitude: number | null;
  longitude: number | null;
  intensity: number | null;
  metadata: Record<string, unknown>;
}

export interface WildfirePerimeterRow {
  id: string;
  event_id: string;
  perimeter_geojson: unknown;
  area_ha: number | null;
  updated_at: string;
}

interface UseWildfireDataReturn {
  events: WildfireEventRow[];
  perimetersByEventId: Record<string, WildfirePerimeterRow[]>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWildfireData(pollMs: number = 30_000): UseWildfireDataReturn {
  const [events, setEvents] = useState<WildfireEventRow[]>([]);
  const [perimeters, setPerimeters] = useState<WildfirePerimeterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);

    const [eventsRes, perimetersRes] = await Promise.all([
      supabase
        .from("wildfire_events")
        .select(
          "id, title, severity, status, detected_at, last_seen_at, latitude, longitude, intensity, metadata"
        )
        .order("detected_at", { ascending: false })
        .limit(500),
      supabase
        .from("wildfire_perimeters")
        .select("id, event_id, perimeter_geojson, area_ha, updated_at")
        .order("updated_at", { ascending: false })
        .limit(1000),
    ]);

    if (eventsRes.error) {
      setError(eventsRes.error.message);
      setEvents([]);
      setPerimeters([]);
      setIsLoading(false);
      return;
    }

    if (perimetersRes.error) {
      setError(perimetersRes.error.message);
      setEvents((eventsRes.data as WildfireEventRow[]) ?? []);
      setPerimeters([]);
      setIsLoading(false);
      return;
    }

    setEvents((eventsRes.data as WildfireEventRow[]) ?? []);
    setPerimeters((perimetersRes.data as WildfirePerimeterRow[]) ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      await fetchAll();
    };
    run();

    const t = window.setInterval(() => {
      if (!isMounted) return;
      void fetchAll();
    }, pollMs);

    return () => {
      isMounted = false;
      window.clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  const perimetersByEventId = useMemo(() => {
    const by: Record<string, WildfirePerimeterRow[]> = {};
    for (const p of perimeters) {
      (by[p.event_id] ||= []).push(p);
    }
    return by;
  }, [perimeters]);

  return {
    events,
    perimetersByEventId,
    isLoading,
    error,
    refetch: fetchAll,
  };
}
