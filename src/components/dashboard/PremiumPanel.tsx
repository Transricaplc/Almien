import { useState } from 'react';
import { 
  Crown, Video, Bell, Shield, Users, Headphones, 
  Database, FileText, Code, Check, Sparkles, Zap,
  ChevronRight, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { premiumFeatures } from '@/data/mapData';

const iconMap: Record<string, any> = {
  video: Video,
  bell: Bell,
  shield: Shield,
  users: Users,
  headphones: Headphones,
  database: Database,
  'file-text': FileText,
  code: Code,
};

const PremiumPanel = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl border-2 transition-all duration-500',
        'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10',
        'border-amber-500/30 hover:border-amber-400/50',
        isHovered && 'shadow-[0_0_40px_rgba(245,158,11,0.15)]'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Crown className="w-4 h-4 text-background" />
            </div>
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-1">
                BlueWhale Pro
                <Sparkles className="w-3 h-3 text-amber-400" />
              </h3>
              <p className="text-[10px] text-amber-400/80 font-mono">PREMIUM SUBSCRIPTION</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-foreground">R299<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
            <div className="text-[10px] text-amber-400">14-day free trial</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative p-3 space-y-2">
        {premiumFeatures.slice(0, 6).map((feature, index) => {
          const Icon = iconMap[feature.icon] || Shield;
          return (
            <div 
              key={feature.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-all',
                'bg-background/30 hover:bg-background/50',
                'border border-transparent hover:border-amber-500/20'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{feature.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{feature.description}</div>
              </div>
              <Check className="w-4 h-4 text-safety-good shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Extra benefits */}
      <div className="relative px-4 py-3 border-t border-amber-500/20 bg-background/20">
        <div className="text-xs text-muted-foreground mb-2">Also includes:</div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded-full border border-amber-500/20">
            Ad-free experience
          </span>
          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded-full border border-amber-500/20">
            Offline maps
          </span>
          <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded-full border border-amber-500/20">
            Priority alerts
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative p-3 pt-0">
        <button className={cn(
          'w-full py-3 rounded-lg font-bold text-sm transition-all',
          'bg-gradient-to-r from-amber-500 to-yellow-500 text-background',
          'hover:from-amber-400 hover:to-yellow-400',
          'flex items-center justify-center gap-2 group',
          'shadow-lg hover:shadow-amber-500/25'
        )}>
          <Zap className="w-4 h-4" />
          Start Free Trial
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          No credit card required • Cancel anytime
        </p>
      </div>

      {/* Rating */}
      <div className="relative px-4 pb-3 flex items-center justify-center gap-2">
        <div className="flex">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">4.9/5 • 12,450 subscribers</span>
      </div>
    </div>
  );
};

export default PremiumPanel;
