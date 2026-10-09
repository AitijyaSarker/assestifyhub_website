import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/cms-store";

export function ProjectScopePlanner({
  services,
  email,
  title,
  description,
}: {
  services: Service[];
  email: string;
  title: string;
  description: string;
}) {
  const [service, setService] = useState("");
  const [stage, setStage] = useState("");
  const [goals, setGoals] = useState("");

  const prepareEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      "Hello Assetify Hub,",
      "",
      "I would like to discuss a project.",
      `Service area: ${service}`,
      `Project stage: ${stage}`,
      "",
      "Goals and scope:",
      goals,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Project scope enquiry")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="scope-planner"
      className="py-16 border-t border-border"
      aria-labelledby="scope-title"
    >
      <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <div className="eyebrow">Project Scope Planner</div>
          <h2 id="scope-title" className="section-title">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            This planner prepares an email brief. It does not calculate a quote, timeline, or
            commitment.
          </p>
        </div>

        <form
          onSubmit={prepareEnquiry}
          className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <label className="field-label">
            Service area
            <select
              required
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="form-field"
            >
              <option value="">Choose a service</option>
              {services.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Where are you in the process?
            <select
              required
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              className="form-field"
            >
              <option value="">Choose a stage</option>
              <option value="Exploring an idea">Exploring an idea</option>
              <option value="Planning a new product">Planning a new product</option>
              <option value="Improving an existing product">Improving an existing product</option>
              <option value="Seeking ongoing support">Seeking ongoing support</option>
            </select>
          </label>
          <label className="field-label">
            What would you like to achieve?
            <textarea
              required
              rows={4}
              value={goals}
              onChange={(event) => setGoals(event.target.value)}
              className="form-field"
              placeholder="Describe the problem, intended users, and any key requirements."
            />
          </label>
          <Button type="submit" variant="brand" className="w-fit">
            Prepare email brief <ArrowUpRight className="size-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
