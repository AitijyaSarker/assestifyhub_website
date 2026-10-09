import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, User, Building, Mail, Phone, FileText, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useCmsStore } from "@/hooks/use-cms-store";
import { format, isWeekend, isBefore, startOfDay } from "date-fns";

const budgetRanges = [
  "Under $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+"
];

export function BookConsultationForm() {
  const { timeSlots, settings } = useCmsStore();
  const availableTimeSlots = useMemo(
    () => timeSlots.filter((slot) => slot.isAvailable).sort((a, b) => a.order - b.order),
    [timeSlots],
  );
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    while (isWeekend(tomorrow)) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return tomorrow;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(() => availableTimeSlots[0]?.label ?? "");
  useEffect(() => {
    if (!availableTimeSlots.some((slot) => slot.label === selectedTimeSlot)) {
      setSelectedTimeSlot(availableTimeSlots[0]?.label ?? "");
    }
  }, [availableTimeSlots, selectedTimeSlot]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "Engineering & Design",
    budgetRange: "$25,000 - $50,000",
    projectBrief: ""
  });

  const [submittedBooking, setSubmittedBooking] = useState<{
    bookingDate: string;
    timeSlot: string;
  } | null>(null);

  // Disable past dates & weekends
  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || isWeekend(date);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    setSubmittedBooking({
      bookingDate: formattedDate,
      timeSlot: selectedTimeSlot
    });

    const subject = `Consultation enquiry: ${formData.name}`;
    const body = `Hello Assetify Hub,\n\nI would like to enquire about a consultation.\n\nPreferred date: ${formattedDate}\nPreferred time: ${selectedTimeSlot}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nInterest: ${formData.serviceInterest}\nBudget range: ${formData.budgetRange}\n\nProject brief:\n${formData.projectBrief}`;
    
    window.location.href = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        {[
          { number: 1, label: "Select Date", icon: CalendarIcon },
          { number: 2, label: "Time Slot", icon: Clock },
          { number: 3, label: "Client Details", icon: User }
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.number;
          const isDone = step > s.number;
          return (
            <div key={s.number} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  isDone
                    ? "bg-primary text-white"
                    : isActive
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <CheckCircle2 className="size-5" /> : s.number}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Date Picker Calendar */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-xl font-bold text-foreground">Step 1: Choose Consultation Date</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Choose a preferred weekday for your consultation enquiry. The time is a preference only; it is not a confirmed booking.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 border border-border rounded-xl bg-background shadow-inner">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                disabled={isDateDisabled}
                className="rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Selected Date: <strong className="text-foreground font-semibold">{selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "None"}</strong>
            </div>
            <Button variant="brand" onClick={() => setStep(2)} disabled={!selectedDate}>
              Next: Select Time Slot <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Time Slot Selector */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-xl font-bold text-foreground">Step 2: Choose Available Time Slot</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Preferred times for <strong className="text-primary">{selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-lg mx-auto">
            {availableTimeSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.label;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot.label)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105"
                      : "bg-background border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  <Clock className="size-3.5" />
                  {slot.label}
                </button>
              );
            })}
            {availableTimeSlots.length === 0 ? (
              <p className="col-span-full rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                There are no consultation times available right now. Please contact us by email.
              </p>
            ) : null}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-border">
            <Button variant="clean" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4 mr-1" /> Back to Date
            </Button>
            <Button variant="brand" onClick={() => setStep(3)} disabled={!selectedTimeSlot}>
              Next: Your Contact Details <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Client Details Form */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-xl font-bold text-foreground">Step 3: Tell Us About Your Project</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Booking scheduled for <strong className="text-primary">{selectedDate ? format(selectedDate, "MMM d, yyyy") : ""} at {selectedTimeSlot}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">
                Full Name *
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="form-field"
                />
              </label>
            </div>

            <div>
              <label className="field-label">
                Work Email Address *
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="sarah@company.com"
                  className="form-field"
                />
              </label>
            </div>

            <div>
              <label className="field-label">
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 019-2834"
                  className="form-field"
                />
              </label>
            </div>

            <div>
              <label className="field-label">
                Company / Organization
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Financial Technologies"
                  className="form-field"
                />
              </label>
            </div>

            <div>
              <label className="field-label">
                Primary Area of Interest
                <select
                  name="serviceInterest"
                  value={formData.serviceInterest}
                  onChange={handleInputChange}
                  className="form-field"
                >
                  <option>Engineering & Design</option>
                  <option>Brand & Digital Growth</option>
                  <option>Infrastructure & Security</option>
                  <option>Custom SaaS & Microservices</option>
                  <option>Security Audit & Zero-Trust</option>
                </select>
              </label>
            </div>

            <div>
              <label className="field-label">
                Estimated Project Budget
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="form-field"
                >
                  {budgetRanges.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">
                Project Summary & Objectives *
                <textarea
                  required
                  rows={4}
                  name="projectBrief"
                  value={formData.projectBrief}
                  onChange={handleInputChange}
                  placeholder="Briefly describe what you would like to build or solve..."
                  className="form-field"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-border">
            <Button type="button" variant="clean" onClick={() => setStep(2)}>
              <ArrowLeft className="size-4 mr-1" /> Back to Time
            </Button>
            <Button type="submit" variant="brand">
              Prepare Email Enquiry <Sparkles className="size-4 ml-1" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 4: Success / Confirmation Screen */}
      {step === 4 && submittedBooking && (
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-accent text-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <CheckCircle2 className="size-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground">Your enquiry draft is ready</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
              Your email app should open with your preferred date and details. Nothing has been booked or sent yet; send the draft to complete your enquiry.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-muted/40 border border-border rounded-xl p-5 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-semibold text-foreground">{submittedBooking.bookingDate} at {submittedBooking.timeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">Client Name:</span>
              <span className="font-semibold text-foreground">{formData.name} ({formData.company})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email draft addressed to:</span>
              <span className="font-semibold text-primary">{settings.contactEmail}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button variant="clean" onClick={() => setStep(1)}>
              Book Another Session
            </Button>
            <Button variant="brand" asChild>
              <a href="/">Return to Home Page</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
