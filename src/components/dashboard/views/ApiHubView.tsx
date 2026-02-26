import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Code, Key, BarChart3, Lock, Copy, Check } from 'lucide-react';

const endpoints = [
  { method: 'GET', path: '/v1/safety/scores', desc: 'Neighborhood safety scores', tier: 'Free' },
  { method: 'GET', path: '/v1/alerts/active', desc: 'Active city alerts', tier: 'Free' },
  { method: 'GET', path: '/v1/infrastructure/status', desc: 'Infrastructure health', tier: 'Pro' },
  { method: 'GET', path: '/v1/tourism/attractions', desc: 'Tourism attraction data', tier: 'Free' },
  { method: 'GET', path: '/v1/weather/current', desc: 'Current weather conditions', tier: 'Free' },
  { method: 'GET', path: '/v1/resilience/national', desc: 'National resilience metrics', tier: 'Enterprise' },
  { method: 'POST', path: '/v1/reports/citizen', desc: 'Submit citizen report', tier: 'Pro' },
];

const usageTiers = [
  { name: 'Free', requests: '1,000/day', price: 'R0', features: ['Read-only safety data', 'Basic weather', 'Tourism listings'] },
  { name: 'Pro', requests: '50,000/day', price: 'R499/mo', features: ['All Free endpoints', 'Infrastructure status', 'Citizen reports API', 'Webhook support'] },
  { name: 'Enterprise', requests: 'Unlimited', price: 'Custom', features: ['All Pro features', 'National aggregates', 'SLA guarantee', 'Dedicated support'] },
];

const ApiHubView = memo(() => {
  const [copied, setCopied] = useState(false);
  const sampleKey = 'gfy_live_xxxxxxxxxxxxxxxxxxxx';

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Code className="w-6 h-6 text-primary" />
          Developer & Partner API Portal
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Secure, read-only API explorer • Monetization-ready • Pre-built endpoints for national departments, NGOs, insurers, and telcos
        </p>
      </div>

      <Tabs defaultValue="explorer" className="w-full">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="explorer">API Explorer</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="mt-4 space-y-3">
          {endpoints.map((ep, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Badge variant={ep.method === 'GET' ? 'secondary' : 'default'} className="font-mono text-[10px] shrink-0 w-12 justify-center">
                  {ep.method}
                </Badge>
                <code className="text-sm font-mono text-foreground flex-1">{ep.path}</code>
                <span className="text-xs text-muted-foreground hidden sm:block">{ep.desc}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">{ep.tier}</Badge>
              </CardContent>
            </Card>
          ))}
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            // Replace with real API call — all endpoints are read-only by default • POPIA-compliant
          </p>
        </TabsContent>

        <TabsContent value="keys" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Your API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-foreground">{sampleKey}</span>
                <button onClick={handleCopy} className="p-1.5 rounded hover:bg-secondary transition-colors">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">This is a demo key. Production keys are issued upon account verification.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {usageTiers.map(tier => (
              <Card key={tier.name} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <p className="text-2xl font-black text-primary">{tier.price}</p>
                  <p className="text-xs text-muted-foreground">{tier.requests} requests</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {tier.features.map(f => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Usage simulation */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Usage & Revenue Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-black text-foreground">12,847</p>
              <p className="text-xs text-muted-foreground">API calls today</p>
            </div>
            <div>
              <p className="text-xl font-black text-foreground">R14,200</p>
              <p className="text-xs text-muted-foreground">Est. monthly revenue</p>
            </div>
            <div>
              <p className="text-xl font-black text-foreground">23</p>
              <p className="text-xs text-muted-foreground">Active partners</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ApiHubView.displayName = 'ApiHubView';
export default ApiHubView;
