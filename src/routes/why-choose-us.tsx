import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Code2, 
  Zap, 
  Cpu, 
  Award, 
  Lock, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/why-choose-us")({
  head: () => ({
    meta: [
      { title: "Why Choose Assetify Hub | Enterprise Engineering Standards" },
      { name: "description", content: "Discover why teams choose Assetify Hub: zero-compromise engineering, zero-trust security, sub-100ms render targets, and SLA-backed partnerships." },
    ],
  }),
  component: WhyChooseUsPage,
});

const DIFFERENTIATORS = [
  {
    icon: Code2,
    title: "Zero-Compromise Engineering",
    description: "We write clean, strictly-typed TypeScript and modular architecture designed to scale seamlessly under enterprise workloads without accumulating technical debt."
  },
  {
    icon: Lock,
    title: "Zero-Trust Security First",
    description: "Security isn't an afterthought. Every line of code passes static vulnerability scanning, automated SOC 2 readiness audits, and strict OWASP compliance checks."
  },
  {
    icon: Zap,
    title: "Sub-100ms Render Performance",
    description: "We optimize render pipelines, database indexing, and static CDN caching to guarantee lightning-fast load times and top-tier Core Web Vitals scores."
  },
  {
    icon: Cpu,
    title: "Full-Stack System Autonomy",
    description: "From intuitive React UI component design systems to Node.js / MongoDB backends, we own the complete product development lifecycle end-to-end."
  },
  {
    icon: Award,
    title: "Enterprise SLA & Dedicated Support",
    description: "We stand by our work with guaranteed 99.99% system availability SLAs, rapid incident response times, and ongoing platform maintenance."
  },
  {
    icon: ShieldCheck,
    title: "Transparent Partnership",
    description: "No black boxes or hidden dependencies. You retain 100% intellectual property ownership, complete codebase visibility, and weekly sprint demos."
  }
];

const TRUST_METRICS = [
  { number: "50+", label: "Projects Delivered", detail: "Across fintech, enterprise SaaS, and healthtech" },
  { number: "99.9%", label: "Uptime SLA", detail: "Guaranteed cloud infrastructure availability" },
  { number: "24/7", label: "Dedicated Support", detail: "Continuous uptime monitoring & rapid triage" },
  { number: "6+", label: "Years Experience", detail: "In modern full-stack web and mobile engineering" }
];

function WhyChooseUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="site-container">
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="eyebrow justify-center">Engineering Philosophy</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Why Forward-Thinking Teams Choose <span className="text-primary">Assetify Hub</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
              We bridge the gap between creative visual design and enterprise software engineering. Here is how we guarantee outcomes for our partners.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="brand" asChild>
                <Link to="/schedule">
                  Schedule Consultation <Sparkles className="size-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/process">
                  Our 7-Step Process <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* 6 Key Differentiators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
            {DIFFERENTIATORS.map((diff, index) => {
              const Icon = diff.icon;
              return (
                <div key={index} className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3">{diff.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{diff.description}</p>
                </div>
              );
            })}
          </div>

          {/* 4 Trust Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-8 rounded-3xl border border-border bg-card mb-20">
            {TRUST_METRICS.map((metric) => (
              <div key={metric.label} className="text-center p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">
                  {metric.number}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {metric.label}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Quality Standards Comparison Table */}
          <div className="p-8 sm:p-10 rounded-3xl border border-border bg-card mb-20 space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">The Assetify Engineering Standard</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Comparing conventional outsourcing with Assetify Hub dedicated product engineering.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold border-b border-border">
                  <tr>
                    <th className="p-4">Engineering Metric</th>
                    <th className="p-4 text-muted-foreground">Standard Web Agencies</th>
                    <th className="p-4 text-primary bg-accent/40 font-bold">Assetify Hub Standards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Type Safety & Code Quality</td>
                    <td className="p-4 text-muted-foreground">Loose JS, occasional typing</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Strict TypeScript throughout, ESLint automated linting</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Performance & Render Targets</td>
                    <td className="p-4 text-muted-foreground">Generic templates, sluggish load times</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Sub-100ms render targets, 95+ Lighthouse scores</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Security Audits</td>
                    <td className="p-4 text-muted-foreground">Basic plugins, manual inspection</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Automated OWASP scans, zero-trust secrets management</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-foreground">Code Ownership</td>
                    <td className="p-4 text-muted-foreground">Vendor lock-in, proprietary runtime</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">100% Client IP ownership from day one</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Experience the difference on your next project</h3>
            <p className="text-sm text-muted-foreground">
              Speak directly with an engineering lead to evaluate your technical roadmap.
            </p>
            <Button variant="brand" size="lg" asChild>
              <Link to="/schedule">
                Book Technical Consultation <Sparkles className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
