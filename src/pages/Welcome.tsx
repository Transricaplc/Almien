import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const legalLinks = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms & Conditions', href: '#terms' },
  { label: 'POPIA Compliance', href: '#popia' },
  { label: 'Cookie Policy', href: '#cookies' },
  { label: 'Disclaimer', href: '#disclaimer' },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [fading, setFading] = useState(false);

  const handleEnter = () => {
    setFading(true);
    setTimeout(() => navigate('/dashboard'), 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/table-mountain-hero.jpg')" }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

      {/* Centered content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg" style={{ textShadow: '0 0 40px hsl(174 60% 50% / 0.25)' }}>
          Almien
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl font-medium text-white/90 tracking-wide" style={{ textShadow: '0 0 20px hsl(174 60% 50% / 0.15)' }}>
          Safety Intelligence at Your Fingertips
        </p>

        <button
          onClick={handleEnter}
          className="mt-10 px-10 py-4 sm:px-14 sm:py-5 rounded-full text-lg sm:text-xl font-bold text-white bg-[hsl(174,60%,42%)] hover:bg-[hsl(174,60%,48%)] active:scale-[0.97] transition-all shadow-lg shadow-[hsl(174,60%,30%)/0.4] hover:shadow-xl"
        >
          Enter
        </button>
      </main>

      {/* Legal footer */}
      <footer className="relative z-10 bg-black/80 backdrop-blur-sm px-6 py-4 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-white/70">
          {legalLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-4">
              {i > 0 && <span className="text-white/30">•</span>}
              <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
            </span>
          ))}
        </nav>
        <p className="mt-2 text-[11px] sm:text-xs text-white/50">
          © 2026 Almien • Cape Town, Western Cape
        </p>
        <p className="mt-1 text-[10px] sm:text-[11px] text-white/40 max-w-xl mx-auto leading-relaxed">
          Almien is fully compliant with the Protection of Personal Information Act (POPIA). We respect your privacy and protect all personal data. By entering you agree to our Terms &amp; Conditions.
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
