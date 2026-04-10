import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield, Search, Bell, Crown, Menu, X, User, BarChart3, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

interface AlmienHeaderProps {
  onSearch?: () => void;
  onNotifications?: () => void;
  onAnalytics?: () => void;
  onProTools?: () => void;
  onRecommender?: () => void;
  className?: string;
}

const AlmienHeader = memo(({ onSearch, onNotifications, onAnalytics, onProTools, onRecommender, className }: AlmienHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "h-16 shrink-0 border-b border-border-subtle bg-surface-base/95 backdrop-blur-xl sticky top-0 z-50",
      "flex items-center justify-between px-4 lg:px-6",
      className
    )}>
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent-safe flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-text-inverse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-foreground leading-none">
              ALMIEN
            </h1>
            <p className="text-[9px] text-muted-foreground font-medium tracking-wider uppercase leading-none mt-0.5">
              Cape Town Safety
            </p>
          </div>
        </div>

        {!isMobile && (
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {['Dashboard', 'Explore', 'Activities'].map(item => (
              <button
                key={item}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-02 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={onProTools}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-02 transition-colors flex items-center gap-1"
            >
              Pro Tools
              <span className="text-[8px] bg-elite-gradient text-text-inverse px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
            <button
              onClick={onAnalytics}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-02 transition-colors flex items-center gap-1"
            >
              Analytics
              <span className="text-[8px] bg-elite-gradient text-text-inverse px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
          </nav>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className="p-2 rounded-lg hover:bg-surface-02 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Search areas"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onRecommender}
          className="p-2 rounded-lg hover:bg-surface-02 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Smart Recommender"
          title="Smart Activity Recommender"
        >
          <Sparkles className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onNotifications}
          className="relative p-2 rounded-lg hover:bg-surface-02 transition-colors text-muted-foreground"
          title="Notifications Hub"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-threat text-white text-[8px] font-bold flex items-center justify-center">
            6
          </span>
        </button>

        <ThemeToggle />

        <Link
          to="/auth"
          className="p-2 rounded-lg hover:bg-surface-02 transition-colors text-muted-foreground hover:text-foreground"
        >
          <User className="w-4.5 h-4.5" />
        </Link>

        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-surface-02 transition-colors text-muted-foreground md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && isMobile && (
        <div className="absolute top-16 left-0 right-0 bg-surface-01 border-b border-border-subtle p-4 z-40">
          <nav className="flex flex-col gap-1">
            {['Dashboard', 'Explore', 'Activities'].map(item => (
              <button
                key={item}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface-02 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); onAnalytics?.(); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface-02 transition-colors flex items-center gap-2"
            >
              Analytics
              <span className="text-[8px] bg-elite-gradient text-text-inverse px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onProTools?.(); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface-02 transition-colors flex items-center gap-2"
            >
              Pro Tools
              <span className="text-[8px] bg-elite-gradient text-text-inverse px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onRecommender?.(); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface-02 transition-colors flex items-center gap-2"
            >
              Recommender
              <span className="text-[8px] bg-elite-gradient text-text-inverse px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
});

AlmienHeader.displayName = 'AlmienHeader';
export default AlmienHeader;
