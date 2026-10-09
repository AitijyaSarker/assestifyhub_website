import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Zap, 
  Palette, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  LineChart, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Development Process | Assestify Hub" },
      { name: "description", content: "Explore Assestify Hub's proven 7-step engineering process: Discover, Plan, Design, Develop, Test, Launch, and Scale." },
    ],
  }),
  component: ProcessPage,
});

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Understanding your vision & opportunities",
    description: "We dive deep into your business objectives, target audience, competitive landscape, and technical constraints to outline a high-impact roadmap.",
    icon: Lightbulb,
    deliverables: ["Requirements Document", "Technical Feasibility Study", "Project Roadmap"],
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    number: "02",
    title: "Plan",
    subtitle: "Architecture, timelines & milestones",
    description: "Defining system architecture, database schema, tech stack selection, resource allocation, and milestone schedules with zero ambiguity.",
    icon: Zap,
    deliverables: ["Architecture Blueprint", "Sprint Backlog", "Security & SLA Targets"],
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
  {
    number: "03",
    title: "Design",
    subtitle: "Interactive UI/UX & Design Systems",
    description: "Crafting intuitive user journeys, wireframes, high-fidelity prototypes, and design tokens built for seamless component implementation.",
    icon: Palette,
    deliverables: ["Figma Design System", "Interactive Prototype", "Accessibility Compliance"],
    badgeColor: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  },
  {
    number: "04",
    title: "Develop",
    subtitle: "Strictly-typed modern engineering",
    description: "Writing maintainable, performant, clean TypeScript, React components, microservices, and secure API gateways with daily continuous integration.",
    icon: Code2,
    deliverables: ["Modular Codebase", "API Documentation", "Test Suite Coverage"],
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    number: "05",
    title: "Test",
    subtitle: "Automated QA, security & audits",
    description: "Rigorous automated end-to-end testing, static vulnerability scans, performance profiling, and cross-device validation before deployment.",
    icon: ShieldCheck,
    deliverables: ["QA Test Reports", "OWASP Security Audit", "Lighthouse 95+ Score"],
    badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  },
  {
    number: "06",
    title: "Launch",
    subtitle: "Production deployment & zero-downtime cutover",
    description: "Deploying to resilient cloud infrastructure with automated rollout pipelines, real-time error tracking, and DNS cutover monitoring.",
    icon: Rocket,
    deliverables: ["Cloud Infrastructure Setup", "Telemetry & Logging", "Release Notes"],
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    number: "07",
    title: "Scale",
    subtitle: "Optimization & ongoing evolution",
    description: "Continuous performance monitoring, database optimization, feature enhancements, and proactive SLA-backed engineering support.",
    icon: LineChart,
    deliverables: ["24/7 SLA Support", "Load & Scale Reports", "Iterative Enhancements"],
    badgeColor: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  },
];

function ProcessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="site-container">
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <div className="eyebrow justify-center">Engineering Workflow</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Our 7-Step <span className="text-primary">Development Process</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
              A disciplined, transparent engineering methodology designed to turn ambitious concepts into resilient, production-ready software.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="brand" asChild>
                <Link to="/schedule">
                  Schedule Consultation <CalendarCheck className="size-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/projects">
                  Explore Case Studies <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 7 Process Steps Vertical Timeline */}
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 relative mb-24">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === PROCESS_STEPS.length - 1;
              return (
                <div key={step.number} className="relative">
                  {/* Timeline connector line */}
                  {!isLast && (
                    <div 
                      className="absolute left-7 sm:left-9 top-20 bottom-[-2.5rem] w-0.5 bg-gradient-to-b from-primary/40 to-transparent hidden sm:block" 
                      aria-hidden="true" 
                    />
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg group">
                    {/* Number & Icon badge */}
                    <div className="flex sm:flex-col items-center gap-3 shrink-0">
                      <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-accent text-primary flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                        <Icon className="size-7 text-primary" />
                      </div>
                      <span className="font-mono font-bold text-sm text-primary tracking-wider">
                        {step.number}
                      </span>
                    </div>

                    {/* Content details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-2 ${step.badgeColor}`}>
                          Phase {step.number}
                        </span>
                        <h2 className="text-2xl font-bold text-foreground">
                          {step.title}
                        </h2>
                        <p className="text-xs font-medium text-primary">
                          {step.subtitle}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>

                      {/* Deliverables tags */}
                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider block mb-2">
                          Key Deliverables:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {step.deliverables.map((item) => (
                            <span 
                              key={item} 
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-muted/60 text-foreground border border-border/50"
                            >
                              <CheckCircle2 className="size-3.5 text-primary" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Box */}
          <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-card p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <span className="eyebrow justify-center">Start Your Project</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Ready to build something extraordinary?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Book a free technical consultation with our engineering team to map out your architecture, timeline, and deliverables.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="brand" size="lg" asChild>
                <Link to="/schedule">
                  Book Technical Consultation <Sparkles className="size-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Send Enquiry
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
