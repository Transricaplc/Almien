import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Send, Mic, MicOff, Phone, MapPin, Users, Shield, ChevronRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ViewId } from '../dashboard/AlmienDashboard';

interface SafiAIProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: ViewId) => void;
  initialMode?: 'chat' | 'briefing' | 'route' | 'emergency';
}

interface Message {
  id: string;
  role: 'user' | 'safi';
  content: string;
  timestamp: Date;
}

const userContext = { suburb: 'Sea Point', commute: 'CBD', riskTolerance: 'moderate' };

const safiResponses: Record<string, (ctx: typeof userContext) => string> = {
  'run': (ctx) => `🏃 Morning runs in ${ctx.suburb} are safest 06:00–07:30 before peak commute. SAPS patrol Promenade from 05:45. Avoid Beach Road north after 07:00 — 3 incidents this week. Today's risk window: LOW until 08:15.`,
  'route': (ctx) => `🧭 Your usual ${ctx.suburb} → ${ctx.commute} route: Safety score 7.8/10 this morning. Avoid De Waal Drive — 1 stationary vehicle alert. Recommended: M3 via UCT. ETA 18 min. Starting escort timer?`,
  'tonight': (ctx) => `🌙 Tonight in ${ctx.suburb}: Stage 2 load-shedding 20:00–22:30. Risk elevates at 20:15 when street lights out on High Level Rd. Stay home or travel before 19:45. 2 × CPF stewards on patrol from 20:00.`,
  'gbv': () => `💜 GBV resources near you:\n• Saartjie Baartman Centre — 8.1km (021 633 5287)\n• Rape Crisis — 24hr helpline: 021 447 9762\n• SAPS GBV desk: 0800 428 428\n• Protection order guide: available in Settings.`,
  'load': (ctx) => `⚡ ${ctx.suburb} load-shedding: Stage 2 active. Next window: 20:00–22:30 tonight. 34 of 120 streetlights affected. Crime risk increases ↑18% during outage. Recommend staying indoors or travelling before 19:45.`,
};

function getSafiResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, fn] of Object.entries(safiResponses)) {
    if (lower.includes(key)) return fn(userContext);
  }
  return `✦ I'm analysing your request about "${input}" for ${userContext.suburb}. Based on current conditions: safety score is 7.8/10, 3 active incidents nearby. Would you like me to find a safe route or check tonight's risk windows?`;
}

const quickChips = [
  'Is it safe to run at 6am?',
  'Safe route to CBD',
  'GBV resources nearby',
  'Load-shedding tonight',
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
};

const SafiAI = memo(({ isOpen, onClose, onNavigate, initialMode = 'chat' }: SafiAIProps) => {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<'chat' | 'briefing' | 'route' | 'emergency'>(initialMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(() =>
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '0',
        role: 'safi',
        content: `Good ${getGreeting()}. Your area has 3 active incidents. What would you like to know?`,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);
    setTimeout(() => {
      const response = getSafiResponse(text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'safi', content: response, timestamp: new Date() }]);
      setIsThinking(false);
    }, 1200);
  }, []);

  const startVoiceInput = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    try {
      const recognition = new SR();
      recognition.lang = 'en-ZA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        sendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setIsListening(false);
    }
  }, [sendMessage]);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop?.();
    setIsListening(false);
  }, []);

  if (!isOpen) return null;

  const modes = ['chat', 'briefing', 'route', 'emergency'] as const;

  return (
    <div className={cn(
      "fixed z-[96] bg-[hsl(var(--surface-deep)/0.98)] backdrop-blur-xl flex flex-col",
      isMobile ? "inset-0" : "top-0 right-0 bottom-0 w-96 border-l border-border-subtle"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle shrink-0">
        <span className="font-neural text-sm font-bold text-accent-safe">✦ SAFI</span>
        <div className="flex gap-1">
          {modes.map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize transition-colors",
                mode === m ? "bg-accent-safe/15 text-accent-safe" : "text-muted-foreground hover:text-foreground"
              )}
            >{m}</button>
          ))}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary min-w-[44px] min-h-[44px] flex items-center justify-center">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content by mode */}
      {mode === 'emergency' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 bg-accent-threat/5">
          <Shield className="w-16 h-16 text-accent-threat animate-pulse" />
          <h2 className="text-xl font-bold text-accent-threat">EMERGENCY MODE</h2>
          {[
            { label: 'Call SAPS (10111)', icon: Phone, color: 'bg-blue-600' },
            { label: 'Share My Location', icon: MapPin, color: 'bg-accent-safe' },
            { label: 'Alert My Network', icon: Users, color: 'bg-accent-warning' },
          ].map(btn => (
            <button key={btn.label} className={cn("w-full max-w-xs h-16 rounded-xl text-white font-bold flex items-center justify-center gap-3 text-base", btn.color)}>
              <btn.icon className="w-6 h-6" /> {btn.label}
            </button>
          ))}
        </div>
      ) : mode === 'briefing' ? (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground">Your {new Date().toLocaleDateString('en-ZA', { weekday: 'long' })} Safety Briefing</h2>
            {[
              { dot: 'bg-accent-threat', label: 'Top Threat', text: '3 vehicle break-ins overnight on Beach Road — highest in 7 days.' },
              { dot: 'bg-accent-warning', label: 'Risk Window', text: 'Elevated risk 17:00–20:00 during Stage 2 load-shedding.' },
              { dot: 'bg-accent-safe', label: 'Safe Windows', text: 'Morning walk safe until 08:15. Evening return recommended before 17:30.' },
            ].map(b => (
              <div key={b.label} className="p-4 rounded-xl bg-card border border-border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", b.dot)} />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{b.label}</span>
                </div>
                <p className="text-sm text-foreground">{b.text}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full min-h-[44px] gap-2">
              <Share2 className="w-4 h-4" /> Share Briefing
            </Button>
          </div>
        </ScrollArea>
      ) : mode === 'route' ? (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground">Route Shield</h2>
            <div className="p-4 rounded-xl bg-card border border-border-subtle">
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm font-bold text-foreground">{userContext.suburb}</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border-subtle">
              <p className="text-xs text-muted-foreground">To</p>
              <p className="text-sm font-bold text-foreground">{userContext.commute}</p>
            </div>
            {['M3 via UCT — Score 7.8', 'N2 Highway — Score 6.2'].map((r, i) => (
              <button key={r} className="w-full p-4 rounded-xl bg-card border border-border-subtle text-left hover:border-accent-safe/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Option {i + 1}</span>
                  <span className={cn("text-xs font-neural", i === 0 ? "text-accent-safe" : "text-accent-warning")}>{r.split('— ')[1]}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.split('— ')[0]}</p>
              </button>
            ))}
            <Button className="w-full min-h-[44px]" onClick={() => onNavigate?.('safe-route')}>
              Open Full Route Planner <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </ScrollArea>
      ) : (
        /* Chat mode */
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    msg.role === 'user'
                      ? "bg-accent-safe/15 text-foreground rounded-br-md"
                      : "bg-card border border-border-subtle text-foreground rounded-bl-md"
                  )}>
                    {msg.role === 'safi' && <span className="text-accent-safe font-neural text-[10px] mr-1">✦</span>}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border-subtle rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full bg-accent-safe/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {/* Quick chips */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-visible">
            {quickChips.map(chip => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="px-3 py-1.5 rounded-full border border-border-subtle text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-accent-safe/30 shrink-0 transition-colors"
              >{chip}</button>
            ))}
          </div>
          {/* Listening indicator */}
          {isListening && (
            <div className="px-4 py-3 border-t border-border-subtle bg-accent-safe/5 flex flex-col items-center gap-1.5 shrink-0 animate-fade-in">
              <div className="flex items-end gap-1 h-5">
                {[0, 1, 2, 3].map(i => (
                  <span
                    key={i}
                    className="w-1 bg-accent-safe rounded-full animate-pulse"
                    style={{ height: `${40 + i * 15}%`, animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-accent-safe">Listening… speak now</span>
              <span className="text-[9px] font-neural text-muted-foreground">en-ZA · Chrome/Android</span>
            </div>
          )}
          {/* Input */}
          <div className="p-4 border-t border-border-subtle flex gap-2 shrink-0" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <div className="flex-1 flex items-center gap-2 bg-card border border-border-subtle rounded-xl px-3">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(inputValue)}
                placeholder={isListening ? 'Listening…' : 'Ask Safi anything...'}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground py-3 outline-none min-h-[48px]"
              />
              {voiceSupported && (
                <button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={cn(
                    'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    isListening
                      ? 'bg-accent-safe text-white'
                      : 'text-muted-foreground hover:text-accent-safe hover:bg-accent-safe/10'
                  )}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  title="Voice mode — works best on Android/Chrome"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>
            <button
              onClick={() => sendMessage(inputValue)}
              className="w-12 h-12 rounded-xl bg-accent-safe flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
});

SafiAI.displayName = 'SafiAI';
export default SafiAI;
