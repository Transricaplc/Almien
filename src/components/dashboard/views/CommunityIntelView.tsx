import { memo } from 'react';
import { cn } from '@/lib/utils';
import { ThumbsUp, MessageCircle, MapPin, Crown, Lock, Info } from 'lucide-react';
import SafetyPulse from '../SafetyPulse';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const reports = [
  {
    type: 'incident' as const, verified: true, user: '@SafetyWatcher', time: '25 min ago',
    title: 'Vehicle break-in at Sea Point parking',
    location: 'Sea Point', when: 'Today, 2:15 PM',
    desc: 'Two vehicles broken into in the parking lot near the promenade. Windows smashed, bags stolen from back seat. Security is reviewing CCTV footage.',
    tip: 'Never leave bags visible in parked cars, even for short stops.',
    helpful: 48, comments: 12,
  },
  {
    type: 'tip' as const, verified: false, user: '@CapeTownLocal', time: '1 hr ago',
    title: 'Safe evening walk routes in Green Point',
    location: 'Green Point', when: 'General',
    desc: 'The promenade from Mouille Point to Green Point is well-lit and busy until about 10pm. The section near the lighthouse is the safest for evening jogs.',
    helpful: 92, comments: 8, favorite: true,
  },
  {
    type: 'review' as const, verified: false, user: '@TouristTraveler', time: '3 hrs ago',
    title: 'Camps Bay restaurant area - Very safe',
    location: 'Camps Bay', when: 'Last weekend',
    desc: 'Spent the evening dining along the strip. Felt completely safe. Good lighting, lots of people, restaurants have security. Highly recommended for families.',
    rating: 5, helpful: 35, comments: 4,
  },
  {
    type: 'incident' as const, verified: true, user: '@WatchdogCPT', time: '5 hrs ago',
    title: 'Pickpocket incident at Greenmarket Square',
    location: 'City Centre', when: 'Today, 11:30 AM',
    desc: 'Tourist reported phone stolen from pocket while browsing market stalls. Third incident this week at this location. SAPS alerted and patrolling area.',
    helpful: 67, comments: 22,
  },
  {
    type: 'tip' as const, verified: false, user: '@MountainRunner', time: '8 hrs ago',
    title: 'Best parking for Table Mountain hikes',
    location: 'Table Mountain', when: 'General',
    desc: 'Use the lower cable station parking — it has CCTV and security. Avoid parking on Tafelberg Road shoulder, several break-ins reported there last month.',
    helpful: 54, comments: 6,
  },
];

const typeConfig = {
  incident: { emoji: '🔴', label: 'INCIDENT REPORT' },
  tip: { emoji: '🟢', label: 'SAFETY TIP' },
  review: { emoji: '🟡', label: 'AREA REVIEW' },
};

const CommunityIntelView = memo(({ onUpgrade }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Community Intel</h1>
        <p className="text-muted-foreground mt-1">Safety reports and tips from the community</p>
      </div>

      {/* Safety Pulse — Crowdsourced Vibe Rating */}
      <SafetyPulse />

      <div className="flex items-center gap-2 p-3 rounded-lg bg-accent text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0" />
        ℹ️ Free: View only | 💎 Elite: Post, comment, upvote
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Verified ✓', 'Last 24hrs', 'Week'].map(f => (
          <button
            key={f}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              f === 'All' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reports feed */}
      <div className="space-y-4">
        {reports.map((report, i) => {
          const config = typeConfig[report.type];
          return (
            <div key={i} className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>{config.emoji} {config.label}</span>
                {report.verified && <span className="text-safety-green font-semibold">VERIFIED ✓</span>}
                {(report as any).favorite && <span className="text-elite-from font-semibold">⭐ COMMUNITY FAVORITE</span>}
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Posted by {report.user} · {report.time}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">{report.title}</h3>
              <div className="text-xs text-muted-foreground mb-2">
                <span>📍 {report.location}</span> · <span>🕐 {report.when}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{report.desc}</p>
              {(report as any).tip && (
                <div className="p-3 rounded-lg bg-safety-green/10 text-sm text-foreground mb-3">
                  <span className="font-semibold">Safety Tip:</span> {(report as any).tip}
                </div>
              )}
              {(report as any).rating && (
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: (report as any).rating }).map((_, j) => (
                    <span key={j} className="text-elite-from">⭐</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {report.helpful} helpful</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {report.comments} comments</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Map</span>
                <button onClick={() => onUpgrade('Comment with Elite')} className="text-primary font-semibold hover:underline ml-auto">
                  Elite: Comment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
        Load More
      </button>

      {/* Elite */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-elite-from" />
          <h3 className="font-bold text-foreground">Elite Community Features</h3>
        </div>
        <ul className="space-y-1.5 mb-4">
          {['Create new reports', 'Comment and upvote', 'Build reputation score', 'Verified contributor badge'].map(f => (
            <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
              <Crown className="w-3 h-3 text-elite-from shrink-0" /> {f}
            </li>
          ))}
        </ul>
        <button onClick={() => onUpgrade()} className="text-sm font-semibold text-primary hover:underline">Upgrade to Elite →</button>
      </div>
    </div>
  );
});

CommunityIntelView.displayName = 'CommunityIntelView';
export default CommunityIntelView;
