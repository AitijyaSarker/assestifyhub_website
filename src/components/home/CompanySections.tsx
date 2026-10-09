import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Medal, Star } from "lucide-react";
import type {
  Award,
  GalleryItem,
  JobPosition,
  Project,
  Review,
  SiteContent,
  SiteSettings,
} from "@/lib/cms-store";

export function ProductsSection({ projects, title }: { projects: Project[]; title: string }) {
  const visibleProjects = projects
    .filter((project) => project.isVisible)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.order - b.order);
  if (visibleProjects.length === 0) return null;

  return (
    <section id="work" className="portfolio-band" aria-labelledby="work-title">
      <div className="site-container">
        <div className="portfolio-heading home-section-heading">
          <div>
            <div className="eyebrow justify-center">Products & Projects</div>
            <h2 id="work-title" className="section-title">
              {title}
            </h2>
          </div>
          <p className="portfolio-note">
            Explore product and interface concepts. Items marked illustrative are explorations, not
            client case studies.
          </p>
        </div>
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <article key={project.id}>
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="showcase-button"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  width={1200}
                  height={800}
                  loading="lazy"
                />
                <span className="showcase-arrow">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
              <div className="project-caption">
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                  {project.tags?.length ? <p className="mt-2 text-xs text-muted-foreground">{project.tags.slice(0, 3).join(" · ")}</p> : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {project.isFeatured ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">Featured</span> : null}
                  {project.isConcept ? (
                    <span className="concept-tag uppercase font-bold text-[10px]">
                      ILLUSTRATIVE CONCEPT
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/projects" className="text-sm font-semibold text-primary hover:underline">
            Explore all projects <ArrowUpRight className="inline size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function GallerySection({ items, title }: { items: GalleryItem[]; title: string }) {
  const visibleItems = items.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);
  if (visibleItems.length === 0) return null;

  return (
    <section
      id="gallery"
      className="py-16 sm:py-20 border-t border-border"
      aria-labelledby="gallery-title"
    >
      <div className="site-container">
        <div className="eyebrow">Gallery</div>
        <h2 id="gallery-title" className="section-title mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <figure
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <img
                src={item.image}
                alt={item.altText || item.title}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              {item.caption ? (
                <figcaption className="p-4 text-sm text-muted-foreground">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AwardsSection({ awards, title }: { awards: Award[]; title: string }) {
  const visibleAwards = awards.filter((award) => award.isVisible).sort((a, b) => a.order - b.order);
  if (visibleAwards.length === 0) return null;

  return (
    <section
      id="awards"
      className="py-16 sm:py-20 bg-muted/30 border-y border-border"
      aria-labelledby="awards-title"
    >
      <div className="site-container">
        <div className="eyebrow">Recognition</div>
        <h2 id="awards-title" className="section-title mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAwards.map((award) => (
            <article key={award.id} className="rounded-2xl border border-border bg-card p-6">
              {award.image ? (
                <img src={award.image} alt="" className="mb-4 h-20 max-w-full object-contain" loading="lazy" />
              ) : (
                <Medal className="size-7 text-primary" aria-hidden="true" />
              )}
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">
                {award.issuer}
                {award.year ? ` · ${award.year}` : ""}
              </p>
              <h3 className="mt-2 text-lg font-bold text-foreground">{award.title}</h3>
              {award.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {award.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ reviews, title }: { reviews: Review[]; title: string }) {
  const approvedReviews = reviews.filter((review) => review.approved);
  if (approvedReviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="py-16 sm:py-20 border-t border-border"
      aria-labelledby="reviews-title"
    >
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="eyebrow">Reviews & Testimonials</div>
            <h2 id="reviews-title" className="section-title">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/review"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
            >
              <Star className="size-3.5 fill-current" />
              Submit Your Review
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {approvedReviews.map((review) => (
            <figure key={review.id} className="rounded-2xl border border-border bg-card p-6">
              <div
                className="flex gap-1 text-primary"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {Array.from({ length: Math.max(0, Math.min(5, review.rating)) }, (_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                “{review.message}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <span className="font-semibold text-foreground">{review.name}</span>
                {[review.role, review.company].filter(Boolean).length ? (
                  <span className="block text-xs text-muted-foreground">
                    {[review.role, review.company].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CareersSection({
  jobs,
  title,
  email,
}: {
  jobs: JobPosition[];
  title: string;
  email: SiteSettings["contactEmail"];
}) {
  const openings = jobs.filter((job) => job.isVisible);
  if (openings.length === 0) return null;

  return (
    <section
      id="careers"
      className="py-16 sm:py-20 border-t border-border"
      aria-labelledby="careers-title"
    >
      <div className="site-container">
        <div className="home-section-heading mb-8">
          <div className="eyebrow justify-center">Careers</div>
          <h2 id="careers-title" className="section-title">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We look for thoughtful people who care about building useful, well-crafted technology.
          </p>
        </div>
        <div className="space-y-3">
          {openings.map((job) => (
            <article
              key={job.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <BriefcaseBusiness className="size-4 text-primary" /> {job.department} ·{" "}
                  {job.location} · {job.type}
                </div>
                <h3 className="mt-2 font-bold text-foreground">{job.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
              </div>
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(`Career enquiry: ${job.title}`)}`}
                className="shrink-0 text-sm font-semibold text-primary hover:underline"
              >
                Ask about this role <ArrowUpRight className="inline size-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
