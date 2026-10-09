import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$slug")({
  component: SingleProjectPage,
});

function SingleProjectPage() {
  const { slug } = useParams({ from: "/projects/$slug" });
  const { projects, store, settings } = useCmsStore();

  const project = projects.find((p) => (p.slug === slug || p.id === slug) && p.isVisible);
  const projectImages = project
    ? [...new Set([project.coverImage, ...(project.gallery ?? [])].filter(Boolean))]
    : [];

  const [accessName, setAccessName] = useState("");
  const [accessEmail, setAccessEmail] = useState("");
  const [accessPhone, setAccessPhone] = useState("");
  const [accessCompany, setAccessCompany] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [accessSubmitted, setAccessSubmitted] = useState(false);
  const [accessSubmitting, setAccessSubmitting] = useState(false);

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !accessName.trim() || !accessEmail.trim()) {
      toast.error("Please enter your name and email address.");
      return;
    }

    setAccessSubmitting(true);
    try {
      store.addProjectAccessRequest(project.id, {
        name: accessName,
        email: accessEmail,
        phone: accessPhone,
        company: accessCompany,
        message: accessMessage,
      });

      try {
        await fetch(`/api/projects/${project.id}/access`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: accessName,
            email: accessEmail,
            phone: accessPhone,
            company: accessCompany,
            message: accessMessage,
          }),
        });
      } catch {
        // offline fallback
      }

      setAccessSubmitted(true);
      toast.success("Access request received! Our team will contact you shortly.");
    } catch {
      toast.error("Unable to submit request. Please try again.");
    } finally {
      setAccessSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="mb-6">
            <Link to="/projects" className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Back to Case Studies
            </Link>
          </div>

          {project ? (
          <>
          {/* Title Header */}
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-primary bg-accent px-3 py-1 rounded uppercase tracking-wider">
                {project.category}
              </span>
              {project.isConcept ? <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded">ILLUSTRATIVE CONCEPT</span> : null}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {project.title}
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              {project.summary}
            </p>
            {project.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Key Metrics Band */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl border border-border bg-card mb-12">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                <div className="text-3xl font-extrabold text-primary">{m.value}</div>
                <div className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Project Image */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projectImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${project.title} view ${index + 1}`}
                className={`w-full rounded-2xl border border-border object-cover shadow-xl ${index === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {/* Challenge / Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
              <h3 className="text-xl font-bold text-foreground">The Challenge</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
              <h3 className="text-xl font-bold text-foreground">The Solution & Architecture</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Results */}
          <div className="p-8 rounded-2xl border border-border bg-card mb-16 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Key Delivered Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.results.map((res, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-foreground p-3 rounded-lg bg-muted/40">
                  <CheckCircle2 className="size-4 text-primary shrink-0" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>

          {(project.techTags.length > 0 || project.accessFeatures?.length || project.review || project.awards || project.serviceOwners?.length || project.link) ? (
            <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
              {project.techTags.length > 0 ? (
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-foreground">Technology Stack</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techTags.map((technology) => <span key={technology} className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-primary">{technology}</span>)}
                  </div>
                </section>
              ) : null}
              {project.accessFeatures?.length ? (
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-foreground">Access Features</h2>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {project.accessFeatures.map((feature) => <li key={feature} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />{feature}</li>)}
                  </ul>
                </section>
              ) : null}
              {project.review ? (
                <blockquote className="rounded-2xl border border-border bg-card p-6 text-sm italic leading-relaxed text-muted-foreground">
                  <h2 className="mb-3 text-lg font-bold not-italic text-foreground">Client Review</h2>
                  “{project.review}”
                </blockquote>
              ) : null}
              {project.awards ? (
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-foreground">Awards & Recognition</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{project.awards}</p>
                </section>
              ) : null}
              {project.serviceOwners?.length ? (
                <section className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-foreground">Service Owners</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {project.serviceOwners.map((owner) => <li key={owner} className="rounded-lg bg-muted/40 px-4 py-3">{owner}</li>)}
                  </ul>
                </section>
              ) : null}
              {project.link ? (
                <section className="flex items-center rounded-2xl border border-border bg-card p-6">
                  <a href={project.link} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                    Visit live project <ArrowUpRight className="ml-1 inline size-4" />
                  </a>
                </section>
              ) : null}
            </div>
          ) : null}

          {/* REQUEST PROJECT ACCESS FORM (UltraBulb IT Feature) */}
          <div id="request-access" className="mb-16 p-8 rounded-2xl border border-border bg-card">
            <div className="max-w-2xl">
              <span className="eyebrow">Enterprise Exploration</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Request Project Access & Deep Dive
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Interested in evaluating the architecture, source implementation, or a private walkthrough of {project.title}? Submit your details below.
              </p>
            </div>

            {accessSubmitted ? (
              <div className="mt-6 p-6 rounded-xl bg-accent/40 border border-border flex items-center gap-4">
                <CheckCircle2 className="size-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Access Request Received</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Thank you, {accessName}. Our team will review your request and get in touch at {accessEmail} with architecture documentation.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAccessSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="field-label">
                  Full Name <span className="text-destructive">*</span>
                  <input
                    type="text"
                    required
                    value={accessName}
                    onChange={(e) => setAccessName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="form-field"
                  />
                </label>

                <label className="field-label">
                  Work Email <span className="text-destructive">*</span>
                  <input
                    type="email"
                    required
                    value={accessEmail}
                    onChange={(e) => setAccessEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="form-field"
                  />
                </label>

                <label className="field-label">
                  Phone Number
                  <input
                    type="tel"
                    value={accessPhone}
                    onChange={(e) => setAccessPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="form-field"
                  />
                </label>

                <label className="field-label">
                  Company / Organization
                  <input
                    type="text"
                    value={accessCompany}
                    onChange={(e) => setAccessCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="form-field"
                  />
                </label>

                <label className="field-label sm:col-span-2">
                  What would you like to explore?
                  <textarea
                    rows={3}
                    value={accessMessage}
                    onChange={(e) => setAccessMessage(e.target.value)}
                    placeholder="Tell us what aspects of this solution you are interested in exploring (e.g. architecture, deployment setup, live demo)..."
                    className="form-field"
                  />
                </label>

                <div className="sm:col-span-2 flex items-center justify-between pt-2">
                  <span className="text-[11px] text-muted-foreground">
                    Confidential. We never share your contact details.
                  </span>
                  <Button type="submit" variant="brand" disabled={accessSubmitting} className="gap-2">
                    <Send className="size-4" />
                    {accessSubmitting ? "Submitting..." : "Request Project Access"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* CTA Band */}
          <div className="contact-band">
            <h2>Want to build an outcome like this?</h2>
            <p>Let's collaborate to engineer your custom software or design system.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="inverse" size="lg" asChild>
                <Link to="/book-consultation">Start A Project <ArrowUpRight className="size-4 ml-1" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10">
                <Link to="/schedule">Schedule A Call <Sparkles className="size-4 ml-1" /></Link>
              </Button>
            </div>
          </div>
          </>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <h1 className="text-2xl font-bold text-foreground">Project unavailable</h1>
              <p className="mt-2 text-sm text-muted-foreground">This project may have been updated or is not currently published.</p>
              <Button variant="brand" className="mt-5" asChild>
                <Link to="/projects">Browse available projects</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
