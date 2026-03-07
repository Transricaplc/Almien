import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Siren, MapPin, Share2, Phone, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const familyContacts = [
  { name: 'Mom', number: '+27821234567' },
  { name: 'Partner', number: '+27839876543' },
  { name: 'Neighbour', number: '+27711112222' },
];

const SOSPanelCard = () => {
  const [activated, setActivated] = useState(false);

  const triggerSOS = () => {
    setActivated(true);
    // Attempt geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const msg = `🆘 EMERGENCY! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`;
          navigator.clipboard.writeText(msg).catch(() => {});
          toast.error('SOS Activated — Location copied to clipboard', { duration: 5000 });
        },
        () => {
          toast.error('SOS Activated — Could not get location', { duration: 5000 });
        }
      );
    } else {
      toast.error('SOS Activated — Geolocation unavailable', { duration: 5000 });
    }
    setTimeout(() => setActivated(false), 5000);
  };

  return (
    <Card className={`bg-card/80 backdrop-blur-sm border-border/50 hover:border-destructive/30 hover:shadow-lg hover:shadow-destructive/5 transition-all duration-300 ${activated ? 'border-destructive/60 shadow-destructive/20 shadow-lg' : ''}`}>
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Siren className="w-4 h-4 text-destructive" />
          Emergency SOS – Instant Share
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* SOS Button */}
        <Button
          variant="destructive"
          size="lg"
          className={`w-full h-16 text-lg font-bold rounded-xl transition-all duration-300 ${activated ? 'animate-pulse' : 'hover:scale-[1.02]'}`}
          onClick={triggerSOS}
        >
          {activated ? (
            <><CheckCircle className="w-5 h-5 mr-2" /> SOS SENT</>
          ) : (
            <><Siren className="w-5 h-5 mr-2" /> 🆘 SOS</>
          )}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">Shares your GPS location + auto-message template</p>

        {/* Quick contacts */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> Family Quick-Share
          </p>
          <div className="space-y-1.5">
            {familyContacts.map(c => (
              <div key={c.name} className="flex items-center justify-between px-2.5 py-2 rounded-lg border border-border/50 bg-card/50">
                <span className="text-xs font-medium text-foreground">{c.name}</span>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" asChild>
                    <a href={`tel:${c.number}`}><Phone className="w-3 h-3" /></a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => {
                    window.open(`https://wa.me/${c.number.replace('+', '')}?text=${encodeURIComponent('🆘 I need help! Please call me or check my last shared location.')}`, '_blank');
                  }}>
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency numbers */}
        <div className="grid grid-cols-2 gap-1.5">
          <Button variant="outline" size="sm" className="text-[10px] h-8 border-destructive/30" asChild>
            <a href="tel:10111"><Phone className="w-3 h-3 mr-1" /> SAPS 10111</a>
          </Button>
          <Button variant="outline" size="sm" className="text-[10px] h-8 border-destructive/30" asChild>
            <a href="tel:0214807700"><Phone className="w-3 h-3 mr-1" /> Fire/Ambu</a>
          </Button>
        </div>

        <div className="pt-2 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground/70">Western Cape Safety Intelligence • Real-time where available • Verified data only</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOSPanelCard;
