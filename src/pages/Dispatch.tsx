import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type CitizenReport = {
  id: string;
  report_type: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

type Incident = {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
};

type Unit = {
  id: string;
  name: string;
  callsign: string | null;
  current_status: string;
};

export default function DispatchPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const reports = useQuery({
    queryKey: ["citizen_reports"],
    queryFn: async (): Promise<CitizenReport[]> => {
      const { data, error } = await supabase
        .from("citizen_reports")
        .select("id, report_type, description, latitude, longitude, created_at")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const incidents = useQuery({
    queryKey: ["incidents"],
    queryFn: async (): Promise<Incident[]> => {
      const { data, error } = await supabase
        .from("incidents")
        .select("id, title, status, priority, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const units = useQuery({
    queryKey: ["responder_units"],
    queryFn: async (): Promise<Unit[]> => {
      const { data, error } = await supabase
        .from("responder_units")
        .select("id, name, callsign, current_status")
        .eq("is_active", true)
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const selectedReport = useMemo(
    () => (reports.data ?? []).find((r) => r.id === selectedReportId) ?? null,
    [reports.data, selectedReportId]
  );

  const createIncidentFromReport = async () => {
    if (!user || !selectedReport) return;
    try {
      const title = `Citizen report: ${selectedReport.report_type}`;
      const { error } = await supabase.from("incidents").insert({
        source_report_id: selectedReport.id,
        title,
        description: selectedReport.description,
        latitude: selectedReport.latitude,
        longitude: selectedReport.longitude,
        created_by: user.id,
      });
      if (error) throw error;
      toast({ title: "Incident created" });
      incidents.refetch();
    } catch (e: any) {
      toast({ title: "Create incident failed", description: e?.message, variant: "destructive" });
    }
  };

  const assignUnit = async () => {
    if (!user || !selectedIncidentId || !selectedUnitId) return;
    try {
      const { error } = await supabase.from("incident_assignments").insert({
        incident_id: selectedIncidentId,
        unit_id: selectedUnitId,
        assigned_by: user.id,
      });
      if (error) throw error;
      toast({ title: "Unit assigned" });
    } catch (e: any) {
      toast({ title: "Assign failed", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Console</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Recent citizen reports</div>
                <Button size="sm" onClick={() => reports.refetch()} variant="secondary">
                  Refresh
                </Button>
              </div>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(reports.data ?? []).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.report_type}</TableCell>
                        <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant={selectedReportId === r.id ? "default" : "secondary"} onClick={() => setSelectedReportId(r.id)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button disabled={!selectedReport} onClick={createIncidentFromReport}>
                Create incident from selected report
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Assign unit to incident</div>
              <div className="grid gap-2">
                <Select value={selectedIncidentId ?? undefined} onValueChange={setSelectedIncidentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident" />
                  </SelectTrigger>
                  <SelectContent>
                    {(incidents.data ?? []).map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.title} • {i.priority} • {i.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUnitId ?? undefined} onValueChange={setSelectedUnitId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {(units.data ?? []).map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {(u.callsign ? `${u.callsign} — ` : "") + u.name} • {u.current_status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button disabled={!selectedIncidentId || !selectedUnitId} onClick={assignUnit}>
                Dispatch unit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
