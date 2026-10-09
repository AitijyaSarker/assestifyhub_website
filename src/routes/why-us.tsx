import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Code2, Zap, Cpu, Award, Lock, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title: "Why Choose Assestify Hub | Engineering Methodology & Standards" },
      { name: "description", content: "Discover Assestify Hub's enterprise engineering principles, zero-trust security posture, sub-100ms render targets, and client SLA guarantees." },
    ],
  }),
  component: WhyUsPage,
});

function WhyUsPage() {
  const differentiators = [
    {
      icon: Code2,
      title: "Zero-Compromise Engineering",
      description: "We write clean, strictly-typed TypeScript and modular microservices architecture designed to scale seamlessly under enterprise workloads."
    },
    {
      icon: Lock,
      title: "Zero-Trust Security First",
      description: "Security isn't an afterthought. Every line of code passes static vulnerability scanning, automated SOC 2 readiness audits, and strict OWASP compliance."
    },
    {
      icon: Zap,
      title: "Sub-100ms Render Performance",
      description: "We optimize render pipelines, database indexing, and static CDN caching to guarantee Lightning-fast load times and top-tier Lighthouse scores."
    },
    {
      icon: Cpu,
      title: "Full-Stack System Autonomy",
      description: "From intuitive React UI component design systems to Node.js / PostgreSQL backends, we own the complete product development lifecycle."
    },
    {
      icon: Award,
      title: "Enterprise SLA & Dedicated Support",
      description: "We stand by our work with guaranteed 99.99% system availability SLAs, rapid incident response times, and ongoing platform maintenance."
    },
    {
      icon: ShieldCheck,
      title: "Transparent B2B Partnership",
      description: "No black boxes or hidden dependencies. You retain 100% intellectual property ownership, complete codebase visibility, and daily status updates."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="eyebrow justify-center">Engineering Philosophy</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Why Forward-Thinking Companies Choose <span className="text-primary">Assestify Hub</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              We bridge the gap between creative visual design and enterprise software engineering. Here is how we guarantee outcomes for our partners.
            </p>
          </div>

          {/* 6 Key Differentiators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {differentiators.map((diff, index) => {
              const Icon = diff.icon;
              return (
                <div key={index} className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{diff.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{diff.description}</p>
                </div>
              );
            })}
          </div>

          {/* Quality Standards Comparison Table */}
          <div className="p-8 rounded-2xl border border-border bg-card mb-20 space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground">The Assestify Engineering Standard</h2>
              <p className="text-xs text-muted-foreground mt-1">Comparing traditional web agencies with Assestify Hub product engineering.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold border-b border-border">
                  <tr>
                    <th className="p-4">Engineering Metric</th>
                    <th className="p-4 text-muted-foreground">Standard Web Agencies</th>
                    <th className="p-4 text-primary bg-accent/40 font-bold">Assestify Hub Standards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-semibold">Codebase Typing</td>
                    <td className="p-4 text-muted-foreground">Loose JavaScript / Basic templates</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Strict TypeScript + Zod Runtime Validation</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Security Posture</td>
                    <td className="p-4 text-muted-foreground">Basic SSL certificate</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Zero-Trust Cloudflare + Automated Vulnerability Scans</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Target Load Time</td>
                    <td className="p-4 text-muted-foreground">2.5s - 4.0s load times</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Sub-100ms render target & 90+ Lighthouse Score</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Content Management</td>
                    <td className="p-4 text-muted-foreground">Rigid hardcoded sites or bloated plugins</td>
                    <td className="p-4 font-semibold text-foreground bg-accent/20">Full CMS Admin Panel with complete CRUD control</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="contact-band">
            <h2>Ready to upgrade your technology infrastructure?</h2>
            <p>Schedule a call with our engineering leaders to review your requirements.</p>
            <Button variant="inverse" size="lg" asChild>
              <Link to="/book-consultation">Book Technical Session <ArrowUpRight className="size-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
