import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ArrowRight, 
  ArrowUpRight, 
  Code2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Award, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TechStackMarquee } from "@/components/home/TechStackMarquee";
import { ProjectScopePlanner } from "@/components/home/ProjectScopePlanner";
import { AwardsSection, CareersSection, GallerySection, ProductsSection, ReviewsSection } from "@/components/home/CompanySections";
import { useCmsStore } from "@/hooks/use-cms-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import architecture from "@/assets/architecture.jpg";
import heroVideo from "@/assets/assestifyrobo.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assetify Hub | Enterprise Engineering & Digital Growth" },
      { name: "description", content: "Assetify Hub delivers custom software, web applications, SaaS architecture, UI/UX design, digital marketing, and enterprise cybersecurity." },
      { property: "og:title", content: "Assetify Hub | Enterprise Engineering & Digital Growth" },
      { property: "og:description", content: "Architecting your digital future with software engineering, design, growth strategy, and security." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { services, techStack, projects, sectionLayouts, siteContent, jobs, gallery, awards, reviews, settings } = useCmsStore();
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);

  const visibleServices = services.filter((service) => service.isVisible).sort((a, b) => a.order - b.order);
  const activeService = selectedServiceIndex !== null ? visibleServices[selectedServiceIndex] : null;
  const sectionOrder = (sectionId: string) => sectionLayouts.find((section) => section.sectionId === sectionId)?.order ?? 99;
  const sectionVisible = (sectionId: string) => sectionLayouts.find((section) => section.sectionId === sectionId)?.isVisible ?? true;

  const whyIcons = [Code2, Lock, Zap, Cpu, Award, ShieldCheck];
  const whyUsItems = siteContent.whyItems.map((item, index) => ({
    ...item,
    icon: whyIcons[index % whyIcons.length] ?? ShieldCheck,
  }));
  const processSteps = siteContent.processSteps;
  const faqs = siteContent.faqs.map((faq) => ({ q: faq.question, a: faq.answer }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="top" className="flex-1">
        {/* HERO SECTION */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="site-container hero-grid">
            <div className="reveal-up hero-copy-block">
              <div className="eyebrow justify-center">{siteContent.heroEyebrow}</div>
              <h1 id="hero-title" className="hero-title">Assetify Hub.</h1>
              <h2 className="hero-statement">
                {siteContent.heroHeadline}
              </h2>
              <p className="hero-copy">
                {siteContent.heroCopy}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="brand" asChild>
                  <Link to="/book-consultation">
                    Book Consultation <Sparkles className="size-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="clean" asChild>
                  <a href="#services">Our Capabilities</a>
                </Button>
              </div>

              {/* Live editorial metrics, not client-performance claims */}
              <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
                {[
                  { value: visibleServices.length, label: "Published capabilities" },
                  { value: projects.filter((project) => project.isVisible && project.isConcept).length, label: "Illustrative concepts" },
                  { value: techStack.filter((item) => item.isVisible).length, label: "Technologies" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="font-bold text-lg text-primary">{metric.value}</div>
                    <div className="text-[11px] text-muted-foreground font-medium">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Container */}
            <figure className="hero-visual visual-reveal">
              <video
                className="hero-visual-video"
                src={heroVideo}
                poster={architecture}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Assetify Hub animated technology showcase"
              />
            </figure>
          </div>
        </section>

        {/* COMPANY OVERVIEW */}
        <div className="flex flex-col">
        {sectionVisible("company") && <div style={{ order: sectionOrder("company") }}>
        <section id="company" className="py-16 sm:py-20 border-y border-border" aria-labelledby="company-title">
          <div className="site-container">
            <div className="home-section-heading mb-10">
              <div className="eyebrow justify-center">About Assetify Hub</div>
              <h2 id="company-title" className="section-title">
                {siteContent.aboutTitle}
              </h2>
            </div>
            <div>
              <p className="mx-auto max-w-4xl text-base leading-relaxed text-muted-foreground">
                {siteContent.aboutCopy}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { title: "Purpose", description: "Turn business needs into useful digital products and services." },
                  { title: "Approach", description: "Connect strategy, experience, and engineering from the start." },
                  { title: "Focus", description: "Build with usability, security, and long-term care in mind." },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                    <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        </div>}

        {/* TECH STACK MARQUEE (WITH HOVER PAUSE & BLUE GLOW) */}
        {sectionVisible("tech_marquee") && <div style={{ order: sectionOrder("tech_marquee") }}><TechStackMarquee /></div>}

        {sectionVisible("scope_planner") && (
          <div style={{ order: sectionOrder("scope_planner") }}>
            <ProjectScopePlanner
              services={visibleServices}
              email={settings.contactEmail}
              title={siteContent.scopeTitle}
              description={siteContent.scopeCopy}
            />
          </div>
        )}

        {/* CAPABILITY PILLARS SECTION */}
        {sectionVisible("services") && <div style={{ order: sectionOrder("services") }}><section id="services" className="section-band" aria-labelledby="services-title">
          <div className="site-container">
            <div className="section-heading home-section-heading">
              <div className="eyebrow justify-center">Our Capabilities</div>
              <h2 id="services-title" className="section-title">
                {siteContent.servicesTitle}
              </h2>
            </div>

            <div className="service-grid">
              {visibleServices.map((item, index) => (
                <article className="service-item" key={item.id}>
                  <span className="service-number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.shortDescription}</p>
                  <ul>
                    {item.items.map((val) => (
                      <li key={val}>{val}</li>
                    ))}
                  </ul>
                  <Button
                    variant="link"
                    className="text-action"
                    onClick={() => setSelectedServiceIndex(index)}
                  >
                    Explore capabilities <ArrowRight className="size-4 ml-1" />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
        </div>}

        {/* WHY CHOOSE US GRID */}
        {sectionVisible("why_us") && <div style={{ order: sectionOrder("why_us") }}><section id="why-us" className="py-20 bg-muted/30 border-t border-border">
          <div className="site-container">
            <div className="home-section-heading max-w-2xl mb-16">
              <div className="eyebrow justify-center">Engineering Standards</div>
              <h2 className="section-title">{siteContent.whyTitle}</h2>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {siteContent.whyCopy}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyUsItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-6 rounded-xl border border-border bg-card space-y-3 hover:border-primary/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-accent text-primary flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        </div>}

        {/* ENGINEERING PROCESS STEPS */}
        {sectionVisible("process") && <div style={{ order: sectionOrder("process") }}><section id="process" className="py-20 border-t border-border">
          <div className="site-container">
            <div className="home-section-heading max-w-xl mb-16">
              <div className="eyebrow justify-center">Our Process</div>
              <h2 className="section-title">{siteContent.processTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((p) => (
                <div key={p.number} className="p-6 rounded-2xl border border-border bg-card space-y-3 relative">
                  <span className="font-extrabold text-2xl text-primary">{p.number}</span>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">{p.step}</div>
                  <h3 className="font-bold text-base text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>}

        {sectionVisible("products") && <div style={{ order: sectionOrder("products") }}><ProductsSection projects={projects} title={siteContent.productsTitle} /></div>}
        <section
          id="network-security"
          aria-labelledby="network-security-title"
          className="border-y border-border bg-muted/30 py-16 sm:py-20"
        >
          <div className="site-container">
            <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-primary/20 bg-card p-7 shadow-sm sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Network & Cybersecurity</div>
                <h2 id="network-security-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Stronger connections. Safer systems.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Need support with network infrastructure, cloud security, or cybersecurity?
                  We’re open to helping you plan, protect, and strengthen your technology.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Network infrastructure", "Cloud security", "Cybersecurity"].map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <Button variant="brand" className="shrink-0" asChild>
                <a
                  href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent("Network and cybersecurity enquiry")}`}
                >
                  Discuss your needs <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        {sectionVisible("gallery") && <div style={{ order: sectionOrder("gallery") }}><GallerySection items={gallery} title={siteContent.galleryTitle} /></div>}
        {sectionVisible("awards") && <div style={{ order: sectionOrder("awards") }}><AwardsSection awards={awards} title={siteContent.awardsTitle} /></div>}
        {sectionVisible("reviews") && <div style={{ order: sectionOrder("reviews") }}><ReviewsSection reviews={reviews} title={siteContent.reviewsTitle} /></div>}
        {sectionVisible("careers") && <div style={{ order: sectionOrder("careers") }}><CareersSection jobs={jobs} title={siteContent.careersTitle} email={settings.contactEmail} /></div>}

        {sectionVisible("facts") && (
          <div style={{ order: sectionOrder("facts") }}>
            <section
              id="facts"
              className="border-t border-border py-16 sm:py-20"
              aria-labelledby="facts-title"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <div className="site-container">
                  <div className="home-section-heading">
                    <div className="eyebrow justify-center">Company Snapshot</div>
                    <h2 id="facts-title" className="section-title">Clear facts about {settings.brandName}</h2>
                  </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Organization</h3>
                    <p className="mt-2 font-semibold text-foreground" itemProp="name">{settings.brandName}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capabilities</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground" itemProp="knowsAbout">
                      {[...new Set(visibleServices.map((service) => service.pillar))].join(" · ") || "Capabilities are being updated."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Enquiries</h3>
                    <a className="mt-2 inline-block text-sm font-semibold text-primary hover:underline" itemProp="email" href={`mailto:${settings.contactEmail}`}>
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* FAQ & LEADERSHIP NOTE */}
        {sectionVisible("faq") && <div style={{ order: sectionOrder("faq") }}><section className="py-20 border-t border-border">
          <div className="site-container">
            <div className="home-section-heading mb-12">
              <div className="eyebrow justify-center">Frequently Asked Questions</div>
              <h2 className="text-3xl font-bold text-foreground">{siteContent.faqTitle}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* FAQ Accordion */}
              <div>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-border bg-card space-y-2">
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <HelpCircle className="size-4 text-primary shrink-0" /> {faq.q}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company approach */}
              <div className="p-8 rounded-2xl border border-border bg-card flex flex-col justify-between gap-8">
                <div>
                  <Layers className="size-9 text-primary" aria-hidden="true" />
                  <h2 className="mt-5 text-2xl font-bold text-foreground">Built around the work, not a template.</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Every engagement starts with the people, goals, and constraints involved. We then bring the right mix of design, engineering, growth, and infrastructure capabilities to the problem.
                  </p>
                </div>
                <Button variant="clean" size="sm" className="w-fit" asChild>
                  <Link to="/about">More about our approach <ArrowUpRight className="size-4 ml-1" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        </div>}

        {/* BLUE CTA BAND */}
        {sectionVisible("cta") && <div style={{ order: sectionOrder("cta") }}><section id="contact" className="contact-band">
          <div className="site-container">
            <h2>{siteContent.closingTitle}</h2>
            <p>{siteContent.closingCopy}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="inverse" size="lg" asChild>
                <Link to="/book-consultation">Book Consultation <ArrowUpRight className="size-4 ml-1" /></Link>
              </Button>
              <Button variant="lightOutline" size="lg" asChild>
                <a href={`mailto:${settings.contactEmail}`}>Email Us Direct</a>
              </Button>
            </div>
            <a className="contact-email" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          </div>
        </section></div>}
        </div>
      </main>

      <Footer />

      {/* SERVICE EXPANDABLE MODAL */}
      <Dialog open={Boolean(activeService)} onOpenChange={(open) => !open && setSelectedServiceIndex(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{activeService?.title}</DialogTitle>
            <DialogDescription>{activeService?.fullDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs">
            <div className="font-bold text-foreground uppercase tracking-wider text-[10px] text-primary">Service Capabilities:</div>
            <ul className="space-y-2">
              {activeService?.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button variant="brand" className="w-full mt-2" asChild>
            <Link to="/book-consultation" onClick={() => setSelectedServiceIndex(null)}>
              Discuss Your Project <ArrowUpRight className="size-4 ml-1" />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}