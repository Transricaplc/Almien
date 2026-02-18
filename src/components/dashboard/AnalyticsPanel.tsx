import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, TrendingUp, BarChart3, PieChart, Calendar, Download, Crown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SafetyScoreBadge from './SafetyScoreBadge';
import type { AreaSafetyData } from '@/data/capeTownSafetyData';

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  area?: AreaSafetyData | null;
}

// Mock 5-year trend data
const generateTrendData = (area?: AreaSafetyData | null) => {
  const base = area?.incidentCount.last12Months || 100;
  return [
    { year: '2020', incidents: Math.round(base * 1.3), score: Math.max(1, (area?.safetyScore || 6) - 1.5) },
    { year: '2021', incidents: Math.round(base * 1.2), score: Math.max(1, (area?.safetyScore || 6) - 1.0) },
    { year: '2022', incidents: Math.round(base * 1.1), score: Math.max(1, (area?.safetyScore || 6) - 0.5) },
    { year: '2023', incidents: Math.round(base * 1.05), score: (area?.safetyScore || 6) - 0.2 },
    { year: '2024', incidents: Math.round(base * 0.95), score: (area?.safetyScore || 6) },
    { year: '2025', incidents: Math.round(base * 0.9), score: Math.min(10, (area?.safetyScore || 6) + 0.3) },
  ];
};

const incidentTypes = [
  { name: 'Theft', value: 35, color: 'hsl(var(--safety-yellow))' },
  { name: 'Assault', value: 20, color: 'hsl(var(--safety-red))' },
  { name: 'Burglary', value: 18, color: 'hsl(var(--safety-orange))' },
  { name: 'Vehicle', value: 15, color: 'hsl(var(--primary))' },
  { name: 'Other', value: 12, color: 'hsl(var(--muted-foreground))' },
];

const seasonalData = [
  { month: 'Jan', score: 7.2 }, { month: 'Feb', score: 7.0 },
  { month: 'Mar', score: 7.5 }, { month: 'Apr', score: 7.8 },
  { month: 'May', score: 8.0 }, { month: 'Jun', score: 8.2 },
  { month: 'Jul', score: 8.1 }, { month: 'Aug', score: 7.9 },
  { month: 'Sep', score: 7.6 }, { month: 'Oct', score: 7.3 },
  { month: 'Nov', score: 6.8 }, { month: 'Dec', score: 6.5 },
];

const insights = [
  { text: 'Incidents increase 30% on weekends', trend: 'up' as const },
  { text: 'December peak: 40% more incidents vs June', trend: 'up' as const },
  { text: 'Night crime down 15% vs last year', trend: 'down' as const },
  { text: 'CCTV areas show 25% fewer incidents', trend: 'down' as const },
];

const AnalyticsPanel = memo(({ isOpen, onClose, area }: AnalyticsPanelProps) => {
  const [activeChart, setActiveChart] = useState<'trends' | 'comparison' | 'seasonal' | 'types'>('trends');
  const trendData = generateTrendData(area);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Analytics</h2>
            <span className="text-[8px] bg-elite-gradient text-white px-1.5 py-0.5 rounded-full font-bold">ELITE</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Area context */}
        {area && (
          <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">{area.name}</div>
              <div className="text-xs text-muted-foreground">5-year analysis · {area.incidentCount.last12Months} incidents/year</div>
            </div>
            <SafetyScoreBadge score={area.safetyScore} size="md" />
          </div>
        )}

        {/* Chart tabs */}
        <div className="flex border-b border-border px-4">
          {[
            { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
            { id: 'comparison' as const, label: 'Comparison', icon: BarChart3 },
            { id: 'seasonal' as const, label: 'Seasonal', icon: Calendar },
            { id: 'types' as const, label: 'Types', icon: PieChart },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors",
                activeChart === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChart === 'trends' && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Crime Trajectory (5 Years)</h3>
              <p className="text-xs text-muted-foreground mb-4">Incident count and safety score trends</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    <Line yAxisId="left" type="monotone" dataKey="incidents" stroke="hsl(var(--safety-red))" strokeWidth={2} dot={{ r: 4 }} name="Incidents" />
                    <Line yAxisId="right" type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Safety Score" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'comparison' && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Area vs City Average</h3>
              <p className="text-xs text-muted-foreground mb-4">How this area compares to Cape Town overall</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { metric: 'Safety', area: area?.safetyScore || 6.5, city: 6.2 },
                    { metric: 'Response', area: 7.2, city: 5.8 },
                    { metric: 'CCTV', area: 8.0, city: 5.5 },
                    { metric: 'Lighting', area: 7.5, city: 6.0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="area" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={area?.name || 'Selected Area'} />
                    <Bar dataKey="city" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="City Average" />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'seasonal' && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Seasonal Patterns</h3>
              <p className="text-xs text-muted-foreground mb-4">Monthly safety score variation</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis domain={[5, 10]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Safety Score">
                      {seasonalData.map((entry, i) => (
                        <Cell key={i} fill={entry.score >= 7.5 ? 'hsl(var(--safety-green))' : entry.score >= 6.5 ? 'hsl(var(--safety-yellow))' : 'hsl(var(--safety-orange))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'types' && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Incident Type Breakdown</h3>
              <p className="text-xs text-muted-foreground mb-4">Distribution by category</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={incidentTypes} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {incidentTypes.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Correlation Insights */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Correlation Insights</h3>
            <div className="grid grid-cols-2 gap-2">
              {insights.map((insight, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className={cn("w-3.5 h-3.5", insight.trend === 'up' ? 'text-safety-red rotate-0' : 'text-safety-green rotate-180')} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Insight</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="flex gap-2">
            {['CSV', 'Excel', 'PDF'].map(format => (
              <button key={format} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
                <Download className="w-3 h-3" />
                {format}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

AnalyticsPanel.displayName = 'AnalyticsPanel';
export default AnalyticsPanel;
