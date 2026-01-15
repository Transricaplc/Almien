import { Shield, Lock, FileText, ExternalLink } from 'lucide-react';

const LegalComplianceFooter = () => {
  return (
    <div className="bg-card/30 border-t border-border">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* POPIA Compliance */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1">POPIA Compliant</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                SafeSync complies with the Protection of Personal Information Act (POPIA) and does not store personally identifiable surveillance data.
              </p>
            </div>
          </div>

          {/* CCTV By-Law */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1">CoCT CCTV By-Law</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                We adhere to the City of Cape Town's CCTV By-Law (2023) regarding third-party system registration and data handling.
              </p>
            </div>
          </div>

          {/* Data Transparency */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1">Data Transparency</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                SafeSync aggregates public OSINT signals and municipal data. No live CCTV footage is stored or processed.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
          <a 
            href="#" 
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            <FileText className="w-3 h-3" />
            Privacy Policy
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span className="text-muted-foreground/30">•</span>
          <a 
            href="#" 
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Shield className="w-3 h-3" />
            POPIA Data Policy
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span className="text-muted-foreground/30">•</span>
          <a 
            href="#" 
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Lock className="w-3 h-3" />
            Terms of Service
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-2 bg-background/50 rounded border border-border/30 text-center">
          <p className="text-[9px] text-muted-foreground font-mono">
            DISCLAIMER: SafeSync provides aggregated safety intelligence for informational purposes. In emergencies, always contact official services directly (SAPS: 10111 | Ambulance: 10177 | Fire: 021 480 7700). 
            Data sourced from City of Cape Town, SAPS, NSRI, and public municipal records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalComplianceFooter;
