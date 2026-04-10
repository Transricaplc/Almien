import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  GraduationCap, MapPin, Shield, Clock, AlertTriangle, Navigation,
  Phone, Send, Eye, Baby, Siren, Radio, Lock, CheckCircle2,
  TrendingUp, TrendingDown, Minus, CircleAlert, Users, Route,
  Locate, Ban, FileWarning, UserCheck, Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'zones' | 'walk-route' | 'tracker' | 'reporting' | 'missing';

interface ViewProps {
  onUpgrade?: (trigger?: string) => void;
  onNavigate?: (view: string) => void;
}

const threatColors = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/30', label: 'Low Risk' },
  moderate: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/30', label: 'Moderate' },
  high: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30', label: 'High Risk' },
};

const schools = [
  { id: 1, name: 'Rondebosch Boys\' High School', suburb: 'Rondebosch', type: 'High School', threat: 'low' as const, incidents: 1, students: 1200 },
  { id: 2, name: 'Spine Road High School', suburb: 'Mitchell\'s Plain', type: 'High School', threat: 'high' as const, incidents: 8, students: 1450 },
  { id: 3, name: 'Wynberg Girls\' High School', suburb: 'Wynberg', type: 'High School', threat: 'low' as const, incidents: 0, students: 980 },
  { id: 4, name: 'Bellville South Primary', suburb: 'Bellville South', type: 'Primary School', threat: 'moderate' as const, incidents: 3, students: 820 },
  { id: 5, name: 'Manenberg Primary School', suburb: 'Manenberg', type: 'Primary School', threat: 'high' as const, incidents: 11, students: 650 },
  { id: 6, name: 'Camps Bay High School', suburb: 'Camps Bay', type: 'High School', threat: 'low' as const, incidents: 0, students: 720 },
  { id: 7, name: 'Delft Secondary School', suburb: 'Delft', type: 'High School', threat: 'high' as const, incidents: 9, students: 1100 },
  { id: 8, name: 'Fish Hoek Primary School', suburb: 'Fish Hoek', type: 'Primary School', threat: 'low' as const, incidents: 1, students: 560 },
];

const reportCategories = [
  { id: 'gang', label: 'Gang Activity Near School Gates', icon: '🔴', severity: 'critical' },
  { id: 'drugs', label: 'Drug Dealing on/near Premises', icon: '💊', severity: 'critical' },
  { id: 'suspicious', label: 'Suspicious Person Approaching Learners', icon: '👤', severity: 'high' },
  { id: 'weapon', label: 'Weapon Spotted', icon: '🔪', severity: 'critical' },
  { id: 'bullying', label: 'Bullying / Violence on Premises', icon: '⚠️', severity: 'moderate' },
];

const SAPSFooter = () => (
  <div className="mt-4 pt-3 border-t border-border text-[10px] text-muted-foreground/60 font-mono flex items-center justify-between">
    <span>Source: SAPS School Safety Unit · Western Cape Education Dept</span>
    <a href="https://www.saps.gov.za" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">saps.gov.za</a>
  </div>
);

// --- Tab: School Zone Safety Radius ---
const ZonesTab = () => {
  const [setSchool, setSetSchool] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            School Zone Safety Map
          </CardTitle>
          <p className="text-xs text-muted-foreground">Toggle "Schools" on the main map to see 300m safety radius overlays around every school. Colour reflects live threat level.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/30 border border-border/50 p-4 mb-4">
            <div className="w-full h-28 bg-gradient-to-br from-blue-900/20 via-background to-emerald-500/10 rounded-lg flex items-center justify-center border border-dashed border-blue-500/30">
              <div className="text-center">
                <GraduationCap className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Enable "Schools" layer on map</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              {Object.entries(threatColors).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={cn("w-3 h-3 rounded-full", val.bg, "border", val.border)} />
                  <span className="text-[10px] text-muted-foreground">{val.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {schools.map(school => {
              const threat = threatColors[school.threat];
              return (
                <div key={school.id} className={cn("rounded-lg border p-3", threat.bg, threat.border)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{school.name}</div>
                      <div className="text-[11px] opacity-80 mt-0.5 flex items-center gap-2">
                        <span>{school.suburb}</span>
                        <Badge variant="outline" className="text-[9px] h-4">{school.type}</Badge>
                      </div>
                    </div>
                    <Badge className={cn("shrink-0 text-[10px]", threat.bg, threat.text, "border", threat.border)} variant="outline">
                      {threat.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{school.incidents} incidents (300m, 30d)</span>
                      <span>{school.students} learners</span>
                    </div>
                    <Button
                      size="sm"
                      variant={setSchool === school.id ? "default" : "outline"}
                      className="h-6 text-[10px] px-2"
                      onClick={() => setSetSchool(school.id)}
                    >
                      {setSchool === school.id ? '✓ Set as Child\'s School' : 'Set as Child\'s School'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <SAPSFooter />
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab: Walk-to-School Safe Route ---
const WalkRouteTab = () => {
  const [childSchool, setChildSchool] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [routeGenerated, setRouteGenerated] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="w-4 h-4 text-blue-500" />
            Walk-to-School Safe Route
          </CardTitle>
          <p className="text-xs text-muted-foreground">Generates a daily safe walking route avoiding gang zones, drug hotspots, and high-traffic crime areas.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Home address / suburb" value={homeAddress} onChange={e => setHomeAddress(e.target.value)} className="text-sm" />
            <Input placeholder="Child's school name" value={childSchool} onChange={e => setChildSchool(e.target.value)} className="text-sm" />
          </div>
          <Button onClick={() => setRouteGenerated(true)} className="w-full" size="sm">
            <Navigation className="w-4 h-4 mr-1.5" /> Generate Safe Walking Route
          </Button>
        </CardContent>
      </Card>

      {routeGenerated && (
        <>
          <Card className="bg-card/80 backdrop-blur border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Today's Walk Route
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">Generated at 06:45 · Recalculated daily based on live threat data</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
                <div className="w-full h-24 bg-gradient-to-r from-emerald-900/20 via-blue-900/10 to-emerald-900/20 rounded-lg flex items-center justify-center border border-dashed border-emerald-500/30">
                  <span className="text-xs text-muted-foreground">Safe route map preview</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                  <div className="text-lg font-black text-foreground">1.2km</div>
                  <div className="text-[10px] text-muted-foreground">Distance</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                  <div className="text-lg font-black text-emerald-500">18min</div>
                  <div className="text-[10px] text-muted-foreground">Walk time</div>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 border border-border/50">
                  <div className="text-lg font-black text-blue-500">Safe</div>
                  <div className="text-[10px] text-muted-foreground">Route status</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Warnings</div>
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">Avoid corner of Main Rd & 3rd Ave — suspicious activity reported at 06:20 this morning</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2 flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">Walking buddy patrol active on this route (CPF volunteers until 08:00)</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Morning notification at 06:45</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Zones Avoided Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {[
                { zone: 'Gang activity corridor — 5th Ave', reason: 'Active gang territory, 4 incidents this week' },
                { zone: 'Drug hotspot — Park behind library', reason: '3 reports of drug dealing near school hours' },
                { zone: 'Unlit underpass — Railway Bridge', reason: 'No CCTV coverage, 2 muggings last month' },
              ].map((z, i) => (
                <div key={i} className="rounded-lg bg-destructive/5 border border-destructive/20 p-2">
                  <div className="text-xs font-medium text-foreground">{z.zone}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{z.reason}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// --- Tab: Parent Journey Tracker ---
const TrackerTab = () => {
  const [tracking, setTracking] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Locate className="w-4 h-4 text-blue-500" />
            Parent Journey Tracker
          </CardTitle>
          <p className="text-xs text-muted-foreground">Track your child's walk to school in real-time. Alerts trigger if they stop in a risk zone or deviate from the safe route.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => setTracking(!tracking)}
            className={cn("w-full", tracking ? "bg-destructive hover:bg-destructive/90" : "")}
            size="sm"
          >
            <Locate className="w-4 h-4 mr-1.5" />
            {tracking ? 'Stop Tracking' : 'Start Tracking My Child\'s Journey'}
          </Button>

          {tracking && (
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
                <div className="w-full h-32 bg-gradient-to-br from-blue-900/20 via-background to-emerald-500/10 rounded-lg flex items-center justify-center border border-dashed border-blue-500/30 relative">
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 text-[9px] animate-pulse">● LIVE</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">Live location tracking map</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2">
                  <div className="text-sm font-bold text-emerald-600">On Route</div>
                  <div className="text-[10px] text-muted-foreground">Status</div>
                </div>
                <div className="rounded-lg bg-muted/30 border border-border/50 p-2">
                  <div className="text-sm font-bold text-foreground">450m</div>
                  <div className="text-[10px] text-muted-foreground">Remaining</div>
                </div>
                <div className="rounded-lg bg-muted/30 border border-border/50 p-2">
                  <div className="text-sm font-bold text-foreground">~6 min</div>
                  <div className="text-[10px] text-muted-foreground">ETA</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alert Rules</div>
                {[
                  { rule: 'Stops >5 min in risk zone', status: 'Armed' },
                  { rule: 'Route deviation >100m', status: 'Armed' },
                  { rule: 'Silent SOS triggered', status: 'Armed' },
                  { rule: 'Phone offline >3 min', status: 'Armed' },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/50 p-2">
                    <span className="text-xs text-muted-foreground">{alert.rule}</span>
                    <Badge variant="outline" className="text-[9px] text-emerald-600 border-emerald-500/30">{alert.status}</Badge>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
                <div className="flex items-start gap-2">
                  <Baby className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-blue-600">Child's Silent SOS</div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Your child can trigger a silent SOS from their tracking screen — no visible indicator on their phone. You will receive an immediate alert with their exact GPS location.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab: School Reporting Portal ---
const ReportingTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-amber-500" />
            School Safety Reporting Portal
          </CardTitle>
          <p className="text-xs text-muted-foreground">For teachers, principals, and school safety officers. Reports are encrypted and sent directly to SAPS Family Violence & School Safety units.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report Category</div>
            {reportCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "w-full text-left rounded-lg border p-2.5 transition-colors",
                  selectedCategory === cat.id
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40"
                )}
              >
                <span className="text-sm">{cat.icon} {cat.label}</span>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <>
              <Textarea
                placeholder="Describe the incident in detail (location, time, description of individuals involved if safe to do so)..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="text-sm min-h-[80px]"
              />
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Submit anonymously (identity protected)</span>
                </div>
                <Switch checked={anonymous} onCheckedChange={setAnonymous} />
              </div>
              <Button
                className="w-full"
                size="sm"
                onClick={() => setSubmitted(true)}
                disabled={submitted || !description.trim()}
              >
                <Send className="w-4 h-4 mr-1.5" />
                {submitted ? 'Report Submitted Securely ✓' : 'Submit Encrypted Report'}
              </Button>
              {submitted && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                  <p className="text-xs text-emerald-600 font-medium">🔒 Report encrypted and sent to SAPS School Safety Unit. Reference: SSR-{Date.now().toString(36).toUpperCase()}</p>
                </div>
              )}
            </>
          )}

          <div className="rounded-lg bg-muted/30 border border-border/50 p-3">
            <div className="flex items-start gap-2">
              <UserCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">Verified Roles</div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Teachers, principals, and school safety officers can apply for Verified Reporter status for higher priority report routing.</p>
              </div>
            </div>
          </div>
          <SAPSFooter />
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab: Missing Child Broadcast ---
const MissingTab = () => {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [clothing, setClothing] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('');
  const [broadcast, setBroadcast] = useState(false);

  const activeAlerts = [
    { id: 1, desc: 'Girl, 9, wearing blue school uniform (Bellville Primary), last seen corner of Voortrekker & Durban Rd', time: '35 min ago', radius: '10km', saps: '021 918 3400' },
    { id: 2, desc: 'Boy, 12, grey hoodie and black pants, last seen Delft taxi rank', time: '2 hours ago', radius: '10km', saps: '021 954 2800' },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-destructive" />
            Report Missing Child
          </CardTitle>
          <p className="text-xs text-muted-foreground">Triggers an Amber-Alert style broadcast to all Almien users within 10km. Alert remains active until cancelled.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Child's name" value={childName} onChange={e => setChildName(e.target.value)} className="text-sm" />
            <Input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="text-sm" />
          </div>
          <Input placeholder="Clothing description (colour, school uniform, etc.)" value={clothing} onChange={e => setClothing(e.target.value)} className="text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Last seen location" value={lastSeen} onChange={e => setLastSeen(e.target.value)} className="text-sm" />
            <Input type="time" placeholder="Last seen time" value={lastSeenTime} onChange={e => setLastSeenTime(e.target.value)} className="text-sm" />
          </div>
          <Button
            className="w-full bg-destructive hover:bg-destructive/90"
            size="sm"
            onClick={() => setBroadcast(true)}
            disabled={broadcast || !childName.trim() || !age.trim()}
          >
            <Siren className="w-4 h-4 mr-1.5" />
            {broadcast ? 'Alert Broadcast Active ✓' : 'Broadcast Missing Child Alert'}
          </Button>
          {broadcast && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
              <p className="text-xs text-destructive font-medium">🚨 MISSING CHILD ALERT broadcast to all Almien users within 10km of last-seen location. SAPS has been notified. Do NOT cancel unless the child is found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-destructive" />
            Active Missing Child Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activeAlerts.map(alert => (
            <div key={alert.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <div className="text-sm font-medium text-foreground">🚨 {alert.desc}</div>
              <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-3">
                <span>{alert.time}</span>
                <span>Radius: {alert.radius}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-6 text-[10px]" asChild>
                  <a href={`tel:${alert.saps.replace(/\s/g, '')}`}>
                    <Phone className="w-3 h-3 mr-1" /> Call SAPS: {alert.saps}
                  </a>
                </Button>
                <Badge variant="outline" className="text-[9px] text-destructive border-destructive/30">DO NOT APPROACH</Badge>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground/60 text-center mt-2">National emergency: 10111 · Missing Children SA: 0800 055 000</p>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Main View ---
const SchoolSafetyView = ({ onUpgrade, onNavigate }: ViewProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('zones');

  const tabs: { id: TabId; label: string; icon: typeof GraduationCap }[] = [
    { id: 'zones', label: 'School Zones', icon: GraduationCap },
    { id: 'walk-route', label: 'Walk Route', icon: Route },
    { id: 'tracker', label: 'Journey Tracker', icon: Locate },
    { id: 'reporting', label: 'School Reports', icon: FileWarning },
    { id: 'missing', label: 'Missing Child', icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-500" />
          School & Child Safety Grid
        </h2>
        <p className="text-sm text-muted-foreground mt-1">School zone safety, safe walking routes, journey tracking, school reporting & missing child alerts</p>
      </div>

      {/* Hero KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Schools Monitored', value: '347', color: 'text-blue-500' },
          { label: 'High-Risk Zones', value: '23', color: 'text-destructive', trend: 'down' },
          { label: 'Active Alerts', value: '2', color: 'text-amber-500', trend: 'stable' },
          { label: 'Safe Routes Today', value: '1,204', color: 'text-emerald-500', trend: 'up' },
        ].map((kpi, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-3 text-center">
              <div className={cn("text-2xl font-black", kpi.color)}>{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                {kpi.trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                {kpi.trend === 'stable' && <Minus className="w-3 h-3 text-muted-foreground" />}
                {kpi.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-card/60 rounded-lg p-1 border border-border/50 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'zones' && <ZonesTab />}
      {activeTab === 'walk-route' && <WalkRouteTab />}
      {activeTab === 'tracker' && <TrackerTab />}
      {activeTab === 'reporting' && <ReportingTab />}
      {activeTab === 'missing' && <MissingTab />}
    </div>
  );
};

export default SchoolSafetyView;
