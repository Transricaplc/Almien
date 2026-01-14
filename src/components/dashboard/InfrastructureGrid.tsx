import DateWeatherWidget from './DateWeatherWidget';
import LoadsheddingPanel from './LoadsheddingPanel';
import WaterOutagePanel from './WaterOutagePanel';
import RobotsStatusPanel from './RobotsStatusPanel';
import FlightStatusPanel from './FlightStatusPanel';
import TaxiRankPanel from './TaxiRankPanel';

const InfrastructureGrid = () => {
  return (
    <div className="border-t border-border bg-background/30 backdrop-blur-sm">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
            <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Infrastructure Status
            </h2>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE DATA</span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Date & Weather - Takes 1 column */}
          <div className="xl:col-span-1">
            <DateWeatherWidget />
          </div>

          {/* Loadshedding - Takes 1 column */}
          <div className="xl:col-span-1">
            <LoadsheddingPanel />
          </div>

          {/* Water & Robots - Takes 1 column */}
          <div className="xl:col-span-1 space-y-4">
            <WaterOutagePanel />
          </div>

          {/* Traffic Robots - Takes 1 column */}
          <div className="xl:col-span-1">
            <RobotsStatusPanel />
          </div>

          {/* Flights - Takes 1 column */}
          <div className="xl:col-span-1">
            <FlightStatusPanel />
          </div>

          {/* Taxi Ranks - Takes 1 column */}
          <div className="xl:col-span-1">
            <TaxiRankPanel />
          </div>
        </div>

        {/* Bottom Ticker */}
        <div className="mt-4 py-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground overflow-hidden">
            <span className="shrink-0 text-primary">ALERTS:</span>
            <div className="flex items-center gap-6 animate-marquee">
              <span className="text-yellow-400">⚡ Stage 4 loadshedding in effect until 22:00</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-blue-400">💧 Planned maintenance: Camps Bay 14:00-17:00</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-cyan-400">✈️ BA6421 to London boarding at Gate B4</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-orange-400">🚕 High demand at Cape Town Station rank</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-emerald-400">🚦 All major intersections operational in CBD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureGrid;
