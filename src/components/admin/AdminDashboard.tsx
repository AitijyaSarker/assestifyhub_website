import { useState } from "react";
import { useCmsStore } from "@/hooks/use-cms-store";
import { useAuth } from "@/hooks/use-auth";
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
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReferenceAdminModules, type AdminModuleTab } from "@/components/admin/ReferenceAdminModules";
import { ImageAssetManager, ImageAssetPicker } from "@/components/admin/ImageAssetPicker";
import type { ConsultationLead, Project } from "@/lib/cms-store";

const isReferenceAdminTab = (tab: string): tab is AdminModuleTab =>
  ["site-content", "vacancies", "gallery", "awards", "time-slots", "reviews", "messages"].includes(tab);

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "site-content" | "settings" | "layout" | "leads" | "services" | "tech" | "portfolio" | "blog" | "nav" | "media" | "audit" | "products" | "vacancies" | "gallery" | "awards" | "time-slots" | "reviews" | "calls" | "messages"
  >("overview");

  const {
    settings,
    siteContent,
    services,
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
  const [searchTerm, setSearchTerm] = useState("");
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

  // CSV Export Helper for Consultation Leads
  const exportLeadsCSV = () => {
    const headers = ["ID,Date,TimeSlot,Name,Email,Phone,Company,Interest,Budget,Status,CreatedAt"];
    const rows = leads.map((l) =>
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

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
            <div className="flex items-center gap-2 font-bold text-lg text-foreground">
              <span className="p-1.5 rounded-lg bg-primary text-white">
                <Sparkles className="size-4" />
              </span>
              Assetify <span className="text-primary">CMS</span>
            </div>
            <a href="/" target="_blank" className="text-muted-foreground hover:text-primary p-1" title="View Public Site">
              <ExternalLink className="size-4" />
            </a>
          </div>

          {/* User Session Info */}
          <div className="mb-6 p-3 rounded-lg bg-accent/50 border border-border/60 flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{session?.name}</div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{session?.role}</div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "site-content", label: "Site Content", icon: FileText },
              { id: "products", label: "Products", icon: Package },
              { id: "services", label: "Service Categories", icon: Code2 },
              { id: "vacancies", label: "Vacancies", icon: Briefcase },
              { id: "gallery", label: "Gallery", icon: ImageIcon },
              { id: "awards", label: "Awards", icon: Award },
              { id: "time-slots", label: "Time Slots", icon: Clock },
              { id: "reviews", label: "Reviews", icon: Star },
              { id: "calls", label: "Scheduled Calls", icon: CalendarCheck, badge: leads.filter(l => l.status === "New").length },
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "tech", label: "Technology Stack", icon: Cpu },
              { id: "portfolio", label: "Portfolio / Cases", icon: FolderKanban },
              { id: "blog", label: "Blog & News", icon: BookOpen },
              { id: "layout", label: "Homepage Builder", icon: Layers },
              { id: "settings", label: "Site Settings", icon: Settings },
              { id: "media", label: "Media Library", icon: ImageIcon },
              { id: "audit", label: "Users & Audit Log", icon: Users }
            ].map((item) => {
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
                  {Boolean(item.badge) && item.badge! > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-border mt-6">
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
              <h2 className="text-2xl font-bold text-foreground">CMS Control Dashboard</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Full visibility control and content management system for <strong className="text-primary">Assetify Hub</strong>.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Scheduled Calls</div>
                <div className="text-2xl font-extrabold text-foreground mt-2">{leads.length}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">{leads.filter(l => l.status === "New").length} New Requests</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Active Services</div>
                <div className="text-2xl font-extrabold text-foreground mt-2">{services.length}</div>
                <div className="text-[11px] text-primary font-medium mt-1">{services.filter((service) => service.isVisible).length} Visible</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Tech Stack Items</div>
                <div className="text-2xl font-extrabold text-foreground mt-2">{techStack.length}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-1">Marquee Hover Enabled</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="text-xs font-semibold text-muted-foreground uppercase">Products & Projects</div>
                <div className="text-2xl font-extrabold text-foreground mt-2">{projects.length}</div>
                  <div className="text-[11px] text-amber-600 font-medium mt-1">{projects.filter((project) => project.isConcept).length} Illustrative Concepts</div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Open Vacancies", value: jobs.filter((job) => job.isVisible).length, tab: "vacancies" },
                  { label: "Gallery Items", value: gallery.filter((item) => item.isVisible).length, tab: "gallery" },
                  { label: "Awards", value: awards.filter((award) => award.isVisible).length, tab: "awards" },
                  { label: "Approved Reviews", value: reviews.filter((review) => review.approved).length, tab: "reviews" },
                  { label: "Available Time Slots", value: timeSlots.filter((slot) => slot.isAvailable).length, tab: "time-slots" },
                  { label: "Unread Messages", value: messages.filter((message) => !message.read).length, tab: "messages" },
                  { label: "Landing Page Sections", value: sectionLayouts.filter((section) => section.isVisible).length, tab: "layout" },
                  { label: "Editable Content Fields", value: Object.keys(siteContent).length, tab: "site-content" },
                ].map((item) => (
                  <button key={item.label} onClick={() => setActiveTab(item.tab as typeof activeTab)} className="rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">{item.label}</span>
                    <span className="mt-2 block text-2xl font-extrabold text-foreground">{item.value}</span>
                    <span className="mt-1 block text-[11px] text-primary">Manage</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Leads Table Overview */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Recent Consultation Requests</h3>
                <Button variant="clean" size="sm" onClick={() => setActiveTab("leads")}>
                  View All Leads →
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
                    {leads.slice(0, 4).map((l) => (
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
                            l.status === "Confirmed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: CONSULTATION LEADS MANAGEMENT */}
        {(activeTab === "leads" || activeTab === "calls") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Consultations & Lead Management</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Record and manage calls arranged outside the site. Public enquiries open an email draft and do not arrive here automatically.
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

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="p-3">Date / Time</th>
                      <th className="p-3">Client Name</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Interest</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <div>{l.bookingDate}</div>
                          <div className="text-[10px] text-primary">{l.timeSlot}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{l.name}</div>
                          <div className="text-[10px] text-muted-foreground">{l.email}</div>
                        </td>
                        <td className="p-3">{l.company || "N/A"}</td>
                        <td className="p-3 font-medium">{l.serviceInterest}</td>
                        <td className="p-3 text-muted-foreground">{l.budgetRange}</td>
                        <td className="p-3">
                          <select
                            value={l.status}
                            onChange={(e) => store.updateLeadStatus(l.id, e.target.value as any, session?.email)}
                            className="form-field py-1 text-xs"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => store.deleteLead(l.id, session?.email)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No calls recorded. Public enquiries are not automatically sent to this browser.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Scheduled Call</DialogTitle>
                  <DialogDescription>Enter a call arranged outside the website. This record is saved only in this browser.</DialogDescription>
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
                  <ImageAssetPicker
                    label="Article cover image"
                    value={editingBlog.coverImage}
                    token={session?.token || ""}
                    onChange={(coverImage) => setEditingBlog({ ...editingBlog, coverImage })}
                  />
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

        {/* MODULE 5: PORTFOLIO & CASE STUDIES CRUD */}
        {(activeTab === "portfolio" || activeTab === "products") && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Products & Portfolio</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage product categories, images, descriptions, technology, reviews, awards, access features, owners, tags, links, and publication.
                </p>
              </div>

              <Button
                variant="brand"
                onClick={() => {
                  setEditingProject({
                    id: `proj-${Date.now()}`,
                    slug: "",
                    title: "",
                    category: "",
                    categoryId: "",
                    summary: "",
                    challenge: "",
                    solution: "",
                    results: [],
                    metrics: [],
                    techTags: [],
                    review: "",
                    awards: "",
                    accessFeatures: [],
                    serviceOwners: [],
                    tags: [],
                    link: "",
                    coverImage: "",
                    gallery: [],
                    isConcept: false,
                    isFeatured: false,
                    order: projects.length + 1,
                    isVisible: true
                  });
                  setProjectModalOpen(true);
                }}
              >
                <Plus className="size-4 mr-1.5" /> Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="p-5 rounded-xl border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-accent px-2.5 py-1 rounded">
                      {p.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingProject(p);
                          setProjectModalOpen(true);
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => store.deleteProject(p.id, session?.email)}
                        className="text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.summary}</p>

                  <div className="grid grid-cols-3 gap-2 py-2">
                    {p.metrics.map((m, idx) => (
                      <div key={idx} className="p-2 rounded bg-muted/50 text-center">
                        <div className="font-bold text-xs text-primary">{m.value}</div>
                        <div className="text-[10px] text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
      {/* PROJECT MODAL */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject && projects.some((project) => project.id === editingProject.id) ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>
              Build a complete product showcase with its service category, images, technology, and project details.
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                const matchedService = services.find((service) => service.pillar === editingProject.category);
                const titleSlug = editingProject.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                const slug = editingProject.slug.trim() || titleSlug || `product-${Date.now()}`;
                if (projects.some((project) => project.slug === slug && project.id !== editingProject.id)) {
                  window.alert("That URL slug is already in use. Choose a unique slug before saving.");
                  return;
                }
                const { categoryId: existingCategoryId, ...projectFields } = editingProject;
                const savedProject: Project = {
                  ...projectFields,
                  slug,
                  category: editingProject.categoryId?.startsWith("custom:")
                    ? editingProject.categoryId.slice(7)
                    : editingProject.category,
                  ...(matchedService?.id || existingCategoryId
                    ? { categoryId: matchedService?.id || existingCategoryId }
                    : {}),
                  results: editingProject.results ?? [],
                  metrics: editingProject.metrics ?? [],
                  techTags: editingProject.techTags ?? [],
                  accessFeatures: editingProject.accessFeatures ?? [],
                  serviceOwners: editingProject.serviceOwners ?? [],
                  tags: editingProject.tags ?? [],
                  gallery: editingProject.gallery ?? [],
                };
                store.saveProject(savedProject, session?.email);
                setProjectModalOpen(false);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Title <span className="text-destructive">*</span>
                  <input required value={editingProject.title} onChange={(event) => setEditingProject({ ...editingProject, title: event.target.value })} className="form-field" />
                </label>
                <label className="field-label">
                  Service Category
                  <select
                    required
                    value={editingProject.categoryId?.startsWith("custom:") ? "Other" : editingProject.category}
                    onChange={(event) => setEditingProject({ ...editingProject, category: event.target.value, categoryId: services.find((service) => service.pillar === event.target.value)?.id || "" })}
                    className="form-field"
                  >
                    {!editingProject.category || !services.some((service) => service.pillar === editingProject.category) ? <option value={editingProject.category}>{editingProject.category || "Select Service Category"}</option> : null}
                    {[...new Set(services.map((service) => service.pillar))].map((category) => <option key={category} value={category}>{category}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </label>
                {editingProject.category === "Other" || editingProject.categoryId?.startsWith("custom:") ? (
                  <label className="field-label sm:col-span-2">
                    Custom Category
                    <input required value={editingProject.categoryId?.startsWith("custom:") ? editingProject.categoryId.slice(7) : ""} onChange={(event) => setEditingProject({ ...editingProject, category: "Other", categoryId: `custom:${event.target.value}` })} className="form-field" />
                  </label>
                ) : null}
                <label className="field-label">
                  URL Slug
                  <input value={editingProject.slug} onChange={(event) => setEditingProject({ ...editingProject, slug: event.target.value })} className="form-field" placeholder="generated-from-title" />
                </label>
                <label className="field-label">
                  Order
                  <input type="number" value={editingProject.order} onChange={(event) => setEditingProject({ ...editingProject, order: Number(event.target.value) || 0 })} className="form-field" />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <ImageAssetPicker
                    label="Image URL * — select or upload an image"
                    value={editingProject.coverImage}
                    token={session?.token || ""}
                    onChange={(coverImage) => setEditingProject({ ...editingProject, coverImage: String(coverImage) })}
                  />
                  <label className="field-label">
                    Or paste an image URL
                    <input required type="url" value={editingProject.coverImage} onChange={(event) => setEditingProject({ ...editingProject, coverImage: event.target.value })} className="form-field" placeholder="https://…" />
                  </label>
                </div>
                <div className="space-y-3">
                  <ImageAssetPicker
                    label="Additional Pictures"
                    value={editingProject.gallery ?? []}
                    multiple
                    token={session?.token || ""}
                    onChange={(gallery) => setEditingProject({ ...editingProject, gallery: Array.isArray(gallery) ? gallery : [gallery] })}
                  />
                  <label className="field-label">
                    Additional Picture URLs (one per line)
                    <textarea rows={3} value={(editingProject.gallery ?? []).join("\n")} onChange={(event) => setEditingProject({ ...editingProject, gallery: event.target.value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean) })} className="form-field" placeholder="https://…" />
                  </label>
                </div>
              </div>

              <label className="field-label">
                Description <span className="text-destructive">*</span>
                <textarea required rows={4} value={editingProject.summary} onChange={(event) => setEditingProject({ ...editingProject, summary: event.target.value })} className="form-field" />
              </label>

              <label className="field-label">
                Tech Stack (comma-separated)
                <input value={(editingProject.techTags ?? []).join(", ")} onChange={(event) => setEditingProject({ ...editingProject, techTags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} className="form-field" placeholder="React, TypeScript, MongoDB" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Client Review
                  <textarea rows={3} value={editingProject.review ?? ""} onChange={(event) => setEditingProject({ ...editingProject, review: event.target.value })} className="form-field" />
                </label>
                <label className="field-label">
                  Awards & Recognition
                  <textarea rows={3} value={editingProject.awards ?? ""} onChange={(event) => setEditingProject({ ...editingProject, awards: event.target.value })} className="form-field" />
                </label>
                <label className="field-label">
                  Access Features (one per line)
                  <textarea rows={3} value={(editingProject.accessFeatures ?? []).join("\n")} onChange={(event) => setEditingProject({ ...editingProject, accessFeatures: event.target.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) })} className="form-field" />
                </label>
                <label className="field-label">
                  Service Owners (one per line: Name - Role)
                  <textarea rows={3} value={(editingProject.serviceOwners ?? []).join("\n")} onChange={(event) => setEditingProject({ ...editingProject, serviceOwners: event.target.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) })} className="form-field" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Tags (comma-separated)
                  <input value={(editingProject.tags ?? []).join(", ")} onChange={(event) => setEditingProject({ ...editingProject, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} className="form-field" />
                </label>
                <label className="field-label">
                  Project Link
                  <input type="url" value={editingProject.link ?? ""} onChange={(event) => setEditingProject({ ...editingProject, link: event.target.value })} className="form-field" placeholder="https://…" />
                </label>
                <label className="field-label">
                  Challenge
                  <textarea rows={3} value={editingProject.challenge} onChange={(event) => setEditingProject({ ...editingProject, challenge: event.target.value })} className="form-field" />
                </label>
                <label className="field-label">
                  Solution & Architecture
                  <textarea rows={3} value={editingProject.solution} onChange={(event) => setEditingProject({ ...editingProject, solution: event.target.value })} className="form-field" />
                </label>
                <label className="field-label">
                  Results (one per line)
                  <textarea rows={3} value={(editingProject.results ?? []).join("\n")} onChange={(event) => setEditingProject({ ...editingProject, results: event.target.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) })} className="form-field" />
                </label>
                <label className="field-label">
                  Metrics (one per line: Label | Value)
                  <textarea rows={3} value={(editingProject.metrics ?? []).map((metric) => `${metric.label} | ${metric.value}`).join("\n")} onChange={(event) => setEditingProject({ ...editingProject, metrics: event.target.value.split(/\r?\n/).map((line) => line.split("|").map((part) => part.trim())).filter((parts) => parts.length === 2 && parts.every(Boolean)).map(([label, value]) => ({ label: label || "", value: value || "" })) })} className="form-field" />
                </label>
              </div>

              <div className="flex flex-wrap gap-6 rounded-lg border border-border p-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={editingProject.isFeatured} onChange={(event) => setEditingProject({ ...editingProject, isFeatured: event.target.checked })} />
                  Featured product
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={editingProject.isVisible} onChange={(event) => setEditingProject({ ...editingProject, isVisible: event.target.checked })} />
                  Publish on website
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={editingProject.isConcept} onChange={(event) => setEditingProject({ ...editingProject, isConcept: event.target.checked })} />
                  Illustrative concept
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setProjectModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="brand">Save Product</Button>
              </div>
            </form>
          )}
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
