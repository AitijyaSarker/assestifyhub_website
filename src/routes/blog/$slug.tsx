import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsStore } from "@/hooks/use-cms-store";
import { ArrowLeft, Clock, Share2, Linkedin, Twitter, Facebook, Copy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/blog/$slug")({
  component: SingleBlogPostPage,
});

function SingleBlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { blogPosts } = useCmsStore();
  const [copied, setCopied] = useState(false);

  const post = blogPosts.find((b) => b.slug === slug) || blogPosts[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container max-w-3xl">
          <div className="mb-6">
            <Link to="/blog" className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Back to Blog & Insights
            </Link>
          </div>

          <article className="space-y-8">
            {/* Header Metadata */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-primary bg-accent px-3 py-1 rounded uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3.5" /> {post.readTimeMinutes} min read · Published {post.publishedAt}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {post.title}
              </h1>

              {/* Author Card */}
              <div className="flex items-center gap-3 pt-2">
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                <div>
                  <div className="font-bold text-sm text-foreground">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.role}</div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden border border-border">
              <img src={post.coverImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
            </div>

            {/* Article Content Render */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
            </div>

            {/* Share & Tags Footer */}
            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase">Tags:</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted px-2.5 py-1 rounded text-muted-foreground font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground mr-1">Share:</span>
                <button onClick={handleCopyLink} className="p-2 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1">
                  <Copy className="size-3.5" /> {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
