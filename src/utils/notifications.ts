/**
 * Almien Unified Notification System
 * Format: [Almien Icon] [Urgency: ALERT | WARNING | INFO] + [Message] + [Deep link]
 */

export type NotificationUrgency = 'ALERT' | 'WARNING' | 'INFO';

export interface AlmienNotification {
  id: string;
  urgency: NotificationUrgency;
  title: string;
  message: string;
  deepLink: string; // ViewId or route
  timestamp: Date;
  module: string;
  read: boolean;
}

const urgencyEmoji: Record<NotificationUrgency, string> = {
  ALERT: '🚨',
  WARNING: '⚠️',
  INFO: 'ℹ️',
};

export function formatNotification(n: AlmienNotification): string {
  return `${urgencyEmoji[n.urgency]} [${n.urgency}] ${n.message}`;
}

export function createNotification(
  urgency: NotificationUrgency,
  title: string,
  message: string,
  deepLink: string,
  module: string
): AlmienNotification {
  return {
    id: crypto.randomUUID(),
    urgency,
    title,
    message,
    deepLink,
    timestamp: new Date(),
    module,
    read: false,
  };
}
