export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  icon: 'phone' | 'flame' | 'hospital' | 'shield' | 'ambulance' | 'lifeBuoy' | 'car' | 'zap';
  category: 'primary' | 'secondary';
}

export const emergencyContacts: EmergencyContact[] = [
  // Primary emergency
  {
    id: 'police',
    name: 'SAPS Emergency',
    number: '10111',
    description: 'Police Emergency Line',
    icon: 'shield',
    category: 'primary'
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    number: '10177',
    description: 'Medical Emergency',
    icon: 'ambulance',
    category: 'primary'
  },
  {
    id: 'fire',
    name: 'Fire Department',
    number: '021 480 7700',
    description: 'Cape Town Fire & Rescue',
    icon: 'flame',
    category: 'primary'
  },
  {
    id: 'rescue',
    name: 'NSRI Sea Rescue',
    number: '021 449 3500',
    description: 'National Sea Rescue',
    icon: 'lifeBuoy',
    category: 'primary'
  },
  // Secondary
  {
    id: 'metro',
    name: 'Metro Police',
    number: '021 596 1999',
    description: 'City Traffic & Safety',
    icon: 'car',
    category: 'secondary'
  },
  {
    id: 'eskom',
    name: 'Eskom Emergency',
    number: '0860 037 566',
    description: 'Power Outages',
    icon: 'zap',
    category: 'secondary'
  },
  {
    id: 'groote',
    name: 'Groote Schuur Hospital',
    number: '021 404 9111',
    description: '24hr Emergency',
    icon: 'hospital',
    category: 'secondary'
  },
  {
    id: 'tygerberg',
    name: 'Tygerberg Hospital',
    number: '021 938 4911',
    description: '24hr Emergency',
    icon: 'hospital',
    category: 'secondary'
  }
];

export interface AreaData {
  id: string;
  name: string;
  safetyScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  policeStation: string;
  policeNumber: string;
  nearestHospital: string;
  hospitalNumber: string;
  incidents24h: number;
  camerasCoverage: number;
}

export const areasData: AreaData[] = [
  {
    id: 'cbd',
    name: 'Cape Town CBD',
    safetyScore: 72,
    riskLevel: 'moderate',
    policeStation: 'Cape Town Central SAPS',
    policeNumber: '021 467 8000',
    nearestHospital: 'Groote Schuur Hospital',
    hospitalNumber: '021 404 9111',
    incidents24h: 8,
    camerasCoverage: 85
  },
  {
    id: 'seapoint',
    name: 'Sea Point',
    safetyScore: 88,
    riskLevel: 'low',
    policeStation: 'Sea Point SAPS',
    policeNumber: '021 430 3800',
    nearestHospital: 'Netcare Christiaan Barnard',
    hospitalNumber: '021 441 0000',
    incidents24h: 2,
    camerasCoverage: 92
  },
  {
    id: 'campsbay',
    name: 'Camps Bay',
    safetyScore: 91,
    riskLevel: 'low',
    policeStation: 'Camps Bay SAPS',
    policeNumber: '021 438 3640',
    nearestHospital: 'Netcare Christiaan Barnard',
    hospitalNumber: '021 441 0000',
    incidents24h: 1,
    camerasCoverage: 89
  },
  {
    id: 'woodstock',
    name: 'Woodstock',
    safetyScore: 65,
    riskLevel: 'moderate',
    policeStation: 'Woodstock SAPS',
    policeNumber: '021 442 3400',
    nearestHospital: 'Groote Schuur Hospital',
    hospitalNumber: '021 404 9111',
    incidents24h: 6,
    camerasCoverage: 68
  },
  {
    id: 'nyanga',
    name: 'Nyanga',
    safetyScore: 22,
    riskLevel: 'critical',
    policeStation: 'Nyanga SAPS',
    policeNumber: '021 380 3270',
    nearestHospital: 'Gugulethu CHC',
    hospitalNumber: '021 637 0290',
    incidents24h: 28,
    camerasCoverage: 35
  },
  {
    id: 'khayelitsha',
    name: 'Khayelitsha',
    safetyScore: 25,
    riskLevel: 'critical',
    policeStation: 'Khayelitsha SAPS',
    policeNumber: '021 364 1020',
    nearestHospital: 'Khayelitsha District Hospital',
    hospitalNumber: '021 360 4700',
    incidents24h: 32,
    camerasCoverage: 28
  },
  {
    id: 'mitchellsplain',
    name: 'Mitchells Plain',
    safetyScore: 38,
    riskLevel: 'high',
    policeStation: 'Mitchells Plain SAPS',
    policeNumber: '021 370 1600',
    nearestHospital: 'Mitchells Plain Hospital',
    hospitalNumber: '021 377 4444',
    incidents24h: 18,
    camerasCoverage: 42
  },
  {
    id: 'bellville',
    name: 'Bellville',
    safetyScore: 74,
    riskLevel: 'moderate',
    policeStation: 'Bellville SAPS',
    policeNumber: '021 918 3000',
    nearestHospital: 'Tygerberg Hospital',
    hospitalNumber: '021 938 4911',
    incidents24h: 5,
    camerasCoverage: 78
  },
  {
    id: 'stellenbosch',
    name: 'Stellenbosch',
    safetyScore: 85,
    riskLevel: 'low',
    policeStation: 'Stellenbosch SAPS',
    policeNumber: '021 809 5000',
    nearestHospital: 'Stellenbosch Hospital',
    hospitalNumber: '021 808 6100',
    incidents24h: 2,
    camerasCoverage: 81
  },
  {
    id: 'muizenberg',
    name: 'Muizenberg',
    safetyScore: 76,
    riskLevel: 'moderate',
    policeStation: 'Muizenberg SAPS',
    policeNumber: '021 787 9000',
    nearestHospital: 'False Bay Hospital',
    hospitalNumber: '021 782 1121',
    incidents24h: 4,
    camerasCoverage: 72
  },
  {
    id: 'philippi',
    name: 'Philippi',
    safetyScore: 28,
    riskLevel: 'critical',
    policeStation: 'Philippi East SAPS',
    policeNumber: '021 370 1014',
    nearestHospital: 'Mitchells Plain Hospital',
    hospitalNumber: '021 377 4444',
    incidents24h: 24,
    camerasCoverage: 32
  },
  {
    id: 'delft',
    name: 'Delft',
    safetyScore: 32,
    riskLevel: 'high',
    policeStation: 'Delft SAPS',
    policeNumber: '021 954 2750',
    nearestHospital: 'Delft CHC',
    hospitalNumber: '021 954 2760',
    incidents24h: 15,
    camerasCoverage: 38
  }
];
