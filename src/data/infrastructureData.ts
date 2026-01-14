export interface LoadsheddingArea {
  id: string;
  area: string;
  postalCode: string;
  stage: number;
  nextOutage: string;
  duration: string;
  status: 'active' | 'scheduled' | 'clear';
}

export interface WaterOutage {
  id: string;
  area: string;
  postalCode: string;
  type: 'planned' | 'emergency' | 'none';
  status: string;
  estimatedRestore: string;
}

export interface RobotStatus {
  id: string;
  intersection: string;
  area: string;
  status: 'operational' | 'faulty' | 'offline';
  lastChecked: string;
}

export interface FlightInfo {
  id: string;
  flightNo: string;
  airline: string;
  destination: string;
  origin: string;
  time: string;
  status: 'on-time' | 'delayed' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  type: 'inbound' | 'outbound';
  gate?: string;
}

export interface TaxiRank {
  id: string;
  name: string;
  area: string;
  routes: string[];
  status: 'operational' | 'busy' | 'closed';
  waitTime: string;
}

export interface AreaInfo {
  name: string;
  postalCode: string;
  type: 'metro' | 'town' | 'coastal';
}

// Cape Town Metro Suburbs
export const capeMetroSuburbs: AreaInfo[] = [
  { name: 'City Bowl', postalCode: '8001', type: 'metro' },
  { name: 'Sea Point', postalCode: '8005', type: 'metro' },
  { name: 'Green Point', postalCode: '8051', type: 'metro' },
  { name: 'Camps Bay', postalCode: '8040', type: 'metro' },
  { name: 'Clifton', postalCode: '8005', type: 'metro' },
  { name: 'Woodstock', postalCode: '7925', type: 'metro' },
  { name: 'Observatory', postalCode: '7925', type: 'metro' },
  { name: 'Rondebosch', postalCode: '7700', type: 'metro' },
  { name: 'Claremont', postalCode: '7708', type: 'metro' },
  { name: 'Newlands', postalCode: '7700', type: 'metro' },
  { name: 'Constantia', postalCode: '7806', type: 'metro' },
  { name: 'Hout Bay', postalCode: '7806', type: 'metro' },
  { name: 'Muizenberg', postalCode: '7945', type: 'metro' },
  { name: 'Fish Hoek', postalCode: '7975', type: 'metro' },
  { name: 'Simon\'s Town', postalCode: '7995', type: 'metro' },
  { name: 'Khayelitsha', postalCode: '7784', type: 'metro' },
  { name: 'Mitchell\'s Plain', postalCode: '7785', type: 'metro' },
  { name: 'Athlone', postalCode: '7764', type: 'metro' },
  { name: 'Bellville', postalCode: '7530', type: 'metro' },
  { name: 'Parow', postalCode: '7500', type: 'metro' },
  { name: 'Goodwood', postalCode: '7460', type: 'metro' },
  { name: 'Milnerton', postalCode: '7441', type: 'metro' },
  { name: 'Table View', postalCode: '7441', type: 'metro' },
  { name: 'Bloubergstrand', postalCode: '7441', type: 'metro' },
  { name: 'Durbanville', postalCode: '7550', type: 'metro' },
  { name: 'Brackenfell', postalCode: '7560', type: 'metro' },
  { name: 'Kraaifontein', postalCode: '7570', type: 'metro' },
  { name: 'Kuils River', postalCode: '7580', type: 'metro' },
  { name: 'Somerset West', postalCode: '7130', type: 'metro' },
  { name: 'Strand', postalCode: '7140', type: 'metro' },
];

// Major Towns
export const majorTowns: AreaInfo[] = [
  { name: 'Stellenbosch', postalCode: '7600', type: 'town' },
  { name: 'Paarl', postalCode: '7646', type: 'town' },
  { name: 'George', postalCode: '6529', type: 'town' },
  { name: 'Hermanus', postalCode: '7200', type: 'town' },
  { name: 'Mossel Bay', postalCode: '6500', type: 'town' },
  { name: 'Worcester', postalCode: '6850', type: 'town' },
  { name: 'Franschhoek', postalCode: '7690', type: 'town' },
  { name: 'Wellington', postalCode: '7654', type: 'town' },
  { name: 'Malmesbury', postalCode: '7300', type: 'town' },
  { name: 'Ceres', postalCode: '6835', type: 'town' },
];

// West Coast & Garden Route
export const coastalCentres: AreaInfo[] = [
  { name: 'Saldanha', postalCode: '7395', type: 'coastal' },
  { name: 'Langebaan', postalCode: '7357', type: 'coastal' },
  { name: 'Yzerfontein', postalCode: '7351', type: 'coastal' },
  { name: 'Paternoster', postalCode: '7381', type: 'coastal' },
  { name: 'Knysna', postalCode: '6570', type: 'coastal' },
  { name: 'Plettenberg Bay', postalCode: '6600', type: 'coastal' },
  { name: 'Wilderness', postalCode: '6560', type: 'coastal' },
  { name: 'Sedgefield', postalCode: '6573', type: 'coastal' },
  { name: 'Stilbaai', postalCode: '6674', type: 'coastal' },
  { name: 'Gansbaai', postalCode: '7220', type: 'coastal' },
  { name: 'Arniston', postalCode: '7280', type: 'coastal' },
  { name: 'Struisbaai', postalCode: '7285', type: 'coastal' },
];

// Loadshedding Data
export const loadsheddingData: LoadsheddingArea[] = [
  { id: 'ls1', area: 'City Bowl', postalCode: '8001', stage: 4, nextOutage: '14:00 - 16:30', duration: '2.5h', status: 'scheduled' },
  { id: 'ls2', area: 'Sea Point', postalCode: '8005', stage: 4, nextOutage: '16:00 - 18:30', duration: '2.5h', status: 'scheduled' },
  { id: 'ls3', area: 'Bellville', postalCode: '7530', stage: 4, nextOutage: '12:00 - 14:30', duration: '2.5h', status: 'active' },
  { id: 'ls4', area: 'Constantia', postalCode: '7806', stage: 4, nextOutage: '18:00 - 20:30', duration: '2.5h', status: 'scheduled' },
  { id: 'ls5', area: 'Khayelitsha', postalCode: '7784', stage: 4, nextOutage: '10:00 - 12:30', duration: '2.5h', status: 'clear' },
  { id: 'ls6', area: 'Stellenbosch', postalCode: '7600', stage: 4, nextOutage: '20:00 - 22:30', duration: '2.5h', status: 'scheduled' },
];

// Water Outage Data
export const waterOutageData: WaterOutage[] = [
  { id: 'wo1', area: 'Camps Bay', postalCode: '8040', type: 'planned', status: 'Maintenance', estimatedRestore: '17:00' },
  { id: 'wo2', area: 'Woodstock', postalCode: '7925', type: 'emergency', status: 'Pipe Burst', estimatedRestore: '15:30' },
  { id: 'wo3', area: 'Rondebosch', postalCode: '7700', type: 'none', status: 'Normal', estimatedRestore: '-' },
  { id: 'wo4', area: 'Paarl', postalCode: '7646', type: 'planned', status: 'Reservoir Work', estimatedRestore: '19:00' },
  { id: 'wo5', area: 'George', postalCode: '6529', type: 'none', status: 'Normal', estimatedRestore: '-' },
];

// Traffic Robots Status
export const robotStatusData: RobotStatus[] = [
  { id: 'rs1', intersection: 'Adderley & Strand', area: 'CBD', status: 'operational', lastChecked: '2 min ago' },
  { id: 'rs2', intersection: 'Main & Voortrekker', area: 'Bellville', status: 'faulty', lastChecked: '5 min ago' },
  { id: 'rs3', intersection: 'Beach & High Level', area: 'Sea Point', status: 'operational', lastChecked: '1 min ago' },
  { id: 'rs4', intersection: 'N1/N7 Interchange', area: 'Century City', status: 'offline', lastChecked: '15 min ago' },
  { id: 'rs5', intersection: 'Victoria & Main', area: 'Claremont', status: 'operational', lastChecked: '3 min ago' },
  { id: 'rs6', intersection: 'R44 & R45', area: 'Stellenbosch', status: 'operational', lastChecked: '8 min ago' },
];

// Flight Data
export const flightData: FlightInfo[] = [
  { id: 'f1', flightNo: 'SA322', airline: 'SAA', destination: 'JNB', origin: 'CPT', time: '14:30', status: 'boarding', type: 'outbound', gate: 'A12' },
  { id: 'f2', flightNo: 'BA6421', airline: 'British Airways', destination: 'LHR', origin: 'CPT', time: '19:45', status: 'on-time', type: 'outbound', gate: 'B4' },
  { id: 'f3', flightNo: 'EK773', airline: 'Emirates', destination: 'DXB', origin: 'CPT', time: '21:00', status: 'on-time', type: 'outbound', gate: 'C1' },
  { id: 'f4', flightNo: 'KQ761', airline: 'Kenya Airways', destination: 'NBO', origin: 'CPT', time: '16:15', status: 'delayed', type: 'outbound', gate: 'A8' },
  { id: 'f5', flightNo: 'SA321', airline: 'SAA', origin: 'JNB', destination: 'CPT', time: '13:45', status: 'arrived', type: 'inbound' },
  { id: 'f6', flightNo: 'QR1370', airline: 'Qatar Airways', origin: 'DOH', destination: 'CPT', time: '17:30', status: 'on-time', type: 'inbound' },
  { id: 'f7', flightNo: 'LH574', airline: 'Lufthansa', origin: 'FRA', destination: 'CPT', time: '06:20', status: 'arrived', type: 'inbound' },
  { id: 'f8', flightNo: 'KL598', airline: 'KLM', origin: 'AMS', destination: 'CPT', time: '18:45', status: 'on-time', type: 'inbound' },
];

// Taxi Rank Data
export const taxiRankData: TaxiRank[] = [
  { id: 'tr1', name: 'Cape Town Station', area: 'CBD', routes: ['Khayelitsha', 'Mitchell\'s Plain', 'Nyanga', 'Gugulethu'], status: 'operational', waitTime: '5-10 min' },
  { id: 'tr2', name: 'Bellville Taxi Rank', area: 'Bellville', routes: ['Paarl', 'Stellenbosch', 'Kraaifontein', 'Durbanville'], status: 'busy', waitTime: '15-20 min' },
  { id: 'tr3', name: 'Wynberg Rank', area: 'Wynberg', routes: ['Fish Hoek', 'Simon\'s Town', 'Retreat', 'Muizenberg'], status: 'operational', waitTime: '10-15 min' },
  { id: 'tr4', name: 'Claremont Rank', area: 'Claremont', routes: ['Constantia', 'Tokai', 'Rondebosch', 'Newlands'], status: 'operational', waitTime: '5-8 min' },
  { id: 'tr5', name: 'Mitchell\'s Plain Rank', area: 'Mitchell\'s Plain', routes: ['CBD', 'Khayelitsha', 'Philippi', 'Nyanga'], status: 'busy', waitTime: '20-25 min' },
  { id: 'tr6', name: 'Site C Rank', area: 'Khayelitsha', routes: ['CBD', 'Bellville', 'Mitchell\'s Plain', 'Nyanga'], status: 'operational', waitTime: '8-12 min' },
];
