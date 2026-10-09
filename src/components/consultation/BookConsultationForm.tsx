import { useEffect, useMemo, useState } from "react";
import {
  Building,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Gift,
  LoaderCircle,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { format, isBefore, isWeekend, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useCmsStore } from "@/hooks/use-cms-store";

const topics = [
  "New project enquiry",
  "Partnership / collaboration",
  "Career opportunity",
  "Technical consultation",
  "General question",
];

interface BookingRecord {
  id: string;
  bookingDate: string;
  timeSlot: string;
  status: string;
}

export function BookConsultationForm() {
  const { timeSlots } = useCmsStore();
  const availableTimeSlots = useMemo(
    () => timeSlots.filter((slot) => slot.isAvailable).sort((a, b) => a.order - b.order),
    [timeSlots],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const nextBusinessDay = new Date();
    nextBusinessDay.setDate(nextBusinessDay.getDate() + 1);
    while (isWeekend(nextBusinessDay)) nextBusinessDay.setDate(nextBusinessDay.getDate() + 1);
    return nextBusinessDay;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availabilityRefresh, setAvailabilityRefresh] = useState(0);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    topic: topics[0] ?? "",
    message: "",
  });

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  useEffect(() => {
    if (!selectedDateKey) return;
    const controller = new AbortController();

    const loadAvailability = async () => {
      setAvailabilityLoading(true);
      setAvailabilityError("");
      setBookedSlots([]);
      try {
        const response = await fetch(
          `/api/schedule/availability?date=${encodeURIComponent(selectedDateKey)}`,
          { signal: controller.signal },
        );
        const result = (await response.json()) as {
          success?: boolean;
          data?: { bookedSlots?: string[] };
          error?: string;
        };
        if (!response.ok || !result.success || !Array.isArray(result.data?.bookedSlots)) {
          throw new Error(result.error || "Could not check time availability.");
        }
        setBookedSlots(result.data.bookedSlots);
      } catch (error) {
        if (controller.signal.aborted) return;
        setAvailabilityError(
          error instanceof Error ? error.message : "Could not check time availability.",
        );
      } finally {
        if (!controller.signal.aborted) setAvailabilityLoading(false);
      }
    };

    void loadAvailability();
    return () => controller.abort();
  }, [selectedDateKey, availabilityRefresh]);

  useEffect(() => {
    if (!selectedDateKey) return;
    const intervalId = window.setInterval(() => {
      setAvailabilityRefresh((refresh) => refresh + 1);
    }, 15_000);
    return () => window.clearInterval(intervalId);
  }, [selectedDateKey]);

  useEffect(() => {
    if (
      !availableTimeSlots.some(
        (slot) => slot.label === selectedTimeSlot && !bookedSlots.includes(slot.label),
      )
    ) {
      setSelectedTimeSlot(
        availableTimeSlots.find((slot) => !bookedSlots.includes(slot.label))?.label ?? "",
      );
    }
  }, [availableTimeSlots, bookedSlots, selectedTimeSlot]);

  const isDateDisabled = (date: Date) => isBefore(date, startOfDay(new Date())) || isWeekend(date);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDateKey || !selectedTimeSlot || availabilityError || availabilityLoading) return;

    setSubmitting(true);
    setBookingError("");
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          topic: formData.topic,
          date: selectedDateKey,
          timeSlot: selectedTimeSlot,
          message: formData.message,
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        data?: BookingRecord;
        error?: string;
      };
      if (!response.ok || !result.success || !result.data?.id) {
        if (response.status === 409) {
          setBookedSlots((current) => [...new Set([...current, selectedTimeSlot])]);
          setSelectedTimeSlot("");
        }
        throw new Error(result.error || "Your booking request could not be saved.");
      }
      setBooking(result.data);
      setBookedSlots((current) => [...new Set([...current, selectedTimeSlot])]);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Your booking request could not be saved. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetBookingForm = () => {
    setBooking(null);
    setBookingError("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      topic: topics[0] ?? "",
      message: "",
    });
    setSelectedTimeSlot("");
  };

  if (booking) {
    return (
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-emerald-200 bg-card shadow-xl dark:border-emerald-900">
        <div className="h-1.5 bg-gradient-to-r from-primary to-emerald-400" />
        <div className="space-y-6 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="size-9" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Booking request received</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              Your requested time is being held while our team reviews it. We’ll contact you at{" "}
              <strong className="text-foreground">{formData.email}</strong> to confirm the
              appointment.
            </p>
          </div>
          <div className="grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon className="size-3.5" /> Date
              </div>
              <div className="text-sm font-semibold text-foreground">
                {format(new Date(`${booking.bookingDate}T00:00:00`), "EEEE, MMMM d, yyyy")}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> Time
              </div>
              <div className="text-sm font-semibold text-foreground">{booking.timeSlot}</div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="mb-1 text-xs text-muted-foreground">Status</div>
              <div className="text-sm font-semibold capitalize text-amber-700 dark:text-amber-300">
                {booking.status}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Reference: {booking.id}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="button" variant="outline" onClick={resetBookingForm}>
              Book Another Call
            </Button>
            <Button variant="brand" asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <form
        onSubmit={handleSubmit}
        className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
      >
        <section className="border-b border-border p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            Pick a date
          </h2>
          <div className="flex justify-center rounded-xl border border-border bg-background p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTimeSlot("");
                setBookingError("");
              }}
              disabled={isDateDisabled}
              className="rounded-md"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Weekends and past dates are unavailable.
          </p>
          {selectedDate ? (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
              <div className="text-xs text-muted-foreground">Selected date</div>
              <div className="text-sm font-semibold text-foreground">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-6 p-5 sm:p-8">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              Choose an available time
            </h2>
            {availabilityLoading ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" /> Checking available times…
              </p>
            ) : availabilityError ? (
              <div className="space-y-2" role="alert">
                <p className="text-sm text-destructive">{availabilityError}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAvailabilityRefresh((refresh) => refresh + 1)}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {availableTimeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot.label);
                  const isSelected = selectedTimeSlot === slot.label;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isBooked}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedTimeSlot(slot.label);
                        setBookingError("");
                      }}
                      className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                        isBooked
                          ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-60"
                          : isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/60"
                      }`}
                    >
                      {slot.label}
                      {isBooked ? " · Booked" : ""}
                    </button>
                  );
                })}
                {availableTimeSlots.length === 0 ? (
                  <p className="col-span-full rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    There are no consultation times available right now. Please contact us.
                  </p>
                ) : null}
                {availableTimeSlots.length > 0 &&
                availableTimeSlots.every((slot) => bookedSlots.includes(slot.label)) ? (
                  <p className="col-span-full text-sm text-muted-foreground">
                    All times are booked for this day. Please choose another date.
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </span>
              Your details
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field-label">
                <span className="flex items-center gap-1">
                  <User className="size-3.5" /> Name <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  maxLength={120}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="form-field"
                />
              </label>
              <label className="field-label">
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" /> Email <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  className="form-field"
                />
              </label>
              <label className="field-label">
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5" /> Phone <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={40}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 555 000 0000"
                  className="form-field"
                />
              </label>
              <label className="field-label">
                <span className="flex items-center gap-1">
                  <Building className="size-3.5" /> Company{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </span>
                <input
                  name="company"
                  autoComplete="organization"
                  maxLength={160}
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company or organization"
                  className="form-field"
                />
              </label>
              <label className="field-label sm:col-span-2">
                Topic <span className="text-destructive">*</span>
                <select
                  required
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="form-field"
                >
                  {topics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </label>
              <label className="field-label sm:col-span-2">
                Message <span className="text-muted-foreground">(optional)</span>
                <textarea
                  name="message"
                  rows={3}
                  maxLength={3000}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us a little about what you’d like to discuss."
                  className="form-field"
                />
              </label>
            </div>
          </div>

          {bookingError ? (
            <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {bookingError}
            </p>
          ) : null}
          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={
              submitting ||
              availabilityLoading ||
              Boolean(availabilityError) ||
              !selectedDate ||
              !selectedTimeSlot
            }
          >
            {submitting ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <CalendarIcon className="mr-2 size-4" />
            )}
            {submitting ? "Submitting request…" : "Request this booking"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your request is pending until our team confirms it. We’ll use your details only to
            respond to this request.
          </p>
        </section>
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: MessageCircle,
            title: "Quick reply",
            copy: "We aim to reply within one business day.",
          },
          { icon: Gift, title: "Free consultation", copy: "A 30-minute call with no obligation." },
          {
            icon: ShieldCheck,
            title: "Secure and private",
            copy: "Your booking details are kept private.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
