import { useState, useEffect, useRef } from "react";
import { useCmsStore } from "@/hooks/use-cms-store";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  CalendarCheck, 
  Code2, 
  Cpu, 
  FolderKanban, 
  BookOpen, 
  Menu as MenuIcon, 
  Image as ImageIcon, 
  Users, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Download, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Search,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  FileText,
  Package,
  Briefcase,
  Award,
  Clock,
  Star,
  MessageSquare,
  Tags,
  Moon,
  Sun,
  Bell,
  Pencil,
  Upload,
  ImagePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReferenceAdminModules, type AdminModuleTab } from "@/components/admin/ReferenceAdminModules";
import { ImageAssetManager, ImageAssetPicker } from "@/components/admin/ImageAssetPicker";
import type { ConsultationLead, Project } from "@/lib/cms-store";

const isReferenceAdminTab = (tab: string): tab is AdminModuleTab =>
  ["site-content", "service-categories", "vacancies", "gallery", "awards", "time-slots", "reviews", "messages"].includes(tab);

interface NavItem {
  id: string;
  label: string;
  icon: typeof Award;
  group: string;
  badge?: number;
}

const buildNavItems = (unreadMessages: number, pendingCalls: number, pendingReviews: number): NavItem[] => [
  { id: "overview", label: "Overview", icon: LayoutDashboard, group: "Main" },
  { id: "site-content", label: "Site Content", icon: FileText, group: "Main" },
  { id: "products", label: "Products", icon: Package, group: "Collections" },
  { id: "service-categories", label: "Service Categories", icon: Tags, group: "Collections" },
  { id: "vacancies", label: "Vacancies", icon: Briefcase, group: "Collections" },
  { id: "gallery", label: "Gallery", icon: ImageIcon, group: "Collections" },
  { id: "awards", label: "Awards", icon: Award, group: "Collections" },
  { id: "time-slots", label: "Time Slots", icon: Clock, group: "Collections" },
  { id: "reviews", label: "Reviews", icon: Star, group: "Submissions", badge: pendingReviews },
  { id: "calls", label: "Scheduled Calls", icon: CalendarCheck, group: "Submissions", badge: pendingCalls },
  { id: "messages", label: "Messages", icon: MessageSquare, group: "Submissions", badge: unreadMessages },
  { id: "tech", label: "Technology Stack", icon: Cpu, group: "Advanced" },
  { id: "portfolio", label: "Portfolio / Cases", icon: FolderKanban, group: "Advanced" },
  { id: "blog", label: "Blog & News", icon: BookOpen, group: "Advanced" },
  { id: "layout", label: "Homepage Builder", icon: Layers, group: "Advanced" },
  { id: "settings", label: "Site Settings", icon: Settings, group: "Advanced" },
  { id: "media", label: "Media Library", icon: ImageIcon, group: "Advanced" },
  { id: "audit", label: "Users & Audit Log", icon: Users, group: "Advanced" },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "site-content" | "settings" | "layout" | "leads" | "services" | "tech" | "portfolio" | "blog" | "nav" | "media" | "audit" | "products" | "service-categories" | "vacancies" | "gallery" | "awards" | "time-slots" | "reviews" | "calls" | "messages"
  >("overview");

  const {
    settings,
    siteContent,
    services,
    serviceCategories,
    techStack,
    projects,
    blogPosts,
    leads,
    jobs,
    team,
    sectionLayouts,
    customPages,
    auditLogs,
    gallery,
    awards,
    reviews,
    timeSlots,
    messages,
    syncError,
    store
  } = useCmsStore();

  const { session, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const imageIsReferenced = (url: string) =>
    Boolean(url) && (
      settings.logoUrlLight === url ||
      settings.logoUrlDark === url ||
      settings.faviconUrl === url ||
      projects.some((project) => project.coverImage === url || project.gallery.includes(url)) ||
      blogPosts.some((post) => post.coverImage === url || post.author.avatar === url) ||
      team.some((member) => member.avatar === url) ||
      gallery.some((item) => item.image === url) ||
      awards.some((item) => item.image === url) ||
      customPages.some((page) => page.blocks.some((block) => block.image === url))
    );

  // MODAL STATES
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [techModalOpen, setTechModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "",
    categoryId: "",
    coverImage: "",
    galleryText: "",
    summary: "",
    techStackText: "",
    review: "",
    awards: "",
    accessFeaturesText: "",
    serviceOwnersText: "",
    tagsText: "",
    link: "",
    order: 0,
    isFeatured: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const openNewProductModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      category: serviceCategories.find((c) => c.active)?.name || "",
      categoryId: serviceCategories.find((c) => c.active)?.id || "",
      coverImage: "",
      galleryText: "",
      summary: "",
      techStackText: "",
      review: "",
      awards: "",
      accessFeaturesText: "",
      serviceOwnersText: "",
      tagsText: "",
      link: "",
      order: 0,
      isFeatured: false,
    });
    setProjectModalOpen(true);
  };

  const openEditProductModal = (p: Project) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title || "",
      category: p.category || "",
      categoryId: p.categoryId || "",
      coverImage: p.coverImage || "",
      galleryText: (p.gallery || []).join("\n"),
      summary: p.summary || "",
      techStackText: (p.techTags || []).join(", "),
      review: p.review || "",
      awards: p.awards || "",
      accessFeaturesText: (p.accessFeatures || []).join("\n"),
      serviceOwnersText: (p.serviceOwners || []).join("\n"),
      tagsText: (p.tags || []).join(", "),
      link: p.link || "",
      order: p.order ?? 0,
      isFeatured: Boolean(p.isFeatured),
    });
    setProjectModalOpen(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: session?.token ? `Bearer ${session.token}` : "",
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setProjectForm((f) => ({ ...f, coverImage: data.url }));
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProjectForm((f) => ({ ...f, coverImage: String(event.target.result) }));
        }
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProjectForm((f) => ({ ...f, coverImage: String(event.target.result) }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callDraft, setCallDraft] = useState<Omit<ConsultationLead, "id" | "createdAt" | "status">>({
    bookingDate: new Date().toISOString().slice(0, 10),
    timeSlot: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "",
    budgetRange: "",
    projectBrief: "",
  });
  const validLeads = leads.filter(
    (lead): lead is ConsultationLead =>
      Boolean(lead) && typeof lead === "object" && typeof lead.id === "string",
  );

  // CSV Export Helper for Consultation Leads
  const exportLeadsCSV = () => {
    const headers = ["ID,Date,TimeSlot,Name,Email,Phone,Company,Interest,Budget,Status,CreatedAt"];
    const rows = validLeads.map((l) =>
      `"${l.id}","${l.bookingDate}","${l.timeSlot}","${l.name}","${l.email}","${l.phone}","${l.company}","${l.serviceInterest}","${l.budgetRange}","${l.status}","${l.createdAt}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Assetify_Consultation_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    store.logAction(session?.email || "admin", "EXPORT_LEADS_CSV", "Exported consultation leads to CSV");
  };

  const unreadMessages = messages.filter((m) => !m.read).length;
  const pendingCalls = validLeads.filter((lead) =>
    ["New", "pending", "Contacted"].includes(lead.status),
  ).length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;
  const navItems = buildNavItems(unreadMessages, pendingCalls, pendingReviews);
  const navGroups = ["Main", "Collections", "Submissions", "Advanced"];

  useEffect(() => {
    if (activeTab !== "calls" && activeTab !== "messages") return;

    const refreshSubmissions = () => {
      void store.refreshRemoteContent();
    };
    refreshSubmissions();
    const interval = window.setInterval(refreshSubmissions, 15000);
    window.addEventListener("focus", refreshSubmissions);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshSubmissions);
    };
  }, [activeTab, store]);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col justify-between shrink-0 max-h-screen md:sticky md:top-0">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
            <div className="flex items-center gap-2 font-bold text-lg text-foreground">
              <span className="p-1.5 rounded-lg bg-primary text-white">
                <Sparkles className="size-4" />
              </span>
              Assetify <span className="text-primary">CMS</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer relative"
                  aria-label={`Notifications${unreadMessages ? `, ${unreadMessages} unread` : ""}`}
                >
                  <Bell className="size-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute left-0 top-9 z-50 w-72 rounded-xl border border-border/70 bg-popover p-3 text-popover-foreground shadow-xl">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <span className="text-sm font-semibold">Notifications</span>
                      <span className="text-xs text-muted-foreground">{unreadMessages} unread</span>
                    </div>
                    <div className="max-h-56 space-y-1 overflow-y-auto">
                      {messages.slice(0, 5).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className="w-full rounded-lg p-2 text-left transition-colors hover:bg-accent cursor-pointer"
                          onClick={() => { setNotifOpen(false); setActiveTab("messages"); }}
                        >
                          <div className="flex items-start gap-2">
                            {!m.read ? <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" /> : <span className="mt-1.5 size-2 shrink-0" />}
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">{m.subject || "No subject"}</span>
                              <span className="block truncate text-xs text-muted-foreground">{m.name} · {new Date(m.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </button>
                      ))}
                      {messages.length === 0 && <p className="px-2 py-4 text-center text-xs text-muted-foreground">No notifications yet.</p>}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => { setNotifOpen(false); setActiveTab("messages"); }}>View all messages</Button>
                  </div>
                )}
              </div>
              {/* View Site */}
              <a href="/" target="_blank" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors" title="View Public Site">
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          {/* User Session Info */}
          <div className="mb-4 p-3 rounded-lg bg-accent/50 border border-border/60 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{session?.name || session?.email}</div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{session?.role}</div>
            </div>
          </div>

          {/* Grouped Nav Items */}
          <nav className="space-y-4">
            {navGroups.map((group) => {
              const items = navItems.filter((item) => item.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {group}
                  </div>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as typeof activeTab)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? "bg-primary text-white shadow-md shadow-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge != null && item.badge > 0 && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive ? "bg-white/20 text-white" : "bg-amber-500 text-white"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-xs text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4 mr-2" /> Logout Session
          </Button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {syncError ? (
          <div role="alert" className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {syncError}
          </div>
        ) : null}
        {/* MODULE 1: OVERVIEW & METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">
                A snapshot of your website content and incoming submissions.
              </p>
            </div>

            {/* Primary Stats Grid — matching UltraBulb IT overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "products", label: "Products", value: projects.length, icon: Package, color: "text-primary bg-primary/10", tab: "products" },
                { key: "vacancies", label: "Vacancies", value: jobs.length, icon: Briefcase, color: "text-foreground bg-accent", tab: "vacancies" },
                { key: "hiring", label: "Actively Hiring", value: jobs.filter((j) => j.isVisible).length, icon: Briefcase, color: "text-emerald-600 bg-emerald-500/10", tab: "vacancies" },
                { key: "pendingReviews", label: "Pending Reviews", value: pendingReviews, icon: Star, color: "text-primary bg-primary/10", tab: "reviews" },
                { key: "unreadMessages", label: "Unread Messages", value: unreadMessages, icon: MessageSquare, color: "text-red-600 bg-red-500/10", tab: "messages" },
                { key: "pendingCalls", label: "Pending Calls", value: pendingCalls, icon: CalendarCheck, color: "text-foreground bg-accent", tab: "calls" },
              ].map((s) => (
                <button key={s.key} onClick={() => setActiveTab(s.tab as typeof activeTab)} className="rounded-xl border border-border/60 bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/40 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className={`flex size-11 items-center justify-center rounded-xl ${s.color}`}>
                      <s.icon className="size-5" />
                    </span>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Cards Row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="size-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Reviews</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pendingReviews} pending, {reviews.length} total
                </p>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setActiveTab("reviews")}>
                  Moderate <ExternalLink className="size-3.5" />
                </Button>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="size-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Scheduled Calls</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pendingCalls} pending, {validLeads.length} total
                </p>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setActiveTab("calls")}>
                  View Calls <ExternalLink className="size-3.5" />
                </Button>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Messages</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {unreadMessages} unread, {messages.length} total
                </p>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setActiveTab("messages")}>
                  Read Messages <ExternalLink className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Awards", value: awards.length, tab: "awards" },
                { label: "Gallery", value: gallery.length, tab: "gallery" },
                { label: "Time Slots", value: timeSlots.length, tab: "time-slots" },
                { label: "Service Categories", value: serviceCategories.length, tab: "service-categories" },
              ].map((item) => (
                <button key={item.label} onClick={() => setActiveTab(item.tab as typeof activeTab)} className="rounded-xl border border-border/60 bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 cursor-pointer">
                  <div className="text-xl font-bold text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </button>
              ))}
            </div>

            {/* Recent Leads Table Overview */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Recent Consultation Requests</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("calls")} className="gap-1.5">
                  View All <ExternalLink className="size-3.5" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {validLeads.slice(0, 5).map((l) => (
                      <tr key={l.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono font-semibold text-primary">{l.id}</td>
                        <td className="p-3 font-medium">
                          <div>{l.name}</div>
                          <div className="text-[10px] text-muted-foreground">{l.email}</div>
                        </td>
                        <td className="p-3">{l.bookingDate} at {l.timeSlot}</td>
                        <td className="p-3">{l.serviceInterest}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            l.status === "Confirmed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : l.status === "New" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-muted text-muted-foreground"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {validLeads.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No calls recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Open Website Link */}
            <Button variant="outline" className="gap-2" onClick={() => window.open("/", "_blank")}>
              Open Website <ExternalLink className="size-4" />
            </Button>
          </div>
        )}

        {/* MODULE 2: CONSULTATION LEADS MANAGEMENT */}
        {(activeTab === "leads" || activeTab === "calls") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Scheduled Calls</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Website booking requests are saved here. Requests remain pending until your team confirms or cancels them.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCallModalOpen(true)}>
                  <Plus className="size-4 mr-1.5" /> Record Scheduled Call
                </Button>
                <Button variant="brand" onClick={exportLeadsCSV}>
                  <Download className="size-4 mr-1.5" /> Export Leads to CSV
                </Button>
              </div>
            </div>

            {syncError ? (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {syncError}
              </p>
            ) : null}
            {validLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                No scheduled calls yet. Bookings submitted from the website will appear here.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {validLeads.map((lead) => {
                  const status = lead.status === "New" ? "pending"
                    : lead.status === "Confirmed" ? "confirmed"
                      : lead.status === "Cancelled" ? "cancelled"
                        : lead.status;
                  const statusClass = status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : status === "completed"
                      ? "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200"
                      : status === "cancelled"
                        ? "bg-muted text-muted-foreground"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200";
                  return (
                    <article key={lead.id} className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{lead.name || "Unnamed visitor"}</h3>
                          <p className="text-xs text-muted-foreground">{lead.company || "No company"}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                          {status}
                        </span>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <a className="truncate hover:text-primary" href={`mailto:${lead.email}`}>
                          {lead.email || "No email provided"}
                        </a>
                        <a className="hover:text-primary" href={lead.phone ? `tel:${lead.phone}` : undefined}>
                          {lead.phone || "No phone provided"}
                        </a>
                        <span>{lead.bookingDate || "Date not set"}</span>
                        <span>{lead.timeSlot || "Time not set"}</span>
                      </div>
                      <div className="rounded-lg bg-muted/60 p-3 text-sm">
                        <span className="font-medium text-foreground">Topic: </span>
                        {lead.topic || lead.serviceInterest || "General consultation"}
                      </div>
                      {lead.projectBrief || lead.message ? (
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {lead.projectBrief || lead.message}
                        </p>
                      ) : null}
                      <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                        <label className="sr-only" htmlFor={`call-status-${lead.id}`}>Booking status</label>
                        <select
                          id={`call-status-${lead.id}`}
                          value={status}
                          onChange={(event) =>
                            store.updateLeadStatus(
                              lead.id,
                              event.target.value as ConsultationLead["status"],
                              session?.email,
                            )
                          }
                          className="form-field max-w-44 py-2 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          {status === "Contacted" ? <option value="Contacted">Contacted</option> : null}
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete booking from ${lead.name || "visitor"}`}
                          onClick={() => store.deleteLead(lead.id, session?.email)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Scheduled Call</DialogTitle>
                  <DialogDescription>Enter a call arranged outside the website. This record is saved to the CMS for administrator access.</DialogDescription>
                </DialogHeader>
                <form
                  className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-1 sm:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    store.addConsultation(callDraft, session?.email || "admin");
                    setCallModalOpen(false);
                    setCallDraft({
                      bookingDate: new Date().toISOString().slice(0, 10),
                      timeSlot: "",
                      name: "",
                      email: "",
                      phone: "",
                      company: "",
                      serviceInterest: "",
                      budgetRange: "",
                      projectBrief: "",
                    });
                  }}
                >
                  <label className="field-label">
                    Call date
                    <input required type="date" value={callDraft.bookingDate} onChange={(event) => setCallDraft({ ...callDraft, bookingDate: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label">
                    Call time
                    <input required value={callDraft.timeSlot} onChange={(event) => setCallDraft({ ...callDraft, timeSlot: event.target.value })} placeholder="e.g. 10:00 AM" className="form-field" />
                  </label>
                  <label className="field-label">
                    Client name
                    <input required value={callDraft.name} onChange={(event) => setCallDraft({ ...callDraft, name: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label">
                    Email
                    <input required type="email" value={callDraft.email} onChange={(event) => setCallDraft({ ...callDraft, email: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label">
                    Phone
                    <input value={callDraft.phone} onChange={(event) => setCallDraft({ ...callDraft, phone: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label">
                    Company
                    <input value={callDraft.company} onChange={(event) => setCallDraft({ ...callDraft, company: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label">
                    Service interest
                    <input value={callDraft.serviceInterest} onChange={(event) => setCallDraft({ ...callDraft, serviceInterest: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label">
                    Budget range
                    <input value={callDraft.budgetRange} onChange={(event) => setCallDraft({ ...callDraft, budgetRange: event.target.value })} className="form-field" />
                  </label>
                  <label className="field-label sm:col-span-2">
                    Project brief
                    <textarea rows={3} value={callDraft.projectBrief} onChange={(event) => setCallDraft({ ...callDraft, projectBrief: event.target.value })} className="form-field" />
                  </label>
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <Button type="button" variant="outline" onClick={() => setCallModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Call Record</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* MODULE 3: SERVICES & CAPABILITIES CRUD */}
        {activeTab === "services" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Services & Capability Pillars CRUD</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Create, edit, and reorganize Assetify Hub's 3 capability pillars and detailed sub-services.
                </p>
              </div>

              <Button
                variant="brand"
                onClick={() => {
                  setEditingService({
                    id: `srv-${Date.now()}`,
                    slug: "new-service-capability",
                    pillar: "Engineering & Design",
                    title: "New Capability",
                    shortDescription: "Short service description...",
                    fullDescription: "Full service details...",
                    icon: "Code2",
                    items: ["Item 1", "Item 2"],
                    deliverables: ["Deliverable 1"],
                    techTags: ["React", "TypeScript"],
                    isFeatured: true,
                    order: services.length + 1,
                    isVisible: true
                  });
                  setServiceModalOpen(true);
                }}
              >
                <Plus className="size-4 mr-1.5" /> Add New Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-5 rounded-xl border border-border bg-card space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-accent px-2.5 py-1 rounded">
                      {s.pillar}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingService(s);
                          setServiceModalOpen(true);
                        }}
                      >
                        <Edit3 className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => store.deleteService(s.id, session?.email)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{s.shortDescription}</p>

                  <div className="pt-2 border-t border-border flex flex-wrap gap-1">
                    {s.items.slice(0, 3).map((item) => (
                      <span key={item} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 4: TECH STACK MARQUEE CRUD */}
        {activeTab === "tech" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Technology Marquee & Hover Tooltips</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage infinite marquee logos, categories, ordering, and hover glow tooltips.
                </p>
              </div>

              <Button
                variant="brand"
                onClick={() => {
                  setEditingTech({
                    id: `tech-${Date.now()}`,
                    name: "New Technology",
                    category: "Frontend",
                    iconName: "",
                    tooltip: "Enterprise framework tool",
                    order: techStack.length + 1,
                    isVisible: true
                  });
                  setTechModalOpen(true);
                }}
              >
                <Plus className="size-4 mr-1.5" /> Add Tech Item
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="p-3">Order</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Hover Tooltip Text</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {techStack.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{t.order}</td>
                        <td className="p-3 font-semibold text-foreground">{t.name}</td>
                        <td className="p-3">
                          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px]">
                            {t.category}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{t.tooltip}</td>
                        <td className="p-3">
                          <button
                            onClick={() => store.saveTechStack({ ...t, isVisible: !t.isVisible }, session?.email)}
                            className="cursor-pointer"
                          >
                            {t.isVisible ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <Eye className="size-3.5" /> Active
                              </span>
                            ) : (
                              <span className="text-red-500 font-bold flex items-center gap-1">
                                <EyeOff className="size-3.5" /> Hidden
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-right flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingTech(t);
                              setTechModalOpen(true);
                            }}
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => store.deleteTechStack(t.id, session?.email)}
                            className="text-red-500"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 5: PRODUCTS / PORTFOLIO (ULTRA BULB IT TABLE REPLICA) */}
        {(activeTab === "portfolio" || activeTab === "products") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Products</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Showcase of projects you've built.
                </p>
              </div>

              <Button
                variant="brand"
                onClick={openNewProductModal}
                className="bg-[#0b1f3f] hover:bg-[#123163] text-white gap-1.5 shadow-sm"
              >
                <Plus className="size-4" /> Add New
              </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="py-3.5 px-5 font-medium">Title</th>
                      <th className="py-3.5 px-5 font-medium">Service Category</th>
                      <th className="py-3.5 px-5 font-medium">Image URL</th>
                      <th className="py-3.5 px-5 font-medium">Additional Picture URLs (one per line)</th>
                      <th className="py-3.5 px-5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {p.coverImage ? (
                              <img 
                                src={p.coverImage} 
                                alt={p.title} 
                                className="size-11 rounded-lg object-cover border border-border/60 shrink-0" 
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="size-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs shrink-0">
                                No img
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground text-sm truncate">{p.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{p.category || "General"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 max-w-xs">
                          <p className="truncate text-xs text-muted-foreground">
                            {p.summary || "No description provided."}
                          </p>
                        </td>
                        <td className="py-4 px-5">
                          {p.isFeatured ? (
                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-xs text-muted-foreground truncate block max-w-xs">
                            {p.gallery?.length ? (
                              <span className="text-primary font-medium">{p.gallery.length} additional image{p.gallery.length > 1 ? "s" : ""}</span>
                            ) : (
                              "—"
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              onClick={() => store.deleteProject(p.id, session?.email)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                          No products found. Click "+ Add New" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 6: BLOG & NEWS CMS */}
        {activeTab === "blog" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Blog & Engineering Insights CMS</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Create and publish articles with categories, read times, and dynamic markdown content.
                </p>
              </div>

              <Button
                variant="brand"
                onClick={() => {
                  setEditingBlog({
                    id: `blog-${Date.now()}`,
                    slug: "new-tech-article",
                    title: "New Engineering Insight",
                    summary: "Summary of the article...",
                    content: "## Article Content\n\nWrite your insights here...",
                    category: "Engineering",
                    tags: ["Architecture", "TypeScript"],
                    author: { name: "Alexander Wright", role: "VP of Engineering", avatar: "" },
                    readTimeMinutes: 5,
                    publishedAt: new Date().toISOString().split("T")[0],
                    status: "Published",
                    coverImage: "/assets/architecture.jpg",
                    isVisible: true
                  });
                  setBlogModalOpen(true);
                }}
              >
                <Plus className="size-4 mr-1.5" /> Write New Article
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="space-y-4">
                {blogPosts.map((b) => (
                  <div key={b.id} className="p-4 rounded-lg border border-border flex items-center justify-between gap-4 hover:bg-muted/30">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary bg-accent px-2 py-0.5 rounded uppercase">
                          {b.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{b.publishedAt} · {b.readTimeMinutes} min read</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{b.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{b.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingBlog(b);
                          setBlogModalOpen(true);
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => store.deleteBlogPost(b.id, session?.email)}
                        className="text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 7: HOMEPAGE BUILDER & REORDERING */}
        {activeTab === "layout" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Homepage Section Layout & Order</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Reorder sections and toggle public visibility for every block on the Assetify Hub landing page.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              {sectionLayouts.map((sec, index) => (
                <div key={sec.id} className="p-3 rounded-lg border border-border flex items-center justify-between bg-background">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-primary w-6">#{index + 1}</span>
                    <span className="font-semibold text-sm text-foreground">{sec.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...sectionLayouts];
                        const section = updated[index];
                        if (!section) return;
                        updated[index] = { ...section, isVisible: !section.isVisible };
                        store.updateSectionLayouts(updated, session?.email);
                      }}
                      className="text-xs font-semibold px-2.5 py-1 rounded border border-border hover:bg-muted cursor-pointer"
                    >
                      {sec.isVisible ? (
                        <span className="text-emerald-600 flex items-center gap-1"><Eye className="size-3" /> Visible</span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1"><EyeOff className="size-3" /> Hidden</span>
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Move ${sec.title} up`}
                      disabled={index === 0}
                      onClick={() => {
                        const updated = [...sectionLayouts];
                        const current = updated[index];
                        const previous = updated[index - 1];
                        if (!current || !previous) return;
                        [updated[index - 1], updated[index]] = [current, previous];
                        store.updateSectionLayouts(updated.map((item, position) => ({ ...item, order: position + 1 })), session?.email);
                      }}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Move ${sec.title} down`}
                      disabled={index === sectionLayouts.length - 1}
                      onClick={() => {
                        const updated = [...sectionLayouts];
                        const current = updated[index];
                        const next = updated[index + 1];
                        if (!current || !next) return;
                        [updated[index], updated[index + 1]] = [next, current];
                        store.updateSectionLayouts(updated.map((item, position) => ({ ...item, order: position + 1 })), session?.email);
                      }}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 8: SITE SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Global Site Settings</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure brand name, logos, contact information, and social connections.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                store.updateSettings(settings, session?.email);
                alert("Site Settings updated successfully!");
              }}
              className="p-6 rounded-xl border border-border bg-card space-y-4 max-w-2xl"
            >
              <div>
                <label className="field-label">
                  Brand Name
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) => store.updateSettings({ brandName: e.target.value }, session?.email)}
                    className="form-field"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ImageAssetPicker
                  label="Light theme logo"
                  value={settings.logoUrlLight}
                  token={session?.token || ""}
                  onChange={(logoUrlLight) => store.updateSettings({ logoUrlLight: String(logoUrlLight) }, session?.email)}
                />
                <ImageAssetPicker
                  label="Dark theme logo"
                  value={settings.logoUrlDark}
                  token={session?.token || ""}
                  onChange={(logoUrlDark) => store.updateSettings({ logoUrlDark: String(logoUrlDark) }, session?.email)}
                />
                <ImageAssetPicker
                  label="Favicon"
                  value={settings.faviconUrl}
                  token={session?.token || ""}
                  onChange={(faviconUrl) => store.updateSettings({ faviconUrl: String(faviconUrl) }, session?.email)}
                />
              </div>

              <div>
                <label className="field-label">
                  Tagline / Motto
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => store.updateSettings({ tagline: e.target.value }, session?.email)}
                    className="form-field"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">
                    Contact Email Address
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => store.updateSettings({ contactEmail: e.target.value }, session?.email)}
                      className="form-field"
                    />
                  </label>
                </div>
                <div>
                  <label className="field-label">
                    Contact Phone Number
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => store.updateSettings({ contactPhone: e.target.value }, session?.email)}
                      className="form-field"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  WhatsApp number or link
                  <input
                    type="text"
                    value={settings.whatsappContact || ""}
                    onChange={(e) => store.updateSettings({ whatsappContact: e.target.value }, session?.email)}
                    className="form-field"
                    placeholder="+1 555 123 4567 or https://wa.me/15551234567"
                    autoComplete="tel"
                  />
                  <span className="font-normal text-muted-foreground">
                    Include the country code. You can also paste a WhatsApp chat link.
                  </span>
                </label>
                <label className="field-label">
                  Facebook Messenger link or username
                  <input
                    type="text"
                    value={settings.messengerContact || ""}
                    onChange={(e) => store.updateSettings({ messengerContact: e.target.value }, session?.email)}
                    className="form-field"
                    placeholder="https://m.me/yourpage or yourpage"
                    autoComplete="url"
                  />
                  <span className="font-normal text-muted-foreground">
                    Paste a Messenger link or enter your Facebook page username.
                  </span>
                </label>
              </div>

              <div>
                <label className="field-label">
                  Office HQ Address
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => store.updateSettings({ address: e.target.value }, session?.email)}
                    className="form-field"
                  />
                </label>
              </div>

              <Button type="submit" variant="brand">
                Save Site Settings
              </Button>
            </form>
          </div>
        )}

        {/* MODULE 9: MEDIA ASSET LIBRARY */}
        {activeTab === "media" && (
          <div className="animate-in fade-in duration-200">
            <ImageAssetManager token={session?.token || ""} canDeleteImage={(url) => !imageIsReferenced(url)} />
          </div>
        )}

        {/* MODULE 10: USERS & AUDIT LOG */}
        {activeTab === "audit" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Audit Log & Administration History</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time activity logs for all CMS actions and role permissions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30">
                        <td className="p-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-semibold text-primary">{log.userEmail}</td>
                        <td className="p-3 font-mono text-[11px]">{log.action}</td>
                        <td className="p-3 text-foreground">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {isReferenceAdminTab(activeTab) && (
          <ReferenceAdminModules tab={activeTab} user={session?.email ?? "admin@assetify.com"} />
        )}
      </main>

      {/* SERVICE EDIT MODAL */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service Capability</DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-3 text-xs">
              <label className="field-label">
                Service category / title
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Category slug
                <input
                  type="text"
                  value={editingService.slug}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Service category
                <select value={editingService.pillar} onChange={(e) => setEditingService({ ...editingService, pillar: e.target.value })} className="form-field">
                  <option>Engineering &amp; Design</option>
                  <option>Brand &amp; Digital Growth</option>
                  <option>Infrastructure &amp; Security</option>
                </select>
              </label>
              <label className="field-label">
                Short Description
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Full Description
                <textarea rows={3} value={editingService.fullDescription} onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })} className="form-field" />
              </label>
              <label className="field-label">
                Key Offerings (one per line)
                <textarea rows={4} value={editingService.items.join("\n")} onChange={(e) => setEditingService({ ...editingService, items: e.target.value.split(/\r?\n/).map((item: string) => item.trim()).filter(Boolean) })} className="form-field" />
              </label>
              <label className="field-label">
                Deliverables (one per line)
                <textarea rows={3} value={editingService.deliverables.join("\n")} onChange={(e) => setEditingService({ ...editingService, deliverables: e.target.value.split(/\r?\n/).map((item: string) => item.trim()).filter(Boolean) })} className="form-field" />
              </label>
              <label className="field-label">
                Technology tags (comma separated)
                <input value={editingService.techTags.join(", ")} onChange={(e) => setEditingService({ ...editingService, techTags: e.target.value.split(",").map((tag: string) => tag.trim()).filter(Boolean) })} className="form-field" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="field-label">
                  Display order
                  <input type="number" min={1} value={editingService.order} onChange={(e) => setEditingService({ ...editingService, order: Number(e.target.value) })} className="form-field" />
                </label>
                <label className="flex items-center gap-2 pt-6 text-xs font-semibold">
                  <input type="checkbox" checked={editingService.isVisible} onChange={(e) => setEditingService({ ...editingService, isVisible: e.target.checked })} />
                  Show on public site
                </label>
              </div>
              <Button
                variant="brand"
                onClick={() => {
                  store.saveService(editingService, session?.email);
                  setServiceModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* TECH MODAL */}
      <Dialog open={techModalOpen} onOpenChange={setTechModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tech Stack Item</DialogTitle>
          </DialogHeader>
          {editingTech && (
            <div className="space-y-3 text-xs">
              <label className="field-label">
                Technology Name
                <input
                  type="text"
                  value={editingTech.name}
                  onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Simple Icons slug (optional)
                <input
                  type="text"
                  value={editingTech.iconName || ""}
                  onChange={(e) => setEditingTech({ ...editingTech, iconName: e.target.value })}
                  className="form-field"
                  placeholder="react, nextdotjs, nodedotjs, postgresql"
                />
                <span className="font-normal text-muted-foreground">
                  Leave blank to match the logo to the technology name.
                </span>
              </label>
              <label className="field-label">
                Category
                <select
                  value={editingTech.category}
                  onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                  className="form-field"
                >
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Database</option>
                  <option>DevOps &amp; Cloud</option>
                  <option>Mobile</option>
                  <option>Design &amp; Strategy</option>
                </select>
              </label>
              <label className="field-label">
                Display order
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editingTech.order}
                  onChange={(e) => setEditingTech({ ...editingTech, order: Number(e.target.value) })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Hover Tooltip Text
                <input
                  type="text"
                  value={editingTech.tooltip}
                  onChange={(e) => setEditingTech({ ...editingTech, tooltip: e.target.value })}
                  className="form-field"
                />
              </label>
              <Button
                variant="brand"
                onClick={() => {
                  store.saveTechStack(editingTech, session?.email);
                  setTechModalOpen(false);
                }}
              >
                Save Tech Item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* PROJECT MODAL (ULTRA BULB IT ADD PRODUCTS REPLICA) */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {editingProject ? "Edit Product" : "Add Products"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure product details, category, images, tags, and showcase features.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!projectForm.title.trim()) {
                window.alert("Title is required");
                return;
              }
              const titleSlug = projectForm.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              const slug = editingProject?.slug || titleSlug || `product-${Date.now()}`;
              const selectedCat = serviceCategories.find((c) => c.name === projectForm.category || c.id === projectForm.categoryId);

              const savedProject: Project = {
                id: editingProject?.id || `proj-${Date.now()}`,
                slug,
                title: projectForm.title.trim(),
                category: projectForm.category || selectedCat?.name || "General",
                categoryId: selectedCat?.id || projectForm.categoryId || "",
                summary: projectForm.summary.trim(),
                challenge: editingProject?.challenge || "",
                solution: editingProject?.solution || "",
                results: editingProject?.results || [],
                metrics: editingProject?.metrics || [],
                techTags: projectForm.techStackText.split(",").map((s) => s.trim()).filter(Boolean),
                review: projectForm.review.trim(),
                awards: projectForm.awards.trim(),
                accessFeatures: projectForm.accessFeaturesText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
                serviceOwners: projectForm.serviceOwnersText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
                tags: projectForm.tagsText.split(",").map((s) => s.trim()).filter(Boolean),
                link: projectForm.link.trim(),
                coverImage: projectForm.coverImage.trim(),
                gallery: projectForm.galleryText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
                isConcept: editingProject?.isConcept ?? false,
                isFeatured: projectForm.isFeatured,
                order: Number(projectForm.order) || 0,
                isVisible: true,
              };

              store.saveProject(savedProject, session?.email);
              setProjectModalOpen(false);
            }}
          >
            {/* Row 1: Title & Service Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Service Category
                </label>
                <select
                  value={projectForm.category}
                  onChange={(e) =>
                    setProjectForm((f) => ({
                      ...f,
                      category: e.target.value,
                      categoryId: serviceCategories.find((c) => c.name === e.target.value)?.id || "",
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors cursor-pointer"
                >
                  <option value="">Select Service Category</option>
                  {serviceCategories.filter((c) => c.active).map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  {serviceCategories.length === 0 &&
                    ["Healthcare", "E-commerce", "Fintech", "Enterprise SaaS", "AI & Automation", "Mobile App"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Row 2: Image URL with upload dropzone box */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Image URL <span className="text-red-500">*</span>
              </label>

              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6 flex flex-col items-center justify-center gap-2.5 text-center transition-colors hover:border-primary/40">
                {projectForm.coverImage ? (
                  <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-border bg-card shadow-sm mb-1">
                    <img
                      src={projectForm.coverImage}
                      alt="Cover Preview"
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProjectForm((f) => ({ ...f, coverImage: "" }))}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground hover:bg-background text-xs shadow"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="size-8 text-muted-foreground/70 stroke-[1.5]" />
                    <span className="text-xs text-muted-foreground">Choose an image from your computer</span>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="gap-2 text-xs rounded-xl"
                >
                  <Upload className="size-3.5" /> {uploadingImage ? "Uploading..." : "Upload image"}
                </Button>
              </div>

              <input
                type="text"
                placeholder="Or paste an image URL"
                value={projectForm.coverImage}
                onChange={(e) => setProjectForm((f) => ({ ...f, coverImage: e.target.value }))}
                className="w-full mt-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 3: Additional Picture URLs */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Additional Picture URLs (one per line)
              </label>
              <textarea
                rows={3}
                value={projectForm.galleryText}
                onChange={(e) => setProjectForm((f) => ({ ...f, galleryText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 4: Description */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={projectForm.summary}
                onChange={(e) => setProjectForm((f) => ({ ...f, summary: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 5: Tech Stack */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={projectForm.techStackText}
                onChange={(e) => setProjectForm((f) => ({ ...f, techStackText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 6: Client Review */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Client Review
              </label>
              <textarea
                rows={3}
                value={projectForm.review}
                onChange={(e) => setProjectForm((f) => ({ ...f, review: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 7: Awards & Recognition */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Awards & Recognition
              </label>
              <textarea
                rows={3}
                value={projectForm.awards}
                onChange={(e) => setProjectForm((f) => ({ ...f, awards: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 8: Access Features */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Access Features (one per line)
              </label>
              <textarea
                rows={3}
                value={projectForm.accessFeaturesText}
                onChange={(e) => setProjectForm((f) => ({ ...f, accessFeaturesText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 9: Service Owners */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Service Owners
              </label>
              <textarea
                rows={3}
                placeholder="Name - Role (one per line)"
                value={projectForm.serviceOwnersText}
                onChange={(e) => setProjectForm((f) => ({ ...f, serviceOwnersText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 10: Tags */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={projectForm.tagsText}
                onChange={(e) => setProjectForm((f) => ({ ...f, tagsText: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 11: Project Link */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Project Link
              </label>
              <input
                type="url"
                value={projectForm.link}
                onChange={(e) => setProjectForm((f) => ({ ...f, link: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            {/* Row 12: Order & Featured Switch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Order
                </label>
                <input
                  type="number"
                  value={projectForm.order}
                  onChange={(e) => setProjectForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <span className="text-sm font-semibold text-foreground">Featured</span>
                <Switch
                  checked={projectForm.isFeatured}
                  onCheckedChange={(checked) => setProjectForm((f) => ({ ...f, isFeatured: checked }))}
                />
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex justify-end gap-3 pt-5 border-t border-border mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProjectModalOpen(false)}
                className="rounded-xl px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0b1f3f] hover:bg-[#123163] text-white rounded-xl px-6 font-semibold shadow-sm"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* BLOG MODAL */}
      <Dialog open={blogModalOpen} onOpenChange={setBlogModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Article</DialogTitle>
          </DialogHeader>
          {editingBlog && (
            <div className="space-y-3 text-xs">
              <ImageAssetPicker
                label="Article cover image"
                value={editingBlog.coverImage || ""}
                token={session?.token || ""}
                onChange={(coverImage) => setEditingBlog({ ...editingBlog, coverImage: String(coverImage) })}
              />
              <label className="field-label">
                Title
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Summary
                <textarea
                  rows={2}
                  value={editingBlog.summary}
                  onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                  className="form-field"
                />
              </label>
              <label className="field-label">
                Markdown Content
                <textarea
                  rows={6}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="form-field font-mono"
                />
              </label>
              <Button
                variant="brand"
                onClick={() => {
                  store.saveBlogPost(editingBlog, session?.email);
                  setBlogModalOpen(false);
                }}
              >
                Save Article
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
