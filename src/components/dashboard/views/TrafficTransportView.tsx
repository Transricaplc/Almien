import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrafficCone, AlertTriangle, TrainFront, Bus, Clock, Lock } from 'lucide-react';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const routes = [
  { id: 'n1-north', name: 'N1 Northbound', status: 'flowing', color: 'text-safety-green', speed: 85, normal: 100, travel: 18, normalTravel: 15, incidents: 0 },
  { id: 'n2-airport', name: 'N2 Airport – CBD', status: 'heavy', color: 'text-safety-orange', speed: 35, normal: 80, travel: 45, normalTravel: 20, incidents: 2 },
  { id: 'm3-southern', name: 'M3 Southern Suburbs', status: 'moderate', color: 'text-safety-yellow', speed: 55, normal: 80, travel: 28, normalTravel: 20, incidents: 1 },
  { id: 'm5-retreat', name: 'M5 Retreat – City', status: 'flowing', color: 'text-safety-green', speed: 75, normal: 80, travel: 22, normalTravel: 20, incidents: 0 },
  { id: 'r27-westcoast', name: 'R27 West Coast Road', status: 'flowing', color: 'text-safety-green', speed: 100, normal: 110, travel: 15, normalTravel: 14, incidents: 0 },
  { id: 'n7-malmesbury', name: 'N7 Malmesbury Rd', status: 'flowing', color: 'text-safety-green', speed: 95, normal: 100, travel: 12, normalTravel: 11, incidents: 0 },
];

const incidents = [
  { id: '1', severity: 'high', title: 'Accident – N2 Inbound near Airport', time: '12 minutes ago', location: 'N2, 2km before Airport off-ramp', type: 'Multi-vehicle collision', lanes: '2 of 3 lanes closed', delay: '30-45 minutes', alt: 'Use M5 via Mitchells Plain' },
  { id: '2', severity: 'medium', title: 'Roadworks – M3 Devils Peak Tunnel', time: '2 hours ago', location: 'M3 Southbound, Devils Peak area', type: 'Lane closure for maintenance', lanes: '1 of 2 lanes closed', delay: '10-15 minutes', alt: 'Use De Waal Drive' },
];

const trafficLightAreas = [
  { name: 'City Centre', faulty: 8, color: 'text-safety-red' },
  { name: 'Northern Suburbs', faulty: 12, color: 'text-safety-yellow' },
  { name: 'Southern Suburbs', faulty: 9, color: 'text-safety-yellow' },
  { name: 'Cape Flats', faulty: 15, color: 'text-safety-orange' },
];

const railLines = [
  { name: 'Central Line', status: 'Suspended (Repairs)', color: 'text-safety-red', icon: '🔴' },
  { name: 'Southern Line', status: 'Operating (Minor delays)', color: 'text-safety-green', icon: '🟢' },
  { name: 'Northern Line', status: 'Operating Normally', color: 'text-safety-green', icon: '🟢' },
  { name: "Simon's Town Line", status: 'Reduced Service', color: 'text-safety-yellow', icon: '🟡' },
];

const statusLabel = (s: string) => s === 'flowing' ? '🟢 FLOWING' : s === 'moderate' ? '🟡 MODERATE' : '🟠 HEAVY TRAFFIC';

const TrafficTransportView = memo(({ onUpgrade }: Props) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrafficCone className="w-6 h-6 text-primary" /> Traffic & Transport
        </h1>
        <p className="text-muted-foreground mt-1">Real-time traffic, public transport & road conditions</p>
        <p className="text-xs text-muted-foreground mt-0.5">Last updated: 3 minutes ago</p>
      </div>

      {/* Live Traffic Status */}
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-foreground mb-1">Live Traffic Status</h2>
          <p className="text-foreground font-medium">Cape Town Overall: <span className="text-safety-yellow">🟡 MODERATE CONGESTION</span></p>
          <p className="text-sm text-muted-foreground">Incidents: 8 active &middot; Avg delay: 12 minutes</p>
        </CardContent>
      </Card>

      {/* Major Routes */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Major Routes</h2>
        <Accordion type="multiple" className="space-y-2">
          {routes.map(r => (
            <AccordionItem key={r.id} value={r.id} className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center justify-between w-full pr-2">
                  <span className="font-semibold text-foreground">{r.name}</span>
                  <Badge variant="outline" className={`${r.color} border-current`}>{statusLabel(r.status)}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-2 text-sm">
                <p>Current Speed: <strong>{r.speed} km/h</strong> (Normal: {r.normal} km/h)</p>
                <p>Travel Time: <strong>{r.travel} min</strong> (Normal: {r.normalTravel} min)</p>
                <p>Congestion Level: {r.status === 'flowing' ? 'Low' : r.status === 'moderate' ? 'Moderate' : 'High'}</p>
                <p className="font-medium mt-2">Incidents: {r.incidents === 0 ? 'None reported ✓' : `${r.incidents} active`}</p>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">View on Map</button>
                  <button onClick={() => onUpgrade('traffic-alert')} className="text-xs px-3 py-1.5 rounded-md bg-elite-gradient text-white">Set Alert 👑</button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Traffic Incidents */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Active Traffic Incidents</h2>
        <div className="space-y-3">
          {incidents.map(inc => (
            <Card key={inc.id}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${inc.severity === 'high' ? 'text-safety-red' : 'text-safety-yellow'}`} />
                  <div>
                    <p className="font-semibold text-foreground">{inc.title}</p>
                    <p className="text-xs text-muted-foreground">{inc.time}</p>
                  </div>
                </div>
                <div className="text-sm space-y-1 pl-7">
                  <p>Location: {inc.location}</p>
                  <p>Type: {inc.type}</p>
                  <p>Lanes Affected: {inc.lanes}</p>
                  <p>Expected Delay: {inc.delay}</p>
                  <p className="text-primary font-medium">Alternative: {inc.alt}</p>
                </div>
                <div className="flex gap-2 pl-7 mt-2">
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">View Map</button>
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Get Alternative Route</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Traffic Lights */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Traffic Lights Status (Western Cape)</h2>
        <Card>
          <CardContent className="p-5">
            <p className="font-semibold text-foreground text-safety-green">🟢 92% OPERATIONAL</p>
            <div className="text-sm mt-2 space-y-1">
              <p>Working: 1,847 intersections (92%)</p>
              <p>Faulty: 127 intersections (6%)</p>
              <p>Under Repair: 38 intersections (2%)</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last Updated: 15 minutes ago</p>
          </CardContent>
        </Card>
        <div className="mt-3 space-y-2">
          {trafficLightAreas.map(a => (
            <Card key={a.name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${a.color}`}>{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.faulty} intersections faulty</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">View Details</button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Public Transport */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Public Transport</h2>

        <Card className="mb-3">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-base flex items-center gap-2"><TrainFront className="w-4 h-4" /> Metrorail Status</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-1.5 text-sm">
            {railLines.map(l => (
              <p key={l.name}>{l.icon} {l.name}: <span className={l.color}>{l.status}</span></p>
            ))}
            <div className="flex gap-2 mt-3">
              <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">View Full Schedule</button>
              <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Plan Journey</button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-3">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-base flex items-center gap-2"><Bus className="w-4 h-4" /> MyCiti Bus Status</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 text-sm space-y-1.5">
            <p className="text-safety-green font-medium">🟢 OPERATING NORMALLY</p>
            <p>Routes Operating: 98% &middot; Average Wait: 8 minutes</p>
            <p className="text-muted-foreground mt-1">Service Alerts:</p>
            <p className="text-sm">• Route T01: 10min delays (high demand)</p>
            <p className="text-sm">• Route 107: Diverted (roadworks on Main Rd)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-base flex items-center gap-2"><Bus className="w-4 h-4" /> Golden Arrow Bus</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 text-sm">
            <p className="text-safety-green font-medium">🟢 OPERATING NORMALLY</p>
            <p>Fleet Status: 87% operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Elite */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3"><Lock className="w-4 h-4" /> Elite Features 👑</h3>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>🔒 Real-time traffic alerts on saved routes</li>
            <li>🔒 Smart route planning (fastest/safest)</li>
            <li>🔒 Commute time predictions</li>
            <li>🔒 Traffic light ETA notifications</li>
            <li>🔒 Public transport live tracking</li>
          </ul>
          <button onClick={() => onUpgrade('traffic')} className="mt-4 px-4 py-2 rounded-lg bg-elite-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Upgrade to Elite</button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">API Sources: TomTom Traffic API &middot; City of Cape Town Open Data &middot; PRASA / Metrorail &middot; MyCiti Open Data</p>
    </div>
  );
});

TrafficTransportView.displayName = 'TrafficTransportView';
export default TrafficTransportView;
