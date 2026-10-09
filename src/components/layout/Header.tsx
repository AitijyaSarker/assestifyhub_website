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
  const [projectsDropdown, setProjectsDropdown] = useState(false);
  const [companyDropdown, setCompanyDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { settings, services, serviceCategories, projects } = useCmsStore();
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

  const activeCategories = serviceCategories.filter((c) => c.active).sort((a, b) => a.order - b.order);
  const visibleProjects = projects.filter((p) => p.isVisible);

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
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
            <Link to="/" className="nav-link font-medium text-sm">
              Home
            </Link>

            {/* Services Dropdown (reads active serviceCategories from CMS) */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button className="nav-link font-medium text-sm flex items-center gap-1 cursor-pointer">
                Services <ChevronDown className={`size-3.5 transition-transform ${servicesDropdown ? "rotate-180 text-primary" : ""}`} />
              </button>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-72 p-3 bg-card border border-border rounded-xl shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Service Capabilities
                  </div>
                  {activeCategories.length > 0 ? (
                    activeCategories.map((cat) => {
                      // Check if a project matches this category
                      const matchingProject = visibleProjects.find(
                        (p) => p.category?.toLowerCase() === cat.name.toLowerCase() || p.categoryId === cat.id
                      );
                      const targetUrl = matchingProject 
                        ? `/projects/${matchingProject.slug}` 
                        : `/projects?category=${encodeURIComponent(cat.name)}`;
                      return (
                        <Link 
                          key={cat.id} 
                          to={targetUrl}
                          className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <span>{cat.name}</span>
                          <ArrowUpRight className="size-3 text-muted-foreground" />
                        </Link>
                      );
                    })
                  ) : (
                    services.slice(0, 6).map((item) => (
                      <Link 
                        key={item.id} 
                        to={`/services/$slug`} 
                        params={{ slug: item.slug }}
                        className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <span>{item.title}</span>
                        <ArrowUpRight className="size-3 text-muted-foreground" />
                      </Link>
                    ))
                  )}
                  <div className="pt-2 border-t border-border mt-1">
                    <Link 
                      to="/services" 
                      className="flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Explore All Services</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Projects Dropdown (lists product records + View All) */}
            <div 
              className="relative"
              onMouseEnter={() => setProjectsDropdown(true)}
              onMouseLeave={() => setProjectsDropdown(false)}
            >
              <button className="nav-link font-medium text-sm flex items-center gap-1 cursor-pointer">
                Projects <ChevronDown className={`size-3.5 transition-transform ${projectsDropdown ? "rotate-180 text-primary" : ""}`} />
              </button>

              {projectsDropdown && (
                <div className="absolute top-full left-0 w-80 p-3 bg-card border border-border rounded-xl shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Featured Systems & Case Studies
                  </div>
                  {visibleProjects.slice(0, 5).map((p) => (
                    <Link 
                      key={p.id} 
                      to={`/projects/$slug`} 
                      params={{ slug: p.slug }}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg text-xs hover:bg-muted transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {p.category}
                        </div>
                      </div>
                      {p.isFeatured && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                          Featured
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-border mt-1">
                    <Link 
                      to="/projects" 
                      className="flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>View All Projects</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="nav-link font-medium text-sm">
              About
            </Link>

            <Link to="/contact" className="nav-link font-medium text-sm">
              Contact
            </Link>

            {/* Company Dropdown (About, Process, Why Choose Us, Reviews, Careers) */}
            <div 
              className="relative"
              onMouseEnter={() => setCompanyDropdown(true)}
              onMouseLeave={() => setCompanyDropdown(false)}
            >
              <button className="nav-link font-medium text-sm flex items-center gap-1 cursor-pointer">
                Company <ChevronDown className={`size-3.5 transition-transform ${companyDropdown ? "rotate-180 text-primary" : ""}`} />
              </button>

              {companyDropdown && (
                <div className="absolute top-full left-0 w-64 p-3 bg-card border border-border rounded-xl shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    to="/about" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Building2 className="size-4 text-primary" /> About Us
                  </Link>
                  <Link 
                    to="/process" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Code2 className="size-4 text-primary" /> Our Process
                  </Link>
                  <Link 
                    to="/why-choose-us" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Award className="size-4 text-primary" /> Why Choose Us
                  </Link>
                  <Link 
                    to="/review" 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Sparkles className="size-4 text-primary" /> Client Reviews
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

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>

            <Button
              variant="brand"
              onClick={() => navigate({ to: "/schedule" })}
              className="hidden sm:inline-flex"
            >
              Schedule a Call
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
          <nav className="site-container mobile-nav lg:hidden mt-3 animate-in fade-in slide-in-from-top-2 space-y-2 pb-4" aria-label="Mobile navigation">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pt-2">Navigation</div>
            <Link to="/" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/services" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/projects" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link to="/about" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Contact</Link>

            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pt-2 border-t border-border">Company</div>
            <Link to="/process" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Our Process</Link>
            <Link to="/why-choose-us" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Why Choose Us</Link>
            <Link to="/review" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Client Reviews</Link>
            <Link to="/careers" className="nav-link font-semibold py-1.5 block" onClick={() => setMenuOpen(false)}>Careers</Link>

            <Button 
              variant="brand" 
              className="w-full mt-3" 
              onClick={() => { setMenuOpen(false); navigate({ to: "/schedule" }); }}
            >
              Schedule a Call
            </Button>
          </nav>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
