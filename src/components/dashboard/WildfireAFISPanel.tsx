import { useEffect, useMemo, useState } from "react";
import { Flame, RefreshCcw, Layers, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWildfireViewer } from "@/contexts/WildfireContext";
import { useWildfireData } from "@/hooks/useWildfireData";
import { cn } from "@/lib/utils";

export default function WildfireAFISPanel() {
  const viewer = useWildfireViewer();
  const { events, isLoading, error, refetch } = useWildfireData(30_000);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "ok" | "error">("idle");
  const [syncMessage, setSyncMessage] = useState<string>("");

  const stats = useMemo(() => {
    const active = events.filter((e) => String(e.status).toLowerCase() === "active");
    const critical = active.filter((e) => String(e.severity).toLowerCase() === "critical").length;
    const high = active.filter((e) => String(e.severity).toLowerCase() === "high").length;
    return { activeCount: active.length, high, critical };
  }, [events]);

  const runAlertSync = async () => {
    setSyncStatus("syncing");
    setSyncMessage("");
    const { data, error: fnError } = await supabase.functions.invoke("wildfire-alert-sync", {
      body: { severityThreshold: "high" },
    });
    if (fnError) {
      setSyncStatus("error");
      setSyncMessage(fnError.message);
      return;
    }
    setSyncStatus("ok");
    setSyncMessage(`Synced ${data?.createdAlerts ?? 0} new alert(s).`);
  };

  // Auto-run alert sync when critical/high exists (debounced by idle state)
  useEffect(() => {
    if (stats.high + stats.critical === 0) return;
    if (syncStatus !== "idle") return;
    void runAlertSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.high, stats.critical]);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold">CSI AFIS Wildfire</div>
            <div className="text-xs text-muted-foreground">Backend feed • map overlay</div>
          </div>
        </div>
        <button
          onClick={() => {
            void refetch();
            void runAlertSync();
          }}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors",
            "bg-background/40 border-border hover:bg-background/60"
          )}
        >
          <RefreshCcw className={cn("w-3.5 h-3.5", syncStatus === "syncing" && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-card/40 border border-border/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active</div>
          <div className="text-lg font-bold tabular-nums">{stats.activeCount}</div>
        </div>
        <div className="p-3 rounded-lg bg-card/40 border border-border/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">High</div>
          <div className="text-lg font-bold tabular-nums">{stats.high}</div>
        </div>
        <div className="p-3 rounded-lg bg-card/40 border border-border/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Critical</div>
          <div className="text-lg font-bold tabular-nums">{stats.critical}</div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-background/30 border border-border/40">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-primary" />
          <div className="text-xs font-semibold">Map layers</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Enable overlay</span>
            <input
              type="checkbox"
              checked={viewer.enabled}
              onChange={(e) => viewer.setEnabled(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Hotspots</span>
            <input
              type="checkbox"
              checked={viewer.showHotspots}
              onChange={(e) => viewer.setShowHotspots(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Perimeters</span>
            <input
              type="checkbox"
              checked={viewer.showPerimeters}
              onChange={(e) => viewer.setShowPerimeters(e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Heat overlay</span>
            <input
              type="checkbox"
              checked={viewer.showHeat}
              onChange={(e) => viewer.setShowHeat(e.target.checked)}
            />
          </label>
        </div>
      </div>

      {(error || isLoading) && (
        <div className="p-3 rounded-lg border border-border/40 bg-card/30">
          <div className="text-xs text-muted-foreground">
            {isLoading ? "Loading wildfire feed…" : `Wildfire feed error: ${error}`}
          </div>
        </div>
      )}

      {syncStatus === "error" && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2">
          <TriangleAlert className="w-4 h-4 mt-0.5" />
          <div>
            <div className="font-semibold">Alert sync failed</div>
            <div className="opacity-90">{syncMessage}</div>
          </div>
        </div>
      )}

      {syncStatus === "ok" && syncMessage && (
        <div className="p-3 rounded-lg border border-border/40 bg-primary/10 text-xs">{syncMessage}</div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="p-3 rounded-lg border border-border/40 bg-card/30 text-xs text-muted-foreground">
          No wildfire events available yet. Once the backend feed is populated, hotspots/perimeters will appear on the map.
        </div>
      )}
    </div>
  );
}
