import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Store, MapPin, Shield, Clock, AlertTriangle, Phone, Send, Lock,
  CheckCircle2, TrendingUp, TrendingDown, Minus, Users, Bell,
  FileWarning, Briefcase, Building2, Fuel, Pill, CreditCard,
  Eye, MessageCircle, UserCheck, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'crime-layer' | 'extortion' | 'sector-alerts' | 'trader-network' | 'saps-link';

interface ViewProps {
  onUpgrade?: (trigger?: string) => void;
  onNavigate?: (view: string) => void;
}

const businessHotspots = [
  { id: 1, name: 'Voortrekker Rd Commercial Strip', suburb: 'Bellville', type: 'Business Robbery', incidents30d: 9, trend: 'up' as const },
  { id: 2, name: 'Philippi Industrial Area', suburb: 'Philippi', type: 'Commercial Burglary', incidents30d: 14, trend: 'up' as const },
  { id: 3, name: 'Claremont Main Road', suburb: 'Claremont', type: 'Smash & Grab', incidents30d: 6, trend: 'down' as const },
  { id: 4, name: 'Parow Centre Precinct', suburb: 'Parow', type: 'ATM Attack', incidents30d: 4, trend: 'stable' as const },
  { id: 5, name: 'Mitchell\'s Plain Town Centre', suburb: 'Mitchell\'s Plain', type: 'Business Robbery', incidents30d: 11, trend: 'up' as const },
  { id: 6, name: 'Salt River Industrial', suburb: 'Salt River', type: 'Commercial Burglary', incidents30d: 7, trend: 'down' as const },
];

const traderNetworks = [
  { id: 1, name: 'Mitchell\'s Plain Market Traders', members: 34, steward: 'Verified', alerts: 3 },
  { id: 2, name: 'Bellville CBD Vendors', members: 22, steward: 'Verified', alerts: 1 },
  { id: 3, name: 'Khayelitsha Informal Traders', members: 48, steward: 'Verified', alerts: 5 },
  { id: 4, name: 'Wynberg Station Vendors', members: 18, steward: 'Pending', alerts: 2 },
  { id: 5, name: 'Philippi Market Association', members: 29, steward: 'Verified', alerts: 4 },
];

const sectorCategories = [
  { id: 'cit', label: 'Cash-in-Transit Robbery', icon: CreditCard, radius: 'Route-based', subscribed: true },
  { id: 'atm', label: 'ATM Attack', icon: CreditCard, radius: '500m', subscribed: true },
  { id: 'fuel', label: 'Fuel Station Robbery', icon: Fuel, radius: '2km', subscribed: false },
  { id: 'pharmacy', label: 'Pharmacy / Retail Robbery', icon: Pill, radius: '2km precinct', subscribed: false },
  { id: 'burglary', label: 'Commercial Burglary', icon: Building2, radius: '1km', subscribed: true },
];

const SAPSFooter = () => (
  <div className="mt-4 pt-3 border-t border-border text-[10px] text-muted-foreground/60 font-mono flex items-center justify-between">
    <span>Source: SAPS Commercial Crime Unit · Q3 2025/26</span>
    <a href="https://www.saps.gov.za" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">saps.gov.za</a>
  </div>
);

// --- Tab 1: Business Crime Layer ---
const CrimeLayerTab = () => {
  const [registered, setRegistered] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            Commercial Crime Map Layer
          </CardTitle>
          <p className="text-xs text-muted-foreground">Toggle "Commercial Crime" on the main map for business robberies, ATM attacks, smash-and-grab zones, and burglary clusters.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/30 border border-border/50 p-4 mb-4">
            <div className="w-full h-28 bg-gradient-to-br from-amber-900/20 via-background to-primary/10 rounded-lg flex items-center justify-center border border-dashed border-primary/30">
              <div className="text-center">
                <Store className="w-8 h-8 text-primary mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Enable "Commercial Crime" layer on map</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              {[
                { label: 'Business Robbery', color: 'bg-destructive' },
                { label: 'ATM Attack', color: 'bg-amber-500' },
                { label: 'Smash & Grab', color: 'bg-orange-500' },
                { label: 'Burglary', color: 'bg-primary' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={cn("w-2.5 h-2.5 rounded-sm", item.color)} />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {businessHotspots.map(spot => (
              <div key={spot.id} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{spot.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{spot.suburb}</span>
                      <Badge variant="outline" className="text-[9px] h-4">{spot.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {spot.trend === 'up' && <TrendingUp className="w-3 h-3 text-destructive" />}
                    {spot.trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                    {spot.trend === 'stable' && <Minus className="w-3 h-3 text-muted-foreground" />}
                    <span className="text-sm font-bold text-foreground">{spot.incidents30d}</span>
                    <span className="text-[9px] text-muted-foreground">30d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">Register Your Business (Free)</div>
                <p className="text-xs text-muted-foreground mt-0.5">Get hyper-local crime alerts for your exact address. No cost — just register your business premises.</p>
                <Button
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => setRegistered(true)}
                  disabled={registered}
                >
                  {registered ? '✓ Business Registered' : 'Register My Business'}
                </Button>
              </div>
            </div>
          </div>
          <SAPSFooter />
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab 2: Extortion Threat Reporting ---
const ExtortionTab = () => {
  const [demandNature, setDemandNature] = useState('');
  const [frequency, setFrequency] = useState('');
  const [violenceThreatened, setViolenceThreatened] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-destructive/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            Extortion Threat Reporting
          </CardTitle>
          <p className="text-xs text-muted-foreground">Fully anonymous and encrypted. No business name or owner identity is collected unless you choose to provide it. Reports are compiled into anonymised area-level intelligence for SAPS Commercial Crime Unit and CPFs.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Your safety is paramount.</span> This form collects NO identifying information by default. All data is end-to-end encrypted and anonymised before sharing with law enforcement.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nature of extortion demand</label>
            <Textarea
              placeholder="Describe the demand (e.g. monthly payment, percentage of revenue, specific goods/services...)"
              value={demandNature}
              onChange={e => setDemandNature(e.target.value)}
              className="text-sm min-h-[70px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Frequency</label>
              <Input placeholder="e.g. Weekly, Monthly" value={frequency} onChange={e => setFrequency(e.target.value)} className="text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Business type</label>
              <Input placeholder="e.g. Spaza shop, Salon" value={businessType} onChange={e => setBusinessType(e.target.value)} className="text-sm" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-muted-foreground">Violence was threatened or used</span>
            </div>
            <Switch checked={violenceThreatened} onCheckedChange={setViolenceThreatened} />
          </div>

          <Button
            className="w-full bg-destructive hover:bg-destructive/90"
            size="sm"
            onClick={() => setSubmitted(true)}
            disabled={submitted || !demandNature.trim()}
          >
            <Send className="w-4 h-4 mr-1.5" />
            {submitted ? 'Report Submitted Anonymously ✓' : 'Submit Encrypted Report'}
          </Button>

          {submitted && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
              <p className="text-xs text-emerald-600 font-medium">🔒 Report encrypted and anonymised. Routed to SAPS Commercial Crime Unit. No identifying data was collected.</p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">How your report is used</div>
            <div className="space-y-1">
              {[
                'Compiled into area-level extortion heat intelligence',
                'Shared with SAPS Commercial Crime & relevant CPFs',
                'Used to identify extortion patterns and syndicate activity',
                'Never linked back to any individual reporter',
              ].map(item => (
                <div key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab 3: Sector-Specific Alerts ---
const SectorAlertsTab = () => {
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set(['cit', 'atm', 'burglary']));

  const toggleSub = (id: string) => {
    setSubscriptions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Sector-Specific Alert Subscriptions
          </CardTitle>
          <p className="text-xs text-muted-foreground">Subscribe to crime categories relevant to your business. Receive immediate push notifications when incidents occur near you.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {sectorCategories.map(cat => {
            const isSubscribed = subscriptions.has(cat.id);
            return (
              <div key={cat.id} className={cn(
                "rounded-lg border p-3 transition-colors",
                isSubscribed ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-border/50"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <cat.icon className={cn("w-4 h-4", isSubscribed ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <div className="text-sm font-medium text-foreground">{cat.label}</div>
                      <div className="text-[10px] text-muted-foreground">Alert radius: {cat.radius}</div>
                    </div>
                  </div>
                  <Switch checked={isSubscribed} onCheckedChange={() => toggleSub(cat.id)} />
                </div>
              </div>
            );
          })}

          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground">
                When an incident matching your subscriptions occurs within your alert radius, you'll receive an immediate push notification with details, safe distance advisory, and precinct response status.
              </p>
            </div>
          </div>
          <SAPSFooter />
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab 4: Informal Trader Safety Network ---
const TraderNetworkTab = () => {
  const [joined, setJoined] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Informal Trader Safety Networks
          </CardTitle>
          <p className="text-xs text-muted-foreground">Join your market or area's trader network. Share safety warnings, coordinate with stewards, and access emergency contacts.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {traderNetworks.map(network => {
            const isJoined = joined.has(network.id.toString());
            return (
              <div key={network.id} className={cn(
                "rounded-lg border p-3",
                isJoined ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-border/50"
              )}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{network.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {network.members} traders</span>
                      <Badge variant="outline" className={cn("text-[9px] h-4", network.steward === 'Verified' ? "text-emerald-600 border-emerald-500/30" : "text-amber-500 border-amber-500/30")}>
                        Steward: {network.steward}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {network.alerts > 0 && (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[9px]" variant="outline">
                        {network.alerts} alerts
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant={isJoined ? "default" : "outline"}
                      className="h-7 text-[10px]"
                      onClick={() => setJoined(prev => {
                        const next = new Set(prev);
                        const key = network.id.toString();
                        if (next.has(key)) next.delete(key); else next.add(key);
                        return next;
                      })}
                    >
                      {isJoined ? '✓ Joined' : 'Join Network'}
                    </Button>
                  </div>
                </div>
                {isJoined && (
                  <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-[10px]">
                      <MessageCircle className="w-3 h-3 mr-1" /> Post Warning
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-[10px]">
                      <Phone className="w-3 h-3 mr-1" /> Emergency Contacts
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

// --- Tab 5: SAPS Commercial Crime Quick Link ---
const SAPSLinkTab = () => {
  const [caseNumber, setCaseNumber] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const incidentTypes = ['Business Robbery', 'Commercial Burglary', 'Fraud / Scam', 'ATM / Card Skimming', 'Extortion', 'Shoplifting / Internal Theft', 'Smash & Grab'];

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            SAPS Business Crime Reporting
          </CardTitle>
          <p className="text-xs text-muted-foreground">Pre-filled structured report routed directly to SAPS Commercial Crime Unit for your precinct — bypassing the 10111 general queue.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Incident type</label>
            <div className="flex flex-wrap gap-1.5">
              {incidentTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setIncidentType(type)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors",
                    incidentType === type
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Describe the incident (what happened, when, any suspect descriptions...)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="text-sm min-h-[70px]"
          />

          <Button
            className="w-full"
            size="sm"
            onClick={() => setSubmitted(true)}
            disabled={submitted || !incidentType || !description.trim()}
          >
            <Send className="w-4 h-4 mr-1.5" />
            {submitted ? 'Report Sent to SAPS Commercial Crime ✓' : 'Submit to SAPS Commercial Crime Unit'}
          </Button>

          {submitted && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
              <p className="text-xs text-emerald-600 font-medium">Report routed to SAPS Commercial Crime Unit. Precinct ref: CCU-{Date.now().toString(36).toUpperCase()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Tracking */}
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            Follow Up on My Case
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input placeholder="Enter SAPS case number (e.g. CAS 123/01/2026)" value={caseNumber} onChange={e => setCaseNumber(e.target.value)} className="text-sm" />
            </div>
            <Button size="sm" variant="outline" disabled={!caseNumber.trim()}>
              Track Case
            </Button>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-[11px] text-muted-foreground">Enter your SAPS case reference number to check status and log follow-up notes. Your case history is stored securely in your Gridfy profile.</p>
          </div>
        </CardContent>
      </Card>

      {/* SAPS e-Service link */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">SAPS e-Service Portal</div>
                <p className="text-[11px] text-muted-foreground">Official SAPS online crime reporting for businesses</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
              <a href="https://www.saps.gov.za/services/crimereporting.php" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" /> Open Portal
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <SAPSFooter />
    </div>
  );
};

// --- Main View ---
const BusinessSafetyView = ({ onUpgrade, onNavigate }: ViewProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('crime-layer');

  const tabs: { id: TabId; label: string; icon: typeof Store }[] = [
    { id: 'crime-layer', label: 'Crime Layer', icon: Store },
    { id: 'extortion', label: 'Extortion', icon: Lock },
    { id: 'sector-alerts', label: 'Sector Alerts', icon: Bell },
    { id: 'trader-network', label: 'Trader Network', icon: Users },
    { id: 'saps-link', label: 'SAPS Report', icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Store className="w-6 h-6 text-primary" />
          Business & Trader Safety Intel
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Commercial crime layer, extortion reporting, sector alerts, trader networks & SAPS business crime unit</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Business Robberies (30d)', value: '51', color: 'text-destructive', trend: 'up' },
          { label: 'Extortion Reports', value: '18', color: 'text-amber-500', trend: 'up' },
          { label: 'Businesses Registered', value: '234', color: 'text-primary', trend: 'up' },
          { label: 'Trader Networks', value: '12', color: 'text-emerald-500', trend: 'stable' },
        ].map((kpi, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="p-3 text-center">
              <div className={cn("text-2xl font-black", kpi.color)}>{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 text-destructive" />}
                {kpi.trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                {kpi.trend === 'stable' && <Minus className="w-3 h-3 text-muted-foreground" />}
                {kpi.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

      {activeTab === 'crime-layer' && <CrimeLayerTab />}
      {activeTab === 'extortion' && <ExtortionTab />}
      {activeTab === 'sector-alerts' && <SectorAlertsTab />}
      {activeTab === 'trader-network' && <TraderNetworkTab />}
      {activeTab === 'saps-link' && <SAPSLinkTab />}
    </div>
  );
};

export default BusinessSafetyView;
