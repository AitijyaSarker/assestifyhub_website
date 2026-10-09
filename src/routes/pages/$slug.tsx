import { createFileRoute, useParams } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsStore } from "@/hooks/use-cms-store";

export const Route = createFileRoute("/pages/$slug")({
  component: CustomDynamicPage,
});

function CustomDynamicPage() {
  const { slug } = useParams({ from: "/pages/$slug" });
  const { customPages } = useCmsStore();

  const page = customPages.find((p) => p.slug === slug) || customPages[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container max-w-4xl space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{page.title}</h1>
            <p className="text-sm text-muted-foreground mt-3">{page.metaDescription}</p>
          </div>

          <div className="space-y-8">
            {page.blocks.map((block) => (
              <div key={block.id} className="p-8 rounded-2xl border border-border bg-card space-y-4">
                {block.title && <h2 className="text-2xl font-bold text-foreground">{block.title}</h2>}
                {block.content && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{block.content}</p>}
                {block.image && <img src={block.image} alt={block.title || "Custom Block Image"} className="w-full rounded-xl border border-border mt-4" />}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
