import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FlightStatus {
  id: string;
  flight_number: string;
  airline: string;
  flight_type: 'arrival' | 'departure';
  origin_destination: string;
  scheduled_time: string;
  actual_time: string | null;
  status: 'scheduled' | 'boarding' | 'departed' | 'in_flight' | 'landed' | 'delayed' | 'cancelled';
  terminal: string;
  gate: string;
  last_updated: string;
}

interface UseFlightsReturn {
  arrivals: FlightStatus[];
  departures: FlightStatus[];
  allFlights: FlightStatus[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFlights = (): UseFlightsReturn => {
  const [flights, setFlights] = useState<FlightStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('flight_status')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (fetchError) throw fetchError;

      setFlights(data as FlightStatus[] || []);
    } catch (err) {
      console.error('Error fetching flight status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch flight data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const arrivals = flights.filter(f => f.flight_type === 'arrival');
  const departures = flights.filter(f => f.flight_type === 'departure');

  return {
    arrivals,
    departures,
    allFlights: flights,
    loading,
    error,
    refetch: fetchData,
  };
};

export const getFlightStatusColor = (status: FlightStatus['status']): string => {
  switch (status) {
    case 'landed':
    case 'departed':
      return 'hsl(160 84% 39%)';
    case 'boarding':
    case 'in_flight':
      return 'hsl(200 84% 50%)';
    case 'scheduled':
      return 'hsl(210 10% 60%)';
    case 'delayed':
      return 'hsl(38 92% 50%)';
    case 'cancelled':
      return 'hsl(0 84% 60%)';
    default:
      return 'hsl(210 10% 60%)';
  }
};

export const getFlightStatusLabel = (status: FlightStatus['status']): string => {
  const labels: Record<FlightStatus['status'], string> = {
    scheduled: 'Scheduled',
    boarding: 'Boarding',
    departed: 'Departed',
    in_flight: 'In Flight',
    landed: 'Landed',
    delayed: 'Delayed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};
