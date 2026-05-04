/**
 * Live Mode store — Phase B (foundation)
 *
 * WebSocket-ready structure. Today it drives a setInterval ticker that
 * emits `live:tick` on the map event bus every N ms. Components that want
 * to refresh (markers, mini-map, alert feed) subscribe to that event.
 *
 * Swap-in plan: replace the setInterval with a real WS subscription
 * without touching any consumer.
 */

import { create } from 'zustand';
import { mapEventBus } from '@/components/map/core/mapEventBus';

interface LiveModeState {
  enabled: boolean;
  intervalMs: number;
  _timer: ReturnType<typeof setInterval> | null;
  toggle: () => void;
  setIntervalMs: (ms: number) => void;
}

export const useLiveMode = create<LiveModeState>((set, get) => ({
  enabled: false,
  intervalMs: 5000,
  _timer: null,

  toggle: () => {
    const { enabled, _timer, intervalMs } = get();
    if (enabled) {
      if (_timer) clearInterval(_timer);
      set({ enabled: false, _timer: null });
      return;
    }
    const t = setInterval(() => {
      mapEventBus.emit('live:tick', { timestamp: Date.now() });
    }, intervalMs);
    // immediate first tick
    mapEventBus.emit('live:tick', { timestamp: Date.now() });
    set({ enabled: true, _timer: t });
  },

  setIntervalMs: (ms) => {
    const { enabled, _timer } = get();
    if (enabled && _timer) {
      clearInterval(_timer);
      const t = setInterval(() => {
        mapEventBus.emit('live:tick', { timestamp: Date.now() });
      }, ms);
      set({ intervalMs: ms, _timer: t });
    } else {
      set({ intervalMs: ms });
    }
  },
}));
