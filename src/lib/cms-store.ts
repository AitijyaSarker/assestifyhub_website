// Assetify Hub CMS Store & Data Persistence Layer

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logoUrlLight: string;
  logoUrlDark: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    github: string;
  };
  themeDefault: 'light' | 'dark' | 'system';
  analyticsId: string;
}

export interface Service {
  id: string;
  slug: string;
  pillar: 'Engineering & Design' | 'Brand & Digital Growth' | 'Infrastructure & Security';
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  items: string[];
  deliverables: string[];
  techTags: string[];
  isFeatured: boolean;
  order: number;
  isVisible: boolean;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps & Cloud' | 'Mobile' | 'Design & Strategy';
  iconSvg?: string;
  iconName?: string;
  tooltip: string;
  order: number;
  isVisible: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryId?: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: { label: string; value: string }[];
  techTags: string[];
  review?: string;
  awards?: string;
  accessFeatures?: string[];
  serviceOwners?: string[];
  tags?: string[];
  link?: string;
  coverImage: string;
  gallery: string[];
  isConcept: boolean;
  isFeatured: boolean;
  order: number;
  isVisible: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readTimeMinutes: number;
  publishedAt: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  coverImage: string;
  isVisible: boolean;
}

export interface ConsultationLead {
  id: string;
  bookingDate: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  budgetRange: string;
  projectBrief: string;
  status: 'New' | 'Contacted' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-Time' | 'Contract' | 'Part-Time';
  description: string;
  requirements: string[];
  isVisible: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: { linkedin?: string; twitter?: string; github?: string };
  order: number;
}

export interface PageSectionLayout {
  id: string;
  sectionId: string;
  title: string;
  order: number;
  isVisible: boolean;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  blocks: {
    id: string;
    type: 'hero' | 'text' | 'features' | 'cta' | 'media';
    title?: string;
    content?: string;
    image?: string;
  }[];
  isPublished: boolean;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  fileSize: string;
  format: string;
  altText: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SiteContent {
  heroEyebrow: string;
  heroHeadline: string;
  heroCopy: string;
  aboutTitle: string;
  aboutCopy: string;
  servicesTitle: string;
  scopeTitle: string;
  scopeCopy: string;
  whyTitle: string;
  whyCopy: string;
  whyItems: { title: string; desc: string }[];
  processTitle: string;
  processSteps: { number: string; step: string; title: string; desc: string }[];
  productsTitle: string;
  galleryTitle: string;
  awardsTitle: string;
  reviewsTitle: string;
  careersTitle: string;
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  closingTitle: string;
  closingCopy: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  altText: string;
  caption: string;
  isVisible: boolean;
  order: number;
}

export interface Award {
  id: string;
  title: string;
  image?: string;
  issuer: string;
  year: string;
  description: string;
  isVisible: boolean;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  label: string;
  isAvailable: boolean;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// DEFAULT INITIAL SEED DATA
const defaultSettings: SiteSettings = {
  brandName: "Assetify Hub",
  tagline: "Architecting your digital future.",
  logoUrlLight: "/favicon.svg",
  logoUrlDark: "/favicon.svg",
  faviconUrl: "/favicon.svg",
  contactEmail: "welisten@assetify.com",
  contactPhone: "+1 (800) 555-2773",
  address: "100 Innovation Way, Suite 400, New York, NY 10001",
  socialLinks: {
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    facebook: "https://www.facebook.com/profile.php?id=61583933039295",
    github: "https://github.com",
  },
  themeDefault: "light",
  analyticsId: "G-ASSETIFY2026",
};

const defaultServices: Service[] = [
  {
    id: "srv-1",
    slug: "engineering-design",
    pillar: "Engineering & Design",
    title: "Engineering & Design",
    shortDescription: "From the first idea to a scalable product. Thoughtful experiences, robust systems, and software built around your business.",
    fullDescription: "We bring together intuitive interface design and custom software engineering to turn your requirements into connected, scalable digital experiences. Our engineering team delivers robust, well-architected applications adhering to strict security and speed standards.",
    icon: "Code2",
    items: [
      "Custom Software Engineering",
      "Scalable Web Applications",
      "Web Services & Microservice APIs",
      "SaaS Product Architecture",
      "E-Commerce & Digital Platforms",
      "UI/UX Experience Design"
    ],
    deliverables: [
      "Enterprise Microservices API architecture",
      "High-converting, accessible React/Next.js interfaces",
      "Figma UI/UX Component System & Design Tokens",
      "Continuous Integration & Automated Testing Pipeline"
    ],
    techTags: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Tailwind CSS"],
    isFeatured: true,
    order: 1,
    isVisible: true
  },
  {
    id: "srv-2",
    slug: "brand-digital-growth",
    pillar: "Brand & Digital Growth",
    title: "Brand & Digital Growth",
    shortDescription: "Make your brand matter. Connect strategy, performance marketing, and lead generation to move your business forward.",
    fullDescription: "Bring clarity to your brand and purpose to your campaigns. We align brand positioning, performance-driven digital marketing, and strategic B2B lead generation around your revenue goals.",
    icon: "TrendingUp",
    items: [
      "Performance-Driven Digital Marketing",
      "Brand Strategy & Identity System",
      "Strategic Lead Generation",
      "Conversion Rate Optimization (CRO)",
      "Content Strategy & SEO Engineering"
    ],
    deliverables: [
      "Brand Identity Guidelines & Vector Design System",
      "Targeted Multi-Channel B2B Growth Campaigns",
      "Data Analytics & Real-Time Attribution Dashboards"
    ],
    techTags: ["Google Analytics 4", "Semrush", "HubSpot", "Meta Ads Manager", "Google Ads"],
    isFeatured: true,
    order: 2,
    isVisible: true
  },
  {
    id: "srv-3",
    slug: "infrastructure-security",
    pillar: "Infrastructure & Security",
    title: "Infrastructure & Security",
    shortDescription: "A stronger foundation for everything you do. Connected infrastructure and enterprise security that put resilience first.",
    fullDescription: "Protect the systems your business relies on. Align network infrastructure and enterprise cybersecurity with your operational needs, compliance mandates, and long-term growth plans.",
    icon: "ShieldCheck",
    items: [
      "Network Infrastructure & Cloud Security",
      "Enterprise Cybersecurity Solutions",
      "Zero-Trust Architecture & Identity Access",
      "DevSecOps & Cloud Hardening",
      "Security Audits & Compliance Testing"
    ],
    deliverables: [
      "ISO 27001 & SOC 2 Readiness Audits",
      "Automated Vulnerability Scanning & Threat Prevention",
      "Multi-Region AWS / GCP Cloud Failover Setup"
    ],
    techTags: ["AWS", "Kubernetes", "Docker", "Cloudflare", "Terraform"],
    isFeatured: true,
    order: 3,
    isVisible: true
  }
];

const defaultTechStack: TechStackItem[] = [
  { id: "tech-1", name: "React", category: "Frontend", tooltip: "High-Performance Interactive UI Framework", order: 1, isVisible: true },
  { id: "tech-2", name: "Next.js", category: "Frontend", tooltip: "Full-Stack Server Rendering & SSR Framework", order: 2, isVisible: true },
  { id: "tech-3", name: "TypeScript", category: "Frontend", tooltip: "Strict Static Typing for Enterprise Reliability", order: 3, isVisible: true },
  { id: "tech-4", name: "Node.js", category: "Backend", tooltip: "Scalable Event-Driven Server Runtime", order: 4, isVisible: true },
  { id: "tech-5", name: "Express.js", category: "Backend", tooltip: "Ultra-fast Lightweight Web API Framework", order: 5, isVisible: true },
  { id: "tech-6", name: "MongoDB", category: "Database", tooltip: "Flexible NoSQL Document Database", order: 6, isVisible: true },
  { id: "tech-7", name: "PostgreSQL", category: "Database", tooltip: "ACID-Compliant Relational Database", order: 7, isVisible: true },
  { id: "tech-8", name: "Flutter", category: "Mobile", tooltip: "Cross-Platform High-Performance Mobile Apps", order: 8, isVisible: true },
  { id: "tech-9", name: "AWS", category: "DevOps & Cloud", tooltip: "Global Enterprise Cloud Infrastructure", order: 9, isVisible: true },
  { id: "tech-10", name: "Docker", category: "DevOps & Cloud", tooltip: "Containerization & Microservice Deployment", order: 10, isVisible: true },
  { id: "tech-11", name: "Tailwind CSS", category: "Frontend", tooltip: "Utility-First Responsive Styling Engine", order: 11, isVisible: true },
  { id: "tech-12", name: "GraphQL", category: "Backend", tooltip: "Typed Data Query & Mutation API Layer", order: 12, isVisible: true },
];

const defaultProjects: Project[] = [
  {
    id: "proj-1",
    slug: "clearer-financial-experience",
    title: "A clearer financial experience",
    category: "Product design · Mobile experience",
    summary: "An illustrative exploration of a mobile financial experience: clear data visualization, considered hierarchy, and a focused interface.",
    challenge: "Traditional financial mobile interfaces bombard users with dense metrics, obscure fee structures, and fragmented navigation trees.",
    solution: "Designed a high-clarity design system with color-coded asset distribution, instant transaction breakdown, and sub-100ms response times.",
    results: [
      "+340% increase in daily user engagement",
      "99.99% system uptime during peak traffic",
      "4.9/5 stars design satisfaction rating"
    ],
    metrics: [
      { label: "Performance", value: "+340%" },
      { label: "Uptime", value: "99.99%" },
      { label: "User Rating", value: "4.9 / 5" }
    ],
    techTags: ["React Native", "TypeScript", "Tailwind CSS", "Node.js"],
    coverImage: "/assets/mobile-concept.jpg",
    gallery: ["/assets/mobile-concept.jpg", "/assets/architecture.jpg"],
    isConcept: true,
    isFeatured: true,
    order: 1,
    isVisible: true
  },
  {
    id: "proj-2",
    slug: "complex-data-simple-decisions",
    title: "Complex data. Simple decisions.",
    category: "Web applications · Interface design",
    summary: "An illustrative analytics platform exploring how a well-structured web interface can make complex information easier to understand.",
    challenge: "Enterprise decision-makers struggle to extract actionable insights from multi-terabyte data streams.",
    solution: "Engineered a custom web dashboard rendering real-time streaming charts with dynamic filtering and automated executive summaries.",
    results: [
      "85% reduction in decision cycle time",
      "Real-time processing of 10M+ daily events",
      "Zero latency data synchronization"
    ],
    metrics: [
      { label: "Latency", value: "<15ms" },
      { label: "Events/Day", value: "10M+" },
      { label: "Cycle Speed", value: "85% faster" }
    ],
    techTags: ["React", "Next.js", "PostgreSQL", "Recharts"],
    coverImage: "/assets/web-concept.jpg",
    gallery: ["/assets/web-concept.jpg", "/assets/architecture.jpg"],
    isConcept: true,
    isFeatured: true,
    order: 2,
    isVisible: true
  },
  {
    id: "proj-3",
    slug: "zero-trust-cloud-architecture",
    title: "Zero-Trust Enterprise Cloud Security",
    category: "Infrastructure & Security",
    summary: "An enterprise security architecture concept protecting distributed workforce access to mission-critical infrastructure.",
    challenge: "Legacy VPN architectures leave organizations vulnerable to lateral privilege escalation attacks.",
    solution: "Deployed an automated Zero-Trust Network Access (ZTNA) policy engine with context-aware biometric authentication.",
    results: [
      "100% mitigation of unauthorized lateral attempts",
      "Compliance achieved for SOC 2 Type II",
      "Zero breach incident record"
    ],
    metrics: [
      { label: "Breaches", value: "0" },
      { label: "Compliance", value: "SOC 2 Type II" },
      { label: "Auth Speed", value: "120ms" }
    ],
    techTags: ["AWS", "Kubernetes", "Cloudflare", "Terraform"],
    coverImage: "/assets/architecture.jpg",
    gallery: ["/assets/architecture.jpg"],
    isConcept: true,
    isFeatured: true,
    order: 3,
    isVisible: true
  }
];

const defaultBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "building-scalable-microservices-nodejs-typescript",
    title: "Architecting Scalable Microservices with Node.js & TypeScript",
    summary: "How to structure enterprise backends with strict typing, clean layer separation, and resilient error boundary handlers.",
    content: `
## Why Architecture Matters in 2026

Building modern enterprise software requires more than just making code work; it demands scalability, maintainability, and clean separation of concerns. In this article, we break down the Controller-Service-Repository pattern.

### Core Principles
1. **Controller Layer**: Handles incoming HTTP requests and Zod validation.
2. **Service Layer**: Contains core business logic isolated from HTTP transport details.
3. **Repository Layer**: Interfaces directly with database models (MongoDB Mongoose / PostgreSQL).

\`\`\`typescript
// Example Controller Endpoint
export async function getServices(req: Request, res: Response) {
  const data = await ServiceRepository.findAll();
  return res.json({ success: true, data });
}
\`\`\`

### Key Takeaways
- Always type your request payloads with Zod schemas.
- Use structured logging and central error-capture handling.
    `,
    category: "Engineering",
    tags: ["Node.js", "TypeScript", "Microservices", "Architecture"],
    author: {
      name: "Alexander Wright",
      role: "VP of Software Engineering",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    readTimeMinutes: 5,
    publishedAt: "2026-09-28",
    status: "Published",
    coverImage: "/assets/architecture.jpg",
    isVisible: true
  },
  {
    id: "blog-2",
    slug: "demystifying-zero-trust-cybersecurity",
    title: "Demystifying Zero-Trust: A Modern Security Posture",
    summary: "Never trust, always verify. Why perimeter security is no longer enough for cloud-native organizations.",
    content: `
## The Death of the Perimeter

In modern cloud infrastructure, traditional corporate perimeters no longer exist. Remote teams, multi-cloud setups, and microservices demand a Zero-Trust architecture.

### Three Pillars of Zero-Trust
- **Explicit Verification**: Always authenticate and authorize based on all available data points.
- **Least Privilege Access**: Limit user access with Just-In-Time and Just-Enough-Access (JTA/JEA).
- **Assume Breach**: Minimize blast radiuses and segment access.
    `,
    category: "Security",
    tags: ["Cybersecurity", "Zero-Trust", "AWS", "Compliance"],
    author: {
      name: "Elena Rostova",
      role: "Lead Security Architect",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    readTimeMinutes: 7,
    publishedAt: "2026-09-15",
    status: "Published",
    coverImage: "/assets/web-concept.jpg",
    isVisible: true
  }
];

const defaultLeads: ConsultationLead[] = [];

const defaultJobs: JobPosition[] = [];

const defaultTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "David K. Sterling",
    role: "Founder & Chief Executive Officer",
    bio: "Ex-Google engineering lead with 14+ years experience launching cloud platforms and scaling technology ventures.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" },
    order: 1
  },
  {
    id: "team-2",
    name: "Elena Rostova",
    role: "Head of Infrastructure & Cybersecurity",
    bio: "Certified Information Systems Security Professional (CISSP) specializing in zero-trust architecture and threat prevention.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    social: { linkedin: "https://linkedin.com", github: "https://github.com" },
    order: 2
  },
  {
    id: "team-3",
    name: "Alexander Wright",
    role: "VP of Software Engineering",
    bio: "Passionate about clean code, microservices architecture, and building high-performance engineering teams.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    social: { linkedin: "https://linkedin.com", github: "https://github.com" },
    order: 3
  }
];

const defaultSectionLayouts: PageSectionLayout[] = [
  { id: "sec-1", sectionId: "company", title: "About Assetify Hub", order: 1, isVisible: true },
  { id: "sec-2", sectionId: "tech_marquee", title: "Technology Ecosystem", order: 2, isVisible: true },
  { id: "sec-3", sectionId: "scope_planner", title: "Project Scope Planner", order: 3, isVisible: true },
  { id: "sec-4", sectionId: "services", title: "Service Categories", order: 4, isVisible: true },
  { id: "sec-5", sectionId: "products", title: "Products & Projects", order: 5, isVisible: true },
  { id: "sec-6", sectionId: "why_us", title: "Why Assetify Hub", order: 6, isVisible: true },
  { id: "sec-7", sectionId: "process", title: "How We Work", order: 7, isVisible: true },
  { id: "sec-8", sectionId: "gallery", title: "Gallery", order: 8, isVisible: true },
  { id: "sec-9", sectionId: "awards", title: "Awards & Recognition", order: 9, isVisible: true },
  { id: "sec-10", sectionId: "reviews", title: "Client Reviews", order: 10, isVisible: true },
  { id: "sec-11", sectionId: "careers", title: "Careers", order: 11, isVisible: true },
  { id: "sec-12", sectionId: "facts", title: "Company Facts", order: 12, isVisible: true },
  { id: "sec-13", sectionId: "faq", title: "Frequently Asked Questions", order: 13, isVisible: true },
  { id: "sec-14", sectionId: "cta", title: "Contact Call to Action", order: 14, isVisible: true },
];

const defaultSiteContent: SiteContent = {
  heroEyebrow: "Ideas into impact",
  heroHeadline: "Architecting your digital future.",
  heroCopy: "We bring product strategy, software engineering, thoughtful design, digital growth, and secure infrastructure together to build technology around your business.",
  aboutTitle: "One partner across the digital product lifecycle.",
  aboutCopy: "We bring product thinking, design, software engineering, digital growth, and infrastructure into one connected conversation. The aim is to make technology decisions clearer and build digital products around real business needs.",
  servicesTitle: "Different disciplines. One connected vision.",
  scopeTitle: "Estimate Your Project Scope",
  scopeCopy: "Outline what you are planning and prepare a structured email for our team. This is a discovery aid, not a price or delivery-time estimate.",
  whyTitle: "Why Choose Assetify Hub",
  whyCopy: "We connect thoughtful product work with clear communication and responsible engineering, from first conversation through ongoing support.",
  whyItems: [
    { title: "Engineering for the problem", desc: "Choose an architecture and tools to suit the product's needs, rather than forcing every project into the same stack." },
    { title: "Security considered early", desc: "Bring security and infrastructure requirements into planning and implementation, not just the final handoff." },
    { title: "Useful, efficient experiences", desc: "Keep usability, accessibility, and performance in view as features and interfaces are designed." },
    { title: "Connected disciplines", desc: "Coordinate product, design, engineering, growth, and infrastructure decisions around shared goals." },
    { title: "Clear collaboration", desc: "Make priorities, trade-offs, and next steps visible throughout the work." },
    { title: "Support beyond launch", desc: "Plan for maintenance and continued improvement as the product and business change." },
  ],
  processTitle: "Discover. Design. Build. Support.",
  processSteps: [
    { number: "01", step: "Discover", title: "Understand the need", desc: "Align on the business goal, intended users, constraints, and what a useful outcome should do." },
    { number: "02", step: "Design", title: "Shape the experience", desc: "Define the product scope and user experience before settling on the implementation details." },
    { number: "03", step: "Build", title: "Develop and refine", desc: "Implement the solution in reviewable steps, checking quality and fit as it takes shape." },
    { number: "04", step: "Deliver", title: "Launch with confidence", desc: "Prepare for release and hand over the knowledge and tools your team needs." },
    { number: "05", step: "Improve", title: "Learn and evolve", desc: "Review what is working and shape the next improvements as needs change." },
  ],
  productsTitle: "A glimpse of what's possible.",
  galleryTitle: "Inside the work",
  awardsTitle: "Awards & Recognition",
  reviewsTitle: "What collaborators say",
  careersTitle: "Build what's next with us",
  faqTitle: "Common Questions",
  faqs: [
    { question: "What services does Assetify Hub specialize in?", answer: "Assetify Hub connects software engineering, product and interface design, digital growth, and infrastructure services." },
    { question: "How do I enquire about a consultation?", answer: "Choose a preferred date and an available time, then prepare an email enquiry. Your email app opens a draft; the request is not sent or booked until you send it." },
    { question: "What can the site administrator manage?", answer: "The private admin area manages site content, service categories, products and projects, vacancies, gallery items, awards, reviews, consultation availability, and homepage layout. Published CMS changes are stored in MongoDB." },
    { question: "What technology stack do you use?", answer: "We build with React, Next.js, Vite, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Tailwind CSS, AWS, Docker, and Cloudflare." },
  ],
  closingTitle: "Your next chapter starts with a conversation.",
  closingCopy: "Have an idea, a challenge, or a bigger ambition? Tell us what you're working on and we'll take it from there.",
};

const defaultCustomPages: CustomPage[] = [
  {
    id: "page-1",
    slug: "engineering-standards",
    title: "Assetify Engineering Standards",
    metaDescription: "Our strict engineering methodology, security guidelines, and performance guarantees.",
    blocks: [
      {
        id: "b-1",
        type: "hero",
        title: "Engineering Without Compromise",
        content: "We adhere to zero-trust security, strict static typing, sub-100ms render targets, and 100% automated test coverage."
      },
      {
        id: "b-2",
        type: "features",
        title: "Core Engineering Pillars",
        content: "1. Type Safety with TypeScript & Zod\n2. Microservice Isolation\n3. Immutable Audit Trails\n4. Automated CI/CD Pipelines"
      }
    ],
    isPublished: true
  }
];

const defaultMediaAssets: MediaAsset[] = [
  {
    id: "med-1",
    filename: "architecture.jpg",
    url: "/assets/architecture.jpg",
    fileSize: "1.2 MB",
    format: "image/jpeg",
    altText: "Contemporary Glass Technology Hub Architectural Concept",
    uploadedAt: "2026-10-01"
  },
  {
    id: "med-2",
    filename: "mobile-concept.jpg",
    url: "/assets/mobile-concept.jpg",
    fileSize: "850 KB",
    format: "image/jpeg",
    altText: "Mobile Financial App Design Concept",
    uploadedAt: "2026-10-02"
  },
  {
    id: "med-3",
    filename: "web-concept.jpg",
    url: "/assets/web-concept.jpg",
    fileSize: "920 KB",
    format: "image/jpeg",
    altText: "Analytics Web Dashboard Interface Concept",
    uploadedAt: "2026-10-03"
  }
];

const defaultAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    userEmail: "admin@assetify.com",
    action: "SYSTEM_INIT",
    details: "Initialized Assetify Hub CMS & Data Store",
    timestamp: new Date().toISOString()
  }
];

export interface CmsStoreState {
  settings: SiteSettings;
  siteContent: SiteContent;
  services: Service[];
  techStack: TechStackItem[];
  projects: Project[];
  blogPosts: BlogPost[];
  leads: ConsultationLead[];
  jobs: JobPosition[];
  team: TeamMember[];
  sectionLayouts: PageSectionLayout[];
  customPages: CustomPage[];
  mediaAssets: MediaAsset[];
  auditLogs: AuditLog[];
  gallery: GalleryItem[];
  awards: Award[];
  reviews: Review[];
  timeSlots: AvailabilitySlot[];
  messages: ContactMessage[];
  syncError: string | null;
}

// REACTION & LOCALSTORAGE MANAGEMENT
class CmsStore {
  private listeners: Set<() => void> = new Set();
  private _cachedState: CmsStoreState | null = null;
  private remoteSyncTimer: ReturnType<typeof setTimeout> | null = null;
  private remoteSyncError: string | null = null;
  
  public settings: SiteSettings = defaultSettings;
  public siteContent: SiteContent = defaultSiteContent;
  public services: Service[] = defaultServices;
  public techStack: TechStackItem[] = defaultTechStack;
  public projects: Project[] = defaultProjects;
  public blogPosts: BlogPost[] = defaultBlogPosts;
  public leads: ConsultationLead[] = defaultLeads;
  public jobs: JobPosition[] = defaultJobs;
  public team: TeamMember[] = defaultTeam;
  public sectionLayouts: PageSectionLayout[] = defaultSectionLayouts;
  public customPages: CustomPage[] = defaultCustomPages;
  public mediaAssets: MediaAsset[] = defaultMediaAssets;
  public auditLogs: AuditLog[] = defaultAuditLogs;
  public gallery: GalleryItem[] = [];
  public awards: Award[] = [];
  public reviews: Review[] = [];
  public timeSlots: AvailabilitySlot[] = [
    { id: "slot-1", label: "09:00 AM", isAvailable: true, order: 1 },
    { id: "slot-2", label: "10:00 AM", isAvailable: true, order: 2 },
    { id: "slot-3", label: "11:00 AM", isAvailable: true, order: 3 },
    { id: "slot-4", label: "01:30 PM", isAvailable: true, order: 4 },
    { id: "slot-5", label: "02:30 PM", isAvailable: true, order: 5 },
    { id: "slot-6", label: "03:30 PM", isAvailable: true, order: 6 },
    { id: "slot-7", label: "04:30 PM", isAvailable: true, order: 7 },
  ];
  public messages: ContactMessage[] = [];

  public getState(): CmsStoreState {
    if (!this._cachedState) {
      this._cachedState = {
        settings: this.settings,
        siteContent: this.siteContent,
        services: this.services,
        techStack: this.techStack,
        projects: this.projects,
        blogPosts: this.blogPosts,
        leads: this.leads,
        jobs: this.jobs,
        team: this.team,
        sectionLayouts: this.sectionLayouts,
        customPages: this.customPages,
        mediaAssets: this.mediaAssets,
        auditLogs: this.auditLogs,
        gallery: this.gallery,
        awards: this.awards,
        reviews: this.reviews,
        timeSlots: this.timeSlots,
        messages: this.messages,
        syncError: this.remoteSyncError,
      };
    }
    return this._cachedState;
  }

  public refreshRemoteContent() {
    return this.loadRemoteContent();
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromLocalStorage();
      void this.loadRemoteContent();
    }
  }

  private async loadRemoteContent() {
    const storedSession = localStorage.getItem("assetify_admin_session");
    let token = "";
    if (storedSession) {
      try {
        token = (JSON.parse(storedSession) as { token?: string }).token || "";
      } catch (error) {
        console.error("Could not read the saved admin session for CMS sync", error);
      }
    }

    const isAdmin = Boolean(token);
    if (!isAdmin) {
      this.leads = [];
      this.messages = [];
      this.auditLogs = defaultAuditLogs;
    }
    try {
      const requestInit: RequestInit = {};
      if (token) requestInit.headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(isAdmin ? "/api/cms/admin" : "/api/cms/public", requestInit);
      const result = await response.json() as {
        success?: boolean;
        data?: Record<string, unknown> | null;
        error?: string;
      };
      if (!response.ok || !result.success) {
        throw new Error(result.error || `CMS content request failed (${response.status}).`);
      }
      if (!result.data) return;

      const snapshot = result.data;
      if (snapshot["settings"] && typeof snapshot["settings"] === "object") {
        this.settings = { ...this.settings, ...snapshot["settings"] as Partial<SiteSettings> };
      }
      if (snapshot["siteContent"] && typeof snapshot["siteContent"] === "object") {
        this.siteContent = { ...defaultSiteContent, ...snapshot["siteContent"] as Partial<SiteContent> };
      }
      if (Array.isArray(snapshot["services"])) this.services = snapshot["services"] as Service[];
      if (Array.isArray(snapshot["techStack"])) this.techStack = snapshot["techStack"] as TechStackItem[];
      if (Array.isArray(snapshot["projects"])) this.projects = snapshot["projects"] as Project[];
      if (Array.isArray(snapshot["blogPosts"])) this.blogPosts = snapshot["blogPosts"] as BlogPost[];
      if (Array.isArray(snapshot["jobs"])) this.jobs = snapshot["jobs"] as JobPosition[];
      if (Array.isArray(snapshot["team"])) this.team = snapshot["team"] as TeamMember[];
      if (Array.isArray(snapshot["customPages"])) this.customPages = snapshot["customPages"] as CustomPage[];
      if (Array.isArray(snapshot["gallery"])) this.gallery = snapshot["gallery"] as GalleryItem[];
      if (Array.isArray(snapshot["awards"])) this.awards = snapshot["awards"] as Award[];
      if (Array.isArray(snapshot["reviews"])) this.reviews = snapshot["reviews"] as Review[];
      if (Array.isArray(snapshot["timeSlots"])) this.timeSlots = snapshot["timeSlots"] as AvailabilitySlot[];
      if (Array.isArray(snapshot["sectionLayouts"])) {
        const savedLayouts = snapshot["sectionLayouts"] as PageSectionLayout[];
        const knownSections = defaultSectionLayouts.map((section) => {
          const saved = savedLayouts.find((item) => item.sectionId === section.sectionId);
          return saved ? { ...section, ...saved } : section;
        });
        const extraSections = savedLayouts.filter(
          (item) => !defaultSectionLayouts.some((section) => section.sectionId === item.sectionId),
        );
        this.sectionLayouts = [...knownSections, ...extraSections].sort((a, b) => a.order - b.order);
      }
      if (isAdmin) {
        if (Array.isArray(snapshot["leads"])) this.leads = snapshot["leads"] as ConsultationLead[];
        if (Array.isArray(snapshot["messages"])) this.messages = snapshot["messages"] as ContactMessage[];
        if (Array.isArray(snapshot["auditLogs"])) this.auditLogs = snapshot["auditLogs"] as AuditLog[];
        if (Array.isArray(snapshot["mediaAssets"])) this.mediaAssets = snapshot["mediaAssets"] as MediaAsset[];
      }
      this.remoteSyncError = null;
      this.saveToLocalStorage(false);
    } catch (error) {
      console.error("Could not load shared CMS content", error);
      if (isAdmin) {
        this.remoteSyncError = "Could not load shared CMS content. Check the API and MongoDB connection.";
        this.notify();
      }
    }
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem("assetify_cms_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.settings) this.settings = parsed.settings;
        if (parsed.siteContent) this.siteContent = { ...defaultSiteContent, ...parsed.siteContent };
        if (parsed.services) this.services = parsed.services;
        if (parsed.techStack) this.techStack = parsed.techStack;
        if (parsed.projects) this.projects = parsed.projects;
        if (parsed.blogPosts) this.blogPosts = parsed.blogPosts;
        if (parsed.leads) this.leads = parsed.leads;
        if (parsed.jobs) this.jobs = parsed.jobs;
        if (parsed.team) this.team = parsed.team;
        if (Array.isArray(parsed.sectionLayouts)) {
          const savedLayouts = parsed.sectionLayouts as PageSectionLayout[];
          this.sectionLayouts = defaultSectionLayouts.map((section) => {
            const saved = savedLayouts.find((item) => item.sectionId === section.sectionId);
            return saved ? { ...section, ...saved } : section;
          }).sort((a, b) => a.order - b.order);
        }
        if (parsed.customPages) this.customPages = parsed.customPages;
        if (parsed.mediaAssets) this.mediaAssets = parsed.mediaAssets;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        if (Array.isArray(parsed.gallery)) this.gallery = parsed.gallery;
        if (Array.isArray(parsed.awards)) this.awards = parsed.awards;
        if (Array.isArray(parsed.reviews)) this.reviews = parsed.reviews;
        if (Array.isArray(parsed.timeSlots)) this.timeSlots = parsed.timeSlots;
        if (Array.isArray(parsed.messages)) this.messages = parsed.messages;
      }
    } catch (e) {
      console.error("Failed to load CMS store from localStorage", e);
    }
  }

  private saveToLocalStorage(syncRemote = true) {
    if (typeof window === "undefined") return;
    try {
      const data = {
        settings: this.settings,
        siteContent: this.siteContent,
        services: this.services,
        techStack: this.techStack,
        projects: this.projects,
        blogPosts: this.blogPosts,
        leads: this.leads,
        jobs: this.jobs,
        team: this.team,
        sectionLayouts: this.sectionLayouts,
        customPages: this.customPages,
        mediaAssets: this.mediaAssets,
        auditLogs: this.auditLogs,
        gallery: this.gallery,
        awards: this.awards,
        reviews: this.reviews,
        timeSlots: this.timeSlots,
        messages: this.messages
      };
      localStorage.setItem("assetify_cms_data", JSON.stringify(data));
      this.notify();
      if (syncRemote) this.queueRemoteSave(data);
    } catch (e) {
      console.error("Failed to save CMS store to localStorage", e);
    }
  }

  private queueRemoteSave(data: Omit<CmsStoreState, "syncError">) {
    const savedSession = localStorage.getItem("assetify_admin_session");
    if (!savedSession) return;
    let token: string;
    try {
      token = (JSON.parse(savedSession) as { token?: string }).token || "";
    } catch (error) {
      console.error("Could not read the saved admin session for CMS sync", error);
      this.remoteSyncError = "CMS changes could not be synced because the admin session is invalid.";
      this.notify();
      return;
    }
    if (!token) return;

    if (this.remoteSyncTimer) clearTimeout(this.remoteSyncTimer);
    this.remoteSyncTimer = setTimeout(() => {
      void fetch("/api/cms/admin", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: data }),
      }).then(async (response) => {
        const result = await response.json() as { success?: boolean; error?: string };
        if (!response.ok || !result.success) {
          throw new Error(result.error || `CMS sync failed (${response.status}).`);
        }
        if (this.remoteSyncError) {
          this.remoteSyncError = null;
          this.notify();
        }
      }).catch((error: unknown) => {
        console.error("Could not sync CMS changes to MongoDB", error);
        this.remoteSyncError = error instanceof Error
          ? `CMS changes are saved in this browser but could not be published: ${error.message}`
          : "CMS changes are saved in this browser but could not be published.";
        this.notify();
      });
    }, 300);
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this._cachedState = null;
    this.listeners.forEach((listener) => listener());
  }

  public logAction(userEmail: string, action: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userEmail,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    this.saveToLocalStorage();
  }

  // SETTINGS CRUD
  public updateSettings(newSettings: Partial<SiteSettings>, user = "admin@assetify.com") {
    this.settings = { ...this.settings, ...newSettings };
    this.logAction(user, "UPDATE_SETTINGS", "Updated site settings");
    this.saveToLocalStorage();
  }

  public updateSiteContent(content: SiteContent, user = "admin@assetify.com") {
    this.siteContent = content;
    this.logAction(user, "UPDATE_SITE_CONTENT", "Updated public landing page content");
    this.saveToLocalStorage();
  }

  public saveGalleryItem(item: GalleryItem, user = "admin@assetify.com") {
    const index = this.gallery.findIndex((entry) => entry.id === item.id);
    if (index >= 0) this.gallery[index] = item;
    else this.gallery.push(item);
    this.logAction(user, index >= 0 ? "UPDATE_GALLERY_ITEM" : "CREATE_GALLERY_ITEM", item.title);
    this.saveToLocalStorage();
  }

  public deleteGalleryItem(id: string, user = "admin@assetify.com") {
    this.gallery = this.gallery.filter((item) => item.id !== id);
    this.logAction(user, "DELETE_GALLERY_ITEM", id);
    this.saveToLocalStorage();
  }

  public saveAward(award: Award, user = "admin@assetify.com") {
    const index = this.awards.findIndex((entry) => entry.id === award.id);
    if (index >= 0) this.awards[index] = award;
    else this.awards.push(award);
    this.logAction(user, index >= 0 ? "UPDATE_AWARD" : "CREATE_AWARD", award.title);
    this.saveToLocalStorage();
  }

  public deleteAward(id: string, user = "admin@assetify.com") {
    this.awards = this.awards.filter((award) => award.id !== id);
    this.logAction(user, "DELETE_AWARD", id);
    this.saveToLocalStorage();
  }

  public saveReview(review: Review, user = "admin@assetify.com") {
    const index = this.reviews.findIndex((entry) => entry.id === review.id);
    if (index >= 0) this.reviews[index] = review;
    else this.reviews.push(review);
    this.logAction(user, index >= 0 ? "UPDATE_REVIEW" : "CREATE_REVIEW", `Review by ${review.name}`);
    this.saveToLocalStorage();
  }

  public deleteReview(id: string, user = "admin@assetify.com") {
    this.reviews = this.reviews.filter((review) => review.id !== id);
    this.logAction(user, "DELETE_REVIEW", id);
    this.saveToLocalStorage();
  }

  public saveTimeSlot(slot: AvailabilitySlot, user = "admin@assetify.com") {
    const index = this.timeSlots.findIndex((entry) => entry.id === slot.id);
    if (index >= 0) this.timeSlots[index] = slot;
    else this.timeSlots.push(slot);
    this.logAction(user, index >= 0 ? "UPDATE_TIME_SLOT" : "CREATE_TIME_SLOT", slot.label);
    this.saveToLocalStorage();
  }

  public deleteTimeSlot(id: string, user = "admin@assetify.com") {
    this.timeSlots = this.timeSlots.filter((slot) => slot.id !== id);
    this.logAction(user, "DELETE_TIME_SLOT", id);
    this.saveToLocalStorage();
  }

  public markMessageRead(id: string, read: boolean, user = "admin@assetify.com") {
    this.messages = this.messages.map((message) => message.id === id ? { ...message, read } : message);
    this.logAction(user, read ? "READ_MESSAGE" : "UNREAD_MESSAGE", id);
    this.saveToLocalStorage();
  }

  public saveMessage(message: ContactMessage, user = "admin@assetify.com") {
    const index = this.messages.findIndex((entry) => entry.id === message.id);
    if (index >= 0) this.messages[index] = message;
    else this.messages = [message, ...this.messages];
    this.logAction(user, index >= 0 ? "UPDATE_MESSAGE" : "CREATE_MESSAGE", message.subject || message.name);
    this.saveToLocalStorage();
  }

  public deleteMessage(id: string, user = "admin@assetify.com") {
    this.messages = this.messages.filter((message) => message.id !== id);
    this.logAction(user, "DELETE_MESSAGE", id);
    this.saveToLocalStorage();
  }

  // SERVICES CRUD
  public saveService(service: Service, user = "admin@assetify.com") {
    const index = this.services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      this.services[index] = service;
      this.logAction(user, "UPDATE_SERVICE", `Updated service: ${service.title}`);
    } else {
      this.services.push(service);
      this.logAction(user, "CREATE_SERVICE", `Created service: ${service.title}`);
    }
    this.saveToLocalStorage();
  }

  public deleteService(id: string, user = "admin@assetify.com") {
    const s = this.services.find((x) => x.id === id);
    this.services = this.services.filter((x) => x.id !== id);
    this.logAction(user, "DELETE_SERVICE", `Deleted service: ${s?.title || id}`);
    this.saveToLocalStorage();
  }

  // TECH STACK CRUD
  public saveTechStack(item: TechStackItem, user = "admin@assetify.com") {
    const index = this.techStack.findIndex((t) => t.id === item.id);
    if (index >= 0) {
      this.techStack[index] = item;
      this.logAction(user, "UPDATE_TECHSTACK", `Updated tech item: ${item.name}`);
    } else {
      this.techStack.push(item);
      this.logAction(user, "CREATE_TECHSTACK", `Created tech item: ${item.name}`);
    }
    this.saveToLocalStorage();
  }

  public deleteTechStack(id: string, user = "admin@assetify.com") {
    const t = this.techStack.find((x) => x.id === id);
    this.techStack = this.techStack.filter((x) => x.id !== id);
    this.logAction(user, "DELETE_TECHSTACK", `Deleted tech item: ${t?.name || id}`);
    this.saveToLocalStorage();
  }

  // PORTFOLIO CRUD
  public saveProject(project: Project, user = "admin@assetify.com") {
    const index = this.projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      this.projects[index] = project;
      this.logAction(user, "UPDATE_PROJECT", `Updated project: ${project.title}`);
    } else {
      this.projects.push(project);
      this.logAction(user, "CREATE_PROJECT", `Created project: ${project.title}`);
    }
    this.saveToLocalStorage();
  }

  public deleteProject(id: string, user = "admin@assetify.com") {
    const p = this.projects.find((x) => x.id === id);
    this.projects = this.projects.filter((x) => x.id !== id);
    this.logAction(user, "DELETE_PROJECT", `Deleted project: ${p?.title || id}`);
    this.saveToLocalStorage();
  }

  // BLOG CRUD
  public saveBlogPost(post: BlogPost, user = "admin@assetify.com") {
    const index = this.blogPosts.findIndex((b) => b.id === post.id);
    if (index >= 0) {
      this.blogPosts[index] = post;
      this.logAction(user, "UPDATE_BLOG", `Updated blog post: ${post.title}`);
    } else {
      this.blogPosts.push(post);
      this.logAction(user, "CREATE_BLOG", `Created blog post: ${post.title}`);
    }
    this.saveToLocalStorage();
  }

  public deleteBlogPost(id: string, user = "admin@assetify.com") {
    const b = this.blogPosts.find((x) => x.id === id);
    this.blogPosts = this.blogPosts.filter((x) => x.id !== id);
    this.logAction(user, "DELETE_BLOG", `Deleted blog post: ${b?.title || id}`);
    this.saveToLocalStorage();
  }

  // CONSULTATIONS & LEADS
  public addConsultation(lead: Omit<ConsultationLead, "id" | "createdAt" | "status">, user = "public") {
    const newLead: ConsultationLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString()
    };
    this.leads = [newLead, ...this.leads];
    this.logAction(user, "NEW_CONSULTATION", `Recorded consultation for: ${newLead.name} (${newLead.email})`);
    this.saveToLocalStorage();
    return newLead;
  }

  public updateLeadStatus(id: string, status: ConsultationLead["status"], user = "admin@assetify.com") {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      this.logAction(user, "UPDATE_LEAD_STATUS", `Updated status for ${lead.name} to ${status}`);
      this.saveToLocalStorage();
    }
  }

  public deleteLead(id: string, user = "admin@assetify.com") {
    this.leads = this.leads.filter((l) => l.id !== id);
    this.logAction(user, "DELETE_LEAD", `Deleted consultation lead: ${id}`);
    this.saveToLocalStorage();
  }

  // CAREERS CRUD
  public saveJob(job: JobPosition, user = "admin@assetify.com") {
    const index = this.jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      this.jobs[index] = job;
      this.logAction(user, "UPDATE_JOB", `Updated job position: ${job.title}`);
    } else {
      this.jobs.push(job);
      this.logAction(user, "CREATE_JOB", `Created job position: ${job.title}`);
    }
    this.saveToLocalStorage();
  }

  public deleteJob(id: string, user = "admin@assetify.com") {
    this.jobs = this.jobs.filter((j) => j.id !== id);
    this.logAction(user, "DELETE_JOB", `Deleted job position: ${id}`);
    this.saveToLocalStorage();
  }

  // TEAM CRUD
  public saveTeamMember(member: TeamMember, user = "admin@assetify.com") {
    const index = this.team.findIndex((t) => t.id === member.id);
    if (index >= 0) {
      this.team[index] = member;
      this.logAction(user, "UPDATE_TEAM", `Updated team member: ${member.name}`);
    } else {
      this.team.push(member);
      this.logAction(user, "CREATE_TEAM", `Created team member: ${member.name}`);
    }
    this.saveToLocalStorage();
  }

  public deleteTeamMember(id: string, user = "admin@assetify.com") {
    this.team = this.team.filter((t) => t.id !== id);
    this.logAction(user, "DELETE_TEAM", `Deleted team member: ${id}`);
    this.saveToLocalStorage();
  }

  // SECTION LAYOUT REORDER & VISIBILITY
  public updateSectionLayouts(layouts: PageSectionLayout[], user = "admin@assetify.com") {
    this.sectionLayouts = layouts;
    this.logAction(user, "REORDER_SECTIONS", "Updated homepage section order & visibility");
    this.saveToLocalStorage();
  }

  // CUSTOM PAGE BUILDER
  public saveCustomPage(page: CustomPage, user = "admin@assetify.com") {
    const index = this.customPages.findIndex((p) => p.id === page.id);
    if (index >= 0) {
      this.customPages[index] = page;
      this.logAction(user, "UPDATE_CUSTOM_PAGE", `Updated custom page: ${page.title}`);
    } else {
      this.customPages.push(page);
      this.logAction(user, "CREATE_CUSTOM_PAGE", `Created custom page: ${page.title}`);
    }
    this.saveToLocalStorage();
  }

  public deleteCustomPage(id: string, user = "admin@assetify.com") {
    this.customPages = this.customPages.filter((p) => p.id !== id);
    this.logAction(user, "DELETE_CUSTOM_PAGE", `Deleted custom page: ${id}`);
    this.saveToLocalStorage();
  }

  // MEDIA ASSET LIBRARY
  public addMediaAsset(asset: Omit<MediaAsset, "id" | "uploadedAt">, user = "admin@assetify.com") {
    const newAsset: MediaAsset = {
      ...asset,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().slice(0, 10)
    };
    this.mediaAssets = [newAsset, ...this.mediaAssets];
    this.logAction(user, "UPLOAD_MEDIA", `Uploaded media asset: ${newAsset.filename}`);
    this.saveToLocalStorage();
    return newAsset;
  }

  public deleteMediaAsset(id: string, user = "admin@assetify.com") {
    this.mediaAssets = this.mediaAssets.filter((m) => m.id !== id);
    this.logAction(user, "DELETE_MEDIA", `Deleted media asset: ${id}`);
    this.saveToLocalStorage();
  }
}

export const cmsStore = new CmsStore();
