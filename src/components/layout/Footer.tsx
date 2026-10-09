import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import logoData from "@/assets/assetify-logo.svg.asset.json";

export function Footer() {
  const { settings } = useCmsStore();

  // Fixed 6-item service list as audited in UltraBulb IT
  const footerServices = [
    { title: "Web Development", slug: "web-development" },
    { title: "Mobile Apps", slug: "mobile-development" },
    { title: "UI/UX Design", slug: "product-design" },
    { title: "Cloud Architecture", slug: "cloud-architecture" },
    { title: "AI & Machine Learning", slug: "ai-engineering" },
    { title: "Enterprise Cybersecurity", slug: "cybersecurity" },
  ];

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
                Assestify <span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {settings.tagline || "Architecting your digital future with enterprise software engineering, strategic brand growth, and zero-trust cloud infrastructure."}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="size-4 text-primary" /> ISO 27001 & SOC 2 Ready
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs">
              <div className="inline-flex items-center gap-1.5 font-semibold text-foreground" aria-label="52 reviews">
                <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                52 Reviews
              </div>
              <div className="inline-flex items-center gap-2 text-muted-foreground" aria-label="Glassdoor rating 4.6 out of 5 stars">
                <span className="font-semibold text-foreground">Glassdoor 4.6</span>
                <span className="inline-flex gap-0.5 text-amber-400" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className="size-3.5 fill-current" />
                  ))}
                </span>
              </div>
            </div>

            {/* Schedule CTA in Footer */}
            <div className="pt-2">
              <Button variant="brand" size="sm" asChild>
                <Link to="/schedule">
                  Schedule a Call <CalendarCheck className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Column 1: Services (6 items) */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Services</h4>
            <ul className="space-y-2.5 text-xs">
              {footerServices.map((s) => (
                <li key={s.slug}>
                  <Link to={`/projects?category=${encodeURIComponent(s.title)}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-primary font-semibold hover:underline">
                  All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company (all 9 audited routes: Home, About, Services, Projects, Process, Reviews, Schedule, Careers, Contact) */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={(event) => {
                    if (window.location.pathname === "/") {
                      event.preventDefault();
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  Home
                </Link>
              </li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
              <li><Link to="/process" className="text-muted-foreground hover:text-primary transition-colors">Process</Link></li>
              <li><Link to="/why-choose-us" className="text-muted-foreground hover:text-primary transition-colors">Why Choose Us</Link></li>
              <li><Link to="/review" className="text-muted-foreground hover:text-primary transition-colors">Reviews</Link></li>
              <li><Link to="/schedule" className="text-muted-foreground hover:text-primary transition-colors">Schedule</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Contact</h4>
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

        {/* Bottom Bar: Copyright and social links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4 flex-wrap">
            {settings.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Assestify Hub on Facebook"
                className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Facebook className="size-4" aria-hidden="true" />
              </a>
            )}
            {settings.socialLinks?.linkedin && (
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Assestify Hub on LinkedIn"
                className="rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Linkedin className="size-4" aria-hidden="true" />
              </a>
            )}
            {settings.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
