// Map data for Cape Town infrastructure

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'cctv' | 'traffic_light' | 'high_risk' | 'accident_hotspot' | 'taxi_rank';
  name: string;
  status?: 'operational' | 'faulty' | 'offline';
  lastInspection?: string;
  area: string;
}

export interface RoadStatus {
  id: string;
  name: string;
  type: 'national' | 'municipal' | 'regional';
  status: 'clear' | 'congested' | 'incident' | 'roadworks' | 'closed';
  trafficFlow: number; // 0-100
  incidents: number;
  avgSpeed: number;
  length: string;
  lastUpdate: string;
  sections?: {
    name: string;
    status: 'clear' | 'congested' | 'incident';
    speed: number;
  }[];
}

export interface WardData {
  id: string;
  name: string;
  municipality: string;
  type: 'urban' | 'peri-urban' | 'rural';
  population: number;
  areaKm2: number;
  cctvCount: number;
  trafficLights: number;
  accidentHotspots: number;
  safetyScore: number;
  lastUpdate: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  included: boolean;
}

// Cape Town center coordinates
export const MAP_CENTER: [number, number] = [-33.9249, 18.4241];
export const MAP_ZOOM = 11;

// CCTV Camera locations
export const cctvMarkers: MapMarker[] = [
  { id: 'cctv1', lat: -33.9258, lng: 18.4232, type: 'cctv', name: 'Adderley Street Cam 1', status: 'operational', lastInspection: '2024-01-10', area: 'CBD' },
  { id: 'cctv2', lat: -33.9189, lng: 18.4213, type: 'cctv', name: 'Foreshore Cam', status: 'operational', lastInspection: '2024-01-08', area: 'CBD' },
  { id: 'cctv3', lat: -33.9050, lng: 18.4200, type: 'cctv', name: 'Waterfront Cam 1', status: 'operational', lastInspection: '2024-01-12', area: 'V&A Waterfront' },
  { id: 'cctv4', lat: -33.9168, lng: 18.3912, type: 'cctv', name: 'Sea Point Promenade', status: 'operational', lastInspection: '2024-01-05', area: 'Sea Point' },
  { id: 'cctv5', lat: -33.9505, lng: 18.3844, type: 'cctv', name: 'Camps Bay Main', status: 'faulty', lastInspection: '2023-11-20', area: 'Camps Bay' },
  { id: 'cctv6', lat: -33.9384, lng: 18.4699, type: 'cctv', name: 'Woodstock Main', status: 'operational', lastInspection: '2024-01-09', area: 'Woodstock' },
  { id: 'cctv7', lat: -33.9577, lng: 18.4612, type: 'cctv', name: 'Observatory Circle', status: 'operational', lastInspection: '2024-01-11', area: 'Observatory' },
  { id: 'cctv8', lat: -33.9604, lng: 18.4759, type: 'cctv', name: 'Rondebosch Main', status: 'offline', lastInspection: '2023-10-15', area: 'Rondebosch' },
  { id: 'cctv9', lat: -33.8933, lng: 18.5125, type: 'cctv', name: 'N1 Koeberg IC', status: 'operational', lastInspection: '2024-01-07', area: 'Milnerton' },
  { id: 'cctv10', lat: -33.8719, lng: 18.6463, type: 'cctv', name: 'Bellville CBD', status: 'operational', lastInspection: '2024-01-06', area: 'Bellville' },
];

// Traffic Light locations
export const trafficLightMarkers: MapMarker[] = [
  { id: 'tl1', lat: -33.9262, lng: 18.4238, type: 'traffic_light', name: 'Adderley & Strand', status: 'operational', area: 'CBD' },
  { id: 'tl2', lat: -33.9195, lng: 18.4189, type: 'traffic_light', name: 'Hertzog & Foreshore', status: 'operational', area: 'CBD' },
  { id: 'tl3', lat: -33.9145, lng: 18.3958, type: 'traffic_light', name: 'Main & Beach', status: 'faulty', area: 'Sea Point' },
  { id: 'tl4', lat: -33.8725, lng: 18.6471, type: 'traffic_light', name: 'Voortrekker & Durban', status: 'operational', area: 'Bellville' },
  { id: 'tl5', lat: -33.9612, lng: 18.4623, type: 'traffic_light', name: 'Main & Lower Main', status: 'operational', area: 'Observatory' },
];

// High Risk Intersections
export const highRiskMarkers: MapMarker[] = [
  { id: 'hr1', lat: -33.9342, lng: 18.6584, type: 'high_risk', name: 'N2/Airport IC', area: 'Airport' },
  { id: 'hr2', lat: -33.8867, lng: 18.5012, type: 'high_risk', name: 'N1/N7 Interchange', area: 'Century City' },
  { id: 'hr3', lat: -33.9456, lng: 18.4912, type: 'high_risk', name: 'Liesbeek Pkwy', area: 'Mowbray' },
  { id: 'hr4', lat: -33.9987, lng: 18.6234, type: 'high_risk', name: 'Khayelitsha IC', area: 'Khayelitsha' },
];

// Accident Hotspots
export const accidentHotspots: MapMarker[] = [
  { id: 'ah1', lat: -33.9312, lng: 18.6234, type: 'accident_hotspot', name: 'N2 Borcherds Quarry', area: 'Gugulethu' },
  { id: 'ah2', lat: -33.8945, lng: 18.5234, type: 'accident_hotspot', name: 'N1 Century City', area: 'Century City' },
  { id: 'ah3', lat: -33.9234, lng: 18.4567, type: 'accident_hotspot', name: 'De Waal Drive', area: 'Gardens' },
];

// Road status data
export const roadsData: RoadStatus[] = [
  { 
    id: 'n1', 
    name: 'N1 - Cape Town to Paarl', 
    type: 'national', 
    status: 'congested', 
    trafficFlow: 65, 
    incidents: 1, 
    avgSpeed: 75, 
    length: '57km',
    lastUpdate: '2 min ago',
    sections: [
      { name: 'Foreshore - Koeberg IC', status: 'congested', speed: 45 },
      { name: 'Koeberg IC - N7 IC', status: 'clear', speed: 95 },
      { name: 'N7 IC - Durbanville', status: 'clear', speed: 110 },
      { name: 'Durbanville - Paarl', status: 'clear', speed: 120 },
    ]
  },
  { 
    id: 'n2', 
    name: 'N2 - Cape Town to Somerset West', 
    type: 'national', 
    status: 'incident', 
    trafficFlow: 45, 
    incidents: 2, 
    avgSpeed: 55, 
    length: '42km',
    lastUpdate: '1 min ago',
    sections: [
      { name: 'Foreshore - Airport', status: 'congested', speed: 40 },
      { name: 'Airport - Khayelitsha', status: 'incident', speed: 25 },
      { name: 'Khayelitsha - Somerset West', status: 'clear', speed: 100 },
    ]
  },
  { 
    id: 'n7', 
    name: 'N7 - Cape Town to Malmesbury', 
    type: 'national', 
    status: 'clear', 
    trafficFlow: 85, 
    incidents: 0, 
    avgSpeed: 110, 
    length: '65km',
    lastUpdate: '3 min ago',
    sections: [
      { name: 'N1 IC - Potsdam', status: 'clear', speed: 100 },
      { name: 'Potsdam - Malmesbury', status: 'clear', speed: 120 },
    ]
  },
  { 
    id: 'm3', 
    name: 'M3 - Cape Town to Muizenberg', 
    type: 'municipal', 
    status: 'congested', 
    trafficFlow: 55, 
    incidents: 0, 
    avgSpeed: 50, 
    length: '18km',
    lastUpdate: '2 min ago',
    sections: [
      { name: 'Hospital Bend - UCT', status: 'congested', speed: 35 },
      { name: 'UCT - Tokai', status: 'congested', speed: 55 },
      { name: 'Tokai - Muizenberg', status: 'clear', speed: 70 },
    ]
  },
  { 
    id: 'm5', 
    name: 'M5 - Foreshore to Retreat', 
    type: 'municipal', 
    status: 'clear', 
    trafficFlow: 78, 
    incidents: 0, 
    avgSpeed: 85, 
    length: '15km',
    lastUpdate: '4 min ago'
  },
  { 
    id: 'r300', 
    name: 'R300 - Kuils River to Bellville', 
    type: 'regional', 
    status: 'roadworks', 
    trafficFlow: 40, 
    incidents: 0, 
    avgSpeed: 40, 
    length: '12km',
    lastUpdate: '5 min ago'
  },
  { 
    id: 'm4', 
    name: 'M4 - Woodstock to Muizenberg', 
    type: 'municipal', 
    status: 'clear', 
    trafficFlow: 82, 
    incidents: 0, 
    avgSpeed: 60, 
    length: '22km',
    lastUpdate: '2 min ago'
  },
  { 
    id: 'r44', 
    name: 'R44 - Strand to Gordon\'s Bay', 
    type: 'regional', 
    status: 'clear', 
    trafficFlow: 90, 
    incidents: 0, 
    avgSpeed: 80, 
    length: '15km',
    lastUpdate: '6 min ago'
  },
];

// Ward comparison data
export const wardData: WardData[] = [
  { id: 'w54', name: 'Ward 54', municipality: 'City of Cape Town', type: 'urban', population: 32000, areaKm2: 4.2, cctvCount: 48, trafficLights: 28, accidentHotspots: 3, safetyScore: 72, lastUpdate: '2024-01-14' },
  { id: 'w55', name: 'Ward 55', municipality: 'City of Cape Town', type: 'urban', population: 28000, areaKm2: 3.8, cctvCount: 42, trafficLights: 24, accidentHotspots: 2, safetyScore: 78, lastUpdate: '2024-01-14' },
  { id: 'w77', name: 'Ward 77', municipality: 'City of Cape Town', type: 'urban', population: 45000, areaKm2: 8.5, cctvCount: 25, trafficLights: 18, accidentHotspots: 8, safetyScore: 35, lastUpdate: '2024-01-14' },
  { id: 'w95', name: 'Ward 95', municipality: 'City of Cape Town', type: 'peri-urban', population: 52000, areaKm2: 12.3, cctvCount: 18, trafficLights: 12, accidentHotspots: 12, safetyScore: 28, lastUpdate: '2024-01-14' },
  { id: 'w100', name: 'Ward 100', municipality: 'City of Cape Town', type: 'urban', population: 18000, areaKm2: 2.1, cctvCount: 35, trafficLights: 22, accidentHotspots: 1, safetyScore: 85, lastUpdate: '2024-01-14' },
  { id: 'w115', name: 'Ward 115', municipality: 'City of Cape Town', type: 'peri-urban', population: 38000, areaKm2: 15.6, cctvCount: 12, trafficLights: 8, accidentHotspots: 6, safetyScore: 45, lastUpdate: '2024-01-14' },
];

// Premium features
export const premiumFeatures: PremiumFeature[] = [
  { id: 'live_feeds', name: 'Live CCTV Feeds', description: 'Real-time camera streams from 500+ locations', icon: 'video', included: true },
  { id: 'alarms', name: 'Instant Alarms', description: 'Push notifications for area incidents & alerts', icon: 'bell', included: true },
  { id: 'insurance', name: 'Insurance Tracker', description: 'Personal claim status & policy monitoring', icon: 'shield', included: true },
  { id: 'geo_family', name: 'Family Geo-Tag', description: 'Real-time location sharing with loved ones', icon: 'users', included: true },
  { id: 'priority', name: 'Priority Support', description: '24/7 dedicated emergency response line', icon: 'headphones', included: true },
  { id: 'history', name: 'Historical Data', description: 'Access 5 years of crime & incident data', icon: 'database', included: true },
  { id: 'reports', name: 'Custom Reports', description: 'Generate detailed area safety reports', icon: 'file-text', included: true },
  { id: 'api', name: 'API Access', description: 'Integrate with your own systems', icon: 'code', included: false },
];

// Additional emergency contacts
export const additionalEmergencyContacts = [
  { id: 'trauma', name: 'Trauma Counselling', number: '021 461 1111', description: 'Crisis support 24/7', icon: 'heart' },
  { id: 'childline', name: 'Childline SA', number: '0800 055 555', description: 'Child protection', icon: 'baby' },
  { id: 'poison', name: 'Poison Control', number: '0861 555 777', description: 'Poison information', icon: 'flask' },
  { id: 'sanparks', name: 'SANParks Emergency', number: '012 426 5000', description: 'National parks', icon: 'tree' },
  { id: 'spca', name: 'Cape Town SPCA', number: '021 700 4158', description: 'Animal rescue', icon: 'paw' },
  { id: 'traffic', name: 'Traffic Info', number: '021 480 7700', description: 'Road conditions', icon: 'car' },
  { id: 'disaster', name: 'Disaster Management', number: '0800 911 4357', description: 'Natural disasters', icon: 'alert-triangle' },
  { id: 'mental', name: 'Mental Health Line', number: '0800 567 567', description: 'Psychological support', icon: 'brain' },
];
