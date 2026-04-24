import { useQuery } from '@tanstack/react-query';

// Cape Town area slug from beyarkay/eskom-calendar
const AREA_SLUG = 'western-cape-16-capetown';
const ESKOM_CAL_URL = `https://raw.githubusercontent.com/beyarkay/eskom-calendar/main/docs/loadshedding-area-${AREA_SLUG}.json`;

export interface LoadsheddingStatus {
  stage: number;
  activeUntil: string | null;
  nextStart: string | null;
  nextStage: number | null;
  source: string;
  is_active: boolean;
  last_updated: string;
}

interface EskomEvent {
  start: string;
  finsh: string;
  stage: number;
  source?: string;
}

interface UseLoadsheddingReturn {
  status: LoadsheddingStatus | null;
  loading: boolean;
  error: string | null;
  currentStage: number;
  isActive: boolean;
  refetch: () => Promise<unknown>;
}

export const useLoadshedding = (): UseLoadsheddingReturn => {
  const query = useQuery({
    queryKey: ['loadshedding', AREA_SLUG],
    queryFn: async (): Promise<LoadsheddingStatus> => {
      const res = await fetch(ESKOM_CAL_URL);
      if (!res.ok) throw new Error('Load shedding data unavailable');
      const data = await res.json();
      const events: EskomEvent[] = data.events || [];
      const now = new Date();

      const active = events.find(
        (e) => new Date(e.start) <= now && new Date(e.finsh) >= now
      );
      const next = events.find((e) => new Date(e.start) > now);

      return {
        stage: active ? active.stage : 0,
        activeUntil: active?.finsh || null,
        nextStart: next?.start || null,
        nextStage: next?.stage || null,
        source: 'eskom-calendar',
        is_active: !!active,
        last_updated: new Date().toISOString(),
      };
    },
    staleTime: 15 * 60 * 1000, // 15 min cache — bandwidth-friendly
    refetchInterval: 15 * 60 * 1000,
    retry: 1,
  });

  return {
    status: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    currentStage: query.data?.stage ?? 0,
    isActive: query.data?.is_active ?? false,
    refetch: query.refetch,
  };
};

export const getStageColor = (stage: number): string => {
  if (stage === 0) return 'hsl(160 84% 39%)';
  if (stage <= 2) return 'hsl(38 92% 50%)';
  if (stage <= 4) return 'hsl(25 95% 53%)';
  return 'hsl(0 84% 60%)';
};

export const getStageSeverity = (stage: number): 'none' | 'low' | 'moderate' | 'high' | 'critical' => {
  if (stage === 0) return 'none';
  if (stage <= 2) return 'low';
  if (stage <= 4) return 'moderate';
  if (stage <= 6) return 'high';
  return 'critical';
};
