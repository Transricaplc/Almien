/**
 * Cape Town Area Safety Data — Mock data for freemium MVP.
 * Prepared for future API integration.
 */

export interface AreaSafetyData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  safetyScore: number;
  safetyLevel: 'green' | 'yellow' | 'orange' | 'red';
  incidentCount: {
    last7Days: number;
    last30Days: number;
    last12Months: number;
  };
  timeBasedSafety: {
    morning: { score: number; color: 'green' | 'yellow' | 'orange' | 'red' };
    day: { score: number; color: 'green' | 'yellow' | 'orange' | 'red' };
    evening: { score: number; color: 'green' | 'yellow' | 'orange' | 'red' };
    night: { score: number; color: 'green' | 'yellow' | 'orange' | 'red' };
  };
  recommendedActivities: {
    name: string;
    safetyScore: number;
    bestTime: string;
    category: ActivityCategory;
  }[];
  nearbyFacilities: {
    type: 'hospital' | 'police' | 'fire_station';
    name: string;
    distance: string;
  }[];
  safetyTips: string[];
  thumbnail?: string;
}

export type ActivityCategory = 'dining' | 'hiking' | 'beaches' | 'shopping' | 'culture' | 'nightlife';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export const safetyLevelColors = {
  green: '#10B981',
  yellow: '#F59E0B',
  orange: '#F97316',
  red: '#EF4444',
} as const;

export const safetyLevelLabels = {
  green: 'Safe',
  yellow: 'Moderate',
  orange: 'Elevated',
  red: 'High Risk',
} as const;

function scoreToLevel(score: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (score >= 7.5) return 'green';
  if (score >= 5.5) return 'yellow';
  if (score >= 3.5) return 'orange';
  return 'red';
}

export const capeTownAreas: AreaSafetyData[] = [
  {
    id: 'camps-bay',
    name: 'Camps Bay',
    coordinates: { lat: -33.9489, lng: 18.3774 },
    safetyScore: 8.5,
    safetyLevel: 'green',
    incidentCount: { last7Days: 2, last30Days: 9, last12Months: 45 },
    timeBasedSafety: {
      morning: { score: 9.2, color: 'green' },
      day: { score: 8.9, color: 'green' },
      evening: { score: 7.5, color: 'green' },
      night: { score: 6.8, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Beach Walk', safetyScore: 9.0, bestTime: 'Morning', category: 'beaches' },
      { name: 'Sunset Dining', safetyScore: 8.5, bestTime: 'Evening', category: 'dining' },
      { name: 'Boutique Shopping', safetyScore: 8.7, bestTime: 'Day', category: 'shopping' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Camps Bay Clinic', distance: '1.2km' },
      { type: 'police', name: 'Camps Bay SAPS', distance: '800m' },
    ],
    safetyTips: [
      'Avoid isolated beach areas after dark',
      'Keep valuables out of sight in parked cars',
      'Use well-lit parking areas',
      'Swim between the flags during daylight hours',
    ],
  },
  {
    id: 'waterfront',
    name: 'V&A Waterfront',
    coordinates: { lat: -33.9036, lng: 18.4209 },
    safetyScore: 9.1,
    safetyLevel: 'green',
    incidentCount: { last7Days: 1, last30Days: 5, last12Months: 28 },
    timeBasedSafety: {
      morning: { score: 9.5, color: 'green' },
      day: { score: 9.3, color: 'green' },
      evening: { score: 8.8, color: 'green' },
      night: { score: 8.2, color: 'green' },
    },
    recommendedActivities: [
      { name: 'Harbour Dining', safetyScore: 9.2, bestTime: 'Evening', category: 'dining' },
      { name: 'Shopping Centre', safetyScore: 9.5, bestTime: 'Day', category: 'shopping' },
      { name: 'Two Oceans Aquarium', safetyScore: 9.4, bestTime: 'Morning', category: 'culture' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Netcare Christiaan Barnard', distance: '2.1km' },
      { type: 'police', name: 'Waterfront Security', distance: '200m' },
    ],
    safetyTips: [
      'Private security patrols area 24/7',
      'Well-lit with extensive CCTV coverage',
      'Use designated parking areas',
    ],
  },
  {
    id: 'city-centre',
    name: 'City Centre (CBD)',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    safetyScore: 5.8,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 6, last30Days: 24, last12Months: 180 },
    timeBasedSafety: {
      morning: { score: 7.2, color: 'yellow' },
      day: { score: 6.5, color: 'yellow' },
      evening: { score: 4.8, color: 'orange' },
      night: { score: 3.2, color: 'red' },
    },
    recommendedActivities: [
      { name: 'Company Garden Walk', safetyScore: 7.5, bestTime: 'Morning', category: 'culture' },
      { name: 'Long Street Dining', safetyScore: 6.8, bestTime: 'Day', category: 'dining' },
      { name: 'Art Gallery Tours', safetyScore: 8.0, bestTime: 'Day', category: 'culture' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Groote Schuur Hospital', distance: '4.5km' },
      { type: 'police', name: 'Cape Town Central SAPS', distance: '500m' },
      { type: 'fire_station', name: 'CBD Fire Station', distance: '1.1km' },
    ],
    safetyTips: [
      'Avoid walking alone at night in quiet streets',
      'Watch for pickpockets around stations',
      'Use ride-hailing services after dark',
      'Stay on main roads with foot traffic',
    ],
  },
  {
    id: 'table-mountain',
    name: 'Table Mountain',
    coordinates: { lat: -33.9625, lng: 18.4034 },
    safetyScore: 8.2,
    safetyLevel: 'green',
    incidentCount: { last7Days: 1, last30Days: 4, last12Months: 22 },
    timeBasedSafety: {
      morning: { score: 9.0, color: 'green' },
      day: { score: 8.5, color: 'green' },
      evening: { score: 6.5, color: 'yellow' },
      night: { score: 4.0, color: 'orange' },
    },
    recommendedActivities: [
      { name: 'Platteklip Gorge Hike', safetyScore: 8.0, bestTime: 'Morning', category: 'hiking' },
      { name: 'Cable Car Ride', safetyScore: 9.5, bestTime: 'Day', category: 'culture' },
      { name: 'Sunset Views', safetyScore: 7.5, bestTime: 'Evening', category: 'hiking' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Table Mountain Emergency', distance: '3.2km' },
      { type: 'police', name: 'SANParks Rangers', distance: 'On-site' },
    ],
    safetyTips: [
      'Start hikes before 10am to finish in daylight',
      'Carry sufficient water and tell someone your route',
      'Avoid hiking alone on remote trails',
      'Check weather conditions before ascending',
    ],
  },
  {
    id: 'sea-point',
    name: 'Sea Point',
    coordinates: { lat: -33.9173, lng: 18.3894 },
    safetyScore: 7.6,
    safetyLevel: 'green',
    incidentCount: { last7Days: 3, last30Days: 12, last12Months: 78 },
    timeBasedSafety: {
      morning: { score: 8.8, color: 'green' },
      day: { score: 8.2, color: 'green' },
      evening: { score: 7.0, color: 'yellow' },
      night: { score: 5.5, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Promenade Walk', safetyScore: 8.5, bestTime: 'Morning', category: 'beaches' },
      { name: 'Restaurant Strip', safetyScore: 8.0, bestTime: 'Evening', category: 'dining' },
      { name: 'Sea Point Pool', safetyScore: 9.0, bestTime: 'Day', category: 'beaches' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Sea Point Clinic', distance: '600m' },
      { type: 'police', name: 'Sea Point SAPS', distance: '1.1km' },
    ],
    safetyTips: [
      'Promenade is well-patrolled during daytime',
      'Secure belongings at the public pool',
      'Use registered parking attendants',
    ],
  },
  {
    id: 'constantia',
    name: 'Constantia',
    coordinates: { lat: -34.0273, lng: 18.4309 },
    safetyScore: 8.0,
    safetyLevel: 'green',
    incidentCount: { last7Days: 2, last30Days: 8, last12Months: 52 },
    timeBasedSafety: {
      morning: { score: 8.8, color: 'green' },
      day: { score: 8.5, color: 'green' },
      evening: { score: 7.2, color: 'yellow' },
      night: { score: 6.5, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Wine Tasting', safetyScore: 9.0, bestTime: 'Day', category: 'dining' },
      { name: 'Kirstenbosch Gardens', safetyScore: 9.2, bestTime: 'Morning', category: 'culture' },
      { name: 'Forest Walks', safetyScore: 7.8, bestTime: 'Morning', category: 'hiking' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Constantiaberg Mediclinic', distance: '1.8km' },
      { type: 'police', name: 'Wynberg SAPS', distance: '3.2km' },
    ],
    safetyTips: [
      'Estate areas are privately secured',
      'Lock vehicle doors when driving through',
      'Residential area with neighbourhood watch',
    ],
  },
  {
    id: 'muizenberg',
    name: 'Muizenberg',
    coordinates: { lat: -34.1089, lng: 18.4711 },
    safetyScore: 6.8,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 4, last30Days: 16, last12Months: 95 },
    timeBasedSafety: {
      morning: { score: 8.0, color: 'green' },
      day: { score: 7.5, color: 'green' },
      evening: { score: 5.5, color: 'yellow' },
      night: { score: 4.5, color: 'orange' },
    },
    recommendedActivities: [
      { name: 'Surfing Lessons', safetyScore: 8.5, bestTime: 'Morning', category: 'beaches' },
      { name: 'Beach Colourful Huts', safetyScore: 8.0, bestTime: 'Day', category: 'culture' },
      { name: 'Local Cafes', safetyScore: 7.2, bestTime: 'Day', category: 'dining' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'False Bay Hospital', distance: '2.5km' },
      { type: 'police', name: 'Muizenberg SAPS', distance: '900m' },
    ],
    safetyTips: [
      'Car break-ins reported in parking areas',
      'Surf during daylight with groups',
      'Avoid walking far from main beach at night',
    ],
  },
  {
    id: 'woodstock',
    name: 'Woodstock',
    coordinates: { lat: -33.9272, lng: 18.4459 },
    safetyScore: 5.2,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 7, last30Days: 28, last12Months: 210 },
    timeBasedSafety: {
      morning: { score: 6.8, color: 'yellow' },
      day: { score: 6.2, color: 'yellow' },
      evening: { score: 4.5, color: 'orange' },
      night: { score: 3.0, color: 'red' },
    },
    recommendedActivities: [
      { name: 'Old Biscuit Mill Market', safetyScore: 8.0, bestTime: 'Morning', category: 'shopping' },
      { name: 'Street Art Tour', safetyScore: 6.5, bestTime: 'Day', category: 'culture' },
      { name: 'Craft Breweries', safetyScore: 7.0, bestTime: 'Day', category: 'dining' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Groote Schuur Hospital', distance: '3.8km' },
      { type: 'police', name: 'Woodstock SAPS', distance: '700m' },
    ],
    safetyTips: [
      'Stay in gentrified areas during visits',
      'Visit markets and breweries during daytime',
      'Use ride-hailing for evening outings',
      'Be aware of surroundings near side streets',
    ],
  },
  {
    id: 'observatory',
    name: 'Observatory',
    coordinates: { lat: -33.9381, lng: 18.4731 },
    safetyScore: 5.5,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 5, last30Days: 20, last12Months: 155 },
    timeBasedSafety: {
      morning: { score: 7.0, color: 'yellow' },
      day: { score: 6.5, color: 'yellow' },
      evening: { score: 5.0, color: 'yellow' },
      night: { score: 3.5, color: 'red' },
    },
    recommendedActivities: [
      { name: 'Lower Main Road Cafes', safetyScore: 7.0, bestTime: 'Day', category: 'dining' },
      { name: 'Observatory Park', safetyScore: 7.5, bestTime: 'Morning', category: 'culture' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Vincent Pallotti Hospital', distance: '2.2km' },
      { type: 'police', name: 'Observatory SAPS', distance: '1.0km' },
    ],
    safetyTips: [
      'Student area with mixed safety levels',
      'Stick to Lower Main Road for dining',
      'Avoid walking alone after dark',
    ],
  },
  {
    id: 'hout-bay',
    name: 'Hout Bay',
    coordinates: { lat: -34.0480, lng: 18.3533 },
    safetyScore: 7.0,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 3, last30Days: 14, last12Months: 85 },
    timeBasedSafety: {
      morning: { score: 8.2, color: 'green' },
      day: { score: 7.8, color: 'green' },
      evening: { score: 6.0, color: 'yellow' },
      night: { score: 5.0, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Harbour Fish Market', safetyScore: 8.0, bestTime: 'Day', category: 'dining' },
      { name: 'Chapman\'s Peak Drive', safetyScore: 8.5, bestTime: 'Day', category: 'culture' },
      { name: 'Seal Snorkeling', safetyScore: 8.2, bestTime: 'Morning', category: 'beaches' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Hout Bay Medical Centre', distance: '1.5km' },
      { type: 'police', name: 'Hout Bay SAPS', distance: '1.2km' },
    ],
    safetyTips: [
      'Scenic but isolated roads — drive carefully',
      'Harbour area is busy and generally safe daytime',
      'Lock vehicles and don\'t leave valuables visible',
    ],
  },
  {
    id: 'stellenbosch',
    name: 'Stellenbosch',
    coordinates: { lat: -33.9321, lng: 18.8602 },
    safetyScore: 7.8,
    safetyLevel: 'green',
    incidentCount: { last7Days: 2, last30Days: 10, last12Months: 60 },
    timeBasedSafety: {
      morning: { score: 8.5, color: 'green' },
      day: { score: 8.2, color: 'green' },
      evening: { score: 7.0, color: 'yellow' },
      night: { score: 5.8, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Wine Route Tour', safetyScore: 9.0, bestTime: 'Day', category: 'dining' },
      { name: 'Historic Dorp Street', safetyScore: 8.5, bestTime: 'Day', category: 'culture' },
      { name: 'Jonkershoek Nature Reserve', safetyScore: 8.0, bestTime: 'Morning', category: 'hiking' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Stellenbosch Hospital', distance: '2.0km' },
      { type: 'police', name: 'Stellenbosch SAPS', distance: '1.5km' },
    ],
    safetyTips: [
      'University town with good foot traffic during the day',
      'Wine estates have private security',
      'Don\'t drink and drive between wine farms',
    ],
  },
  {
    id: 'khayelitsha',
    name: 'Khayelitsha',
    coordinates: { lat: -34.0388, lng: 18.6780 },
    safetyScore: 2.8,
    safetyLevel: 'red',
    incidentCount: { last7Days: 22, last30Days: 85, last12Months: 650 },
    timeBasedSafety: {
      morning: { score: 4.0, color: 'orange' },
      day: { score: 3.5, color: 'red' },
      evening: { score: 2.0, color: 'red' },
      night: { score: 1.5, color: 'red' },
    },
    recommendedActivities: [
      { name: 'Township Tour (Guided)', safetyScore: 6.5, bestTime: 'Morning', category: 'culture' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Khayelitsha Hospital', distance: '2.8km' },
      { type: 'police', name: 'Khayelitsha SAPS', distance: '1.5km' },
    ],
    safetyTips: [
      'Only visit with a registered guide',
      'Do not carry expensive items or cameras openly',
      'Avoid visiting after dark',
      'Use guided township tour operators only',
    ],
  },
  {
    id: 'green-point',
    name: 'Green Point',
    coordinates: { lat: -33.9065, lng: 18.4031 },
    safetyScore: 8.3,
    safetyLevel: 'green',
    incidentCount: { last7Days: 1, last30Days: 6, last12Months: 35 },
    timeBasedSafety: {
      morning: { score: 9.0, color: 'green' },
      day: { score: 8.8, color: 'green' },
      evening: { score: 7.5, color: 'green' },
      night: { score: 6.5, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Green Point Park', safetyScore: 9.2, bestTime: 'Morning', category: 'culture' },
      { name: 'Stadium Area Walk', safetyScore: 8.5, bestTime: 'Day', category: 'culture' },
      { name: 'Mouille Point Dining', safetyScore: 8.8, bestTime: 'Evening', category: 'dining' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Cape Medical Depot', distance: '1.0km' },
      { type: 'police', name: 'Green Point SAPS', distance: '800m' },
    ],
    safetyTips: [
      'Well-maintained urban park with security',
      'Popular running and cycling area',
      'Good CCTV coverage throughout',
    ],
  },
  {
    id: 'simon-s-town',
    name: "Simon's Town",
    coordinates: { lat: -34.1884, lng: 18.4327 },
    safetyScore: 8.0,
    safetyLevel: 'green',
    incidentCount: { last7Days: 1, last30Days: 5, last12Months: 30 },
    timeBasedSafety: {
      morning: { score: 8.8, color: 'green' },
      day: { score: 8.5, color: 'green' },
      evening: { score: 7.2, color: 'yellow' },
      night: { score: 6.0, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Boulders Beach Penguins', safetyScore: 9.5, bestTime: 'Morning', category: 'beaches' },
      { name: 'Naval Museum', safetyScore: 9.0, bestTime: 'Day', category: 'culture' },
      { name: 'Harbour Seafood', safetyScore: 8.5, bestTime: 'Day', category: 'dining' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: "Simon's Town Medical", distance: '1.0km' },
      { type: 'police', name: "Simon's Town SAPS", distance: '600m' },
    ],
    safetyTips: [
      'Naval town with good security presence',
      'Watch out for baboons near the mountain',
      'Boulders Beach has controlled access',
    ],
  },
  {
    id: 'newlands',
    name: 'Newlands',
    coordinates: { lat: -33.9793, lng: 18.4597 },
    safetyScore: 7.5,
    safetyLevel: 'green',
    incidentCount: { last7Days: 2, last30Days: 10, last12Months: 65 },
    timeBasedSafety: {
      morning: { score: 8.5, color: 'green' },
      day: { score: 8.0, color: 'green' },
      evening: { score: 6.8, color: 'yellow' },
      night: { score: 5.5, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Newlands Forest Walk', safetyScore: 7.5, bestTime: 'Morning', category: 'hiking' },
      { name: 'Brewery Tour', safetyScore: 8.5, bestTime: 'Day', category: 'dining' },
      { name: 'Rugby at Newlands', safetyScore: 8.0, bestTime: 'Day', category: 'culture' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Kingsbury Hospital', distance: '1.5km' },
      { type: 'police', name: 'Claremont SAPS', distance: '2.0km' },
    ],
    safetyTips: [
      'Forest trails best visited in groups',
      'Residential area with community patrols',
      'Lock vehicle doors when visiting',
    ],
  },
  {
    id: 'mitchells-plain',
    name: "Mitchell's Plain",
    coordinates: { lat: -34.0499, lng: 18.6177 },
    safetyScore: 3.2,
    safetyLevel: 'red',
    incidentCount: { last7Days: 18, last30Days: 72, last12Months: 520 },
    timeBasedSafety: {
      morning: { score: 4.5, color: 'orange' },
      day: { score: 4.0, color: 'orange' },
      evening: { score: 2.5, color: 'red' },
      night: { score: 1.8, color: 'red' },
    },
    recommendedActivities: [],
    nearbyFacilities: [
      { type: 'hospital', name: "Mitchell's Plain Hospital", distance: '2.5km' },
      { type: 'police', name: "Mitchell's Plain SAPS", distance: '1.8km' },
    ],
    safetyTips: [
      'Avoid unless with a knowledgeable local guide',
      'Do not carry visible valuables',
      'Strictly avoid after dark',
    ],
  },
  {
    id: 'claremont',
    name: 'Claremont',
    coordinates: { lat: -33.9830, lng: 18.4632 },
    safetyScore: 7.2,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 4, last30Days: 15, last12Months: 92 },
    timeBasedSafety: {
      morning: { score: 8.0, color: 'green' },
      day: { score: 7.5, color: 'green' },
      evening: { score: 6.5, color: 'yellow' },
      night: { score: 5.0, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Cavendish Square Shopping', safetyScore: 8.5, bestTime: 'Day', category: 'shopping' },
      { name: 'Café Culture', safetyScore: 7.8, bestTime: 'Day', category: 'dining' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Kingsbury Hospital', distance: '1.2km' },
      { type: 'police', name: 'Claremont SAPS', distance: '800m' },
    ],
    safetyTips: [
      'Major shopping hub with good security',
      'Watch for smash-and-grab at traffic lights',
      'Use mall parking over street parking',
    ],
  },
  {
    id: 'bloubergstrand',
    name: 'Bloubergstrand',
    coordinates: { lat: -33.8100, lng: 18.4500 },
    safetyScore: 7.8,
    safetyLevel: 'green',
    incidentCount: { last7Days: 2, last30Days: 9, last12Months: 55 },
    timeBasedSafety: {
      morning: { score: 8.5, color: 'green' },
      day: { score: 8.2, color: 'green' },
      evening: { score: 7.0, color: 'yellow' },
      night: { score: 6.0, color: 'yellow' },
    },
    recommendedActivities: [
      { name: 'Kitesurfing', safetyScore: 8.0, bestTime: 'Day', category: 'beaches' },
      { name: 'Table Mountain View', safetyScore: 9.0, bestTime: 'Evening', category: 'culture' },
      { name: 'Beachfront Dining', safetyScore: 8.2, bestTime: 'Evening', category: 'dining' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Blaauwberg Hospital', distance: '3.0km' },
      { type: 'police', name: 'Table View SAPS', distance: '2.5km' },
    ],
    safetyTips: [
      'Popular for water sports — generally safe during day',
      'Beach can be windy — secure belongings',
      'Residential area with community watches',
    ],
  },
  {
    id: 'bo-kaap',
    name: 'Bo-Kaap',
    coordinates: { lat: -33.9207, lng: 18.4139 },
    safetyScore: 6.5,
    safetyLevel: 'yellow',
    incidentCount: { last7Days: 3, last30Days: 13, last12Months: 80 },
    timeBasedSafety: {
      morning: { score: 7.8, color: 'green' },
      day: { score: 7.2, color: 'yellow' },
      evening: { score: 5.5, color: 'yellow' },
      night: { score: 4.0, color: 'orange' },
    },
    recommendedActivities: [
      { name: 'Colourful Houses Photo Walk', safetyScore: 7.5, bestTime: 'Morning', category: 'culture' },
      { name: 'Cape Malay Cooking Class', safetyScore: 8.0, bestTime: 'Day', category: 'dining' },
      { name: 'Spice Shopping', safetyScore: 7.0, bestTime: 'Day', category: 'shopping' },
    ],
    nearbyFacilities: [
      { type: 'hospital', name: 'Groote Schuur Hospital', distance: '5.0km' },
      { type: 'police', name: 'Cape Town Central SAPS', distance: '1.0km' },
    ],
    safetyTips: [
      'Popular tourist area — visit during daylight',
      'Be respectful of residents and homes',
      'Watch for pickpockets on busy photo spots',
      'Use guided walking tours for best experience',
    ],
  },
];

// Utility to filter areas by category
export function getAreasByCategory(category: ActivityCategory): AreaSafetyData[] {
  return capeTownAreas.filter(area =>
    area.recommendedActivities.some(a => a.category === category)
  ).sort((a, b) => b.safetyScore - a.safetyScore);
}

// Utility to get top safe areas
export function getTopSafeAreas(limit = 5): AreaSafetyData[] {
  return [...capeTownAreas].sort((a, b) => b.safetyScore - a.safetyScore).slice(0, limit);
}

// Search areas
export function searchAreas(query: string): AreaSafetyData[] {
  const lower = query.toLowerCase();
  return capeTownAreas.filter(area =>
    area.name.toLowerCase().includes(lower) ||
    area.recommendedActivities.some(a => a.name.toLowerCase().includes(lower))
  );
}
