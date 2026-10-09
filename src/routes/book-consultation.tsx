import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookConsultationForm } from "@/components/consultation/BookConsultationForm";
import { Calendar, ShieldCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/book-consultation")({
  head: () => ({
    meta: [
      { title: "Book Technical Consultation | Assestify Hub" },
      { name: "description", content: "Schedule a 45-minute technical discovery session with Assestify Hub software engineers and solution architects." },
    ],
  }),
  component: BookConsultationPage,
});

function BookConsultationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container">
          {/* Page Banner */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center">Schedule a Conversation</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Book Your Technical <span className="text-primary">Consultation</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Connect directly with our lead architects and engineers. Pick your preferred date and time slot below for a 45-minute project discovery session.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary" /> 45-Minute Session
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Zero-Commitment Strategy
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" /> Real-time Slot Availability
              </div>
            </div>
          </div>

          {/* Booking Form System */}
          <BookConsultationForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
