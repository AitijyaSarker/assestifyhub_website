import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/hooks/use-cms-store";
import { Mail, Phone, MapPin, Send, ArrowUpRight, Building2, Globe } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Assetify Hub | Get In Touch" },
      { name: "description", content: "Reach out to Assetify Hub engineering team. Global offices in New York, London, Dhaka, and Singapore." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { settings, services } = useCmsStore();

  const offices = [
    { city: "New York (HQ)", address: "100 Innovation Way, Suite 400, New York, NY 10001", phone: "+1 (800) 555-2773" },
    { city: "London", address: "30 St Mary Axe, City of London, EC3A 8EP", phone: "+44 20 7946 0912" },
    { city: "Dhaka", address: "Gulshan Avenue, Tower 5, Level 12, Dhaka 1212", phone: "+880 2 988 1234" },
    { city: "Singapore", address: "1 Raffles Place, #20-01 One Raffles Place, Singapore 048616", phone: "+65 6789 0123" }
  ];

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `General Contact Enquiry: ${String(data.get("service"))}`;
    const body = `Hello Assetify Hub,\n\n${String(data.get("message"))}\n\nFrom: ${String(data.get("name"))}\nEmail: ${String(data.get("email"))}\nCompany: ${String(data.get("company"))}\nInterest: ${String(data.get("service"))}`;
    
    // Per AGENTS.md rule: send via prefilled email draft
    window.location.href = `mailto:welisten@assetify.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow justify-center">Get In Touch</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Let's Build What <span className="text-primary">Comes Next</span>
            </h1>
            <p className="text-base text-muted-foreground mt-4 leading-relaxed">
              Have an idea, a complex architecture challenge, or a growth ambition? We are here to listen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <div className="p-8 rounded-2xl border border-border bg-card shadow-xl">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <label className="field-label">
                  Your Full Name *
                  <input required name="name" type="text" placeholder="Sarah Jenkins" className="form-field" />
                </label>

                <label className="field-label">
                  Email Address *
                  <input required name="email" type="email" placeholder="sarah@company.com" className="form-field" />
                </label>

                <label className="field-label">
                  Company Name
                  <input name="company" type="text" placeholder="Acme Global Inc." className="form-field" />
                </label>

                <label className="field-label">
                  Area of Interest
                  <select name="service" className="form-field">
                    {services.map((s) => (
                      <option key={s.id}>{s.title}</option>
                    ))}
                    <option>General Enquiry</option>
                  </select>
                </label>

                <label className="field-label">
                  Your Project Brief or Question *
                  <textarea required name="message" rows={4} placeholder="Describe your project goals or technical question..." className="form-field" />
                </label>

                <Button type="submit" variant="brand" className="w-full">
                  Open Prefilled Email Draft <ArrowUpRight className="size-4 ml-1" />
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Your email application will open addressed to <strong className="text-primary">welisten@assetify.com</strong>.
                </p>
              </form>
            </div>

            {/* Office Locations Grid & Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-lg font-bold text-foreground mb-4">Direct Contacts</h3>
                <ul className="space-y-3 text-xs">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="size-4 text-primary" />
                    <span>Email: <strong className="text-foreground">{settings.contactEmail}</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="size-4 text-primary" />
                    <span>Phone: <strong className="text-foreground">{settings.contactPhone}</strong></span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offices.map((off) => (
                  <div key={off.city} className="p-5 rounded-xl border border-border bg-card">
                    <div className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
                      <Building2 className="size-4 text-primary" /> {off.city}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{off.address}</p>
                    <div className="text-[11px] font-semibold text-primary">{off.phone}</div>
                  </div>
                ))}
              </div>

              {/* Interactive Visual Map Frame */}
              <div className="p-4 rounded-2xl border border-border bg-card text-center">
                <div className="w-full h-40 bg-muted/60 rounded-xl flex items-center justify-center border border-border">
                  <div className="text-center">
                    <Globe className="size-8 text-primary mx-auto mb-2 animate-pulse" />
                    <span className="text-xs font-semibold text-foreground">Global Operations Map</span>
                    <p className="text-[10px] text-muted-foreground">New York · London · Dhaka · Singapore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
