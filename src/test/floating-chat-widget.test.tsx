import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingChatWidget } from "@/components/layout/FloatingChatWidget";

const { mockSettings } = vi.hoisted(() => ({
  mockSettings: {
    whatsappContact: "",
    messengerContact: "",
  },
}));

vi.mock("@/hooks/use-cms-store", () => ({
  useCmsStore: () => ({ settings: mockSettings }),
}));

describe("floating chat widget", () => {
  beforeEach(() => {
    mockSettings.whatsappContact = "+1 (555) 123-4567";
    mockSettings.messengerContact = "assetifyhub";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 201, json: async () => ({ ok: true, id: "msg-chat" }) })),
    );
  });

  it("sends chat messages to the shared contact inbox", async () => {
    render(<FloatingChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat options" }));

    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Jordan Lee" } });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "jordan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would like to discuss a project." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Your message has been sent");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Jordan Lee",
          email: "jordan@example.com",
          message: "I would like to discuss a project.",
          subject: "Website chat enquiry",
          source: "chatbot",
        }),
      }),
    );
  });

  it("shows the API error and keeps the chat form available when sending fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({ ok: false, error: "Unable to save your message right now." }),
      })),
    );
    render(<FloatingChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat options" }));
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Jordan Lee" } });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "jordan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Need help." } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to save your message");
    expect(screen.getByLabelText("Message")).toHaveValue("Need help.");
  });

  it("opens direct WhatsApp and Messenger links from admin-configured contacts", () => {
    render(<FloatingChatWidget />);

    fireEvent.click(screen.getByRole("button", { name: "Open chat options" }));

    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/15551234567",
    );
    expect(screen.getByRole("link", { name: /Messenger/ })).toHaveAttribute(
      "href",
      "https://m.me/assetifyhub",
    );
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /Messenger/ })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("accepts supported secure chat links and ignores unsafe destinations", () => {
    mockSettings.whatsappContact = "javascript:alert(1)";
    mockSettings.messengerContact = "https://m.me/assetifyhub";

    render(<FloatingChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat options" }));

    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Messenger/ })).toHaveAttribute(
      "href",
      "https://m.me/assetifyhub",
    );
  });

  it("closes the options with Escape and provides a contact page if none are configured", () => {
    mockSettings.whatsappContact = "";
    mockSettings.messengerContact = "";

    render(<FloatingChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open chat options" }));

    expect(screen.getByRole("link", { name: "Send us a message" })).toHaveAttribute(
      "href",
      "/contact",
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("region", { name: "Choose a chat service" })).not.toBeInTheDocument();
  });
});
