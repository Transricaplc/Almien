export interface RouteSection {
  name: string;
  cameras: number;
  status: 'good' | 'moderate' | 'poor' | 'critical';
}

export interface MajorRoute {
  id: string;
  name: string;
  total_cameras: number;
  functioning: number;
  offline: number;
  safety_score: number;
  incidents_24h: number;
  sections: RouteSection[];
}

export interface TrainRoute {
  id: string;
  name: string;
  safety_score: number;
  stations: number;
  operating_cameras: number;
  total_cameras: number;
  incidents_24h: number;
  status: 'critical' | 'high_risk' | 'moderate';
}

export interface UberDangerZone {
  id: string;
  name: string;
  danger_level: 'CRITICAL' | 'HIGH' | 'MODERATE';
  risk_score: number;
  incidents_uber: number;
  recommendation: string;
}

export type TabId = 'overview' | 'routes' | 'trains' | 'uber' | 'map' | 'analytics';
