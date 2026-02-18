import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield, Search, MapPin, Bell, Crown, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * GridifyHeader — Fixed top header (64px) for the freemium platform.
 * Logo, main nav, search, notifications (Elite), profile.
 */

interface GridifyHeaderProps {
  onSearch?: () => void;
  className?: string;
}

const GridifyHeader = memo(({ onSearch, className }: GridifyHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "h-16 shrink-0 border-b border-border bg-card/95 backdrop-blur-xl sticky top-0 z-50",
      "flex items-center justify-between px-4 lg:px-6",
      className
    )}>
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Shield className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-foreground leading-none">
              GRIDIFY
            </h1>
            <p className="text-[9px] text-muted-foreground font-medium tracking-wider uppercase leading-none mt-0.5">
              Cape Town Safety
            </p>
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {['Dashboard', 'Explore', 'Activities'].map(item => (
              <button
                key={item}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {item}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1">
              Community
              <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
          </nav>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={onSearch}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Search areas"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* Notifications (Elite teaser) */}
        <button
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          title="Upgrade to Elite for notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <Crown className="w-2.5 h-2.5 text-elite-from absolute -top-0.5 -right-0.5" />
        </button>

        <ThemeToggle />

        {/* Profile / Auth */}
        <Link
          to="/auth"
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <User className="w-4.5 h-4.5" />
        </Link>

        {/* Mobile menu */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && isMobile && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 shadow-lg z-40">
          <nav className="flex flex-col gap-1">
            {['Dashboard', 'Explore', 'Activities'].map(item => (
              <button
                key={item}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
            >
              Community
              <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
});

GridifyHeader.displayName = 'GridifyHeader';

export default GridifyHeader;
