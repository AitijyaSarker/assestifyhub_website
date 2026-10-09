import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCmsStore } from "@/hooks/use-cms-store";
import { Linkedin, Twitter, Github } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Leadership & Team | Assetify Hub" },
      { name: "description", content: "Meet the executive leadership and senior engineering team architecting Assetify Hub platforms." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { team } = useCmsStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Leadership</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Meet Our <span className="text-primary">Engineering Leaders</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              Our team brings together former Google engineers, CISSP cybersecurity veterans, and award-winning product designers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.id} className="p-6 rounded-2xl border border-border bg-card text-center group hover:border-primary/50 transition-all">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20 group-hover:scale-105 transition-transform"
                />
                <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                <div className="text-xs font-semibold text-primary mb-3">{member.role}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{member.bio}</p>

                <div className="flex justify-center gap-3 text-muted-foreground">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      <Linkedin className="size-4" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      <Twitter className="size-4" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      <Github className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
