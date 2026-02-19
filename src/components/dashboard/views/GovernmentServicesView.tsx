import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Phone, MapPin, FileText, Wrench, BookOpen, Heart, Lock } from 'lucide-react';
import type { ViewId } from '../GridifyDashboard';

interface Props { onUpgrade: (trigger?: string) => void; onNavigate: (view: ViewId) => void; }

const serviceCenters = [
  { name: 'Civic Centre (Main)', address: '12 Hertzog Blvd, Cape Town, 8001', hours: 'Mon-Fri: 7:30am-5pm · Sat: 8am-12pm' },
  { name: 'Tygerberg Service Centre', address: 'Voortrekker Rd, Bellville, 7530', hours: 'Mon-Fri: 8am-4:30pm · Sat: 8am-12pm' },
  { name: 'Khayelitsha Service Centre', address: 'Lwandle Rd, Khayelitsha, 7784', hours: 'Mon-Fri: 8am-4:30pm' },
  { name: 'Athlone Service Centre', address: 'Klipfontein Rd, Athlone, 7764', hours: 'Mon-Fri: 8am-4:30pm' },
];

const GovernmentServicesView = memo(({ onUpgrade }: Props) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Landmark className="w-6 h-6 text-primary" /> Government Services
        </h1>
        <p className="text-muted-foreground mt-1">Quick access to essential public services</p>
      </div>

      {/* Service Status */}
      <Card>
        <CardContent className="p-5">
          <p className="text-safety-green font-semibold">🟢 ALL SERVICES OPERATIONAL</p>
          <div className="text-sm mt-2 space-y-0.5">
            <p>Customer Service Centers: Open</p>
            <p>Online Portal: Operational</p>
            <p>Call Center: 0860 103 089 (Available)</p>
          </div>
        </CardContent>
      </Card>

      {/* City of Cape Town Services */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">City of Cape Town Services</h2>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /> Pay Municipal Bills</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Electricity (prepaid top-up)</li>
                <li>• Water & Sanitation</li>
                <li>• Rates & Property Tax</li>
                <li>• Refuse Removal</li>
              </ul>
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">Pay Online</button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">View My Account</button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2"><Wrench className="w-4 h-4" /> Report Issues</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Potholes & Road Damage</li>
                <li>• Illegal Dumping</li>
                <li>• Broken Traffic Lights</li>
                <li>• Water Leaks</li>
                <li>• Electricity Outages</li>
                <li>• Graffiti Removal</li>
              </ul>
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">Report Issue</button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Track My Reports</button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /> Documents & Permits</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Building Plans Approval</li>
                <li>• Business Licenses</li>
                <li>• Parking Permits</li>
                <li>• Events Permits</li>
                <li>• Zoning Certificates</li>
              </ul>
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">Apply Online</button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Check Status</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Service Centers */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3"><MapPin className="w-5 h-5" /> Service Centers</h2>
        <div className="space-y-2">
          {serviceCenters.map((sc, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-sm">
                <p className="font-semibold text-foreground">📍 {sc.name}</p>
                <p className="text-muted-foreground">{sc.address}</p>
                <p className="text-muted-foreground">⏰ {sc.hours}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Directions</button>
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Book Appointment</button>
                </div>
              </CardContent>
            </Card>
          ))}
          <button className="text-sm text-primary hover:underline">View All 10 Service Centers</button>
        </div>
      </section>

      {/* Library Services */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4" /> Library Services</h3>
          <p className="text-sm text-muted-foreground mb-3">Cape Town has 102 public libraries</p>
          <div className="flex flex-wrap gap-2">
            <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Find Nearest Library</button>
            <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Check Library Hours</button>
            <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Renew Books Online</button>
          </div>
        </CardContent>
      </Card>

      {/* Western Cape Government */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Western Cape Government</h2>

        <Card className="mb-3">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2"><Heart className="w-4 h-4" /> Health Services</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Hospital Waiting Times</li>
              <li>• Clinic Locations & Hours</li>
              <li>• Emergency Medical Services</li>
              <li>• Ambulance Dispatch: <strong>10177</strong></li>
            </ul>
            <div className="flex gap-2 mt-3">
              <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">Find Nearest Clinic</button>
              <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Emergency Info</button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-3">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">🏫 Education</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• School Finder by Area</li>
              <li>• Admissions Information</li>
              <li>• Bursary & Funding Programs</li>
              <li>• School Safety Ratings</li>
            </ul>
            <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent mt-3">Find Schools Near Me</button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">🚔 Law Enforcement</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• SAPS Station Finder</li>
              <li>• Case Status Tracking</li>
              <li>• Community Policing Forums</li>
              <li>• Emergency: <strong>10111</strong></li>
            </ul>
            <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent mt-3">Find Nearest Station</button>
          </CardContent>
        </Card>
      </section>

      {/* National Government */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">National Government</h2>
        <div className="space-y-2">
          {[
            { name: 'Home Affairs', desc: 'ID documents, passports, birth certificates', phone: '0800 601 190', addr: '56 Barrack St, Cape Town, 8001' },
            { name: 'SARS (Tax)', desc: 'Tax returns, VAT, customs', phone: '0800 007 277', addr: 'Customs House, Heerengracht, Cape Town' },
            { name: 'Labour Department', desc: 'UIF claims, labour disputes, workplace safety', phone: '012 309 4000', addr: 'Plein Park, Cape Town' },
          ].map((svc, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-sm">
                <p className="font-semibold text-foreground">🏛️ {svc.name}</p>
                <p className="text-muted-foreground">{svc.desc}</p>
                <p className="mt-1">📞 {svc.phone}</p>
                <p className="text-muted-foreground">📍 {svc.addr}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Directions</button>
                  <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Book Appointment</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Important Numbers */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-5"><CardTitle className="text-base flex items-center gap-2"><Phone className="w-4 h-4" /> Important Numbers</CardTitle></CardHeader>
        <CardContent className="px-5 pb-4 text-sm space-y-1">
          <p>🚨 Emergency (Police/Fire/Ambulance): <strong>10111</strong></p>
          <p>🚑 Ambulance: <strong>10177</strong></p>
          <p>🔥 Fire: <strong>021 535 1100</strong></p>
          <p>💡 Electricity Faults: <strong>0860 037 566</strong></p>
          <p>💧 Water Faults: <strong>0860 103 089</strong></p>
          <p>🏠 Home Affairs: <strong>0800 601 190</strong></p>
          <p>🩺 Poison Centre: <strong>0861 555 777</strong></p>
          <p>🆘 Gender-Based Violence: <strong>0800 428 428</strong></p>
        </CardContent>
      </Card>

      {/* Elite */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3"><Lock className="w-4 h-4" /> Elite Features 👑</h3>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>🔒 Service appointment booking</li>
            <li>🔒 Report issue tracking dashboard</li>
            <li>🔒 Document status notifications</li>
            <li>🔒 Saved service center preferences</li>
          </ul>
          <button onClick={() => onUpgrade('government')} className="mt-4 px-4 py-2 rounded-lg bg-elite-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Upgrade to Elite</button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">Sources: City of Cape Town · Western Cape Government · South African Government</p>
    </div>
  );
});

GovernmentServicesView.displayName = 'GovernmentServicesView';
export default GovernmentServicesView;
