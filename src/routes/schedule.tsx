import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookConsultationForm } from "@/components/consultation/BookConsultationForm";
import { Calendar, ShieldCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule a Consultation Call | Assestify Hub" },
      {
        name: "description",
        content:
          "Select your preferred date and time slot to schedule a technical discovery call with Assestify Hub software engineers and architects.",
      },
    ],
  }),
  component: ScheduleCallPage,
});

function ScheduleCallPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="site-container">
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center">Schedule a Conversation</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mt-2">
              Book Your Technical <span className="text-primary">Consultation</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Pick a date and available time that works for you, then share a few details. Your
              request will appear in our admin booking queue while we confirm the appointment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary" /> Free Consultation
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" /> Private & Secure
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" /> Real-time Slot Availability
              </div>
            </div>
          </div>

          {/* Interactive Schedule Booking Form */}
          <BookConsultationForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
