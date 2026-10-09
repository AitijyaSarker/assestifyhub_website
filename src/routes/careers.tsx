import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import { MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Job Openings | Assestify Hub" },
      { name: "description", content: "Join Assestify Hub's software engineering and UI/UX product design teams." },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const { jobs, settings } = useCmsStore();
  const openings = jobs.filter((job) => job.isVisible);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Join Our Team</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Build What's Next at <span className="text-primary">Assestify Hub</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              Explore current openings and contact us by email to ask about a role or share your experience.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {openings.map((job) => (
              <div key={job.id} className="p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-primary bg-accent px-2.5 py-0.5 rounded uppercase">
                      {job.department}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" /> {job.location} · {job.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
                  {job.requirements?.length ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                      {job.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                    </ul>
                  ) : null}
                </div>

                <Button variant="brand" className="shrink-0" asChild>
                  <a href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Career enquiry: ${job.title}`)}&body=${encodeURIComponent(`Hello Assestify Hub,\n\nI am interested in the ${job.title} role.\n\nName:\nEmail:\nRelevant experience:\n`)}`}>
                    Ask about this role <ArrowRight className="size-4 ml-1" />
                  </a>
                </Button>
              </div>
            ))}
            {openings.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                There are no published openings right now. Please check back later.
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
