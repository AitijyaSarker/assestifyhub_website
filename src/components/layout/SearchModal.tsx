import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ArrowRight, Code, FolderKanban, BookOpen, Layers } from "lucide-react";
import { useCmsStore } from "@/hooks/use-cms-store";
import { Link } from "@tanstack/react-router";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { services, projects, blogPosts, customPages } = useCmsStore();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedServices = services
      .filter((s) => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q))
      .map((s) => ({
        id: `srv-${s.id}`,
        type: "Service",
        icon: Code,
        title: s.title,
        description: s.shortDescription,
        url: `/services/${s.slug}`,
      }));

    const matchedProjects = projects
      .filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .map((p) => ({
        id: `proj-${p.id}`,
        type: "Case Study",
        icon: FolderKanban,
        title: p.title,
        description: p.summary,
        url: `/projects/${p.slug}`,
      }));

    const matchedPosts = blogPosts
      .filter((b) => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q))
      .map((b) => ({
        id: `blog-${b.id}`,
        type: "Blog Article",
        icon: BookOpen,
        title: b.title,
        description: b.summary,
        url: `/blog/${b.slug}`,
      }));

    const matchedPages = customPages
      .filter((cp) => cp.title.toLowerCase().includes(q))
      .map((cp) => ({
        id: `page-${cp.id}`,
        type: "Custom Page",
        icon: Layers,
        title: cp.title,
        description: cp.metaDescription,
        url: `/pages/${cp.slug}`,
      }));

    return [...matchedServices, ...matchedProjects, ...matchedPosts, ...matchedPages];
  }, [query, services, projects, blogPosts, customPages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center gap-3">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, portfolio, insights, pages..."
            className="w-full bg-transparent border-none text-base outline-none focus:outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Type keywords to search across <span className="text-primary font-medium">Assestify Hub</span> services, portfolio, blog insights, and custom pages.
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching results found for "<span className="font-semibold text-foreground">{query}</span>".
            </div>
          ) : (
            <div className="grid gap-2">
              {results.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={() => onOpenChange(false)}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/80 transition-colors group text-decoration-none"
                  >
                    <div className="p-2 rounded-md bg-accent text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-primary bg-accent px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
