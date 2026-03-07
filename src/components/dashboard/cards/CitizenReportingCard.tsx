import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, MapPin, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockFeed = [
  { id: '1', type: 'Armed robbery', suburb: 'Nyanga', time: new Date(Date.now() - 12 * 60000).toISOString(), verified: true, desc: 'Two suspects on foot near taxi rank' },
  { id: '2', type: 'Loadshedding-related break-in', suburb: 'Mfuleni', time: new Date(Date.now() - 38 * 60000).toISOString(), verified: true, desc: 'Garage broken into during Stage 4' },
  { id: '3', type: 'Suspicious vehicle', suburb: 'Camps Bay', time: new Date(Date.now() - 72 * 60000).toISOString(), verified: false, desc: 'White sedan circling the block repeatedly' },
  { id: '4', type: 'Cable theft', suburb: 'Delft', time: new Date(Date.now() - 120 * 60000).toISOString(), verified: true, desc: 'Copper cables removed from substation' },
  { id: '5', type: 'Smash & grab', suburb: 'CBD', time: new Date(Date.now() - 200 * 60000).toISOString(), verified: false, desc: 'Window smashed at traffic light on Buitengracht' },
];

const CitizenReportingCard = () => {
  const [suburb, setSuburb] = useState('');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!desc.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setDesc('');
    setSuburb('');
  };

  return (
    <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-safety-orange" />
          Report Incident – Help Update the Map
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {/* Form */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Suburb (auto-fill)" value={suburb} onChange={e => setSuburb(e.target.value)} className="flex-1 h-9 text-sm" />
            <Button variant="outline" size="sm" className="shrink-0 h-9">
              <Camera className="w-3.5 h-3.5 mr-1" /> Photo
            </Button>
          </div>
          <Textarea placeholder="Describe the incident…" value={desc} onChange={e => setDesc(e.target.value)} className="min-h-[60px] text-sm resize-none" />
          <Button size="sm" onClick={handleSubmit} disabled={!desc.trim()} className="w-full sm:w-auto">
            {submitted ? <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Submitted!</> : <><Send className="w-3.5 h-3.5 mr-1" /> Submit Report</>}
          </Button>
        </div>

        {/* Moderated Feed */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Live Feed</p>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-2">
              {mockFeed.map(r => {
                const isFresh = Date.now() - new Date(r.time).getTime() < 30 * 60000;
                return (
                  <div key={r.id} className={`p-2.5 rounded-lg border transition-colors ${isFresh ? 'border-primary/40 bg-primary/5' : 'border-border/50 bg-card/50'}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{r.type}</span>
                      {r.verified && <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-primary border-primary/30">✓ Verified</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{r.desc}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground/70">
                      <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{r.suburb}</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{formatDistanceToNow(new Date(r.time), { addSuffix: true })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="pt-2 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground/70">Western Cape Safety Intelligence • Real-time where available • Verified data only</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CitizenReportingCard;
