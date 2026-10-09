import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import { ArrowRight, CheckCircle2, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  component: SingleServicePage,
});

function SingleServicePage() {
  const { slug } = useParams({ from: "/services/$slug" });
  const { services } = useCmsStore();
  const service = services.find((item) => item.slug === slug && item.isVisible);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="mb-6">
            <Link
              to="/services"
              className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ArrowLeft className="size-3.5" /> Back to All Services
            </Link>
          </div>

          {service ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <div className="lg:col-span-2 space-y-6">
                <span className="text-xs font-bold text-primary bg-accent px-3 py-1 rounded uppercase tracking-wider">
                  {service.pillar}
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                  {service.title}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {service.fullDescription}
                </p>

                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h2 className="text-lg font-bold text-foreground">Core Capabilities Breakdown</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.items.map((item) => (
                      <div
                        key={item}
                        className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs font-semibold flex items-center gap-2"
                      >
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h2 className="text-lg font-bold text-foreground">
                    Technical Deliverables &amp; Standards
                  </h2>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-2">
                        <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4 text-center">
                  <Sparkles className="size-8 text-primary mx-auto" />
                  <h2 className="text-xl font-bold text-foreground">Need {service.title}?</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Send us a consultation enquiry to discuss your project requirements.
                  </p>
                  <Button variant="brand" className="w-full" asChild>
                    <Link to="/book-consultation">
                      Book Consultation <ArrowRight className="size-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                    Tech Stack Used
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {service.techTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-2.5 py-1 rounded font-semibold text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <h1 className="text-2xl font-bold text-foreground">Service category unavailable</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This service may have been updated or is not currently published.
              </p>
              <Button variant="brand" className="mt-5" asChild>
                <Link to="/services">Browse available services</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
