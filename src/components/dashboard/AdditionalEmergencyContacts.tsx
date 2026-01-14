import { 
  Heart, Baby, FlaskConical, TreePine, Dog, 
  Car, AlertTriangle, Brain, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { additionalEmergencyContacts } from '@/data/mapData';

const iconMap: Record<string, any> = {
  heart: Heart,
  baby: Baby,
  flask: FlaskConical,
  tree: TreePine,
  paw: Dog,
  car: Car,
  'alert-triangle': AlertTriangle,
  brain: Brain,
};

const AdditionalEmergencyContacts = () => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-destructive/20 to-destructive/10 px-4 py-3 border-b border-destructive/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-destructive" />
            <h3 className="font-bold text-foreground">Additional Helplines</h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Tap to call</span>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {additionalEmergencyContacts.map(contact => {
          const Icon = iconMap[contact.icon] || Phone;
          return (
            <a
              key={contact.id}
              href={`tel:${contact.number.replace(/\s/g, '')}`}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all',
                'bg-background/50 hover:bg-destructive/10 border border-border hover:border-destructive/30',
                'group'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/50 group-hover:bg-destructive/20 flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">{contact.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{contact.description}</div>
              </div>
              <div className="font-mono text-xs text-foreground whitespace-nowrap">
                {contact.number}
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-background/30 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground">
          All helplines are available 24/7 • Numbers verified as of Jan 2024
        </p>
      </div>
    </div>
  );
};

export default AdditionalEmergencyContacts;
