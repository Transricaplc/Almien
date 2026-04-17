import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  'Report a pothole',
  'Bus times for MyCiti',
  'Check permit status',
  'Load shedding schedule',
  'Nearest safe point',
  'Water outage in my area',
];

const botResponses: Record<string, string> = {
  'pothole': '🕳️ I can help you report a pothole. Please share the location (street name or GPS) and I\'ll log it with the municipality. Average resolution time is currently 12 days for Ward priority areas.',
  'bus': '🚌 MyCiti Route T01 (Civic Centre → Table View): Next departures at 14:15, 14:35, 14:55. Real-time tracking shows the 14:15 bus is 2 mins away. Need a different route?',
  'permit': '📋 Enter your permit number (e.g., P-2026-0041) and I\'ll check its current status. You can also upload documents for a new AI compliance review.',
  'load': '⚡ Cape Town is currently on Stage 2 load shedding. Your area (if set) next outage: 18:00–20:30 today. Set your suburb in Settings for personalized schedules.',
  'safe': '🛡️ Nearest 24hr safe points to CBD: 1) Caltex Foreshore (0.3km) 2) SAPS Cape Town Central (0.5km) 3) Engen Buitengracht (0.7km). Want directions?',
  'water': '💧 No active water outages reported in your area. City-wide: 2 active outages in Hout Bay (burst main, est. repair 16:00) and Mitchells Plain (maintenance until 15:00).',
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return `I understand you're asking about "${input}". I can help with reporting issues, checking transport schedules, permit status, utility outages, and finding safe points. What would you like to know?`;
}

export default function CityChatbotWidget() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '👋 Hi! I\'m GridBot, your 24/7 city services assistant. I can help with reports, transport, permits, utilities, and safety info. How can I help?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  // Mobile uses Safi AI panel instead — hide this widget on mobile
  if (isMobile) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[520px] flex flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold">GridBot</span>
          <Badge variant="outline" className="text-[9px]">24/7</Badge>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 max-h-[340px]">
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && <Bot className="w-5 h-5 text-primary shrink-0 mt-1" />}
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <Bot className="w-5 h-5 text-primary shrink-0 mt-1" />
              <div className="bg-muted rounded-lg px-3 py-2"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickActions.slice(0, 4).map(a => (
            <button key={a} onClick={() => sendMessage(a)} className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted hover:bg-accent transition-colors">{a}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-border">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask anything..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => sendMessage(input)} disabled={!input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
