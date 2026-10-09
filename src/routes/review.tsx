import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MessageSquare, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCmsStore } from "@/hooks/use-cms-store";
import { toast } from "sonner";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Client Reviews & Feedback | Assestify Hub" },
      { name: "description", content: "Read authentic feedback from leaders and engineering teams who partner with Assestify Hub, or share your own experience." },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const { reviews, store, siteContent } = useCmsStore();
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const approvedReviews = reviews.filter((r) => r.approved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and review message.");
      return;
    }

    setSubmitting(true);
    try {
      // Save locally to CMS store
      store.addReview({
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        company: company.trim(),
        rating,
        message: message.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });

      // Submit to backend API
      try {
        await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            role: role.trim(),
            company: company.trim(),
            rating,
            message: message.trim(),
            avatarUrl: avatarUrl.trim() || null,
          }),
        });
      } catch {
        // Backend optional / offline fallback
      }

      setSubmitted(true);
      toast.success("Thank you! Your review has been submitted for moderation.");
      setTimeout(() => {
        setFormOpen(false);
        setSubmitted(false);
        setName("");
        setEmail("");
        setRole("");
        setCompany("");
        setMessage("");
        setAvatarUrl("");
        setRating(5);
      }, 2000);
    } catch {
      toast.error("Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="site-container">
          {/* Hero Banner */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <div className="mx-auto size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
              <MessageSquare className="size-6" />
            </div>
            <div className="eyebrow justify-center">Client Testimonials</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mt-2">
              What Partners Say About <span className="text-primary">Assestify Hub</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
              {siteContent.reviewsTitle || "Explore authentic impressions from engineering teams and leaders who build digital products with us."} Read their experiences or submit your own.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="brand" size="lg" onClick={() => setFormOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
                <Star className="size-4 fill-current" />
                Submit Your Review
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/" className="gap-1.5">
                  <ArrowLeft className="size-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </section>

          {/* Published Reviews Grid */}
          <section>
            {approvedReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center max-w-xl mx-auto">
                <MessageSquare className="size-10 text-muted-foreground/60 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">Be the first to share your experience</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Approved partner reviews will appear here. Click "Submit Your Review" above to share your thoughts with our team.
                </p>
                <Button variant="brand" className="mt-6" onClick={() => setFormOpen(true)}>
                  Submit First Review
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedReviews.map((rev) => {
                  const initials = rev.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <article key={rev.id} className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm hover:shadow-md">
                      <div>
                        {/* Rating stars */}
                        <div className="flex items-center gap-1 text-amber-400 mb-4" aria-label={`${rev.rating} out of 5 stars`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-sm leading-relaxed text-foreground font-medium mb-6">
                          "{rev.message}"
                        </blockquote>
                      </div>

                      {/* Author Card */}
                      <footer className="pt-4 border-t border-border/70 flex items-center gap-3">
                        {rev.avatarUrl ? (
                          <img src={rev.avatarUrl} alt={rev.name} className="size-10 rounded-full object-cover border border-border" />
                        ) : (
                          <div className="size-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <cite className="font-bold text-xs text-foreground not-italic block truncate">
                            {rev.name}
                          </cite>
                          {(rev.role || rev.company) && (
                            <span className="text-[11px] text-muted-foreground block truncate">
                              {[rev.role, rev.company].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </div>
                      </footer>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Review Submission Dialog Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-primary" /> Share Your Experience
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tell us about collaborating with Assestify Hub. Reviews are moderated prior to public publication.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-foreground">Review Submitted!</h3>
              <p className="text-xs text-muted-foreground">
                Thank you for your feedback. Our team will review and publish it shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Rating picker */}
              <div>
                <label className="field-label mb-1">
                  Rating <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`size-6 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-muted-foreground ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="field-label">
                  Your Full Name <span className="text-destructive">*</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="form-field"
                  />
                </label>

                <label className="field-label">
                  Email Address <span className="text-destructive">*</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="form-field"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="field-label">
                  Your Role / Title
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Chief Product Officer"
                    className="form-field"
                  />
                </label>

                <label className="field-label">
                  Company / Organization
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Health"
                    className="form-field"
                  />
                </label>
              </div>

              <label className="field-label">
                Your Review / Experience <span className="text-destructive">*</span>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the quality of delivery, communication, and engineering outcomes..."
                  className="form-field"
                />
              </label>

              <label className="field-label">
                Avatar Image URL (Optional)
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="form-field"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
