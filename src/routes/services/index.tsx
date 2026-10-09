import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import { ArrowRight, Code2, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services & Capabilities Catalogue | Assetify Hub" },
      { name: "description", content: "Explore Assetify Hub's capabilities across Engineering & Design, Brand Growth, and Cloud Security." },
    ],
  }),
  component: ServicesIndexPage,
});

function ServicesIndexPage() {
  const { services } = useCmsStore();
  const visibleServices = services.filter((service) => service.isVisible).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Capabilities Catalogue</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Different Disciplines. <span className="text-primary">One Connected Vision.</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              From the first software architecture blueprint to zero-trust cloud deployment, explore our engineering services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {visibleServices.map((service, idx) => (
              <div key={service.id} className="service-item flex flex-col justify-between">
                <div>
                  <span className="service-number">0{idx + 1}</span>
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">{service.shortDescription}</p>

                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Key Offerings:</div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {visibleServices.length === 0 ? (
                        <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                          Service categories are being updated. Please contact us to discuss your project.
                        </p>
                      ) : null}
                    </ul>
                  </div>
                </div>

                <Button variant="brand" className="w-full mt-4" asChild>
                  <Link to={`/services/$slug`} params={{ slug: service.slug }}>
                    Explore Capabilities <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
