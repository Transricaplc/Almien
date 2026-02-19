import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plane, Phone, Lock, MapPin, Clock, Info } from 'lucide-react';
import { useFlights, getFlightStatusColor, getFlightStatusLabel } from '@/hooks/useFlights';
import { useWeather, getWeatherIcon } from '@/hooks/useWeather';
import type { ViewId } from '../GridifyDashboard';

interface Props { onUpgrade: (trigger?: string) => void; onNavigate: (view: ViewId) => void; }

const mockArrivals = [
  { id: '1', flight: 'SA 328', route: 'Johannesburg → Cape Town', status: 'landed', gate: 'B12', scheduled: '08:30', actual: '08:35', airline: 'South African Airways', aircraft: 'Airbus A320', baggage: 'Carousel 3' },
  { id: '2', flight: 'BA 56', route: 'London Heathrow → Cape Town', status: 'delayed', gate: 'C5', scheduled: '08:45', actual: '09:15', airline: 'British Airways', aircraft: 'Boeing 777-300ER', baggage: 'Carousel 7' },
  { id: '3', flight: 'EK 772', route: 'Dubai → Cape Town', status: 'scheduled', gate: 'C8', scheduled: '09:30', actual: null, airline: 'Emirates', aircraft: 'Airbus A380', baggage: 'TBD' },
  { id: '4', flight: 'FA 191', route: 'Durban → Cape Town', status: 'in_flight', gate: 'A3', scheduled: '09:05', actual: null, airline: 'FlySafair', aircraft: 'Boeing 737-800', baggage: 'Carousel 1' },
  { id: '5', flight: 'LH 575', route: 'Frankfurt → Cape Town', status: 'cancelled', gate: '-', scheduled: '09:45', actual: null, airline: 'Lufthansa', aircraft: 'Airbus A340', baggage: '-' },
];

const mockDepartures = [
  { id: '6', flight: 'SA 341', route: 'Cape Town → Johannesburg', status: 'boarding', gate: 'A7', scheduled: '09:15', actual: null, airline: 'South African Airways', aircraft: 'Airbus A320' },
  { id: '7', flight: 'BA 55', route: 'Cape Town → London Heathrow', status: 'scheduled', gate: 'C12', scheduled: '19:45', actual: null, airline: 'British Airways', aircraft: 'Boeing 777-300ER' },
  { id: '8', flight: 'EK 771', route: 'Cape Town → Dubai', status: 'scheduled', gate: 'C12', scheduled: '10:30', actual: null, airline: 'Emirates', aircraft: 'Airbus A380' },
  { id: '9', flight: 'FA 186', route: 'Cape Town → Durban', status: 'delayed', gate: 'A2', scheduled: '09:45', actual: '10:05', airline: 'FlySafair', aircraft: 'Boeing 737-800' },
];

const statusBadge = (status: string) => {
  const color = status === 'landed' || status === 'departed' ? 'text-safety-green' : status === 'delayed' ? 'text-safety-yellow' : status === 'cancelled' ? 'text-safety-red' : status === 'boarding' || status === 'in_flight' ? 'text-primary' : 'text-muted-foreground';
  const label = status === 'landed' ? '🟢 LANDED' : status === 'delayed' ? '🟡 DELAYED' : status === 'cancelled' ? '🔴 CANCELLED' : status === 'boarding' ? '🟢 BOARDING' : status === 'in_flight' ? '🟢 APPROACHING' : '🟢 ON TIME';
  return <Badge variant="outline" className={`${color} border-current text-xs`}>{label}</Badge>;
};

const AirportInfoView = memo(({ onUpgrade }: Props) => {
  const { arrivals: dbArrivals, departures: dbDepartures, loading: flightsLoading } = useFlights();
  const { weather } = useWeather();
  const [tab, setTab] = useState<'arrivals' | 'departures'>('arrivals');

  const arrivals = dbArrivals.length > 0
    ? dbArrivals.map(f => ({ id: f.id, flight: f.flight_number, route: `${f.origin_destination} → Cape Town`, status: f.status, gate: f.gate || '-', scheduled: f.scheduled_time?.slice(11, 16) || '', actual: f.actual_time?.slice(11, 16) || null, airline: f.airline, aircraft: '', baggage: '' }))
    : mockArrivals;

  const departures = dbDepartures.length > 0
    ? dbDepartures.map(f => ({ id: f.id, flight: f.flight_number, route: `Cape Town → ${f.origin_destination}`, status: f.status, gate: f.gate || '-', scheduled: f.scheduled_time?.slice(11, 16) || '', actual: f.actual_time?.slice(11, 16) || null, airline: f.airline, aircraft: '' }))
    : mockDepartures;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" /> Cape Town International Airport
        </h1>
        <p className="text-muted-foreground mt-1">Real-time arrivals, departures & airport status</p>
        <p className="text-xs text-muted-foreground mt-0.5">Last updated: 2 minutes ago</p>
      </div>

      {/* Airport Status */}
      <Card>
        <CardContent className="p-5">
          <p className="text-safety-green font-semibold text-lg">🟢 AIRPORT OPERATING NORMALLY</p>
          <div className="text-sm mt-2 space-y-0.5">
            <p>Current Weather: {weather ? `${getWeatherIcon(weather.icon_code)} ${weather.description}, ${weather.temperature_celsius}°C, Wind ${weather.wind_speed_kmh} km/h` : '☀️ Clear, 24°C, Wind 15 km/h'}</p>
            <p>Visibility: Excellent (&gt;10km)</p>
            <p>Runway Status: Both runways operational</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">287</p><p className="text-xs text-muted-foreground">Flights Today</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-safety-green">89%</p><p className="text-xs text-muted-foreground">On Time</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-safety-yellow">24</p><p className="text-xs text-muted-foreground">Delayed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-safety-red">3</p><p className="text-xs text-muted-foreground">Cancelled</p></CardContent></Card>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setTab('arrivals')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'arrivals' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent'}`}>Arrivals</button>
        <button onClick={() => setTab('departures')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'departures' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent'}`}>Departures</button>
      </div>

      {/* Flights */}
      <Accordion type="multiple" className="space-y-2">
        {(tab === 'arrivals' ? arrivals : departures).map(f => (
          <AccordionItem key={f.id} value={f.id} className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center justify-between w-full pr-2 gap-2">
                <span className="font-semibold text-foreground text-sm">{f.flight} – {f.route}</span>
                {statusBadge(f.status)}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm space-y-1">
              <p>Airline: {f.airline}</p>
              {f.aircraft && <p>Aircraft: {f.aircraft}</p>}
              <p>Scheduled: {f.scheduled} {f.actual ? `· Actual: ${f.actual}` : ''}</p>
              <p>Gate: {f.gate}</p>
              {'baggage' in f && (f as any).baggage && <p>Baggage Claim: {(f as any).baggage}</p>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => onUpgrade('flight-track')} className="text-xs px-3 py-1.5 rounded-md bg-elite-gradient text-white">Track Flight 👑</button>
                <button className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-accent">Share Flight Info</button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Getting There */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3"><MapPin className="w-5 h-5" /> Getting to the Airport</h2>
        <Card>
          <CardContent className="p-5 text-sm space-y-2">
            <p className="font-medium">Address: Matroosfontein, Cape Town, 7490 · 20 km from City Centre</p>
            <div className="space-y-1.5 mt-2">
              <p>🚕 <strong>Uber/Bolt:</strong> R180-250 · 25-35 min · Wait: ~8 min</p>
              <p>🚖 <strong>Metered Taxi:</strong> R250-300 · Unicab: 021 448 1720</p>
              <p>🚌 <strong>MyCiti Bus:</strong> R90 · Route A01 · Every 20 min</p>
              <p>🅿️ <strong>Parking:</strong> R15/hour, R120/day · Availability: 87%</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Terminal Facilities */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-5"><CardTitle className="text-base">🏢 Terminal Facilities</CardTitle></CardHeader>
        <CardContent className="px-5 pb-4 text-sm space-y-1">
          <p>Restaurants & Cafes: 15 · Shops: 22 · Lounges: 4 (Priority Pass accepted)</p>
          <p>ATMs: 8 · Currency Exchange: 3 bureaux · Free WiFi · Charging Stations</p>
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-5"><CardTitle className="text-base flex items-center gap-2"><Info className="w-4 h-4" /> Travel Tips</CardTitle></CardHeader>
        <CardContent className="px-5 pb-4 text-sm space-y-2">
          <div>
            <p className="font-medium">Check-in Times</p>
            <p>Domestic: 60 min before · International: 3 hours before</p>
          </div>
          <div>
            <p className="font-medium">Security: Current Wait 15-20 min</p>
            <p>Peak: 06:00-08:00, 17:00-19:00 · Liquids: Max 100ml in 1L bag</p>
          </div>
        </CardContent>
      </Card>

      {/* Airport Contacts */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-5"><CardTitle className="text-base flex items-center gap-2"><Phone className="w-4 h-4" /> Airport Contacts</CardTitle></CardHeader>
        <CardContent className="px-5 pb-4 text-sm space-y-1">
          <p>General Enquiries: 021 937 1200</p>
          <p>Lost & Found: 021 934 0407</p>
          <p>Airport Police: 021 937 1263</p>
          <p>Website: www.airports.co.za</p>
        </CardContent>
      </Card>

      {/* Elite */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3"><Lock className="w-4 h-4" /> Elite Features 👑</h3>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>🔒 Flight tracking with live map</li>
            <li>🔒 Delay/cancellation alerts (SMS + Push)</li>
            <li>🔒 Gate change notifications</li>
            <li>🔒 Multi-flight monitoring</li>
            <li>🔒 Smart journey planning (traffic-aware)</li>
          </ul>
          <button onClick={() => onUpgrade('airport')} className="mt-4 px-4 py-2 rounded-lg bg-elite-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Upgrade to Elite</button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">API Sources: FlightAware API · OpenWeatherMap · ACSA</p>
    </div>
  );
});

AirportInfoView.displayName = 'AirportInfoView';
export default AirportInfoView;
