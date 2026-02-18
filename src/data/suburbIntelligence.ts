// Gridfy - Suburb Intelligence Database
// Comprehensive Western Cape area data with emergency contacts

export interface SuburbData {
  id: string;
  suburb_name: string;
  ward_id: number;
  area_code: string;
  saps_station: string;
  saps_contact: string;
  fire_station: string;
  fire_contact: string;
  hospital_name: string;
  hospital_contact: string;
  safety_score: number;
  risk_type?: string;
  cctv_coverage: number;
  incidents_24h: number;
}

export interface BeachData {
  id: string;
  name: string;
  safety_rating: number;
  primary_risk: string;
  infrastructure: string;
  shark_spotter: boolean;
  lifeguards: boolean;
  flag_status: 'green' | 'black' | 'red' | 'white';
}

export interface TouristSite {
  id: string;
  name: string;
  type: 'hiking' | 'attraction' | 'beach' | 'landmark';
  safety_score: number;
  protocols: string[];
  emergency_contact: string;
  emergency_name: string;
}

// 50+ Western Cape Suburbs with full emergency data
export const suburbIntelligence: SuburbData[] = [
  // Cape Town Metro
  { id: 'ottery', suburb_name: 'Ottery', ward_id: 63, area_code: '7800', saps_station: 'Grassy Park SAPS', saps_contact: '021 700 3900', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Victoria Hospital', hospital_contact: '021 799 1111', safety_score: 68, cctv_coverage: 65, incidents_24h: 5 },
  { id: 'athlone', suburb_name: 'Athlone', ward_id: 49, area_code: '7764', saps_station: 'Athlone SAPS', saps_contact: '021 697 9200', fire_station: 'Epping Fire', fire_contact: '021 535 1100', hospital_name: 'Melomed Gatesville', hospital_contact: '021 637 8100', safety_score: 65, cctv_coverage: 58, incidents_24h: 7 },
  { id: 'sea-point', suburb_name: 'Sea Point', ward_id: 54, area_code: '8005', saps_station: 'Sea Point SAPS', saps_contact: '021 430 3700', fire_station: 'Sea Point Fire', fire_contact: '021 430 3750', hospital_name: 'Netcare Christiaan Barnard', hospital_contact: '021 441 0000', safety_score: 82, cctv_coverage: 92, incidents_24h: 2 },
  { id: 'khayelitsha', suburb_name: 'Khayelitsha', ward_id: 89, area_code: '7784', saps_station: 'Khayelitsha SAPS', saps_contact: '021 360 2300', fire_station: 'Khayelitsha Fire', fire_contact: '021 360 2400', hospital_name: 'Khayelitsha Hospital', hospital_contact: '021 360 4200', safety_score: 55, cctv_coverage: 35, incidents_24h: 28 },
  { id: 'bellville', suburb_name: 'Bellville', ward_id: 3, area_code: '7530', saps_station: 'Bellville SAPS', saps_contact: '021 918 3000', fire_station: 'Bellville Fire', fire_contact: '021 918 3050', hospital_name: 'Karl Bremer Hospital', hospital_contact: '021 918 1911', safety_score: 70, cctv_coverage: 72, incidents_24h: 6 },
  { id: 'claremont', suburb_name: 'Claremont', ward_id: 58, area_code: '7708', saps_station: 'Claremont SAPS', saps_contact: '021 657 2240', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Kingsbury Hospital', hospital_contact: '021 670 4000', safety_score: 85, cctv_coverage: 88, incidents_24h: 2 },
  { id: 'mitchells-plain', suburb_name: 'Mitchells Plain', ward_id: 79, area_code: '7785', saps_station: 'Mitchells Plain SAPS', saps_contact: '021 370 1600', fire_station: 'Mitchells Plain Fire', fire_contact: '021 370 1650', hospital_name: 'Mitchells Plain District Hospital', hospital_contact: '021 377 4300', safety_score: 58, cctv_coverage: 42, incidents_24h: 18 },
  { id: 'milnerton', suburb_name: 'Milnerton', ward_id: 4, area_code: '7441', saps_station: 'Milnerton SAPS', saps_contact: '021 528 3800', fire_station: 'Milnerton Fire', fire_contact: '021 528 3850', hospital_name: 'Milnerton Mediclinic', hospital_contact: '021 529 9000', safety_score: 78, cctv_coverage: 80, incidents_24h: 3 },
  { id: 'gugulethu', suburb_name: 'Gugulethu', ward_id: 40, area_code: '7750', saps_station: 'Gugulethu SAPS', saps_contact: '021 684 2300', fire_station: 'Gugulethu Fire', fire_contact: '021 684 2350', hospital_name: 'Heideveld Day Hospital', hospital_contact: '021 637 8069', safety_score: 60, cctv_coverage: 38, incidents_24h: 12 },
  { id: 'durbanville', suburb_name: 'Durbanville', ward_id: 112, area_code: '7550', saps_station: 'Durbanville SAPS', saps_contact: '021 970 3800', fire_station: 'Durbanville Fire', fire_contact: '021 970 3850', hospital_name: 'Durbanville Mediclinic', hospital_contact: '021 980 2100', safety_score: 88, cctv_coverage: 85, incidents_24h: 1 },
  { id: 'hout-bay', suburb_name: 'Hout Bay', ward_id: 74, area_code: '7806', saps_station: 'Hout Bay SAPS', saps_contact: '021 791 8660', fire_station: 'Hout Bay Fire', fire_contact: '021 791 8670', hospital_name: 'Victoria Hospital', hospital_contact: '021 799 1111', safety_score: 74, cctv_coverage: 70, incidents_24h: 4 },
  { id: 'table-view', suburb_name: 'Table View', ward_id: 113, area_code: '7441', saps_station: 'Table View SAPS', saps_contact: '021 521 3300', fire_station: 'Table View Fire', fire_contact: '021 521 3350', hospital_name: 'Netcare Blaauwberg', hospital_contact: '021 554 9000', safety_score: 80, cctv_coverage: 82, incidents_24h: 3 },
  { id: 'woodstock', suburb_name: 'Woodstock', ward_id: 115, area_code: '7925', saps_station: 'Woodstock SAPS', saps_contact: '021 442 3100', fire_station: 'Roeland Street Fire', fire_contact: '021 480 7700', hospital_name: 'Groote Schuur Hospital', hospital_contact: '021 404 9111', safety_score: 72, cctv_coverage: 75, incidents_24h: 6 },
  { id: 'rondebosch', suburb_name: 'Rondebosch', ward_id: 59, area_code: '7700', saps_station: 'Rondebosch SAPS', saps_contact: '021 685 7345', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Red Cross Childrens Hospital', hospital_contact: '021 658 5111', safety_score: 86, cctv_coverage: 84, incidents_24h: 2 },
  { id: 'parow', suburb_name: 'Parow', ward_id: 26, area_code: '7500', saps_station: 'Parow SAPS', saps_contact: '021 921 4300', fire_station: 'Parow Fire', fire_contact: '021 921 4350', hospital_name: 'N1 City Hospital', hospital_contact: '021 590 4444', safety_score: 70, cctv_coverage: 68, incidents_24h: 5 },
  { id: 'fish-hoek', suburb_name: 'Fish Hoek', ward_id: 64, area_code: '7975', saps_station: 'Fish Hoek SAPS', saps_contact: '021 784 2700', fire_station: 'Fish Hoek Fire', fire_contact: '021 784 2750', hospital_name: 'False Bay Hospital', hospital_contact: '021 782 1121', safety_score: 84, cctv_coverage: 78, incidents_24h: 2 },
  { id: 'somerset-west', suburb_name: 'Somerset West', ward_id: 15, area_code: '7130', saps_station: 'Somerset West SAPS', saps_contact: '021 850 1300', fire_station: 'Strand Fire', fire_contact: '021 854 9150', hospital_name: 'Vergelegen Mediclinic', hospital_contact: '021 850 9000', safety_score: 82, cctv_coverage: 80, incidents_24h: 3 },
  { id: 'strand', suburb_name: 'Strand', ward_id: 83, area_code: '7140', saps_station: 'Strand SAPS', saps_contact: '021 854 9100', fire_station: 'Strand Fire', fire_contact: '021 854 9150', hospital_name: 'Strand Hospital', hospital_contact: '021 850 1911', safety_score: 74, cctv_coverage: 72, incidents_24h: 4 },
  { id: 'kuils-river', suburb_name: 'Kuils River', ward_id: 11, area_code: '7580', saps_station: 'Kuils River SAPS', saps_contact: '021 900 2800', fire_station: 'Kuils River Fire', fire_contact: '021 900 2850', hospital_name: 'Netcare Kuils River', hospital_contact: '021 900 6000', safety_score: 72, cctv_coverage: 70, incidents_24h: 5 },
  { id: 'langa', suburb_name: 'Langa', ward_id: 52, area_code: '7455', saps_station: 'Langa SAPS', saps_contact: '021 695 7300', fire_station: 'Epping Fire', fire_contact: '021 535 1100', hospital_name: 'Langa Day Hospital', hospital_contact: '021 694 4440', safety_score: 58, cctv_coverage: 40, incidents_24h: 10 },
  { id: 'grassy-park', suburb_name: 'Grassy Park', ward_id: 66, area_code: '7941', saps_station: 'Grassy Park SAPS', saps_contact: '021 700 3900', fire_station: 'Ottery Fire', fire_contact: '021 700 3950', hospital_name: 'Victoria Hospital', hospital_contact: '021 799 1111', safety_score: 62, cctv_coverage: 55, incidents_24h: 7 },
  { id: 'kenilworth', suburb_name: 'Kenilworth', ward_id: 58, area_code: '7708', saps_station: 'Claremont SAPS', saps_contact: '021 657 2240', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Kenilworth Clinic', hospital_contact: '021 763 4400', safety_score: 84, cctv_coverage: 82, incidents_24h: 2 },
  { id: 'muizenberg', suburb_name: 'Muizenberg', ward_id: 64, area_code: '7945', saps_station: 'Muizenberg SAPS', saps_contact: '021 787 9000', fire_station: 'Lakeside Fire', fire_contact: '021 787 9050', hospital_name: 'False Bay Hospital', hospital_contact: '021 782 1121', safety_score: 76, cctv_coverage: 74, incidents_24h: 4 },
  { id: 'goodwood', suburb_name: 'Goodwood', ward_id: 27, area_code: '7460', saps_station: 'Goodwood SAPS', saps_contact: '021 592 4430', fire_station: 'Goodwood Fire', fire_contact: '021 592 4450', hospital_name: 'N1 City Hospital', hospital_contact: '021 590 4444', safety_score: 74, cctv_coverage: 70, incidents_24h: 4 },
  { id: 'brackenfell', suburb_name: 'Brackenfell', ward_id: 102, area_code: '7560', saps_station: 'Brackenfell SAPS', saps_contact: '021 983 1940', fire_station: 'Brackenfell Fire', fire_contact: '021 983 1950', hospital_name: 'Brackenfell Mediclinic', hospital_contact: '021 981 2100', safety_score: 82, cctv_coverage: 80, incidents_24h: 2 },
  { id: 'kraaifontein', suburb_name: 'Kraaifontein', ward_id: 101, area_code: '7570', saps_station: 'Kraaifontein SAPS', saps_contact: '021 980 5500', fire_station: 'Kraaifontein Fire', fire_contact: '021 980 5550', hospital_name: 'Tygerberg Hospital', hospital_contact: '021 938 4911', safety_score: 60, cctv_coverage: 52, incidents_24h: 9 },
  { id: 'constantia', suburb_name: 'Constantia', ward_id: 62, area_code: '7806', saps_station: 'Diep River SAPS', saps_contact: '021 710 7300', fire_station: 'Constantia Fire', fire_contact: '021 710 7350', hospital_name: 'Constantiaberg Mediclinic', hospital_contact: '021 799 2196', safety_score: 90, cctv_coverage: 88, incidents_24h: 1 },
  { id: 'wynberg', suburb_name: 'Wynberg', ward_id: 63, area_code: '7800', saps_station: 'Wynberg SAPS', saps_contact: '021 799 1400', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Victoria Hospital', hospital_contact: '021 799 1111', safety_score: 72, cctv_coverage: 70, incidents_24h: 5 },
  { id: 'gardens', suburb_name: 'Gardens', ward_id: 77, area_code: '8001', saps_station: 'Cape Town Central SAPS', saps_contact: '021 467 8000', fire_station: 'Roeland Street Fire', fire_contact: '021 480 7700', hospital_name: 'Mediclinic Cape Town', hospital_contact: '021 464 0500', safety_score: 84, cctv_coverage: 90, incidents_24h: 3 },
  { id: 'plumstead', suburb_name: 'Plumstead', ward_id: 63, area_code: '7800', saps_station: 'Diep River SAPS', saps_contact: '021 710 7300', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Victoria Hospital', hospital_contact: '021 799 1111', safety_score: 80, cctv_coverage: 76, incidents_24h: 3 },
  { id: 'epping', suburb_name: 'Epping', ward_id: 30, area_code: '7460', saps_station: 'Epping SAPS', saps_contact: '021 534 4420', fire_station: 'Epping Fire', fire_contact: '021 535 1100', hospital_name: 'N1 City Hospital', hospital_contact: '021 590 4444', safety_score: 68, cctv_coverage: 60, incidents_24h: 6 },
  { id: 'belhar', suburb_name: 'Belhar', ward_id: 12, area_code: '7493', saps_station: 'Belhar SAPS', saps_contact: '021 953 8100', fire_station: 'Belhar Fire', fire_contact: '021 953 8150', hospital_name: 'Tygerberg Hospital', hospital_contact: '021 938 4911', safety_score: 62, cctv_coverage: 48, incidents_24h: 8 },
  { id: 'blue-downs', suburb_name: 'Blue Downs', ward_id: 108, area_code: '7100', saps_station: 'Blue Downs SAPS', saps_contact: '021 909 9300', fire_station: 'Mfuleni Fire', fire_contact: '021 909 9350', hospital_name: 'Eerste River Hospital', hospital_contact: '021 902 8000', safety_score: 58, cctv_coverage: 42, incidents_24h: 10 },
  { id: 'delft', suburb_name: 'Delft', ward_id: 106, area_code: '7100', saps_station: 'Delft SAPS', saps_contact: '021 954 9000', fire_station: 'Belhar Fire', fire_contact: '021 953 8150', hospital_name: 'Tygerberg Hospital', hospital_contact: '021 938 4911', safety_score: 54, cctv_coverage: 35, incidents_24h: 14 },
  { id: 'manenberg', suburb_name: 'Manenberg', ward_id: 46, area_code: '7764', saps_station: 'Manenberg SAPS', saps_contact: '021 638 1101', fire_station: 'Gugulethu Fire', fire_contact: '021 684 2350', hospital_name: 'Heideveld Day Hospital', hospital_contact: '021 637 8069', safety_score: 52, cctv_coverage: 38, incidents_24h: 12 },
  { id: 'nyanga', suburb_name: 'Nyanga', ward_id: 37, area_code: '7750', saps_station: 'Nyanga SAPS', saps_contact: '021 380 3300', fire_station: 'Gugulethu Fire', fire_contact: '021 684 2350', hospital_name: 'Gugulethu Day Hospital', hospital_contact: '021 633 4615', safety_score: 50, cctv_coverage: 30, incidents_24h: 18 },
  { id: 'philippi', suburb_name: 'Philippi', ward_id: 34, area_code: '7785', saps_station: 'Philippi SAPS', saps_contact: '021 690 1500', fire_station: 'Gugulethu Fire', fire_contact: '021 684 2350', hospital_name: 'Mitchells Plain Hospital', hospital_contact: '021 377 4300', safety_score: 52, cctv_coverage: 32, incidents_24h: 16 },
  { id: 'bishop-lavis', suburb_name: 'Bishop Lavis', ward_id: 31, area_code: '7490', saps_station: 'Bishop Lavis SAPS', saps_contact: '021 935 9800', fire_station: 'Belhar Fire', fire_contact: '021 953 8150', hospital_name: 'Tygerberg Hospital', hospital_contact: '021 938 4911', safety_score: 56, cctv_coverage: 40, incidents_24h: 11 },
  { id: 'elsies-river', suburb_name: "Elsie's River", ward_id: 28, area_code: '7490', saps_station: 'Elsies River SAPS', saps_contact: '021 933 0300', fire_station: 'Goodwood Fire', fire_contact: '021 592 4450', hospital_name: 'Tygerberg Hospital', hospital_contact: '021 938 4911', safety_score: 58, cctv_coverage: 45, incidents_24h: 9 },
  { id: 'maitland', suburb_name: 'Maitland', ward_id: 56, area_code: '7405', saps_station: 'Maitland SAPS', saps_contact: '021 506 9400', fire_station: 'Salt River Fire', fire_contact: '021 480 7700', hospital_name: 'Vincent Pallotti Hospital', hospital_contact: '021 506 5111', safety_score: 70, cctv_coverage: 65, incidents_24h: 5 },
  { id: 'lansdowne', suburb_name: 'Lansdowne', ward_id: 60, area_code: '7780', saps_station: 'Lansdowne SAPS', saps_contact: '021 700 9000', fire_station: 'Ottery Fire', fire_contact: '021 700 3950', hospital_name: 'Melomed Gatesville', hospital_contact: '021 637 8100', safety_score: 74, cctv_coverage: 68, incidents_24h: 4 },
  { id: 'pinelands', suburb_name: 'Pinelands', ward_id: 53, area_code: '7405', saps_station: 'Pinelands SAPS', saps_contact: '021 506 2100', fire_station: 'Epping Fire', fire_contact: '021 535 1100', hospital_name: 'Vincent Pallotti Hospital', hospital_contact: '021 506 5111', safety_score: 88, cctv_coverage: 85, incidents_24h: 1 },
  { id: 'mowbray', suburb_name: 'Mowbray', ward_id: 57, area_code: '7700', saps_station: 'Mowbray SAPS', saps_contact: '021 680 9580', fire_station: 'Salt River Fire', fire_contact: '021 480 7700', hospital_name: 'Groote Schuur Hospital', hospital_contact: '021 404 9111', safety_score: 80, cctv_coverage: 78, incidents_24h: 3 },
  { id: 'newlands', suburb_name: 'Newlands', ward_id: 59, area_code: '7700', saps_station: 'Rondebosch SAPS', saps_contact: '021 685 7345', fire_station: 'Wynberg Fire', fire_contact: '021 444 9623', hospital_name: 'Claremont Hospital', hospital_contact: '021 670 4300', safety_score: 90, cctv_coverage: 88, incidents_24h: 1 },
  { id: 'observatory', suburb_name: 'Observatory', ward_id: 57, area_code: '7925', saps_station: 'Woodstock SAPS', saps_contact: '021 442 3100', fire_station: 'Salt River Fire', fire_contact: '021 480 7700', hospital_name: 'Groote Schuur Hospital', hospital_contact: '021 404 9111', safety_score: 78, cctv_coverage: 75, incidents_24h: 4 },
  { id: 'green-point', suburb_name: 'Green Point', ward_id: 115, area_code: '8005', saps_station: 'Sea Point SAPS', saps_contact: '021 430 3700', fire_station: 'Sea Point Fire', fire_contact: '021 430 3750', hospital_name: 'Mediclinic Cape Town', hospital_contact: '021 464 0500', safety_score: 85, cctv_coverage: 90, incidents_24h: 2 },
  { id: 'camps-bay', suburb_name: 'Camps Bay', ward_id: 54, area_code: '8005', saps_station: 'Camps Bay SAPS', saps_contact: '021 437 8140', fire_station: 'Sea Point Fire', fire_contact: '021 430 3750', hospital_name: 'Mediclinic Cape Town', hospital_contact: '021 464 0500', safety_score: 92, cctv_coverage: 90, incidents_24h: 1 },
  { id: 'kalk-bay', suburb_name: 'Kalk Bay', ward_id: 64, area_code: '7975', saps_station: 'Muizenberg SAPS', saps_contact: '021 787 9000', fire_station: 'Fish Hoek Fire', fire_contact: '021 784 2750', hospital_name: 'False Bay Hospital', hospital_contact: '021 782 1121', safety_score: 88, cctv_coverage: 82, incidents_24h: 1 },
  { id: 'simons-town', suburb_name: "Simon's Town", ward_id: 61, area_code: '7975', saps_station: 'Simons Town SAPS', saps_contact: '021 786 8600', fire_station: 'Simons Town Fire', fire_contact: '021 786 8650', hospital_name: 'False Bay Hospital', hospital_contact: '021 782 1121', safety_score: 90, cctv_coverage: 85, incidents_24h: 1 },
  { id: 'ocean-view', suburb_name: 'Ocean View', ward_id: 61, area_code: '7979', saps_station: 'Ocean View SAPS', saps_contact: '021 783 8300', fire_station: 'Simons Town Fire', fire_contact: '021 786 8650', hospital_name: 'False Bay Hospital', hospital_contact: '021 782 1121', safety_score: 60, cctv_coverage: 45, incidents_24h: 8 },
  // Tourist & Special Locations
  { id: 'va-waterfront', suburb_name: 'V&A Waterfront', ward_id: 115, area_code: '8001', saps_station: 'Table Bay Harbour SAPS', saps_contact: '021 410 2300', fire_station: 'Roeland Street Fire', fire_contact: '021 480 7700', hospital_name: 'Netcare Christiaan Barnard', hospital_contact: '021 441 0000', safety_score: 95, cctv_coverage: 98, incidents_24h: 1 },
  { id: 'lions-head', suburb_name: "Lion's Head", ward_id: 54, area_code: '8005', saps_station: 'Sea Point SAPS', saps_contact: '021 430 3700', fire_station: 'Sea Point Fire', fire_contact: '021 430 3750', hospital_name: 'Mediclinic Cape Town', hospital_contact: '021 464 0500', safety_score: 80, cctv_coverage: 20, incidents_24h: 0 },
  { id: 'boulders-beach', suburb_name: 'Boulders Beach', ward_id: 61, area_code: '7975', saps_station: "Simon's Town SAPS", saps_contact: '021 786 8600', fire_station: "Simon's Town Fire", fire_contact: '021 786 8650', hospital_name: 'False Bay Hospital', hospital_contact: '021 782 1121', safety_score: 92, cctv_coverage: 75, incidents_24h: 0 },
  // Mobility Hotspots
  { id: 'liesbeek-cycle', suburb_name: 'Liesbeek Cycle Path', ward_id: 57, area_code: '7700', saps_station: 'Mowbray SAPS', saps_contact: '021 680 9580', fire_station: 'Salt River Fire', fire_contact: '021 480 7700', hospital_name: 'Groote Schuur', hospital_contact: '021 404 9111', safety_score: 62, risk_type: 'Isolated Path', cctv_coverage: 25, incidents_24h: 2 },
  { id: 'sea-point-promenade', suburb_name: 'Sea Point Promenade', ward_id: 54, area_code: '8005', saps_station: 'Sea Point SAPS', saps_contact: '021 430 3700', fire_station: 'Sea Point Fire', fire_contact: '021 430 3750', hospital_name: 'New Somerset Hospital', hospital_contact: '021 402 6911', safety_score: 88, cctv_coverage: 85, incidents_24h: 1 },
  { id: 'grand-parade', suburb_name: 'Grand Parade CBD', ward_id: 115, area_code: '8001', saps_station: 'Cape Town Central', saps_contact: '021 467 8000', fire_station: 'Roeland St Fire', fire_contact: '021 480 7700', hospital_name: 'Christiaan Barnard', hospital_contact: '021 441 0000', safety_score: 58, risk_type: 'Pickpocket Hotspot', cctv_coverage: 80, incidents_24h: 8 },
  { id: 'st-georges-mall', suburb_name: 'St Georges Mall', ward_id: 115, area_code: '8001', saps_station: 'Cape Town Central', saps_contact: '021 467 8000', fire_station: 'Roeland St Fire', fire_contact: '021 480 7700', hospital_name: 'Netcare Christiaan Barnard', hospital_contact: '021 441 0000', safety_score: 74, risk_type: 'Pickpocket Hotspot', cctv_coverage: 85, incidents_24h: 4 },
];

// Beach Safety Data
export const beachSafety: BeachData[] = [
  { id: 'muizenberg', name: 'Muizenberg', safety_rating: 88, primary_risk: 'Shark Activity / Rip Currents', infrastructure: 'Permanent Shark Spotters & Siren', shark_spotter: true, lifeguards: true, flag_status: 'green' },
  { id: 'camps-bay-beach', name: 'Camps Bay Beach', safety_rating: 92, primary_risk: 'Cold Water Shock / Crowds', infrastructure: 'Seasonal Lifeguards & High CCTV', shark_spotter: false, lifeguards: true, flag_status: 'green' },
  { id: 'clifton', name: 'Clifton (1-4)', safety_rating: 95, primary_risk: 'Theft / Alcohol Violations', infrastructure: 'Dedicated Law Enforcement Patrols', shark_spotter: false, lifeguards: true, flag_status: 'green' },
  { id: 'fish-hoek-beach', name: 'Fish Hoek Beach', safety_rating: 85, primary_risk: 'Shark Activity', infrastructure: 'Shark Exclusion Net (Weather permitting)', shark_spotter: true, lifeguards: true, flag_status: 'green' },
  { id: 'monwabisi', name: 'Monwabisi', safety_rating: 45, primary_risk: 'High Drowning Risk / Crime', infrastructure: 'Strong Rips; Emergency Hub nearby', shark_spotter: false, lifeguards: false, flag_status: 'red' },
  { id: 'bloubergstrand', name: 'Bloubergstrand', safety_rating: 80, primary_risk: 'Strong Winds / Kite-surf collisions', infrastructure: 'High Visibility Vol. Lifeguards', shark_spotter: false, lifeguards: true, flag_status: 'green' },
  { id: 'llandudno', name: 'Llandudno', safety_rating: 75, primary_risk: 'Strong Currents / Remote', infrastructure: 'No Lifeguards - Swim at own risk', shark_spotter: false, lifeguards: false, flag_status: 'black' },
  { id: 'noordhoek', name: 'Noordhoek Beach', safety_rating: 70, primary_risk: 'Horse Riding / Strong Currents', infrastructure: 'Remote beach - Limited coverage', shark_spotter: false, lifeguards: false, flag_status: 'black' },
];

// Tourist Site Protocols
export const touristSites: TouristSite[] = [
  {
    id: 'lions-head-hike',
    name: "Lion's Head",
    type: 'hiking',
    safety_score: 80,
    protocols: [
      'Sunset Trap Warning: Start descent 30 mins before sunset',
      'Use spiral path if rocks are damp or you\'re inexperienced',
      'Chains section has high injury risk - use caution',
      'Carry a headlamp if hiking late'
    ],
    emergency_contact: '021 480 7700',
    emergency_name: 'Table Mountain National Park Rescue'
  },
  {
    id: 'table-mountain',
    name: 'Table Mountain',
    type: 'hiking',
    safety_score: 85,
    protocols: [
      'Check weather before ascending - conditions change rapidly',
      'Inform someone of your route and expected return',
      'Carry at least 2L water per person',
      'Stay on marked paths'
    ],
    emergency_contact: '021 480 7700',
    emergency_name: 'Table Mountain National Park Rescue'
  },
  {
    id: 'boulders-penguins',
    name: 'Boulders Beach (Penguin Colony)',
    type: 'attraction',
    safety_score: 92,
    protocols: [
      'Do not touch or feed penguins - they bite!',
      'Stay within designated boardwalk areas',
      'Best visiting times: Early morning or late afternoon',
      'High crowd density during peak season'
    ],
    emergency_contact: '021 786 8600',
    emergency_name: "Simon's Town SAPS"
  },
  {
    id: 'va-waterfront-site',
    name: 'V&A Waterfront',
    type: 'landmark',
    safety_score: 95,
    protocols: [
      'Stay within blue-painted lines for safest routes',
      'High security presence throughout',
      'Report suspicious activity to security',
      'Safe 24/7 with CCTV coverage'
    ],
    emergency_contact: '021 408 7708',
    emergency_name: 'Waterfront Security'
  },
  {
    id: 'kirstenbosch',
    name: 'Kirstenbosch Gardens',
    type: 'attraction',
    safety_score: 90,
    protocols: [
      'Gates close at 6pm (7pm in summer)',
      'Stay on designated paths',
      'Watch for baboons - secure food items',
      'Skeleton Gorge hike requires fitness'
    ],
    emergency_contact: '021 799 8783',
    emergency_name: 'Kirstenbosch Security'
  },
];

// Coastal Emergency Contacts
export const coastalEmergencyContacts = [
  { id: 'nsri', name: 'NSRI Emergency (National)', number: '087 094 9774', description: 'National Sea Rescue Institute' },
  { id: 'port-control', name: 'Cape Town Port Control', number: '021 449 2805', description: 'Maritime emergencies' },
  { id: 'waterfront-security', name: 'Waterfront Security', number: '021 408 7708', description: 'V&A Waterfront emergencies' },
  { id: 'shark-spotters', name: 'Shark Spotters Info Line', number: '078 174 4203', description: 'Shark activity updates' },
  { id: 'mountain-rescue', name: 'Mountain Rescue', number: '021 480 7700', description: 'Table Mountain & Lion\'s Head' },
  { id: 'ccid-security', name: 'CCID Urban Security', number: '021 426 1325', description: 'Cape Town CBD Security' },
];

// Helper to get risk level from safety score
export const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'high';
  return 'critical';
};

// Calculate camera coverage estimation
export const estimateCameraCount = (safetyScore: number): { total: number; active: number } => {
  const total = Math.floor(safetyScore * 0.2) + 5;
  const active = total - Math.floor(Math.random() * 2);
  return { total, active };
};
