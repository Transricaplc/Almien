import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone, MapPin, Clock, ChevronDown, ChevronUp, Shield, Crown, Lock } from 'lucide-react';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const sections = [
  {
    title: 'Police Stations',
    items: [
      { name: 'Cape Town Central Police Station', phone: '021 467 8400', address: '5 Buitenkant Street, Cape Town City Centre, 8001', hours: 'Open 24/7', score: 8.5 },
      { name: 'Sea Point SAPS', phone: '021 430 4100', address: '60 Regent Road, Sea Point, 8005', hours: 'Open 24/7', score: 8.2 },
      { name: 'Camps Bay SAPS', phone: '021 438 5202', address: 'Victoria Road, Camps Bay, 8040', hours: 'Open 24/7', score: 8.8 },
      { name: 'Woodstock SAPS', phone: '021 442 4200', address: '30 Roodebloem Road, Woodstock, 7925', hours: 'Open 24/7', score: 7.0 },
      { name: 'Claremont SAPS', phone: '021 657 3400', address: 'Dreyer Street, Claremont, 7708', hours: 'Open 24/7', score: 7.5 },
    ],
  },
  {
    title: 'Hospitals & Medical',
    items: [
      { name: 'Groote Schuur Hospital', phone: '021 404 9111', address: 'Main Road, Observatory, 7925', hours: '24hr Emergency', score: 8.0, extra: 'Public · Trauma Unit · Cardiac' },
      { name: 'Netcare Christiaan Barnard Memorial', phone: '021 441 0000', address: '181 Longmarket Street, Cape Town, 8001', hours: '24hr Emergency', score: 9.0, extra: 'Private · Full ICU · Cardiac' },
      { name: 'Mediclinic Cape Town', phone: '021 464 5500', address: '21 Hof Street, Oranjezicht, 8001', hours: '24hr Emergency', score: 8.8, extra: 'Private · General Surgery' },
      { name: 'Red Cross War Memorial Children\'s Hospital', phone: '021 658 5111', address: 'Klipfontein Road, Rondebosch, 7700', hours: '24hr Paediatric Emergency', score: 8.5, extra: 'Public · Children Only' },
    ],
  },
  {
    title: 'Fire & Rescue',
    items: [
      { name: 'City of Cape Town Fire & Rescue', phone: '021 535 1100', address: 'Roeland Street, Cape Town, 8001', hours: '24/7', score: 8.5, extra: 'Response time: ~8 min avg' },
      { name: 'Table Bay Fire Station', phone: '021 417 5000', address: 'Marine Drive, Table Bay, 8001', hours: '24/7', score: 8.8 },
    ],
  },
  {
    title: 'Mountain Rescue',
    items: [
      { name: 'Wilderness Search and Rescue (WSAR)', phone: '021 948 9900', address: 'SANParks Headquarters, Table Mountain National Park, 8001', hours: '24/7', score: 9.0, extra: 'Helicopter available · Covers all WC mountains' },
    ],
  },
  {
    title: '24-Hour Pharmacies',
    items: [
      { name: 'Clicks Pharmacy V&A Waterfront', phone: '021 419 5380', address: 'Shop 148, Victoria Wharf, V&A Waterfront, 8001', hours: 'Open 24/7', score: 9.2 },
      { name: 'Dis-Chem Pharmacy Canal Walk', phone: '021 555 3770', address: 'Canal Walk Shopping Centre, Century City, 7441', hours: 'Open until 10pm', score: 8.5 },
    ],
  },
  {
    title: 'Roadside Assistance',
    items: [
      { name: 'AA South Africa', phone: '0861 000 234', address: 'AA House, 66 Ernest Oppenheimer Ave, Bruma, 2026', hours: '24/7 Nationwide', score: 8.0 },
    ],
  },
  {
    title: 'Embassies & Consulates',
    items: [
      { name: 'US Consulate General', phone: '021 702 7300', address: '2 Reddam Avenue, Westlake, 7945', hours: 'Mon-Fri 7:30-16:00', score: 9.0, extra: 'Emergency: 021 702 7300' },
      { name: 'British High Commission', phone: '021 405 2400', address: '15th Floor, Norton Rose House, 8 Riebeek St, 8001', hours: 'Mon-Fri 8:00-16:30', score: 9.0, extra: 'Emergency: +44 20 7008 5000' },
      { name: 'German Consulate', phone: '021 405 3000', address: '19th Floor, Safmarine House, 22 Riebeek St, 8001', hours: 'Mon-Fri 9:00-12:00', score: 9.0 },
    ],
  },
  {
    title: 'Crisis Support',
    items: [
      { name: 'SADAG Depression & Anxiety Helpline', phone: '0800 567 567', address: 'Toll-free National Service', hours: '24/7', score: 0 },
      { name: 'GBV Command Centre', phone: '0800 428 428', address: 'Toll-free National Service', hours: '24/7', score: 0 },
    ],
  },
];

const EmergencyContactsView = memo(({ onUpgrade }: Props) => {
  const [expanded, setExpanded] = useState<string[]>(['Police Stations']);

  const toggle = (title: string) => {
    setExpanded(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Emergency Contacts</h1>
        <p className="text-muted-foreground mt-1">All contacts with full physical addresses</p>
      </div>

      {/* National Emergency */}
      <div className="p-6 rounded-xl border-2 border-safety-red bg-card">
        <div className="text-center">
          <div className="text-4xl font-black text-safety-red mb-1">🚨 10111</div>
          <div className="text-lg font-bold text-foreground">Emergency Services</div>
          <div className="text-sm text-muted-foreground mb-4">Police, Fire, Medical · 24/7</div>
          <a href="tel:10111" className="inline-flex px-8 py-3 rounded-xl bg-safety-red text-white font-bold text-sm hover:opacity-90 transition-opacity">
            📞 CALL NOW
          </a>
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => {
        const isOpen = expanded.includes(section.title);
        return (
          <div key={section.title} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggle(section.title)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
            >
              <span className="text-base font-semibold text-foreground">{section.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{section.items.length}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-border divide-y divide-border">
                {section.items.map(item => (
                  <div key={item.name} className="p-5">
                    <h4 className="text-sm font-bold text-foreground mb-2">{item.name}</h4>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> {item.phone}</div>
                      <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {item.address}</div>
                      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0" /> {item.hours}</div>
                      {item.extra && <div className="text-xs text-muted-foreground">{item.extra}</div>}
                    </div>
                    {item.score > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">Safety Score: {item.score}</span>
                      </div>
                    )}
                    <div className="flex gap-3 mt-3">
                      <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="text-xs font-semibold text-primary hover:underline">Call</a>
                      <button className="text-xs text-muted-foreground hover:underline">Directions</button>
                      <button className="text-xs text-muted-foreground hover:underline">Save Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Elite */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Save Personal Emergency Contacts</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Family, friends, hotel, tour guide — all in one place</p>
        <button onClick={() => onUpgrade()} className="text-sm font-semibold text-primary hover:underline">Upgrade to Elite →</button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Export All (vCard)</button>
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Print Card</button>
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Email to Self</button>
      </div>
    </div>
  );
});

EmergencyContactsView.displayName = 'EmergencyContactsView';
export default EmergencyContactsView;
