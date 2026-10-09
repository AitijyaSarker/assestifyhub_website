import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsStore } from "@/hooks/use-cms-store";
import { Search, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & Insights | Assetify Hub" },
      { name: "description", content: "Engineering insights, software architecture guides, and cloud security articles from Assetify Hub." },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { blogPosts } = useCmsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = ["All", "Engineering", "Security", "Design", "Growth"];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCat = selectedCat === "All" || post.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch && post.isVisible;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center">Tech Insights</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Software Engineering & <span className="text-primary">Architecture Insights</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              Deep dives into microservices, zero-trust cybersecurity, scalable design systems, and cloud infrastructure.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCat === cat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="form-field pl-9 py-2 text-xs"
              />
            </div>
          </div>

          {/* Blog Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredPosts.map((post) => (
              <article key={post.id} className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between hover:border-primary/50 transition-all group">
                <div>
                  <img src={post.coverImage} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-xl mb-4 border border-border" />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-primary bg-accent px-2.5 py-0.5 rounded uppercase">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> {post.readTimeMinutes} min read · {post.publishedAt}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{post.summary}</p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                    <span>{post.author.name}</span>
                  </div>

                  <Link to={`/blog/$slug`} params={{ slug: post.slug }} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                    Read Article <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
