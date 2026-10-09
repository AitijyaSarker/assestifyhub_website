import { z } from "zod";

// ZOD SCHEMAS FOR SHARED TYPES

export const SiteSettingsSchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string(),
  logoUrlLight: z.string(),
  logoUrlDark: z.string(),
  faviconUrl: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  address: z.string(),
  socialLinks: z.object({
    linkedin: z.string().url().or(z.literal("")),
    twitter: z.string().url().or(z.literal("")),
    facebook: z.string().url().or(z.literal("")),
    github: z.string().url().or(z.literal("")),
  }),
  themeDefault: z.enum(["light", "dark", "system"]),
  analyticsId: z.string(),
});

export const ServiceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  pillar: z.enum(["Engineering & Design", "Brand & Digital Growth", "Infrastructure & Security"]),
  title: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  icon: z.string(),
  items: z.array(z.string()),
  deliverables: z.array(z.string()),
  techTags: z.array(z.string()),
  isFeatured: z.boolean(),
  order: z.number(),
  isVisible: z.boolean(),
});

export const TechStackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["Frontend", "Backend", "Database", "DevOps & Cloud", "Mobile", "Design & Strategy"]),
  tooltip: z.string(),
  order: z.number(),
  isVisible: z.boolean(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  summary: z.string(),
  challenge: z.string(),
  solution: z.string(),
  results: z.array(z.string()),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })),
  techTags: z.array(z.string()),
  coverImage: z.string(),
  gallery: z.array(z.string()),
  isConcept: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number(),
  isVisible: z.boolean(),
});

export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
  readTimeMinutes: z.number(),
  publishedAt: z.string(),
  status: z.enum(["Published", "Draft", "Scheduled"]),
  coverImage: z.string(),
  isVisible: z.boolean(),
});

export const ConsultationLeadSchema = z.object({
  id: z.string().optional(),
  bookingDate: z.string(),
  timeSlot: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string(),
  budgetRange: z.string(),
  projectBrief: z.string().min(5),
  status: z.enum(["New", "Contacted", "Confirmed", "Cancelled"]).optional(),
  createdAt: z.string().optional(),
});

export type SiteSettingsType = z.infer<typeof SiteSettingsSchema>;
export type ServiceType = z.infer<typeof ServiceSchema>;
export type TechStackItemType = z.infer<typeof TechStackItemSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
export type BlogPostType = z.infer<typeof BlogPostSchema>;
export type ConsultationLeadType = z.infer<typeof ConsultationLeadSchema>;
