import { useCmsStore } from "@/hooks/use-cms-store";
import { 
  Code2, 
  Layers, 
  Database, 
  Server, 
  Cpu, 
  Smartphone, 
  Cloud, 
  Terminal, 
  Globe, 
  Box,
  FileCode2,
  Workflow
} from "lucide-react";

export function TechStackMarquee() {
  const { techStack } = useCmsStore();
  const visibleTech = techStack.filter((t) => t.isVisible).sort((a, b) => a.order - b.order);

  // Fallback icon selector based on tech category or name
  const getTechIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("react") || n.includes("vue") || n.includes("next")) return Code2;
    if (n.includes("node") || n.includes("express") || n.includes("laravel") || n.includes("php")) return Server;
    if (n.includes("mongo") || n.includes("postgres") || n.includes("sql")) return Database;
    if (n.includes("flutter") || n.includes("mobile")) return Smartphone;
    if (n.includes("aws") || n.includes("cloud") || n.includes("docker")) return Cloud;
    if (n.includes("graphql") || n.includes("api")) return Workflow;
    if (n.includes("typescript")) return FileCode2;
    return Box;
  };

  if (visibleTech.length === 0) return null;

  // Duplicate elements to ensure smooth continuous marquee infinite scroll
  const marqueeItems = [...visibleTech, ...visibleTech];

  return (
    <section className="py-12 border-y border-border bg-muted/30 overflow-hidden">
      <div className="site-container mb-6 text-center">
        <div className="eyebrow justify-center">Modern Technology Ecosystem</div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Engineered with battle-tested frameworks & enterprise infrastructure
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeItems.map((item, idx) => {
            const Icon = getTechIcon(item.name);
            return (
              <div key={`${item.id}-${idx}`} className="tech-card group">
                <div className="p-1.5 rounded-md bg-accent text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-normal">
                  {item.category}
                </span>

                {/* Interactive Tooltip on Hover */}
                <div className="tech-tooltip">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-[10px] opacity-80">{item.tooltip}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
