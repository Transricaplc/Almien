-- Create suburb_intelligence table for Western Cape suburb data
CREATE TABLE public.suburb_intelligence (
    id TEXT PRIMARY KEY,
    suburb_name TEXT NOT NULL,
    ward_id INTEGER NOT NULL,
    area_code TEXT NOT NULL,
    saps_station TEXT NOT NULL,
    saps_contact TEXT NOT NULL,
    fire_station TEXT NOT NULL,
    fire_contact TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    hospital_contact TEXT NOT NULL,
    safety_score INTEGER NOT NULL CHECK (safety_score >= 0 AND safety_score <= 100),
    risk_type TEXT,
    cctv_coverage INTEGER NOT NULL DEFAULT 0 CHECK (cctv_coverage >= 0 AND cctv_coverage <= 100),
    incidents_24h INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suburb_intelligence ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read suburb intelligence" 
ON public.suburb_intelligence 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_suburb_intelligence_updated_at
BEFORE UPDATE ON public.suburb_intelligence
FOR EACH ROW
EXECUTE FUNCTION public.update_api_cache_updated_at();

-- Create index for faster searches
CREATE INDEX idx_suburb_intelligence_name ON public.suburb_intelligence (suburb_name);
CREATE INDEX idx_suburb_intelligence_safety ON public.suburb_intelligence (safety_score);

-- Insert 50 Western Cape suburbs with full emergency data
INSERT INTO public.suburb_intelligence (id, suburb_name, ward_id, area_code, saps_station, saps_contact, fire_station, fire_contact, hospital_name, hospital_contact, safety_score, risk_type, cctv_coverage, incidents_24h) VALUES
-- Cape Town Metro
('ottery', 'Ottery', 63, '7800', 'Grassy Park SAPS', '021 700 3900', 'Wynberg Fire', '021 444 9623', 'Victoria Hospital', '021 799 1111', 68, NULL, 65, 5),
('athlone', 'Athlone', 49, '7764', 'Athlone SAPS', '021 697 9200', 'Epping Fire', '021 535 1100', 'Melomed Gatesville', '021 637 8100', 65, NULL, 58, 7),
('sea-point', 'Sea Point', 54, '8005', 'Sea Point SAPS', '021 430 3700', 'Sea Point Fire', '021 430 3750', 'Netcare Christiaan Barnard', '021 441 0000', 82, NULL, 92, 2),
('khayelitsha', 'Khayelitsha', 89, '7784', 'Khayelitsha SAPS', '021 360 2300', 'Khayelitsha Fire', '021 360 2400', 'Khayelitsha Hospital', '021 360 4200', 55, NULL, 35, 28),
('bellville', 'Bellville', 3, '7530', 'Bellville SAPS', '021 918 3000', 'Bellville Fire', '021 918 3050', 'Karl Bremer Hospital', '021 918 1911', 70, NULL, 72, 6),
('claremont', 'Claremont', 58, '7708', 'Claremont SAPS', '021 657 2240', 'Wynberg Fire', '021 444 9623', 'Kingsbury Hospital', '021 670 4000', 85, NULL, 88, 2),
('mitchells-plain', 'Mitchells Plain', 79, '7785', 'Mitchells Plain SAPS', '021 370 1600', 'Mitchells Plain Fire', '021 370 1650', 'Mitchells Plain District Hospital', '021 377 4300', 58, NULL, 42, 18),
('milnerton', 'Milnerton', 4, '7441', 'Milnerton SAPS', '021 528 3800', 'Milnerton Fire', '021 528 3850', 'Milnerton Mediclinic', '021 529 9000', 78, NULL, 80, 3),
('gugulethu', 'Gugulethu', 40, '7750', 'Gugulethu SAPS', '021 684 2300', 'Gugulethu Fire', '021 684 2350', 'Heideveld Day Hospital', '021 637 8069', 60, NULL, 38, 12),
('durbanville', 'Durbanville', 112, '7550', 'Durbanville SAPS', '021 970 3800', 'Durbanville Fire', '021 970 3850', 'Durbanville Mediclinic', '021 980 2100', 88, NULL, 85, 1),
('hout-bay', 'Hout Bay', 74, '7806', 'Hout Bay SAPS', '021 791 8660', 'Hout Bay Fire', '021 791 8670', 'Victoria Hospital', '021 799 1111', 74, NULL, 70, 4),
('table-view', 'Table View', 113, '7441', 'Table View SAPS', '021 521 3300', 'Table View Fire', '021 521 3350', 'Netcare Blaauwberg', '021 554 9000', 80, NULL, 82, 3),
('woodstock', 'Woodstock', 115, '7925', 'Woodstock SAPS', '021 442 3100', 'Roeland Street Fire', '021 480 7700', 'Groote Schuur Hospital', '021 404 9111', 72, NULL, 75, 6),
('rondebosch', 'Rondebosch', 59, '7700', 'Rondebosch SAPS', '021 685 7345', 'Wynberg Fire', '021 444 9623', 'Red Cross Childrens Hospital', '021 658 5111', 86, NULL, 84, 2),
('parow', 'Parow', 26, '7500', 'Parow SAPS', '021 921 4300', 'Parow Fire', '021 921 4350', 'N1 City Hospital', '021 590 4444', 70, NULL, 68, 5),
('fish-hoek', 'Fish Hoek', 64, '7975', 'Fish Hoek SAPS', '021 784 2700', 'Fish Hoek Fire', '021 784 2750', 'False Bay Hospital', '021 782 1121', 84, NULL, 78, 2),
('somerset-west', 'Somerset West', 15, '7130', 'Somerset West SAPS', '021 850 1300', 'Strand Fire', '021 854 9150', 'Vergelegen Mediclinic', '021 850 9000', 82, NULL, 80, 3),
('strand', 'Strand', 83, '7140', 'Strand SAPS', '021 854 9100', 'Strand Fire', '021 854 9150', 'Strand Hospital', '021 850 1911', 74, NULL, 72, 4),
('kuils-river', 'Kuils River', 11, '7580', 'Kuils River SAPS', '021 900 2800', 'Kuils River Fire', '021 900 2850', 'Netcare Kuils River', '021 900 6000', 72, NULL, 70, 5),
('langa', 'Langa', 52, '7455', 'Langa SAPS', '021 695 7300', 'Epping Fire', '021 535 1100', 'Langa Day Hospital', '021 694 4440', 58, NULL, 40, 10),
('grassy-park', 'Grassy Park', 66, '7941', 'Grassy Park SAPS', '021 700 3900', 'Ottery Fire', '021 700 3950', 'Victoria Hospital', '021 799 1111', 62, NULL, 55, 7),
('kenilworth', 'Kenilworth', 58, '7708', 'Claremont SAPS', '021 657 2240', 'Wynberg Fire', '021 444 9623', 'Kenilworth Clinic', '021 763 4400', 84, NULL, 82, 2),
('muizenberg', 'Muizenberg', 64, '7945', 'Muizenberg SAPS', '021 787 9000', 'Lakeside Fire', '021 787 9050', 'False Bay Hospital', '021 782 1121', 76, NULL, 74, 4),
('goodwood', 'Goodwood', 27, '7460', 'Goodwood SAPS', '021 592 4430', 'Goodwood Fire', '021 592 4450', 'N1 City Hospital', '021 590 4444', 74, NULL, 70, 4),
('brackenfell', 'Brackenfell', 102, '7560', 'Brackenfell SAPS', '021 983 1940', 'Brackenfell Fire', '021 983 1950', 'Brackenfell Mediclinic', '021 981 2100', 82, NULL, 80, 2),
('kraaifontein', 'Kraaifontein', 101, '7570', 'Kraaifontein SAPS', '021 980 5500', 'Kraaifontein Fire', '021 980 5550', 'Tygerberg Hospital', '021 938 4911', 60, NULL, 52, 9),
('constantia', 'Constantia', 62, '7806', 'Diep River SAPS', '021 710 7300', 'Constantia Fire', '021 710 7350', 'Constantiaberg Mediclinic', '021 799 2196', 90, NULL, 88, 1),
('wynberg', 'Wynberg', 63, '7800', 'Wynberg SAPS', '021 799 1400', 'Wynberg Fire', '021 444 9623', 'Victoria Hospital', '021 799 1111', 72, NULL, 70, 5),
('gardens', 'Gardens', 77, '8001', 'Cape Town Central SAPS', '021 467 8000', 'Roeland Street Fire', '021 480 7700', 'Mediclinic Cape Town', '021 464 0500', 84, NULL, 90, 3),
('plumstead', 'Plumstead', 63, '7800', 'Diep River SAPS', '021 710 7300', 'Wynberg Fire', '021 444 9623', 'Victoria Hospital', '021 799 1111', 80, NULL, 76, 3),
('epping', 'Epping', 30, '7460', 'Epping SAPS', '021 534 4420', 'Epping Fire', '021 535 1100', 'N1 City Hospital', '021 590 4444', 68, NULL, 60, 6),
('belhar', 'Belhar', 12, '7493', 'Belhar SAPS', '021 953 8100', 'Belhar Fire', '021 953 8150', 'Tygerberg Hospital', '021 938 4911', 62, NULL, 48, 8),
('blue-downs', 'Blue Downs', 108, '7100', 'Blue Downs SAPS', '021 909 9300', 'Mfuleni Fire', '021 909 9350', 'Eerste River Hospital', '021 902 8000', 58, NULL, 42, 10),
('delft', 'Delft', 106, '7100', 'Delft SAPS', '021 954 9000', 'Belhar Fire', '021 953 8150', 'Tygerberg Hospital', '021 938 4911', 54, NULL, 35, 14),
('manenberg', 'Manenberg', 46, '7764', 'Manenberg SAPS', '021 638 1101', 'Gugulethu Fire', '021 684 2350', 'Heideveld Day Hospital', '021 637 8069', 52, NULL, 38, 12),
('nyanga', 'Nyanga', 37, '7750', 'Nyanga SAPS', '021 380 3300', 'Gugulethu Fire', '021 684 2350', 'Gugulethu Day Hospital', '021 633 4615', 50, NULL, 30, 18),
('philippi', 'Philippi', 34, '7785', 'Philippi SAPS', '021 690 1500', 'Gugulethu Fire', '021 684 2350', 'Mitchells Plain Hospital', '021 377 4300', 52, NULL, 32, 16),
('bishop-lavis', 'Bishop Lavis', 31, '7490', 'Bishop Lavis SAPS', '021 935 9800', 'Belhar Fire', '021 953 8150', 'Tygerberg Hospital', '021 938 4911', 56, NULL, 40, 11),
('elsies-river', 'Elsies River', 28, '7490', 'Elsies River SAPS', '021 933 0300', 'Goodwood Fire', '021 592 4450', 'Tygerberg Hospital', '021 938 4911', 58, NULL, 45, 9),
('maitland', 'Maitland', 56, '7405', 'Maitland SAPS', '021 506 9400', 'Salt River Fire', '021 480 7700', 'Vincent Pallotti Hospital', '021 506 5111', 70, NULL, 65, 5),
('lansdowne', 'Lansdowne', 60, '7780', 'Lansdowne SAPS', '021 700 9000', 'Ottery Fire', '021 700 3950', 'Melomed Gatesville', '021 637 8100', 74, NULL, 68, 4),
('pinelands', 'Pinelands', 53, '7405', 'Pinelands SAPS', '021 506 2100', 'Epping Fire', '021 535 1100', 'Vincent Pallotti Hospital', '021 506 5111', 88, NULL, 85, 1),
('mowbray', 'Mowbray', 57, '7700', 'Mowbray SAPS', '021 680 9580', 'Salt River Fire', '021 480 7700', 'Groote Schuur Hospital', '021 404 9111', 80, NULL, 78, 3),
('newlands', 'Newlands', 59, '7700', 'Rondebosch SAPS', '021 685 7345', 'Wynberg Fire', '021 444 9623', 'Claremont Hospital', '021 670 4300', 90, NULL, 88, 1),
('observatory', 'Observatory', 57, '7925', 'Woodstock SAPS', '021 442 3100', 'Salt River Fire', '021 480 7700', 'Groote Schuur Hospital', '021 404 9111', 78, NULL, 75, 4),
('green-point', 'Green Point', 115, '8005', 'Sea Point SAPS', '021 430 3700', 'Sea Point Fire', '021 430 3750', 'Mediclinic Cape Town', '021 464 0500', 85, NULL, 90, 2),
('camps-bay', 'Camps Bay', 54, '8005', 'Camps Bay SAPS', '021 437 8140', 'Sea Point Fire', '021 430 3750', 'Mediclinic Cape Town', '021 464 0500', 92, NULL, 90, 1),
('kalk-bay', 'Kalk Bay', 64, '7975', 'Muizenberg SAPS', '021 787 9000', 'Fish Hoek Fire', '021 784 2750', 'False Bay Hospital', '021 782 1121', 88, NULL, 82, 1),
('simons-town', 'Simons Town', 61, '7975', 'Simons Town SAPS', '021 786 8600', 'Simons Town Fire', '021 786 8650', 'False Bay Hospital', '021 782 1121', 90, NULL, 85, 1),
('ocean-view', 'Ocean View', 61, '7979', 'Ocean View SAPS', '021 783 8300', 'Simons Town Fire', '021 786 8650', 'False Bay Hospital', '021 782 1121', 60, NULL, 45, 8);