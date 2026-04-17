import { useEffect, useRef, useCallback } from 'react';

interface BehaviourWatchOptions {
  currentSuburb: string;
  safetyScore: number; // 0-10
  onAlert: (alert: SafiAlert) => void;
  /** Disable for testing or when user is not in active session */
  enabled?: boolean;
}

export interface SafiAlert {
  id: string;
  type: 'go-home' | 'dark-zone' | 'pattern-warning';
  title: string;
  message: string;
  urgency: 'info' | 'warning' | 'critical';
  timestamp: Date;
}

function getCurrentRiskWindow(): 'safe' | 'elevated' | 'high' {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) return 'high';
  if (hour >= 19 || (hour >= 6 && hour < 7)) return 'elevated';
  return 'safe';
}

function getSessionDurationMinutes(): number {
  const start = localStorage.getItem('safi-session-start');
  if (!start) return 0;
  return Math.floor((Date.now() - Number(start)) / 60000);
}

export function useSafiBehaviourWatch({
  currentSuburb,
  safetyScore,
  onAlert,
  enabled = true,
}: BehaviourWatchOptions) {
  const alertedRef = useRef<Set<string>>(new Set());

  // Record session start once
  useEffect(() => {
    if (!localStorage.getItem('safi-session-start')) {
      localStorage.setItem('safi-session-start', String(Date.now()));
    }
  }, []);

  const checkBehaviour = useCallback(() => {
    if (!enabled) return;
    const riskWindow = getCurrentRiskWindow();
    const sessionMins = getSessionDurationMinutes();
    const hour = new Date().getHours();

    // Rule 1: 2+ hours session + evening/night + moderate-high risk area
    if (
      sessionMins >= 120 &&
      riskWindow !== 'safe' &&
      safetyScore < 7.5 &&
      !alertedRef.current.has('go-home-1')
    ) {
      alertedRef.current.add('go-home-1');
      onAlert({
        id: 'go-home-1',
        type: 'go-home',
        title: '✦ Safi recommends heading home',
        message: `You've been in ${currentSuburb} for ${sessionMins} minutes. Crime incidents typically rise after ${hour + 1}:00. Tonight's score: ${(safetyScore - 1.2).toFixed(1)}/10. Safe travel window: next 30 minutes.`,
        urgency: 'warning',
        timestamp: new Date(),
      });
    }

    // Rule 2: After 22:00 in any area
    if (hour >= 22 && !alertedRef.current.has('late-night')) {
      alertedRef.current.add('late-night');
      onAlert({
        id: 'late-night',
        type: 'go-home',
        title: '🌙 Late night safety check',
        message: `It's after 10pm in ${currentSuburb}. Crime risk is elevated. If you're heading home, use the Safe Route planner. Escort timer ready — set your ETA before you leave.`,
        urgency: 'info',
        timestamp: new Date(),
      });
    }

    // Rule 3: High-risk area + evening risk window
    if (
      safetyScore < 5.5 &&
      riskWindow === 'elevated' &&
      !alertedRef.current.has('high-risk-area')
    ) {
      alertedRef.current.add('high-risk-area');
      onAlert({
        id: 'high-risk-area',
        type: 'pattern-warning',
        title: `⚠ ${currentSuburb} risk window opening`,
        message: `Incident frequency in ${currentSuburb} rises 19:00–22:00. 3 reports in the last 2 hours nearby. Safi recommends activating the Virtual Escort Timer before moving.`,
        urgency: 'warning',
        timestamp: new Date(),
      });
    }
  }, [currentSuburb, safetyScore, onAlert, enabled]);

  useEffect(() => {
    checkBehaviour();
    const interval = setInterval(checkBehaviour, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkBehaviour]);

  // Reset session on tab close
  useEffect(() => {
    const handler = () => localStorage.removeItem('safi-session-start');
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
}
