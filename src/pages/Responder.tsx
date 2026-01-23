import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type UnitMembership = { unit_id: string };
type Unit = { id: string; name: string; callsign: string | null; current_status: string };
type Assignment = {
  id: string;
  incident_id: string;
  unit_id: string;
  status: string;
  acknowledged_at: string | null;
};
type Incident = { id: string; title: string; description: string | null; priority: string; status: string };

const UNIT_STATUSES = [
  "available",
  "enroute",
  "on_scene",
  "transporting",
  "unavailable",
] as const;

type UnitStatus = (typeof UNIT_STATUSES)[number];

export default function ResponderPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus>("available");

  const memberships = useQuery({
    queryKey: ["unit_members", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<UnitMembership[]> => {
      const { data, error } = await supabase.from("unit_members").select("unit_id").eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const unitIds = useMemo(() => (memberships.data ?? []).map((m) => m.unit_id), [memberships.data]);

  const units = useQuery({
    queryKey: ["responder_units", unitIds.join(",")],
    enabled: unitIds.length > 0,
    queryFn: async (): Promise<Unit[]> => {
      const { data, error } = await supabase
        .from("responder_units")
        .select("id, name, callsign, current_status")
        .in("id", unitIds);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const assignments = useQuery({
    queryKey: ["incident_assignments", unitIds.join(",")],
    enabled: unitIds.length > 0,
    queryFn: async (): Promise<Assignment[]> => {
      const { data, error } = await supabase
        .from("incident_assignments")
        .select("id, incident_id, unit_id, status, acknowledged_at")
        .in("unit_id", unitIds)
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const incidents = useQuery({
    queryKey: ["incidents_for_assignments", (assignments.data ?? []).map((a) => a.incident_id).join(",")],
    enabled: (assignments.data ?? []).length > 0,
    queryFn: async (): Promise<Incident[]> => {
      const ids = (assignments.data ?? []).map((a) => a.incident_id);
      const { data, error } = await supabase
        .from("incidents")
        .select("id, title, description, priority, status")
        .in("id", ids);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const incidentById = useMemo(() => {
    const map = new Map<string, Incident>();
    (incidents.data ?? []).forEach((i) => map.set(i.id, i));
    return map;
  }, [incidents.data]);

  const acknowledge = async (assignmentId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("incident_assignments")
        .update({ status: "accepted", acknowledged_by: user.id, acknowledged_at: new Date().toISOString() })
        .eq("id", assignmentId);
      if (error) throw error;
      toast({ title: "Acknowledged" });
      assignments.refetch();
    } catch (e: any) {
      toast({ title: "Acknowledge failed", description: e?.message, variant: "destructive" });
    }
  };

  const setStatusForAllMyUnits = async () => {
    if (!user || unitIds.length === 0) return;
    try {
      const payload = unitIds.map((unit_id) => ({ unit_id, status: selectedStatus, set_by: user.id }));
      const { error } = await supabase.from("unit_status_events").insert(payload);
      if (error) throw error;
      toast({ title: "Status updated" });
      units.refetch();
    } catch (e: any) {
      toast({ title: "Status update failed", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-5xl mx-auto grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Responder Console</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2 items-end">
              <div className="space-y-1">
                <div className="text-sm font-medium">Set unit status</div>
                <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as UnitStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={setStatusForAllMyUnits} disabled={unitIds.length === 0}>
                Update my unit(s)
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(assignments.data ?? []).map((a) => {
                    const inc = incidentById.get(a.incident_id);
                    const unit = (units.data ?? []).find((u) => u.id === a.unit_id);
                    return (
                      <TableRow key={a.id}>
                        <TableCell>{unit ? `${unit.callsign ? unit.callsign + " — " : ""}${unit.name}` : a.unit_id}</TableCell>
                        <TableCell>{inc ? inc.title : a.incident_id}</TableCell>
                        <TableCell>{a.status}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => acknowledge(a.id)} disabled={a.status !== "assigned"}>
                            Acknowledge
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
