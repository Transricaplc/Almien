import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Building2, Shield, Truck, Plane, Lock, Crown, Star, ArrowRight } from 'lucide-react';
import type { ViewId } from '../AlmienDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const tools = [
  {
    icon: Building2,
    title: '🏢 Real Estate Intelligence',
    desc: 'Neighbourhood safety reports, investment scores, and trend analysis for property professionals.',
    features: ['Property safety report generator', '3-year trend analysis', 'Investment safety scoring', 'Comparable area analysis'],
    testimonial: '"Almien has transformed how I present neighborhood data to buyers." — Sarah M., Realtor',
  },
  {
    icon: Shield,
    title: '🛡️ Insurance Risk Assessment',
    desc: 'Risk multipliers, claims correlation data, and premium adjustment recommendations.',
    features: ['Risk assessment calculator', 'Claims correlation viewer', 'Premium adjustment engine', 'Actuarial data export'],
    testimonial: '"Essential for accurate underwriting in the Cape Town market." — James K., Actuary',
  },
  {
    icon: Truck,
    title: '🚚 Logistics & Fleet Management',
    desc: 'Multi-stop route optimization with safety scoring and delivery zone analysis.',
    features: ['Multi-stop route planner (20+ stops)', 'Delivery zone analyzer', 'Time-window safety recommendations', 'Fleet tracking integration'],
    testimonial: '"Reduced delivery incidents by 40% using Almien routes." — Pieter V., Ops Manager',
  },
  {
    icon: Plane,
    title: '✈️ Tourism & Hospitality',
    desc: 'Venue safety analysis, itinerary checking, and guest safety guide generation.',
    features: ['Venue safety analysis (500m radius)', 'Multi-day itinerary safety checker', 'Guest safety guide generator', 'Walking safety radius maps'],
    testimonial: '"Our guests feel safer with Almien reports at check-in." — Lisa T., Hotel GM',
  },
];

const ProfessionalToolsView = memo(({ onUpgrade }: Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Professional Tools
          <span className="text-sm font-bold bg-elite-gradient text-white px-2 py-0.5 rounded-full">👑 ELITE</span>
        </h1>
        <p className="text-muted-foreground mt-1">Enterprise-grade safety intelligence for professionals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tools.map(tool => (
          <div key={tool.title} className="p-6 rounded-xl border border-border bg-card card-hover relative overflow-hidden">
            {/* Lock overlay */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <span className="text-sm font-semibold text-muted-foreground">Elite Only</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">{tool.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{tool.desc}</p>
            <ul className="space-y-1.5 mb-4">
              {tool.features.map(f => (
                <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="w-3 h-3 text-elite-from shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground italic border-t border-border pt-3">{tool.testimonial}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-8 rounded-xl bg-card border border-border text-center">
        <button
          onClick={() => onUpgrade()}
          className="px-8 py-3.5 rounded-xl bg-elite-gradient text-white font-bold text-base hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto mb-4"
        >
          <Crown className="w-5 h-5" />
          UPGRADE TO ELITE — Start 7-Day Free Trial
        </button>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Elite R349/month or R3,490/year <span className="text-safety-green">(save 17%)</span></div>
          <div>Enterprise: Custom pricing</div>
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <button className="text-sm text-primary font-semibold hover:underline">Contact Sales</button>
          <button className="text-sm text-muted-foreground hover:underline">View All Features</button>
        </div>
      </div>
    </div>
  );
});

ProfessionalToolsView.displayName = 'ProfessionalToolsView';
export default ProfessionalToolsView;
