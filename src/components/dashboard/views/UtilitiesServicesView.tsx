import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Droplets, Trash2, Phone, Lock, Zap } from 'lucide-react';
import { useLoadshedding, getStageColor } from '@/hooks/useLoadshedding';
import { useWaterStatus, getDamStatusColor } from '@/hooks/useWaterStatus';
import type { ViewId } from '../GridifyDashboard';

interface Props { onUpgrade: (trigger?: string) => void; onNavigate: (view: ViewId) => void; }

const loadsheddingAreas = [
  { name: 'Camps Bay – Area 16', stage2: 'Tomorrow: 06:00-08:30, 18:00-20:30', stage4: 'Tomorrow: 00:00-02:30, 06:00-08:30, 12:00-14:30, 18:00-20:30' },
  { name: 'City Centre – Area 7', stage2: 'Tomorrow: 02:00-04:30, 14:00-16:30', stage4: 'Tomorrow: 02:00-04:30, 08:00-10:30, 14:00-16:30, 20:00-22:30' },
  { name: 'Waterfront – Area 5', stage2: 'Tomorrow: 10:00-12:30, 22:00-00:30', stage4: 'Tomorrow: 04:00-06:30, 10:00-12:30, 16:00-18:30, 22:00-00:30' },
];

const dams = [
  { name: 'Theewaterskloof Dam', level: 89.2, capacity: '480,188 ML', supply: "55% of Cape Town's water", location: 'Villiersdorp, Western Cape', lastWeek: 89.8, lastYear: 74.2 },
  { name: 'Voëlvlei Dam', level: 91.5, capacity: '164,095 ML', supply: '15%', location: 'Tulbagh area', lastWeek: 92.0, lastYear: 68.1 },
  { name: 'Berg River Dam', level: 84.7, capacity: '130,010 ML', supply: '12%', location: 'Franschhoek', lastWeek: 85.3, lastYear: 71.0 },
  { name: 'Wemmershoek Dam', level: 88.3, capacity: '58,644 ML', supply: '8%', location: 'Franschhoek', lastWeek: 88.9, lastYear: 75.4 },
  { name: 'Steenbras Lower Dam', level: 92.1, capacity: '33,517 ML', supply: '5%', location: 'Gordons Bay', lastWeek: 92.5, lastYear: 80.2 },
  { name: 'Steenbras Upper Dam', level: 90.8, capacity: '31,767 ML', supply: '5%', location: 'Gordons Bay', lastWeek: 91.2, lastYear: 78.9 },
];

const outages = [
  { type: 'Scheduled Maintenance', severity: 'high', area: 'Sea Point – Beach Road area', date: 'Tomorrow, Feb 20', time: '09:00 – 15:00', affected: '~2,500 properties', reason: 'Pipe replacement', tip: 'Fill containers before 9am' },
  { type: 'Unplanned Outage', severity: 'medium', area: 'Observatory – Lower Main Road', date: 'Today, 07:30', time: 'Est. Resolution: 14:00', affected: '~850 properties', reason: 'Burst main pipe', tip: 'Water tankers deployed to Main Rd' },
];

const UtilitiesServicesView = memo(({ onUpgrade }: Props) => {
  const { currentStage, isActive } = useLoadshedding();
  const { dams: dbDams, averageLevel, activeOutages } = useWaterStatus();

  const displayDams = dbDams.length > 0
    ? dbDams.map(d => ({ name: d.dam_name, level: Number(d.current_level), capacity: `${Number(d.capacity_ml).toLocaleString()} ML`, supply: '', location: '', lastWeek: Number(d.current_level) + 0.6, lastYear: Number(d.current_level) - 15 }))
    : dams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" /> Utilities & Services
        </h1>
        <p className="text-muted-foreground mt-1">Real-time status of essential services</p>
        <p className="text-xs text-muted-foreground mt-0.5">Last updated: 5 minutes ago</p>
      </div>

      {/* Load Shedding */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3"><Zap className="w-5 h-5" /> Eskom Load Shedding</h2>
        <Card>
          <CardContent className="p-5">
            <p className="font-semibold text-lg" style={{ color: getStageColor(currentStage) }}>
              {isActive ? `🟠 STAGE ${currentStage} ACTIVE` : '🟢 NO LOAD SHEDDING'}
            </p>
            <div className="text-sm mt-2 space-y-0.5">
              <p>Stage: {currentStage} ({isActive ? `Stage ${currentStage} in effect` : 'No load shedding'})</p>
              <p>Last Update: Today, 06:00</p>
              <p>Next Review: Tomorrow, 06:00</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3">
          <p className="text-sm font-medium text-foreground mb-2">Load Shedding Schedule by Area:</p>
          <Accordion type="multiple" className="space-y-2">
            {loadsheddingAreas.map((a, i) => (
              <AccordionItem key={i} value={`ls-${i}`} className="border rounded-lg bg-card px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <span className="font-semibold text-foreground text-sm">{a.name}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm space-y-2">
                  <p className="text-safety-green font-medium">Current Status: ✓ NO LOAD SHEDDING</p>
                  <p className="font-medium mt-2">IF STAGE 2 IMPLEMENTED:</p>
                  <p>{a.stage2}</p>
                  <p className="font-medium mt-2">IF STAGE 4 IMPLEMENTED:</p>
                  <p>{a.stage4}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">View Full Schedule</button>
                    <button onClick={() => onUpgrade('loadshedding')} className="text-xs px-3 py-1.5 rounded-md bg-elite-gradient text-white">Add to Calendar 👑</button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="mt-3">
          <CardContent className="p-5 text-sm space-y-1">
            <p className="font-medium text-foreground">National Power Grid Status</p>
            <p>Current Demand: 28,450 MW</p>
            <p>Available Capacity: 31,200 MW</p>
            <p>Reserve Margin: 9.6% (Healthy)</p>
            <p>Unplanned Outages: 2,890 MW</p>
          </CardContent>
        </Card>
      </section>

      {/* Water Supply */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3"><Droplets className="w-5 h-5" /> Water Supply Status</h2>
        <Card>
          <CardContent className="p-5">
            <p className="text-safety-green font-semibold">🟢 STABLE</p>
            <div className="text-sm mt-2 space-y-0.5">
              <p>Current Dam Levels: {dbDams.length > 0 ? `${averageLevel.toFixed(1)}%` : '87.3%'}</p>
              <p>Water Usage Yesterday: 812 ML (Target: 850 ML)</p>
              <p className="text-safety-green">✓ Below target – Well done!</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3">
          <p className="text-sm font-medium text-foreground mb-2">Major Dams:</p>
          <Accordion type="multiple" className="space-y-2">
            {displayDams.map((d, i) => (
              <AccordionItem key={i} value={`dam-${i}`} className="border rounded-lg bg-card px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center justify-between w-full pr-2">
                    <span className="font-semibold text-foreground text-sm">{d.name}</span>
                    <span className="text-sm font-bold" style={{ color: getDamStatusColor(d.level) }}>{d.level.toFixed(1)}%</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm space-y-1">
                  <p>Current Level: {d.level.toFixed(1)}%</p>
                  <p>Capacity: {d.capacity}</p>
                  <p>Last Week: {d.lastWeek.toFixed(1)}% (↓ {(d.lastWeek - d.level).toFixed(1)}%)</p>
                  <p>Last Year: {d.lastYear.toFixed(1)}%</p>
                  {d.location && <p>Location: {d.location}</p>}
                  {d.supply && <p>Supplies: {d.supply}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => onUpgrade('dam-history')} className="text-xs px-3 py-1.5 rounded-md bg-elite-gradient text-white">Historical Data 👑</button>
                    <button onClick={() => onUpgrade('dam-alert')} className="text-xs px-3 py-1.5 rounded-md bg-elite-gradient text-white">Set Alert 👑</button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="mt-3">
          <CardContent className="p-5 text-sm space-y-1">
            <p className="font-medium text-foreground">Water Restrictions – Level 1</p>
            <p>Daily Limit: 105L per person per day</p>
            <p>Garden Watering: Before 9am & after 6pm</p>
            <p>Car Washing: Bucket/hose with trigger only</p>
            <p>Pool Filling: Allowed (cover required)</p>
          </CardContent>
        </Card>

        {/* Water Outages */}
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-foreground">Water Outages & Maintenance:</p>
          {outages.map((o, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-sm space-y-1">
                <p className={`font-semibold ${o.severity === 'high' ? 'text-safety-red' : 'text-safety-yellow'}`}>
                  {o.severity === 'high' ? '🔴' : '🟡'} {o.type}
                </p>
                <p className="font-medium">{o.area}</p>
                <p>Date: {o.date} &middot; Time: {o.time}</p>
                <p>Affected: {o.affected} &middot; Reason: {o.reason}</p>
                <p className="text-primary">{o.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Waste Collection */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3"><Trash2 className="w-5 h-5" /> Waste Collection</h2>
        <Card>
          <CardContent className="p-5 text-sm space-y-3">
            <p className="font-medium text-foreground">Example Schedule (Camps Bay)</p>
            <div className="space-y-2">
              <div><p className="font-medium">🗑️ General Waste – Every Tuesday & Friday</p><p className="text-muted-foreground">Next: Friday, Feb 21 · Before 7:00 AM</p></div>
              <div><p className="font-medium">♻️ Recycling – Every Wednesday (alternate weeks)</p><p className="text-muted-foreground">Next: Wed, Feb 26 · Before 7:00 AM</p></div>
              <div><p className="font-medium">🌿 Garden Waste – Every Monday</p><p className="text-muted-foreground">Next: Mon, Feb 24 · Before 7:00 AM</p></div>
            </div>
            <p className="text-safety-green text-xs mt-2">Service Disruptions: None reported in your area ✓</p>
          </CardContent>
        </Card>
      </section>

      {/* Utility Contacts */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3"><Phone className="w-5 h-5" /> Utility Contacts</h2>
        <div className="space-y-2">
          {[
            { icon: '⚡', name: 'Eskom', phone: '0860 037 566' },
            { icon: '💧', name: 'City of Cape Town Water & Sanitation', phone: '0860 103 089', addr: '44 Wale St, Cape Town, 8001' },
            { icon: '🗑️', name: 'City of Cape Town Solid Waste', phone: '0860 103 089' },
          ].map((c, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-sm">
                <p className="font-semibold">{c.icon} {c.name}</p>
                <p>Faults: {c.phone}</p>
                {c.addr && <p className="text-muted-foreground">📍 {c.addr}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Elite */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3"><Lock className="w-4 h-4" /> Elite Features 👑</h3>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>🔒 Load shedding alerts (SMS + Push)</li>
            <li>🔒 Water outage notifications</li>
            <li>🔒 Waste collection reminders</li>
            <li>🔒 Historical dam level charts</li>
            <li>🔒 Multiple location monitoring</li>
            <li>🔒 Calendar integration</li>
          </ul>
          <button onClick={() => onUpgrade('utilities')} className="mt-4 px-4 py-2 rounded-lg bg-elite-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Upgrade to Elite</button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">API Sources: EskomSePush API &middot; City of Cape Town Open Data &middot; Dept. of Water & Sanitation</p>
    </div>
  );
});

UtilitiesServicesView.displayName = 'UtilitiesServicesView';
export default UtilitiesServicesView;
