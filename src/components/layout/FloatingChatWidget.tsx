import { useEffect, useRef, useState, type FormEvent } from "react";
import { faFacebookMessenger, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { LoaderCircle, Send, X } from "lucide-react";
import { useCmsStore } from "@/hooks/use-cms-store";
import chatbotImage from "@/assets/chatbot.png";

interface ChatForm {
  name: string;
  email: string;
  message: string;
}

function getWhatsappHref(value: string) {
  const contact = value.trim();
  if (!contact) return "";

  if (/^https?:\/\//i.test(contact)) {
    try {
      const url = new URL(contact);
      return url.protocol === "https:" &&
        ["wa.me", "www.whatsapp.com", "whatsapp.com", "api.whatsapp.com"].includes(url.hostname)
        ? url.toString()
        : "";
    } catch {
      return "";
    }
  }

  const number = contact.replace(/\D/g, "");
  return number.length >= 7 ? `https://wa.me/${number}` : "";
}

function getMessengerHref(value: string) {
  const contact = value.trim();
  if (!contact) return "";

  if (/^https?:\/\//i.test(contact)) {
    try {
      const url = new URL(contact);
      return url.protocol === "https:" &&
        ["m.me", "www.facebook.com", "facebook.com"].includes(url.hostname)
        ? url.toString()
        : "";
    } catch {
      return "";
    }
  }

  const username = contact.replace(/^@/, "");
  return /^[\w.-]+$/.test(username) ? `https://m.me/${encodeURIComponent(username)}` : "";
}

function BrandIcon({ icon }: { icon: typeof faWhatsapp }) {
  const [width, height, , , iconPath] = icon.icon;

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${width} ${height}`} className="size-5 shrink-0 fill-current">
      <path d={Array.isArray(iconPath) ? iconPath.join(" ") : iconPath} />
    </svg>
  );
}

export function FloatingChatWidget() {
  const { settings } = useCmsStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ChatForm>({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const whatsappHref = getWhatsappHref(settings.whatsappContact || "");
  const messengerHref = getMessengerHref(settings.messengerContact || "");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: "Website chat enquiry",
          source: "chatbot",
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Your message could not be sent. Please try again.");
      }
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Your message could not be sent. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !widgetRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="floating-chat" ref={widgetRef}>
      {open ? (
        <section
          id="floating-chat-options"
          className="floating-chat-panel"
          aria-label="Choose a chat service"
        >
          <div className="floating-chat-panel-heading">
            <div>
              <p className="floating-chat-eyebrow">Let’s talk</p>
              <h2>Send us a message</h2>
            </div>
            <button
              type="button"
              className="floating-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat options"
            >
              <X className="size-4" />
            </button>
          </div>

          {submitted ? (
            <div className="floating-chat-success" role="status">
              <strong>Thanks for reaching out!</strong>
              <span>Your message has been sent to our team.</span>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="floating-chat-send-another"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="floating-chat-form" onSubmit={handleSubmit}>
              <label>
                <span>Your name</span>
                <input
                  name="name"
                  autoComplete="name"
                  maxLength={120}
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your name"
                />
              </label>
              <label>
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  rows={3}
                  maxLength={2000}
                  required
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="How can our team help?"
                />
              </label>
              {submitError ? (
                <p className="floating-chat-error" role="alert">
                  {submitError}
                </p>
              ) : null}
              <button type="submit" className="floating-chat-submit" disabled={submitting}>
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}

          {whatsappHref || messengerHref ? (
            <div className="floating-chat-direct">
              <p>Or message us directly</p>
            </div>
          ) : null}

          {whatsappHref ? (
            <a
              className="floating-chat-option"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <span className="floating-chat-option-icon whatsapp">
                <BrandIcon icon={faWhatsapp} />
              </span>
              <span>
                <strong>WhatsApp</strong>
                <small>Chat with our team</small>
              </span>
            </a>
          ) : null}

          {messengerHref ? (
            <a
              className="floating-chat-option"
              href={messengerHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <span className="floating-chat-option-icon messenger">
                <BrandIcon icon={faFacebookMessenger} />
              </span>
              <span>
                <strong>Messenger</strong>
                <small>Message our Facebook page</small>
              </span>
            </a>
          ) : null}

          {!whatsappHref && !messengerHref ? (
            <div className="floating-chat-empty">
              <p>Direct chat options are not set up yet.</p>
              <a href="/contact" onClick={() => setOpen(false)}>
                Send us a message
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      <button
        type="button"
        className="floating-chat-trigger"
        aria-label={open ? "Close chat options" : "Open chat options"}
        aria-expanded={open}
        aria-controls="floating-chat-options"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {open ? (
          <X className="size-6" />
        ) : (
          <img src={chatbotImage} alt="" aria-hidden="true" className="floating-chat-image" />
        )}
      </button>
    </div>
  );
}
