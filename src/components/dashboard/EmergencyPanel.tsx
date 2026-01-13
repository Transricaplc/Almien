import { useState } from 'react';
import { Phone, Flame, Cross, Shield, Ambulance, LifeBuoy, Car, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { emergencyContacts, EmergencyContact } from '@/data/emergencyContacts';
import { cn } from '@/lib/utils';

const iconMap = {
  phone: Phone,
  flame: Flame,
  hospital: Cross,
  shield: Shield,
  ambulance: Ambulance,
  lifeBuoy: LifeBuoy,
  car: Car,
  zap: Zap,
};

const EmergencyCard = ({ contact }: { contact: EmergencyContact }) => {
  const Icon = iconMap[contact.icon];
  
  return (
    <a
      href={`tel:${contact.number.replace(/\s/g, '')}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group',
        'bg-background/50 hover:bg-destructive/20 border border-border hover:border-destructive',
        'hover:scale-[1.02] active:scale-[0.98]'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
        contact.category === 'primary' 
          ? 'bg-destructive/20 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground'
          : 'bg-safety-moderate/20 text-safety-moderate group-hover:bg-safety-moderate group-hover:text-background'
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-foreground text-sm truncate">{contact.name}</div>
        <div className="text-xs text-muted-foreground truncate">{contact.description}</div>
      </div>
      <div className="font-mono font-bold text-sm text-foreground whitespace-nowrap">
        {contact.number}
      </div>
    </a>
  );
};

const EmergencyPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryContacts = emergencyContacts.filter(c => c.category === 'primary');
  const secondaryContacts = emergencyContacts.filter(c => c.category === 'secondary');

  return (
    <div className="bg-card rounded-xl border-2 border-destructive/30 overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-destructive/20 to-destructive/10 px-4 py-3 border-b border-destructive/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <h3 className="font-bold text-foreground">Emergency Contacts</h3>
          </div>
          <span className="text-xs text-muted-foreground">Tap to call</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {primaryContacts.map(contact => (
          <EmergencyCard key={contact.id} contact={contact} />
        ))}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border"
      >
        {isExpanded ? (
          <>
            <span>Show less</span>
            <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            <span>More contacts</span>
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {isExpanded && (
        <div className="p-3 pt-0 space-y-2 animate-fade-in">
          {secondaryContacts.map(contact => (
            <EmergencyCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyPanel;
