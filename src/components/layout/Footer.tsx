import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";
import { useCmsStore } from "@/hooks/use-cms-store";
import logoData from "@/assets/assetify-logo.svg.asset.json";

export function Footer() {
  const { settings, services } = useCmsStore();

  return (
    <footer className="site-footer bg-card border-t border-border">
      <div className="site-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="brand-lockup flex items-center gap-2.5">
              <img 
                src={settings.logoUrlLight || logoData.url} 
                alt={settings.brandName} 
                className="brand-logo" 
                width={38} 
                height={38} 
              />
              <span className="font-bold tracking-tight text-xl">
                Assetify <span className="text-primary">Hub.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Architecting your digital future with enterprise software engineering, strategic brand growth, and zero-trust cloud infrastructure.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="size-4 text-primary" /> ISO 27001 & SOC 2 Ready
              </div>
            </div>
          </div>

          {/* Column 1: Services */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Capabilities</h4>
            <ul className="space-y-2.5 text-xs">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/$slug`} params={{ slug: s.slug }} className="text-muted-foreground hover:text-primary transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-primary font-semibold hover:underline">
                  All Capabilities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/why-us" className="text-muted-foreground hover:text-primary transition-colors">Why Choose Us</Link></li>
              <li><Link to="/team" className="text-muted-foreground hover:text-primary transition-colors">Leadership & Team</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers & Openings</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog & Tech Insights</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Connect</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="size-3.5 text-primary" /> {settings.contactEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="size-3.5 text-primary" /> {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Bottom Note & Rule compliance label */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Assetify Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-accent text-primary font-medium px-2.5 py-1 rounded">
              Note: Portfolio imagery items represent illustrative design concepts.
            </span>
            <a 
              href={settings.socialLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              Facebook <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
