import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Rocket, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";
import architecture from "@/assets/architecture.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Assetify Hub | Enterprise Technology Partner" },
      { name: "description", content: "Learn about Assetify Hub's mission, engineering roots, leadership story, and track record." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const milestones = [
    { year: "2020", title: "Foundation", detail: "Assetify Hub was established to bring enterprise software engineering discipline to high-growth tech ventures." },
    { year: "2022", title: "Cloud Security Practice", detail: "Launched Zero-Trust cybersecurity and cloud infrastructure engineering division." },
    { year: "2024", title: "Global Expansion", detail: "Expanded operations across North America, Europe, and Asia with 50+ full-stack engineers and designers." },
    { year: "2026", title: "Assetify CMS 2.0", detail: "Pioneered real-time reactive CMS page builders and high-contrast dual-theme UI design systems." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="eyebrow">Our Story</div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Architecting Digital Solutions Built Around <span className="text-primary">Your Business.</span>
              </h1>
              <p className="text-base text-muted-foreground mt-4 leading-relaxed">
                At Assetify Hub, we combine deep technical execution with thoughtful visual experience design. We don't just build websites or software—we engineer scalable digital assets that empower businesses to lead their industries.
              </p>
              <div className="pt-6">
                <Button variant="brand" asChild>
                  <Link to="/book-consultation">Work With Us <ArrowUpRight className="size-4 ml-1" /></Link>
                </Button>
              </div>
            </div>

            <div className="hero-visual">
              <img src={architecture} alt="Assetify Hub HQ Concept Architecture" className="rounded-2xl shadow-xl border border-border" />
            </div>
          </div>

          {/* Interactive Milestone Timeline */}
          <div className="py-12 border-t border-border mb-16">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="eyebrow justify-center">Milestones</div>
              <h2 className="text-3xl font-bold text-foreground">Our Evolution Story</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((m) => (
                <div key={m.year} className="p-6 rounded-xl border border-border bg-card">
                  <div className="text-2xl font-extrabold text-primary mb-2">{m.year}</div>
                  <h3 className="font-bold text-base text-foreground mb-2">{m.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
