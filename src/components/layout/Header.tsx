import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowUpRight, 
  Code2, 
  TrendingUp, 
  ShieldCheck,
  Building2,
  Users,
  Award,
  Briefcase,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useCmsStore } from "@/hooks/use-cms-store";
import { SearchModal } from "./SearchModal";
import logoData from "@/assets/assetify-logo.svg.asset.json";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { settings, services } = useCmsStore();
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pillar1Services = services.filter((s) => s.pillar === "Engineering & Design");
  const pillar2Services = services.filter((s) => s.pillar === "Brand & Digital Growth");
  const pillar3Services = services.filter((s) => s.pillar === "Infrastructure & Security");

  return (
    <>
      <header className="site-header">
        <div className="site-container flex items-center justify-between">
          {/* Brand Logo */}
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

          {/* Desktop Navigation Tree */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7">
            <Link to="/" className="nav-link font-medium text-sm">
              Home
            </Link>

            {/* Services Mega-menu Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button className="nav-link font-medium text-sm flex items-center gap-1 cursor-pointer">
                Services <ChevronDown className={`size-3.5 transition-transform ${servicesDropdown ? "rotate-180 text-primary" : ""}`} />
              </button>

              {servicesDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[780px] p-6 bg-card border border-border rounded-xl shadow-2xl z-50 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Category 1 */}
                  <div>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-primary mb-3">
                      <Code2 className="size-4" /> Engineering & Design
                    </div>
                    <ul className="space-y-2">
                      {pillar1Services.map((item) => (
                        <li key={item.id}>
                          <Link 
                            to={`/services/$slug`} 
                            params={{ slug: item.slug }}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all block py-1"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 2 */}
                  <div>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-primary mb-3">
                      <TrendingUp className="size-4" /> Brand & Digital Growth
                    </div>
                    <ul className="space-y-2">
                      {pillar2Services.map((item) => (
                        <li key={item.id}>
                          <Link 
                            to={`/services/$slug`} 
                            params={{ slug: item.slug }}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all block py-1"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 3 */}
                  <div>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-primary mb-3">
                      <ShieldCheck className="size-4" /> Infrastructure & Security
                    </div>
                    <ul className="space-y-2">
                      {pillar3Services.map((item) => (
                        <li key={item.id}>
                          <Link 
                            to={`/services/$slug`} 
                            params={{ slug: item.slug }}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all block py-1"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-3 pt-4 border-t border-border flex items-center justify-between bg-muted/40 -mx-6 -mb-6 p-4 rounded-b-xl">
                    <span className="text-xs text-muted-foreground">Looking for custom architecture or security audits?</span>
                    <Link to="/book-consultation" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                      Book technical consultation <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Projects / Case Studies */}
            <Link to="/projects" className="nav-link font-medium text-sm">
              Projects
            </Link>

            {/* Company Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCompanyDropdown(true)}
              onMouseLeave={() => setCompanyDropdown(false)}
            >
              <button className="nav-link font-medium text-sm flex items-center gap-1 cursor-pointer">
                Company <ChevronDown className={`size-3.5 transition-transform ${companyDropdown ? "rotate-180 text-primary" : ""}`} />
              </button>

              {companyDropdown && (
                <div className="absolute top-full left-0 w-60 p-3 bg-card border border-border rounded-xl shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    to="/about" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Building2 className="size-4 text-primary" /> About Us
                  </Link>
                  <Link 
                    to="/why-us" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Award className="size-4 text-primary" /> Why Us
                  </Link>
                  <Link 
                    to="/team" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Users className="size-4 text-primary" /> Leadership & Team
                  </Link>
                  <Link 
                    to="/careers" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Briefcase className="size-4 text-primary" /> Careers
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Why Us */}
            <Link to="/why-us" className="nav-link font-medium text-sm">
              Why Us
            </Link>

            {/* Blog & Insights */}
            <Link to="/blog" className="nav-link font-medium text-sm">
              Blog & Insights
            </Link>

            {/* Contact */}
            <Link to="/contact" className="nav-link font-medium text-sm">
              Contact
            </Link>
          </nav>

          {/* Header Right Action Group */}
          <div className="flex items-center gap-3">
            {/* Search Modal Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Search (Cmd+K)"
              aria-label="Open search modal"
            >
              <Search className="size-5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              aria-label="Toggle theme mode"
            >
              {theme === "light" ? <Moon className="size-5 text-slate-700" /> : <Sun className="size-5 text-amber-400" />}
            </button>

            {/* Primary CTA Button */}
            <Button 
              variant="brand" 
              onClick={() => navigate({ to: "/book-consultation" })}
              className="hidden sm:inline-flex"
            >
              Book Consultation <Sparkles className="size-4 ml-1" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <nav className="site-container mobile-nav lg:hidden mt-3 animate-in fade-in slide-in-from-top-2" aria-label="Mobile navigation">
            <Link to="/" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/services" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/projects" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Projects & Case Studies</Link>
            <Link to="/why-us" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Why Us</Link>
            <Link to="/about" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/team" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Leadership & Team</Link>
            <Link to="/careers" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Careers</Link>
            <Link to="/blog" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Blog & Insights</Link>
            <Link to="/contact" className="nav-link font-semibold py-2" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Button 
              variant="brand" 
              className="w-full mt-2" 
              onClick={() => { setMenuOpen(false); navigate({ to: "/book-consultation" }); }}
            >
              Book Consultation <ArrowUpRight className="size-4" />
            </Button>
          </nav>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
