import { faAws } from "@fortawesome/free-brands-svg-icons";
import {
  siDocker,
  siExpress,
  siFlutter,
  siGraphql,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { useCmsStore } from "@/hooks/use-cms-store";

type TechnologyLogo = {
  path: string;
  viewBox: string;
  fill: string;
};

const technologyIcons: Record<string, SimpleIcon> = {
  docker: siDocker,
  express: siExpress,
  "express.js": siExpress,
  flutter: siFlutter,
  graphql: siGraphql,
  mongodb: siMongodb,
  "next.js": siNextdotjs,
  "nextjs": siNextdotjs,
  "node.js": siNodedotjs,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  react: siReact,
  "tailwind css": siTailwindcss,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
};

function getTechnologyIcon(name: string, iconName?: string): TechnologyLogo | undefined {
  const slug = (iconName || name).trim().toLowerCase();
  const simpleIcon =
    technologyIcons[slug] ?? Object.values(technologyIcons).find((icon) => icon.slug === slug);

  if (simpleIcon) {
    return {
      path: simpleIcon.path,
      viewBox: "0 0 24 24",
      fill: simpleIcon.hex === "000000" ? "var(--foreground)" : `#${simpleIcon.hex}`,
    };
  }

  if (slug === "aws") {
    const [width, height, , , pathData] = faAws.icon;
    return {
      path: Array.isArray(pathData) ? pathData.join(" ") : pathData,
      viewBox: `0 0 ${width} ${height}`,
      fill: "var(--foreground)",
    };
  }
}

export function TechStackMarquee() {
  const { techStack } = useCmsStore();
  const visibleTech = techStack.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);

  if (visibleTech.length === 0) return null;

  const repeatedTech = [...visibleTech, ...visibleTech];

  return (
    <section
      aria-label="Technology we use"
      className="technology-section overflow-hidden border-y border-border bg-muted/50 py-14 sm:py-16"
    >
      <div className="site-container home-section-heading mb-8 sm:mb-10">
        <div className="eyebrow justify-center">Technology We Use</div>
        <h2 className="section-title">
          The tools behind thoughtful digital products
        </h2>
      </div>

      <div className="technology-marquee" role="group" aria-label="Continuous technology logo marquee">
        <div className="technology-marquee-track">
          {repeatedTech.map((item, index) => {
            const icon = getTechnologyIcon(item.name, item.iconName);
            const isRepeatedCopy = index >= visibleTech.length;

            return (
              <div
                key={`${item.id}-${index}`}
                className="technology-logo"
                aria-hidden={isRepeatedCopy ? true : undefined}
                title={item.tooltip || item.name}
              >
                {icon ? (
                  <svg
                    aria-hidden="true"
                    className="technology-logo-mark"
                    viewBox={icon.viewBox}
                    role="img"
                  >
                    <path d={icon.path} fill={icon.fill} />
                  </svg>
                ) : (
                  <span className="technology-logo-fallback" aria-hidden="true">
                    {item.name.toLowerCase() === "aws" ? "AWS" : item.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="technology-logo-name">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
