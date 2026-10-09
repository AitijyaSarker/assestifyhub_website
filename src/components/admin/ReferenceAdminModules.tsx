import { useState, type FormEvent } from "react";
import { Check, Eye, EyeOff, Mail, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageAssetPicker } from "@/components/admin/ImageAssetPicker";
import { useAuth } from "@/hooks/use-auth";
import { useCmsStore } from "@/hooks/use-cms-store";
import type {
  Award,
  AvailabilitySlot,
  ContactMessage,
  GalleryItem,
  JobPosition,
  Review,
  ServiceCategory,
  SiteContent,
} from "@/lib/cms-store";
import { cmsStore } from "@/lib/cms-store";

export type AdminModuleTab =
  | "site-content"
  | "service-categories"
  | "vacancies"
  | "gallery"
  | "awards"
  | "time-slots"
  | "reviews"
  | "messages";
type AdminTab = AdminModuleTab;
type Draft = Record<string, string | number | boolean>;
type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox";
  required?: boolean;
};

const CONTENT_FIELDS: Field[] = [
  { key: "heroEyebrow", label: "Hero eyebrow" },
  { key: "heroHeadline", label: "Hero headline" },
  { key: "heroCopy", label: "Hero introduction", type: "textarea" },
  { key: "aboutTitle", label: "Company section title" },
  { key: "aboutCopy", label: "Company introduction", type: "textarea" },
  { key: "servicesTitle", label: "Services section title" },
  { key: "scopeTitle", label: "Scope planner title" },
  { key: "scopeCopy", label: "Scope planner introduction", type: "textarea" },
  { key: "whyTitle", label: "Why choose us title" },
  { key: "whyCopy", label: "Why choose us introduction", type: "textarea" },
  { key: "whyItems", label: "Why-us cards (one per line: title | description)", type: "textarea" },
  { key: "processTitle", label: "Process section title" },
  { key: "processSteps", label: "Process steps (one per line: number | stage | title | description)", type: "textarea" },
  { key: "productsTitle", label: "Products section title" },
  { key: "galleryTitle", label: "Gallery section title" },
  { key: "awardsTitle", label: "Awards section title" },
  { key: "reviewsTitle", label: "Reviews section title" },
  { key: "careersTitle", label: "Careers section title" },
  { key: "faqTitle", label: "FAQ section title" },
  { key: "faqs", label: "FAQs (one per line: question | answer)", type: "textarea" },
  { key: "closingTitle", label: "Closing call to action" },
  { key: "closingCopy", label: "Closing call to action description", type: "textarea" },
];

const MESSAGE_FIELDS: Field[] = [
  { key: "name", label: "Sender name", required: true },
  { key: "email", label: "Email address", required: true },
  { key: "phone", label: "Phone number" },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message", type: "textarea", required: true },
  { key: "read", label: "Mark as read", type: "checkbox" },
];

const COLLECTION_FIELDS: Record<Exclude<AdminTab, "site-content" | "messages">, Field[]> = {
  "service-categories": [
    { key: "name", label: "Category name", required: true },
    { key: "slug", label: "URL slug", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "order", label: "Display order", type: "number" },
    { key: "active", label: "Visible in navigation & services", type: "checkbox" },
  ],
  vacancies: [
    { key: "title", label: "Role title", required: true },
    { key: "department", label: "Department", required: true },
    { key: "location", label: "Location" },
    { key: "type", label: "Employment type" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "requirements", label: "Requirements (one per line)", type: "textarea" },
    { key: "isVisible", label: "Publish opening", type: "checkbox" },
  ],
  gallery: [
    { key: "title", label: "Image title", required: true },
    { key: "image", label: "Image", required: true },
    { key: "altText", label: "Accessible alt text" },
    { key: "caption", label: "Caption" },
    { key: "order", label: "Display order", type: "number" },
    { key: "isVisible", label: "Show on landing page", type: "checkbox" },
  ],
  awards: [
    { key: "title", label: "Recognition title", required: true },
    { key: "image", label: "Award image" },
    { key: "issuer", label: "Awarding organization" },
    { key: "year", label: "Year" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "order", label: "Display order", type: "number" },
    { key: "isVisible", label: "Show on landing page", type: "checkbox" },
  ],
  "time-slots": [
    { key: "label", label: "Available time label", required: true },
    { key: "value", label: "Value (e.g. 09:00)", required: true },
    { key: "order", label: "Display order", type: "number" },
    { key: "isAvailable", label: "Available for enquiries", type: "checkbox" },
  ],
  reviews: [
    { key: "name", label: "Reviewer name", required: true },
    { key: "company", label: "Company" },
    { key: "role", label: "Role" },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "message", label: "Review", type: "textarea", required: true },
    { key: "approved", label: "Publish review", type: "checkbox" },
  ],
};

const TAB_DETAILS: Record<AdminTab, { title: string; description: string }> = {
  "site-content": {
    title: "Site Content",
    description: "Edit the landing-page messages and section headings shown to visitors.",
  },
  "service-categories": {
    title: "Service Categories",
    description: "Categories shown in the Services navbar menu and assigned to products.",
  },
  vacancies: {
    title: "Vacancies",
    description: "Publish and maintain the open roles shown on the landing page.",
  },
  gallery: {
    title: "Gallery",
    description: "Manage images, captions, accessibility text, visibility, and display order.",
  },
  awards: {
    title: "Awards",
    description: "Manage recognition displayed on the public landing page.",
  },
  "time-slots": {
    title: "Time Slots",
    description: "Manage the consultation times visitors can select.",
  },
  reviews: {
    title: "Reviews",
    description: "Add and approve reviews before they appear publicly.",
  },
  messages: {
    title: "Messages",
    description: "Keep a local record of enquiries received outside the site.",
  },
};
const COLLECTION_LABELS: Record<Exclude<AdminTab, "site-content">, string> = {
  "service-categories": "Service Category",
  vacancies: "Vacancy",
  gallery: "Gallery Item",
  awards: "Award",
  "time-slots": "Time Slot",
  reviews: "Review",
  messages: "Message",
};

const toDraft = (value: object, fields: Field[]): Draft => {
  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    fields.map(({ key }) => [key, (source[key] as string | number | boolean) ?? ""]),
  );
};

const contentToDraft = (content: SiteContent): Draft => ({
  ...content,
  whyItems: content.whyItems.map((item) => `${item.title} | ${item.desc}`).join("\n"),
  processSteps: content.processSteps
    .map((step) => `${step.number} | ${step.step} | ${step.title} | ${step.desc}`)
    .join("\n"),
  faqs: content.faqs.map((faq) => `${faq.question} | ${faq.answer}`).join("\n"),
});

const parseContentRows = (value: unknown, columns: number) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length === columns && parts.every(Boolean));

const newDraft = (tab: AdminTab, content: SiteContent): Draft => {
  if (tab === "site-content") return contentToDraft(content);
  const defaults: Record<Exclude<AdminTab, "site-content">, Draft> = {
    "service-categories": {
      name: "",
      slug: "",
      description: "",
      order: 1,
      active: true,
    },
    vacancies: {
      title: "",
      department: "",
      location: "Remote",
      type: "Full-Time",
      description: "",
      requirements: "",
      isVisible: false,
    },
    gallery: { title: "", image: "", altText: "", caption: "", order: 1, isVisible: false },
    awards: { title: "", image: "", issuer: "", year: "", description: "", order: 1, isVisible: false },
    "time-slots": { label: "", value: "09:00", order: 1, isAvailable: true },
    reviews: { name: "", company: "", role: "", rating: 5, message: "", approved: false },
    messages: { name: "", email: "", phone: "", subject: "", message: "", read: false },
  };
  return { ...defaults[tab] };
};

export function ReferenceAdminModules({ tab, user }: { tab: AdminTab; user?: string }) {
  const { siteContent, jobs, gallery, awards, reviews, timeSlots, messages, serviceCategories } = useCmsStore();
  const { session } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(() =>
    tab === "site-content" ? contentToDraft(siteContent) : {},
  );
  const [formOpen, setFormOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved">("all");
  const [messageFilter, setMessageFilter] = useState<"all" | "unread">("all");
  const details = TAB_DETAILS[tab];
  const isCollection = tab !== "site-content";
  const fields =
    tab === "site-content"
      ? CONTENT_FIELDS
      : tab === "messages"
        ? MESSAGE_FIELDS
        : COLLECTION_FIELDS[tab];

  const records = (() => {
    switch (tab) {
      case "service-categories":
        return serviceCategories.map((item) => ({
          id: item.id,
          title: item.name,
          detail: `${item.slug} · ${item.description || "No description"} (Order: ${item.order})`,
          visible: item.active,
          item,
        }));
      case "vacancies":
        return jobs.map((item) => ({
          id: item.id,
          title: item.title,
          detail: `${item.department} · ${item.location} · ${item.hiring ? "Hiring" : "Closed"}`,
          visible: item.isVisible,
          item,
        }));
      case "gallery":
        return gallery.map((item) => ({
          id: item.id,
          title: item.title,
          detail: item.caption || item.image,
          visible: item.isVisible,
          item,
        }));
      case "awards":
        return awards.map((item) => ({
          id: item.id,
          title: item.title,
          detail: [item.issuer, item.year].filter(Boolean).join(" · "),
          visible: item.isVisible,
          item,
        }));
      case "time-slots":
        return timeSlots.map((item) => ({
          id: item.id,
          title: item.label,
          detail: `Value: ${item.value || "-"} · Display order ${item.order}`,
          visible: item.isAvailable,
          item,
        }));
      case "reviews": {
        const filtered = reviews.filter((r) => {
          if (reviewFilter === "pending") return !r.approved;
          if (reviewFilter === "approved") return r.approved;
          return true;
        });
        return filtered.map((item) => ({
          id: item.id,
          title: item.name,
          detail: `★ ${item.rating}/5 · ${item.company || "No company"} (${item.role || "Client"}) · "${item.message}"`,
          visible: item.approved,
          item,
        }));
      }
      case "messages": {
        const filtered = messages.filter((m) => {
          if (messageFilter === "unread") return !m.read;
          return true;
        });
        return filtered.map((item) => ({
          id: item.id,
          title: item.subject || item.name,
          detail: `${item.name} (${item.email}${item.phone ? `, ${item.phone}` : ""}) · ${item.message}`,
          visible: item.read,
          item,
        }));
      }
      case "site-content":
        return [];
    }
  })();

  const openNew = () => {
    setEditingId(null);
    setDraft(newDraft(tab, siteContent));
    setFormOpen(true);
  };

  const openEdit = (record: (typeof records)[number]) => {
    setEditingId(record.id);
    setDraft(toDraft(record.item, fields));
    setFormOpen(true);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tab === "site-content") {
      const content: SiteContent = {
        ...siteContent,
        heroEyebrow: String(draft["heroEyebrow"] ?? ""),
        heroHeadline: String(draft["heroHeadline"] ?? ""),
        heroCopy: String(draft["heroCopy"] ?? ""),
        aboutTitle: String(draft["aboutTitle"] ?? ""),
        aboutCopy: String(draft["aboutCopy"] ?? ""),
        servicesTitle: String(draft["servicesTitle"] ?? ""),
        scopeTitle: String(draft["scopeTitle"] ?? ""),
        scopeCopy: String(draft["scopeCopy"] ?? ""),
        whyTitle: String(draft["whyTitle"] ?? ""),
        whyCopy: String(draft["whyCopy"] ?? ""),
        whyItems: parseContentRows(draft["whyItems"], 2).map(([title, desc]) => ({
          title: title || "",
          desc: desc || "",
        })),
        processTitle: String(draft["processTitle"] ?? ""),
        processSteps: parseContentRows(draft["processSteps"], 4).map(([number, step, title, desc]) => ({
          number: number || "",
          step: step || "",
          title: title || "",
          desc: desc || "",
        })),
        productsTitle: String(draft["productsTitle"] ?? ""),
        galleryTitle: String(draft["galleryTitle"] ?? ""),
        awardsTitle: String(draft["awardsTitle"] ?? ""),
        reviewsTitle: String(draft["reviewsTitle"] ?? ""),
        careersTitle: String(draft["careersTitle"] ?? ""),
        faqTitle: String(draft["faqTitle"] ?? ""),
        faqs: parseContentRows(draft["faqs"], 2).map(([question, answer]) => ({
          question: question || "",
          answer: answer || "",
        })),
        closingTitle: String(draft["closingTitle"] ?? ""),
        closingCopy: String(draft["closingCopy"] ?? ""),
      };
      cmsStore.updateSiteContent(content, user);
    } else if (tab === "service-categories") {
      const item: ServiceCategory = {
        id: editingId || `cat-${Date.now()}`,
        name: String(draft["name"] || ""),
        slug: String(draft["slug"] || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: String(draft["description"] || ""),
        order: Number(draft["order"]) || 1,
        active: Boolean(draft["active"]),
      };
      cmsStore.saveServiceCategory(item, user);
    } else if (tab === "vacancies") {
      const requirements = String(draft["requirements"] || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const job: JobPosition = {
        id: editingId || `job-${Date.now()}`,
        title: String(draft["title"] || ""),
        department: String(draft["department"] || ""),
        location: String(draft["location"] || ""),
        type: (["Full-Time", "Contract", "Part-Time"].includes(String(draft["type"]))
          ? draft["type"]
          : "Full-Time") as JobPosition["type"],
        description: String(draft["description"] || ""),
        requirements,
        isVisible: Boolean(draft["isVisible"]),
        hiring: Boolean(draft["isVisible"]),
        order: 1,
      };
      cmsStore.saveJob(job, user);
    } else if (tab === "gallery") {
      const item: GalleryItem = {
        id: editingId || `gallery-${Date.now()}`,
        title: String(draft["title"] || ""),
        image: String(draft["image"] || ""),
        altText: String(draft["altText"] || ""),
        caption: String(draft["caption"] || ""),
        order: Number(draft["order"]) || 1,
        isVisible: Boolean(draft["isVisible"]),
      };
      cmsStore.saveGalleryItem(item, user);
    } else if (tab === "awards") {
      const item: Award = {
        id: editingId || `award-${Date.now()}`,
        title: String(draft["title"] || ""),
        image: String(draft["image"] || ""),
        issuer: String(draft["issuer"] || ""),
        year: String(draft["year"] || ""),
        description: String(draft["description"] || ""),
        order: Number(draft["order"]) || 1,
        isVisible: Boolean(draft["isVisible"]),
      };
      cmsStore.saveAward(item, user);
    } else if (tab === "time-slots") {
      const item: AvailabilitySlot = {
        id: editingId || `slot-${Date.now()}`,
        label: String(draft["label"] || ""),
        value: String(draft["value"] || "09:00"),
        order: Number(draft["order"]) || 1,
        isAvailable: Boolean(draft["isAvailable"]),
        active: Boolean(draft["isAvailable"]),
      };
      cmsStore.saveTimeSlot(item, user);
    } else if (tab === "reviews") {
      const item: Review = {
        id: editingId || `review-${Date.now()}`,
        name: String(draft["name"] || ""),
        company: String(draft["company"] || ""),
        role: String(draft["role"] || ""),
        rating: Math.min(5, Math.max(1, Number(draft["rating"]) || 5)),
        message: String(draft["message"] || ""),
        approved: Boolean(draft["approved"]),
        createdAt: new Date().toISOString(),
      };
      cmsStore.saveReview(item, user);
    } else if (tab === "messages") {
      const item: ContactMessage = {
        id: editingId || `message-${Date.now()}`,
        name: String(draft["name"] || ""),
        email: String(draft["email"] || ""),
        phone: String(draft["phone"] || ""),
        subject: String(draft["subject"] || ""),
        message: String(draft["message"] || ""),
        read: Boolean(draft["read"]),
        createdAt: new Date().toISOString(),
      };
      cmsStore.saveMessage(item, user);
    }
    setFormOpen(false);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    switch (tab) {
      case "service-categories":
        cmsStore.deleteServiceCategory(id, user);
        break;
      case "vacancies":
        cmsStore.deleteJob(id, user);
        break;
      case "gallery":
        cmsStore.deleteGalleryItem(id, user);
        break;
      case "awards":
        cmsStore.deleteAward(id, user);
        break;
      case "time-slots":
        cmsStore.deleteTimeSlot(id, user);
        break;
      case "reviews":
        cmsStore.deleteReview(id, user);
        break;
      case "messages":
        cmsStore.deleteMessage(id, user);
        break;
      case "site-content":
        break;
    }
  };

  const toggleRecord = (id: string, enabled: boolean) => {
    if (tab === "service-categories") {
      const cat = serviceCategories.find((entry) => entry.id === id);
      if (cat) cmsStore.saveServiceCategory({ ...cat, active: enabled }, user);
    } else if (tab === "vacancies") {
      const job = jobs.find((entry) => entry.id === id);
      if (job) cmsStore.saveJob({ ...job, isVisible: enabled }, user);
    } else if (tab === "gallery") {
      const item = gallery.find((entry) => entry.id === id);
      if (item) cmsStore.saveGalleryItem({ ...item, isVisible: enabled }, user);
    } else if (tab === "awards") {
      const item = awards.find((entry) => entry.id === id);
      if (item) cmsStore.saveAward({ ...item, isVisible: enabled }, user);
    } else if (tab === "time-slots") {
      const item = timeSlots.find((entry) => entry.id === id);
      if (item) cmsStore.saveTimeSlot({ ...item, isAvailable: enabled, active: enabled }, user);
    } else if (tab === "reviews") {
      const item = reviews.find((entry) => entry.id === id);
      if (item) cmsStore.saveReview({ ...item, approved: enabled }, user);
    } else if (tab === "messages") {
      cmsStore.markMessageRead(id, enabled, user);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{details.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{details.description}</p>
        </div>
        {isCollection && tab !== "messages" ? (
          <Button onClick={openNew} className="gap-2">
            <Plus className="size-4" /> Add {COLLECTION_LABELS[tab]}
          </Button>
        ) : null}
        {tab === "messages" ? (
          <Button onClick={openNew} className="gap-2">
            <Plus className="size-4" /> Record Message
          </Button>
        ) : null}
      </header>

      {tab === "reviews" && (
        <div className="flex gap-2 border-b border-border pb-3">
          {(["all", "pending", "approved"] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={reviewFilter === mode ? "default" : "outline"}
              onClick={() => setReviewFilter(mode)}
              className="capitalize text-xs"
            >
              {mode} ({mode === "all" ? reviews.length : mode === "pending" ? reviews.filter((r) => !r.approved).length : reviews.filter((r) => r.approved).length})
            </Button>
          ))}
        </div>
      )}

      {tab === "messages" && (
        <div className="flex gap-2 border-b border-border pb-3">
          {(["all", "unread"] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={messageFilter === mode ? "default" : "outline"}
              onClick={() => setMessageFilter(mode)}
              className="capitalize text-xs"
            >
              {mode} ({mode === "all" ? messages.length : messages.filter((m) => !m.read).length})
            </Button>
          ))}
        </div>
      )}

      {tab === "site-content" ? (
        <form
          onSubmit={save}
          className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2"
        >
          {CONTENT_FIELDS.map((field) => (
            <label
              key={field.key}
              className={`field-label ${field.type === "textarea" ? "md:col-span-2" : ""}`}
            >
              {field.label}
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={String(draft[field.key] ?? "")}
                  onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                  className="form-field"
                />
              ) : (
                <input
                  value={String(draft[field.key] ?? "")}
                  onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                  className="form-field"
                />
              )}
            </label>
          ))}
          <div className="md:col-span-2">
            <Button type="submit">Save Site Content</Button>
          </div>
        </form>
      ) : records.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {tab === "messages"
            ? "No messages yet. Visitor chat and contact enquiries will appear here."
            : `No ${details.title.toLowerCase()} yet. Add an item when you have real content to publish.`}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {records.map((record) => (
              <article
                key={record.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground">{record.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{record.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {tab === "messages" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRecord(record.id, !record.visible)}
                    >
                      <Mail className="mr-1.5 size-4" />{" "}
                      {record.visible ? "Mark unread" : "Mark read"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRecord(record.id, !record.visible)}
                    >
                      {record.visible ? (
                        <Eye className="mr-1.5 size-4" />
                      ) : (
                        <EyeOff className="mr-1.5 size-4" />
                      )}
                      {record.visible
                        ? tab === "reviews"
                          ? "Approved"
                          : "Visible"
                        : tab === "reviews"
                          ? "Pending"
                          : "Hidden"}
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${record.title}`}
                    onClick={() => openEdit(record)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${record.title}`}
                    onClick={() => remove(record.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {formOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setFormOpen(false);
          }}
        >
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingId ? "Edit" : "Add"}{" "}
                {COLLECTION_LABELS[tab as Exclude<AdminTab, "site-content">]}
              </h2>
              <Button type="button" size="sm" variant="ghost" onClick={() => setFormOpen(false)}>
                Close
              </Button>
            </div>
            {fields.map((field) =>
              (tab === "gallery" && field.key === "image") || (tab === "awards" && field.key === "image") ? (
                <ImageAssetPicker
                  key={field.key}
                  label={field.label}
                  value={String(draft[field.key] ?? "")}
                  token={session?.token || ""}
                  onChange={(image) => setDraft({ ...draft, [field.key]: String(image) })}
                />
              ) : field.type === "checkbox" ? (
                <label
                  key={field.key}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(draft[field.key])}
                    onChange={(event) => setDraft({ ...draft, [field.key]: event.target.checked })}
                  />
                  {field.label}
                </label>
              ) : (
                <label key={field.key} className="field-label">
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      required={field.required}
                      rows={4}
                      value={String(draft[field.key] ?? "")}
                      onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                      className="form-field"
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={field.type === "number" ? "number" : "text"}
                      min={field.key === "rating" ? 1 : undefined}
                      max={field.key === "rating" ? 5 : undefined}
                      value={String(draft[field.key] ?? "")}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          [field.key]:
                            field.type === "number"
                              ? Number(event.target.value)
                              : event.target.value,
                        })
                      }
                      className="form-field"
                    />
                  )}
                </label>
              ),
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-1.5 size-4" /> Save
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
