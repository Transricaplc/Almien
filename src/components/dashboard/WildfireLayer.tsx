import { useMemo } from "react";
import { Circle, CircleMarker, GeoJSON, Popup } from "react-leaflet";
import { useWildfireData } from "@/hooks/useWildfireData";
import { useWildfireViewer } from "@/contexts/WildfireContext";
import { cn } from "@/lib/utils";

function getSeverityStyle(severity: string) {
  const s = severity?.toLowerCase?.() ?? "moderate";
  if (s === "critical") return { color: "hsl(var(--destructive))", fill: "hsl(var(--destructive))" };
  if (s === "high") return { color: "hsl(var(--accent))", fill: "hsl(var(--accent))" };
  if (s === "moderate") return { color: "hsl(var(--primary))", fill: "hsl(var(--primary))" };
  return { color: "hsl(var(--muted-foreground))", fill: "hsl(var(--muted-foreground))" };
}

export default function WildfireLayer({ visible }: { visible: boolean }) {
  const { enabled, showHotspots, showPerimeters, showHeat } = useWildfireViewer();
  const { events, perimetersByEventId } = useWildfireData(30_000);

  const hotspotEvents = useMemo(
    () => events.filter((e) => e.latitude != null && e.longitude != null),
    [events]
  );

  if (!visible || !enabled) return null;

  return (
    <>
      {/* Heat overlay (approximation using concentric circles) */}
      {showHeat &&
        hotspotEvents.map((e) => {
          const intensity = Math.max(0, Number(e.intensity ?? 0));
          const base = 250 + Math.min(1750, intensity * 40);
          const style = getSeverityStyle(String(e.severity));
          return (
            <Circle
              key={`heat-${e.id}`}
              center={[Number(e.latitude), Number(e.longitude)]}
              radius={base}
              pathOptions={{
                color: style.color,
                fillColor: style.fill,
                fillOpacity: 0.12,
                opacity: 0.2,
                weight: 1,
              }}
            />
          );
        })}

      {/* Hotspot markers */}
      {showHotspots &&
        hotspotEvents.map((e) => {
          const style = getSeverityStyle(String(e.severity));
          return (
            <CircleMarker
              key={`hotspot-${e.id}`}
              center={[Number(e.latitude), Number(e.longitude)]}
              radius={8}
              pathOptions={{
                color: style.color,
                fillColor: style.fill,
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-sm">{e.title}</div>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded border",
                        "bg-background/60 text-foreground border-border"
                      )}
                    >
                      {String(e.severity).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: {String(e.status)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Detected: {new Date(e.detected_at).toLocaleString()}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

      {/* Perimeter polygons */}
      {showPerimeters &&
        hotspotEvents.flatMap((e) => {
          const polys = perimetersByEventId[e.id] || [];
          if (!polys.length) return [];
          const style = getSeverityStyle(String(e.severity));
          return polys.map((p) => (
            <GeoJSON
              key={`perim-${p.id}`}
              data={p.perimeter_geojson as any}
              style={{
                color: style.color,
                weight: 2,
                opacity: 0.8,
                fillColor: style.fill,
                fillOpacity: 0.1,
              }}
            />
          ));
        })}
    </>
  );
}
