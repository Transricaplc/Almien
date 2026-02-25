import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const sponsors = [
  {
    name: 'Cape Town Tourism',
    tagline: 'Discover the Mother City',
    url: 'https://www.capetown.travel',
    logo: '🏔️',
  },
  {
    name: 'Visit Western Cape',
    tagline: 'A World of Wonders',
    url: 'https://www.visitwesterncape.co.za',
    logo: '🌊',
  },
  {
    name: 'SANParks',
    tagline: 'Explore South Africa\'s Natural Heritage',
    url: 'https://www.sanparks.org',
    logo: '🌿',
  },
];

export default function SponsorBanner() {
  const [visible, setVisible] = useState(true);
  const [index] = useState(() => Math.floor(Math.random() * sponsors.length));
  const sponsor = sponsors[index];

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0">{sponsor.logo}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">{sponsor.name}</span>
            <Badge variant="outline" className="text-[8px] px-1.5 py-0 border-muted-foreground/30 text-muted-foreground">
              Sponsor
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground truncate">{sponsor.tagline}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-primary hover:underline font-medium"
        >
          Visit <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={() => setVisible(false)}
          className="p-0.5 rounded hover:bg-muted text-muted-foreground"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
