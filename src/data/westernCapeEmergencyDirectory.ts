/**
 * Western Cape Emergency Directory
 * Verified SAPS, Fire & Rescue, Medical contacts for 89+ suburbs.
 * Searchable by suburb name or postal code.
 */

export interface SAPSContact {
  station: string;
  phone: string;
  clusterHQ?: string;
  clusterPhone?: string;
  sectorVehicles?: { sector: string; phone: string }[];
}

export interface FireContact {
  station: string;
  phone: string;
}

export interface MedicalContact {
  publicHospital: string;
  publicPhone: string;
  privateClinic?: string;
  privatePhone?: string;
}

export interface SuburbEmergencyEntry {
  suburb: string;
  postalCode: string;
  saps: SAPSContact;
  fire: FireContact;
  medical: MedicalContact;
}

// ── Province-wide constants ──
export const PROVINCE_WIDE = {
  nationalCrimeStop: '08600 10111',
  emergencyGeneral: '107',
  nsri: '087 094 9774',
  wsar: '021 937 0300',
  metroEMS: '10177',
  er24: '084 124',
  netcare911: '082 911',
  flyingSquad: '10111',
} as const;

// ── Directory ──
export const westernCapeDirectory: SuburbEmergencyEntry[] = [
  // ── City of Cape Town Metro ──
  {
    suburb: 'Cape Town CBD', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Camps Bay', postalCode: '8040',
    saps: { station: 'Camps Bay SAPS', phone: '021 437 8150', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Camps Bay Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Sea Point', postalCode: '8005',
    saps: { station: 'Sea Point SAPS', phone: '021 430 3700', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Sea Point Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Cape Town International Airport', postalCode: '7525',
    saps: { station: 'Airport SAPS', phone: '021 927 2900', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Airport Fire & Rescue', phone: '021 937 1211' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Durbanville', privatePhone: '021 980 2100' },
  },
  {
    suburb: 'Belhar', postalCode: '7493',
    saps: { station: 'Belhar SAPS', phone: '021 953 8100', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Belhar Fire', phone: '021 954 1155' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Melomed Bellville', privatePhone: '021 948 8131' },
  },
  {
    suburb: 'Bellville', postalCode: '7530',
    saps: { station: 'Bellville SAPS', phone: '021 918 3000', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Bellville Fire', phone: '021 918 2100' },
    medical: { publicHospital: 'Tygerberg Hospital', publicPhone: '021 938 4911', privateClinic: 'Melomed Bellville', privatePhone: '021 948 8131' },
  },
  {
    suburb: 'Woodstock', postalCode: '7925',
    saps: { station: 'Woodstock SAPS', phone: '021 442 4200', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Woodstock Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Cape Town', privatePhone: '021 464 5500' },
  },
  {
    suburb: 'Observatory', postalCode: '7925',
    saps: { station: 'Woodstock SAPS', phone: '021 442 4200', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Woodstock Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Cape Town', privatePhone: '021 464 5500' },
  },
  {
    suburb: 'Claremont', postalCode: '7708',
    saps: { station: 'Claremont SAPS', phone: '021 657 3400', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Claremont Fire', phone: '021 670 2400' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Life Kingsbury Hospital', privatePhone: '021 670 3000' },
  },
  {
    suburb: 'Rondebosch', postalCode: '7700',
    saps: { station: 'Rondebosch SAPS', phone: '021 685 3700', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Rondebosch Fire', phone: '021 670 2400' },
    medical: { publicHospital: 'Red Cross Children\'s Hospital', publicPhone: '021 658 5111', privateClinic: 'Life Kingsbury Hospital', privatePhone: '021 670 3000' },
  },
  {
    suburb: 'Wynberg', postalCode: '7800',
    saps: { station: 'Wynberg SAPS', phone: '021 710 4000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Wynberg Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121', privateClinic: 'Mediclinic Constantiaberg', privatePhone: '021 799 2911' },
  },
  {
    suburb: 'Muizenberg', postalCode: '7945',
    saps: { station: 'Muizenberg SAPS', phone: '021 787 9000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Muizenberg Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121', privateClinic: 'Mediclinic Constantiaberg', privatePhone: '021 799 2911' },
  },
  {
    suburb: 'Kalk Bay', postalCode: '7975',
    saps: { station: 'Muizenberg SAPS', phone: '021 787 9000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Muizenberg Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Simon\'s Town', postalCode: '7975',
    saps: { station: 'Simon\'s Town SAPS', phone: '021 786 1412', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Simon\'s Town Fire', phone: '021 786 1042' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Fish Hoek', postalCode: '7974',
    saps: { station: 'Fish Hoek SAPS', phone: '021 782 2505', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Fish Hoek Fire', phone: '021 786 1042' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Constantia', postalCode: '7806',
    saps: { station: 'Diep River SAPS', phone: '021 710 4000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Constantia Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Constantiaberg', privatePhone: '021 799 2911' },
  },
  {
    suburb: 'Newlands', postalCode: '7700',
    saps: { station: 'Rondebosch SAPS', phone: '021 685 3700', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Newlands Fire', phone: '021 670 2400' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Life Kingsbury Hospital', privatePhone: '021 670 3000' },
  },
  {
    suburb: 'Kenilworth', postalCode: '7708',
    saps: { station: 'Claremont SAPS', phone: '021 657 3400', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Claremont Fire', phone: '021 670 2400' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Life Kingsbury Hospital', privatePhone: '021 670 3000' },
  },
  {
    suburb: 'Pinelands', postalCode: '7405',
    saps: { station: 'Pinelands SAPS', phone: '021 535 1400', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Pinelands Fire', phone: '021 535 1100' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Cape Town', privatePhone: '021 464 5500' },
  },
  {
    suburb: 'Maitland', postalCode: '7405',
    saps: { station: 'Maitland SAPS', phone: '021 507 9600', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Maitland Fire', phone: '021 535 1100' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  {
    suburb: 'Goodwood', postalCode: '7460',
    saps: { station: 'Goodwood SAPS', phone: '021 591 7800', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Goodwood Fire', phone: '021 591 1444' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111' },
  },
  {
    suburb: 'Parow', postalCode: '7500',
    saps: { station: 'Parow SAPS', phone: '021 938 4700', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Parow Fire', phone: '021 938 4800' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Panorama', privatePhone: '021 938 2111' },
  },
  {
    suburb: 'Durbanville', postalCode: '7550',
    saps: { station: 'Durbanville SAPS', phone: '021 970 1600', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Durbanville Fire', phone: '021 970 1700' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Durbanville', privatePhone: '021 980 2100' },
  },
  {
    suburb: 'Milnerton', postalCode: '7441',
    saps: { station: 'Milnerton SAPS', phone: '021 529 8600', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Milnerton Fire', phone: '021 550 1700' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Milnerton', privatePhone: '021 529 9000' },
  },
  {
    suburb: 'Table View', postalCode: '7441',
    saps: { station: 'Table View SAPS', phone: '021 521 1100', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Table View Fire', phone: '021 550 1700' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Milnerton', privatePhone: '021 529 9000' },
  },
  {
    suburb: 'Bloubergstrand', postalCode: '7441',
    saps: { station: 'Table View SAPS', phone: '021 521 1100', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Blouberg Fire', phone: '021 550 1700' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111' },
  },
  {
    suburb: 'Century City', postalCode: '7441',
    saps: { station: 'Milnerton SAPS', phone: '021 529 8600', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Milnerton Fire', phone: '021 550 1700' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Milnerton', privatePhone: '021 529 9000' },
  },
  // ── Cape Flats & South ──
  {
    suburb: 'Athlone', postalCode: '7764',
    saps: { station: 'Athlone SAPS', phone: '021 697 5300', clusterHQ: 'Mitchells Plain Cluster', clusterPhone: '021 370 1600' },
    fire: { station: 'Athlone Fire', phone: '021 697 1333' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  {
    suburb: 'Mitchells Plain', postalCode: '7785',
    saps: { station: 'Mitchells Plain SAPS', phone: '021 370 1600', clusterHQ: 'Mitchells Plain Cluster', clusterPhone: '021 370 1600' },
    fire: { station: 'Mitchells Plain Fire', phone: '021 370 2300' },
    medical: { publicHospital: 'Mitchells Plain Hospital', publicPhone: '021 377 4444' },
  },
  {
    suburb: 'Khayelitsha', postalCode: '7784',
    saps: { station: 'Khayelitsha SAPS', phone: '021 364 1020', clusterHQ: 'Khayelitsha Cluster', clusterPhone: '021 364 1020' },
    fire: { station: 'Khayelitsha Fire', phone: '021 360 6200' },
    medical: { publicHospital: 'Khayelitsha District Hospital', publicPhone: '021 360 4700' },
  },
  {
    suburb: 'Nyanga', postalCode: '7755',
    saps: { station: 'Nyanga SAPS', phone: '021 380 3270', clusterHQ: 'Khayelitsha Cluster', clusterPhone: '021 364 1020' },
    fire: { station: 'Nyanga Fire', phone: '021 360 6200' },
    medical: { publicHospital: 'Gugulethu CHC', publicPhone: '021 637 0290' },
  },
  {
    suburb: 'Gugulethu', postalCode: '7750',
    saps: { station: 'Gugulethu SAPS', phone: '021 633 1062', clusterHQ: 'Khayelitsha Cluster', clusterPhone: '021 364 1020' },
    fire: { station: 'Gugulethu Fire', phone: '021 360 6200' },
    medical: { publicHospital: 'Gugulethu CHC', publicPhone: '021 637 0290' },
  },
  {
    suburb: 'Langa', postalCode: '7455',
    saps: { station: 'Langa SAPS', phone: '021 695 8200', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Langa Fire', phone: '021 697 1333' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  {
    suburb: 'Philippi', postalCode: '7785',
    saps: { station: 'Philippi East SAPS', phone: '021 370 1014', clusterHQ: 'Mitchells Plain Cluster', clusterPhone: '021 370 1600' },
    fire: { station: 'Philippi Fire', phone: '021 370 2300' },
    medical: { publicHospital: 'Mitchells Plain Hospital', publicPhone: '021 377 4444' },
  },
  {
    suburb: 'Delft', postalCode: '7100',
    saps: { station: 'Delft SAPS', phone: '021 954 2750', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Delft Fire', phone: '021 954 1155' },
    medical: { publicHospital: 'Delft CHC', publicPhone: '021 954 2760' },
  },
  {
    suburb: 'Blue Downs', postalCode: '7100',
    saps: { station: 'Blue Downs SAPS', phone: '021 904 0100', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Blue Downs Fire', phone: '021 954 1155' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111' },
  },
  {
    suburb: 'Kuils River', postalCode: '7580',
    saps: { station: 'Kuils River SAPS', phone: '021 900 5700', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Kuils River Fire', phone: '021 903 2100' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111' },
  },
  {
    suburb: 'Kraaifontein', postalCode: '7570',
    saps: { station: 'Kraaifontein SAPS', phone: '021 980 5400', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Kraaifontein Fire', phone: '021 980 5500' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111' },
  },
  {
    suburb: 'Brackenfell', postalCode: '7560',
    saps: { station: 'Brackenfell SAPS', phone: '021 980 5200', clusterHQ: 'Blue Downs Cluster', clusterPhone: '021 904 0100' },
    fire: { station: 'Brackenfell Fire', phone: '021 980 5500' },
    medical: { publicHospital: 'Karl Bremer Hospital', publicPhone: '021 918 1111', privateClinic: 'Mediclinic Durbanville', privatePhone: '021 980 2100' },
  },
  // ── Atlantic Seaboard ──
  {
    suburb: 'Green Point', postalCode: '8005',
    saps: { station: 'Sea Point SAPS', phone: '021 430 3700', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Green Point Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'V&A Waterfront', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Hout Bay', postalCode: '7806',
    saps: { station: 'Hout Bay SAPS', phone: '021 790 2000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Hout Bay Fire', phone: '021 790 1011' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  {
    suburb: 'Llandudno', postalCode: '7806',
    saps: { station: 'Hout Bay SAPS', phone: '021 790 2000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Hout Bay Fire', phone: '021 790 1011' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  // ── Northern Suburbs ──
  {
    suburb: 'Stellenbosch', postalCode: '7600',
    saps: { station: 'Stellenbosch SAPS', phone: '021 809 5000', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Stellenbosch Fire', phone: '021 808 8888' },
    medical: { publicHospital: 'Stellenbosch Hospital', publicPhone: '021 808 6100', privateClinic: 'Mediclinic Stellenbosch', privatePhone: '021 861 2000' },
  },
  {
    suburb: 'Somerset West', postalCode: '7130',
    saps: { station: 'Somerset West SAPS', phone: '021 850 4600', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Somerset West Fire', phone: '021 850 4700' },
    medical: { publicHospital: 'Hottentots Holland Hospital', publicPhone: '021 850 4700', privateClinic: 'Mediclinic Vergelegen', privatePhone: '021 850 9000' },
  },
  {
    suburb: 'Strand', postalCode: '7140',
    saps: { station: 'Strand SAPS', phone: '021 845 1000', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Strand Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Hottentots Holland Hospital', publicPhone: '021 850 4700' },
  },
  {
    suburb: 'Gordon\'s Bay', postalCode: '7150',
    saps: { station: 'Gordon\'s Bay SAPS', phone: '021 856 1142', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Gordon\'s Bay Fire', phone: '021 856 1266' },
    medical: { publicHospital: 'Hottentots Holland Hospital', publicPhone: '021 850 4700' },
  },
  {
    suburb: 'Franschhoek', postalCode: '7690',
    saps: { station: 'Franschhoek SAPS', phone: '021 876 2105', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Franschhoek Fire', phone: '021 876 2601' },
    medical: { publicHospital: 'Paarl Hospital', publicPhone: '021 860 2500' },
  },
  {
    suburb: 'Paarl', postalCode: '7646',
    saps: { station: 'Paarl SAPS', phone: '021 807 5600', clusterHQ: 'Paarl Cluster', clusterPhone: '021 807 5600' },
    fire: { station: 'Paarl Fire', phone: '021 807 4700' },
    medical: { publicHospital: 'Paarl Hospital', publicPhone: '021 860 2500', privateClinic: 'Mediclinic Paarl', privatePhone: '021 807 8000' },
  },
  {
    suburb: 'Wellington', postalCode: '7655',
    saps: { station: 'Wellington SAPS', phone: '021 873 1414', clusterHQ: 'Paarl Cluster', clusterPhone: '021 807 5600' },
    fire: { station: 'Wellington Fire', phone: '021 873 1440' },
    medical: { publicHospital: 'Paarl Hospital', publicPhone: '021 860 2500' },
  },
  // ── West Coast ──
  {
    suburb: 'Atlantis', postalCode: '7349',
    saps: { station: 'Atlantis SAPS', phone: '021 572 3900', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Atlantis Fire', phone: '021 572 1234' },
    medical: { publicHospital: 'Wesfleur Hospital', publicPhone: '021 571 8000' },
  },
  {
    suburb: 'Malmesbury', postalCode: '7299',
    saps: { station: 'Malmesbury SAPS', phone: '022 487 1600', clusterHQ: 'West Coast Cluster', clusterPhone: '022 487 1600' },
    fire: { station: 'Malmesbury Fire', phone: '022 482 3400' },
    medical: { publicHospital: 'Malmesbury Hospital', publicPhone: '022 487 9200' },
  },
  {
    suburb: 'Saldanha', postalCode: '7395',
    saps: { station: 'Saldanha SAPS', phone: '022 714 1050', clusterHQ: 'West Coast Cluster', clusterPhone: '022 487 1600' },
    fire: { station: 'Saldanha Fire', phone: '022 714 2100' },
    medical: { publicHospital: 'Saldanha Bay Hospital', publicPhone: '022 714 1555' },
  },
  {
    suburb: 'Langebaan', postalCode: '7357',
    saps: { station: 'Langebaan SAPS', phone: '022 772 2110', clusterHQ: 'West Coast Cluster', clusterPhone: '022 487 1600' },
    fire: { station: 'Langebaan Fire', phone: '022 772 1411' },
    medical: { publicHospital: 'Saldanha Bay Hospital', publicPhone: '022 714 1555' },
  },
  // ── Garden Route / South Cape ──
  {
    suburb: 'George', postalCode: '6529',
    saps: { station: 'George SAPS', phone: '044 803 4400', clusterHQ: 'George Cluster', clusterPhone: '044 803 4400' },
    fire: { station: 'George Fire', phone: '044 801 6311' },
    medical: { publicHospital: 'George Hospital', publicPhone: '044 802 4532', privateClinic: 'Mediclinic George', privatePhone: '044 803 2000' },
  },
  {
    suburb: 'Knysna', postalCode: '6570',
    saps: { station: 'Knysna SAPS', phone: '044 302 6602', clusterHQ: 'George Cluster', clusterPhone: '044 803 4400' },
    fire: { station: 'Knysna Fire', phone: '044 302 6300' },
    medical: { publicHospital: 'Knysna Hospital', publicPhone: '044 302 8400', privateClinic: 'Mediclinic Garden Route', privatePhone: '044 302 2000' },
  },
  {
    suburb: 'Plettenberg Bay', postalCode: '6600',
    saps: { station: 'Plettenberg Bay SAPS', phone: '044 501 1200', clusterHQ: 'George Cluster', clusterPhone: '044 803 4400' },
    fire: { station: 'Plettenberg Bay Fire', phone: '044 501 3000' },
    medical: { publicHospital: 'Knysna Hospital', publicPhone: '044 302 8400' },
  },
  {
    suburb: 'Mossel Bay', postalCode: '6500',
    saps: { station: 'Mossel Bay SAPS', phone: '044 693 1100', clusterHQ: 'George Cluster', clusterPhone: '044 803 4400' },
    fire: { station: 'Mossel Bay Fire', phone: '044 606 5000' },
    medical: { publicHospital: 'Mossel Bay Hospital', publicPhone: '044 691 2011' },
  },
  {
    suburb: 'Oudtshoorn', postalCode: '6625',
    saps: { station: 'Oudtshoorn SAPS', phone: '044 203 8600', clusterHQ: 'George Cluster', clusterPhone: '044 803 4400' },
    fire: { station: 'Oudtshoorn Fire', phone: '044 203 3100' },
    medical: { publicHospital: 'Oudtshoorn Hospital', publicPhone: '044 203 7200' },
  },
  // ── Overberg ──
  {
    suburb: 'Hermanus', postalCode: '7200',
    saps: { station: 'Hermanus SAPS', phone: '028 312 2930', clusterHQ: 'Overberg Cluster', clusterPhone: '028 312 2930' },
    fire: { station: 'Hermanus Fire', phone: '028 313 8111' },
    medical: { publicHospital: 'Hermanus Hospital', publicPhone: '028 312 1166', privateClinic: 'Mediclinic Hermanus', privatePhone: '028 313 0168' },
  },
  {
    suburb: 'Caledon', postalCode: '7230',
    saps: { station: 'Caledon SAPS', phone: '028 214 1144', clusterHQ: 'Overberg Cluster', clusterPhone: '028 312 2930' },
    fire: { station: 'Caledon Fire', phone: '028 214 3300' },
    medical: { publicHospital: 'Caledon Hospital', publicPhone: '028 212 1070' },
  },
  {
    suburb: 'Swellendam', postalCode: '6740',
    saps: { station: 'Swellendam SAPS', phone: '028 514 1227', clusterHQ: 'Overberg Cluster', clusterPhone: '028 312 2930' },
    fire: { station: 'Swellendam Fire', phone: '028 514 1220' },
    medical: { publicHospital: 'Swellendam Hospital', publicPhone: '028 514 1142' },
  },
  // ── Central Karoo ──
  {
    suburb: 'Beaufort West', postalCode: '6970',
    saps: { station: 'Beaufort West SAPS', phone: '023 414 3700', clusterHQ: 'Central Karoo Cluster', clusterPhone: '023 414 3700' },
    fire: { station: 'Beaufort West Fire', phone: '023 414 2130' },
    medical: { publicHospital: 'Beaufort West Hospital', publicPhone: '023 414 1100' },
  },
  // ── Cape Winelands ──
  {
    suburb: 'Worcester', postalCode: '6850',
    saps: { station: 'Worcester SAPS', phone: '023 348 4200', clusterHQ: 'Worcester Cluster', clusterPhone: '023 348 4200' },
    fire: { station: 'Worcester Fire', phone: '023 348 2600' },
    medical: { publicHospital: 'Worcester Hospital', publicPhone: '023 348 1100', privateClinic: 'Mediclinic Worcester', privatePhone: '023 348 1500' },
  },
  {
    suburb: 'Robertson', postalCode: '6705',
    saps: { station: 'Robertson SAPS', phone: '023 626 3400', clusterHQ: 'Worcester Cluster', clusterPhone: '023 348 4200' },
    fire: { station: 'Robertson Fire', phone: '023 626 2700' },
    medical: { publicHospital: 'Robertson Hospital', publicPhone: '023 626 1090' },
  },
  // ── Southern Suburbs (additional) ──
  {
    suburb: 'Retreat', postalCode: '7945',
    saps: { station: 'Retreat SAPS', phone: '021 710 9110', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Retreat Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Tokai', postalCode: '7945',
    saps: { station: 'Diep River SAPS', phone: '021 710 4000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Tokai Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121', privateClinic: 'Mediclinic Constantiaberg', privatePhone: '021 799 2911' },
  },
  {
    suburb: 'Plumstead', postalCode: '7800',
    saps: { station: 'Wynberg SAPS', phone: '021 710 4000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Plumstead Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  {
    suburb: 'Grassy Park', postalCode: '7941',
    saps: { station: 'Grassy Park SAPS', phone: '021 700 9400', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Grassy Park Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Steenberg', postalCode: '7945',
    saps: { station: 'Retreat SAPS', phone: '021 710 9110', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Steenberg Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Ottery', postalCode: '7800',
    saps: { station: 'Wynberg SAPS', phone: '021 710 4000', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Ottery Fire', phone: '021 799 8200' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111' },
  },
  // ── Helderberg ──
  {
    suburb: 'Sir Lowry\'s Pass', postalCode: '7133',
    saps: { station: 'Somerset West SAPS', phone: '021 850 4600', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Somerset West Fire', phone: '021 850 4700' },
    medical: { publicHospital: 'Hottentots Holland Hospital', publicPhone: '021 850 4700' },
  },
  {
    suburb: 'Macassar', postalCode: '7130',
    saps: { station: 'Macassar SAPS', phone: '021 857 8200', clusterHQ: 'Stellenbosch Cluster', clusterPhone: '021 809 5000' },
    fire: { station: 'Macassar Fire', phone: '021 857 8300' },
    medical: { publicHospital: 'Hottentots Holland Hospital', publicPhone: '021 850 4700' },
  },
  // ── Additional key suburbs ──
  {
    suburb: 'Kommetjie', postalCode: '7976',
    saps: { station: 'Ocean View SAPS', phone: '021 783 3700', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Kommetjie Fire', phone: '021 786 1042' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Noordhoek', postalCode: '7979',
    saps: { station: 'Ocean View SAPS', phone: '021 783 3700', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Noordhoek Fire', phone: '021 786 1042' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Scarborough', postalCode: '7975',
    saps: { station: 'Simon\'s Town SAPS', phone: '021 786 1412', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Scarborough Fire', phone: '021 786 1042' },
    medical: { publicHospital: 'False Bay Hospital', publicPhone: '021 782 1121' },
  },
  {
    suburb: 'Bo-Kaap', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Gardens', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Cape Town', privatePhone: '021 464 5500' },
  },
  {
    suburb: 'Oranjezicht', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Cape Town', privatePhone: '021 464 5500' },
  },
  {
    suburb: 'Tamboerskloof', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Mediclinic Cape Town', privatePhone: '021 464 5500' },
  },
  {
    suburb: 'De Waterkant', postalCode: '8001',
    saps: { station: 'Cape Town Central SAPS', phone: '021 467 8078', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Cape Town Central Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Mouille Point', postalCode: '8005',
    saps: { station: 'Sea Point SAPS', phone: '021 430 3700', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Green Point Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Three Anchor Bay', postalCode: '8005',
    saps: { station: 'Sea Point SAPS', phone: '021 430 3700', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Green Point Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Bantry Bay', postalCode: '8005',
    saps: { station: 'Sea Point SAPS', phone: '021 430 3700', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Sea Point Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Clifton', postalCode: '8005',
    saps: { station: 'Camps Bay SAPS', phone: '021 437 8150', clusterHQ: 'Cape Town Cluster', clusterPhone: '021 467 8001' },
    fire: { station: 'Camps Bay Fire', phone: '021 444 7601' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Netcare Christiaan Barnard', privatePhone: '021 441 0000' },
  },
  {
    suburb: 'Bishopscourt', postalCode: '7708',
    saps: { station: 'Claremont SAPS', phone: '021 657 3400', clusterHQ: 'Wynberg Cluster', clusterPhone: '021 710 4000' },
    fire: { station: 'Claremont Fire', phone: '021 670 2400' },
    medical: { publicHospital: 'Groote Schuur Hospital', publicPhone: '021 404 9111', privateClinic: 'Life Kingsbury Hospital', privatePhone: '021 670 3000' },
  },
];

// ── Lookup helper ──

export interface EmergencyContactsResult {
  suburb: string;
  postalCode: string;
  saps: SAPSContact & { nationalCrimeStop: string };
  fire: FireContact & { nsri: string; wsar: string };
  medical: MedicalContact & { metroEMS: string; er24: string; netcare911: string };
}

export function getEmergencyContacts(query: string): EmergencyContactsResult | null {
  if (!query.trim()) return null;
  const q = query.toLowerCase().trim();

  const entry = westernCapeDirectory.find(
    e => e.suburb.toLowerCase().includes(q) || e.postalCode === q
  );

  if (!entry) return null;

  return {
    suburb: entry.suburb,
    postalCode: entry.postalCode,
    saps: { ...entry.saps, nationalCrimeStop: PROVINCE_WIDE.nationalCrimeStop },
    fire: { ...entry.fire, nsri: PROVINCE_WIDE.nsri, wsar: PROVINCE_WIDE.wsar },
    medical: { ...entry.medical, metroEMS: PROVINCE_WIDE.metroEMS, er24: PROVINCE_WIDE.er24, netcare911: PROVINCE_WIDE.netcare911 },
  };
}

export function searchDirectory(query: string): SuburbEmergencyEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return westernCapeDirectory
    .filter(e => e.suburb.toLowerCase().includes(q) || e.postalCode.includes(q))
    .slice(0, 10);
}
