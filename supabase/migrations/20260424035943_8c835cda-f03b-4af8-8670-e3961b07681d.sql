-- Wards table
CREATE TABLE IF NOT EXISTS public.wards (
  id SERIAL PRIMARY KEY,
  ward_number INTEGER UNIQUE NOT NULL,
  ward_name TEXT,
  suburb TEXT,
  district TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  safety_score INTEGER DEFAULT 50,
  incident_count INTEGER DEFAULT 0,
  geojson JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safety services
CREATE TABLE IF NOT EXISTS public.safety_services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('saps','hospital','fire','ambulance','trauma','shelter')),
  address TEXT,
  phone TEXT,
  emergency_phone TEXT,
  lat NUMERIC(9,6) NOT NULL,
  lng NUMERIC(9,6) NOT NULL,
  ward_number INTEGER REFERENCES public.wards(ward_number),
  is_24h BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wards" ON public.wards FOR SELECT USING (true);
CREATE POLICY "Anyone can read safety services" ON public.safety_services FOR SELECT USING (true);

-- Seed wards
INSERT INTO public.wards (ward_number, ward_name, suburb, district, lat, lng, safety_score) VALUES
(57, 'Ward 57', 'Cape Town CBD', 'City Bowl', -33.9249, 18.4241, 72),
(58, 'Ward 58', 'Gardens', 'City Bowl', -33.9380, 18.4150, 68),
(54, 'Ward 54', 'Green Point', 'Atlantic Seaboard', -33.9050, 18.4050, 75),
(74, 'Ward 74', 'Sea Point', 'Atlantic Seaboard', -33.9192, 18.3878, 78),
(62, 'Ward 62', 'Woodstock', 'City Bowl', -33.9320, 18.4468, 61),
(84, 'Ward 84', 'Observatory', 'Southern Suburbs', -33.9380, 18.4710, 65),
(56, 'Ward 56', 'Bo-Kaap', 'City Bowl', -33.9218, 18.4150, 70),
(23, 'Ward 23', 'Khayelitsha', 'Khayelitsha', -34.0350, 18.6730, 38),
(34, 'Ward 34', 'Mitchells Plain', 'Mitchells Plain', -34.0580, 18.6280, 41),
(31, 'Ward 31', 'Bellville', 'Northern Suburbs', -33.9000, 18.6300, 63),
(44, 'Ward 44', 'Parow', 'Northern Suburbs', -33.8980, 18.5940, 60),
(19, 'Ward 19', 'Gugulethu', 'Southern Suburbs', -33.9850, 18.5880, 35),
(70, 'Ward 70', 'Claremont', 'Southern Suburbs', -33.9800, 18.4650, 71),
(68, 'Ward 68', 'Newlands', 'Southern Suburbs', -33.9670, 18.4590, 74),
(76, 'Ward 76', 'Camps Bay', 'Atlantic Seaboard', -33.9502, 18.3762, 80),
(77, 'Ward 77', 'Hout Bay', 'Atlantic Seaboard', -34.0397, 18.3573, 67),
(21, 'Ward 21', 'Delft', 'Tygerberg', -33.9800, 18.6470, 36),
(6,  'Ward 6',  'Langa', 'Tygerberg', -33.9470, 18.5420, 40),
(91, 'Ward 91', 'Constantia', 'Southern Suburbs', -34.0200, 18.4370, 82),
(50, 'Ward 50', 'Pinelands', 'Northern Suburbs', -33.9530, 18.5060, 69)
ON CONFLICT (ward_number) DO NOTHING;

-- Seed services
INSERT INTO public.safety_services (name, type, address, phone, emergency_phone, lat, lng, ward_number, is_24h) VALUES
('Cape Town Central Police Station','saps','Buitenkant St, Cape Town','+27214611100','10111',-33.9262,18.4235,57,true),
('Sea Point Police Station','saps','Roodehek St, Sea Point','+27214308400','10111',-33.9157,18.3901,74,true),
('Woodstock Police Station','saps','Albert Rd, Woodstock','+27214480500','10111',-33.9307,18.4510,62,true),
('Khayelitsha Police Station','saps','Ntlazane Rd, Khayelitsha','+27219070000','10111',-34.0393,18.6795,23,true),
('Mitchells Plain Police Station','saps','AZ Berman Dr, Mitchells Plain','+27213910200','10111',-34.0553,18.6254,34,true),
('Groote Schuur Hospital','hospital','Main Rd, Observatory','+27214042111','10177',-33.9415,18.4638,84,true),
('Tygerberg Hospital','hospital','Francie van Zyl Dr, Bellville','+27219385000','10177',-33.9050,18.6296,44,true),
('Christiaan Barnard Memorial','hospital','DF Malan St, Cape Town','+27214804000','10177',-33.9258,18.4212,57,true),
('Red Cross War Memorial','hospital','Klipfontein Rd, Rondebosch','+27216585111','10177',-33.9703,18.4707,84,true),
('Mitchells Plain Hospital','hospital','AZ Berman Dr, Mitchells Plain','+27213771000','10177',-34.0571,18.6270,34,true),
('Cape Town Fire Station','fire','Buitenkant St, Cape Town','+27214807700','107',-33.9270,18.4210,57,true),
('Woodstock Fire Station','fire','Victoria Rd, Woodstock','+27214487940','107',-33.9280,18.4500,62,true),
('Bellville Fire Station','fire','Voortrekker Rd, Bellville','+27219182100','107',-33.9020,18.6320,31,true),
('Hout Bay Fire Station','fire','Main Rd, Hout Bay','+27217904180','107',-34.0421,18.3601,77,false),
('ER24 Cape Town','ambulance','Cnr Buitenkant & Roeland','+27104551000','084124',-33.9259,18.4218,57,true),
('Netcare 911','ambulance','Christiaan Barnard Memorial','+27119501500','082911',-33.9258,18.4215,57,true),
('Trauma Centre Cape Town','trauma','Toll Rd, Cape Town','+27214483500','10177',-33.9300,18.4200,57,true),
('Khayelitsha District Hospital','hospital','Walter Sisulu Dr, Khayelitsha','+27219070500','10177',-34.0361,18.6697,23,true);