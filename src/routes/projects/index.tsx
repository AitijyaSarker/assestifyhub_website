import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Portfolio & Case Studies | Assetify Hub" },
      { name: "description", content: "Explore Assetify Hub illustrative design concepts, mobile experiences, and web application platforms." },
    ],
  }),
  component: ProjectsIndexPage,
});

function ProjectsIndexPage() {
  const { projects } = useCmsStore();
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(projects.map((project) => project.category).filter(Boolean))];
  const visibleProjects = projects
    .filter((project) => project.isVisible)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.order - b.order);

  const filteredProjects = filter === "All"
    ? visibleProjects
    : visibleProjects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center">Design Explorations</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              A Glimpse of <span className="text-primary">What's Possible</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              Illustrative concepts exploring the intersection of thoughtful user interface design and high-performance technology.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {filteredProjects.map((item) => (
              <article key={item.id} className="group">
                <Link to={`/projects/$slug`} params={{ slug: item.slug }} className="showcase-button">
                  <img src={item.coverImage} alt={item.title} className="w-full aspect-[3/2] object-cover" />
                  <span className="showcase-arrow">
                    <ArrowUpRight className="size-5" />
                  </span>
                </Link>
                <div className="project-caption">
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                    {item.tags?.length ? <p className="mt-2 text-xs text-muted-foreground">{item.tags.slice(0, 4).join(" · ")}</p> : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {item.isFeatured ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">Featured</span> : null}
                    {item.isConcept ? <span className="concept-tag uppercase font-bold text-[10px]">ILLUSTRATIVE CONCEPT</span> : null}
                  </div>
                </div>
              </article>
            ))}
            {filteredProjects.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No published projects match this category yet.
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
