import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Shield, Bell, CreditCard, HelpCircle, Info, Crown, Lock, MessageSquare } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { ViewId } from '../GridifyDashboard';

interface Props {
  onUpgrade: (trigger?: string) => void;
  onNavigate: (view: ViewId) => void;
}

const SettingsView = memo(({ onUpgrade }: Props) => {
  const [smsFallback, setSmsFallback] = useState(false);
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Account */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">Guest User</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">guest@example.com</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="text-foreground">Free</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span className="text-foreground">February 2026</span></div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Edit Profile</button>
          <button onClick={() => onUpgrade()} className="px-4 py-2 rounded-lg bg-elite-gradient text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> UPGRADE TO ELITE
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">I am a:</label>
            <div className="flex flex-wrap gap-2">
              {['Tourist', 'Resident', 'Professional', 'Business'].map(type => (
                <button key={type} className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  type === 'Tourist' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                )}>{type}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Risk Tolerance:</label>
            <div className="flex flex-wrap gap-2">
              {['Cautious', 'Balanced', 'Adventurous'].map(level => (
                <button key={level} className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  level === 'Balanced' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                )}>{level}</button>
              ))}
            </div>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Save Preferences</button>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-xl border border-border bg-card relative">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <button onClick={() => onUpgrade('Customize notifications with Elite')} className="text-sm font-semibold text-primary hover:underline">Upgrade to customize</button>
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications 👑</h2>
        <p className="text-sm text-muted-foreground">Full notification settings available for Elite members</p>
      </div>

      {/* SMS Fallback */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Offline / SMS Fallback
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          When enabled, if no internet is detected during a panic trigger, the system auto-sends an SMS to all trusted contacts with your GPS coordinates and a timestamped emergency message.
        </p>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <span className="text-sm font-medium text-foreground">Enable SMS Fallback</span>
            <p className="text-xs text-muted-foreground mt-0.5">Requires mobile network signal</p>
          </div>
          <Switch checked={smsFallback} onCheckedChange={setSmsFallback} />
        </div>
        {smsFallback && (
          <p className="mt-3 text-xs text-muted-foreground p-3 rounded-lg bg-secondary/50">
            📱 SMS template: "GRIDIFY PANIC ALERT — [Name] needs help at [GPS coordinates]. Time: [timestamp]."
          </p>
        )}
      </div>

      {/* Privacy */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Privacy & Security</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Change Password</button>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border">
            <span className="text-sm font-medium text-foreground">Two-Factor Authentication</span>
            <span className="text-xs text-muted-foreground">Off</span>
          </div>
          <div className="flex gap-3 text-xs text-primary">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5" /> Support</h2>
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">Email: support@gridify.co.za</div>
          <div className="text-muted-foreground">Elite: 24/7 Priority Support</div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Send Feedback</button>
          <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Report Bug</button>
        </div>
      </div>

      {/* About */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Info className="w-5 h-5" /> About</h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>Gridify v2.0.0</div>
          <div>© 2026 Gridify Safety Intelligence</div>
          <div className="flex gap-3 text-xs text-primary mt-2">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Licenses</a>
            <a href="#" className="hover:underline">About Us</a>
          </div>
        </div>
      </div>

      <button className="text-xs text-safety-red hover:underline">Delete Account</button>
    </div>
  );
});

SettingsView.displayName = 'SettingsView';
export default SettingsView;
