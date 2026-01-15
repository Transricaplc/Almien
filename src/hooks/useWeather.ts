import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  id: string;
  location: string;
  temperature_celsius: number;
  feels_like_celsius: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  wind_direction: string;
  description: string;
  icon_code: string;
  uv_index: number;
  visibility_km: number;
  last_updated: string;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location', 'Cape Town')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      setWeather(data as WeatherData || null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    weather,
    loading,
    error,
    refetch: fetchData,
  };
};

export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌡️';
};

export const getUVLevel = (uv: number): { label: string; color: string } => {
  if (uv <= 2) return { label: 'Low', color: 'hsl(160 84% 39%)' };
  if (uv <= 5) return { label: 'Moderate', color: 'hsl(38 92% 50%)' };
  if (uv <= 7) return { label: 'High', color: 'hsl(25 95% 53%)' };
  if (uv <= 10) return { label: 'Very High', color: 'hsl(0 84% 60%)' };
  return { label: 'Extreme', color: 'hsl(280 84% 60%)' };
};
