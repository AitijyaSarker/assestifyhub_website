import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookConsultationForm } from "@/components/consultation/BookConsultationForm";

vi.mock("@/hooks/use-cms-store", () => ({
  useCmsStore: () => ({
    timeSlots: [
      { id: "morning", label: "10:00 AM – 10:30 AM", value: "10:00", isAvailable: true, order: 1 },
      {
        id: "afternoon",
        label: "02:00 PM – 02:30 PM",
        value: "14:00",
        isAvailable: true,
        order: 2,
      },
    ],
  }),
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }: { onSelect: (date: Date) => void }) => (
    <button type="button" onClick={() => onSelect(new Date(2027, 0, 4))}>
      Select test date
    </button>
  ),
}));

describe("public consultation booking", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === "POST") {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                id: "lead-test-reference",
                bookingDate: "2027-01-04",
                timeSlot: "10:00 AM – 10:30 AM",
                status: "pending",
              },
            }),
          };
        }
        return { ok: true, json: async () => ({ success: true, data: { bookedSlots: [] } }) };
      }),
    );
  });

  it("saves the selected date and time before showing a pending confirmation", async () => {
    render(<BookConsultationForm />);
    fireEvent.click(screen.getByRole("button", { name: "Select test date" }));
    await waitFor(() => expect(screen.getByRole("button", { name: /10:00 AM/ })).toBeEnabled());

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Morgan Lee" } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "morgan@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: "+1 555 0100" } });
    fireEvent.click(screen.getByRole("button", { name: /Request this booking/ }));

    expect(
      await screen.findByRole("heading", { name: "Booking request received" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Reference: lead-test-reference")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/schedule",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"date":"2027-01-04"'),
      }),
    );
  });

  it("does not show a confirmation when the booking request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === "POST") {
          return {
            ok: false,
            json: async () => ({ success: false, error: "That time has just been booked." }),
          };
        }
        return { ok: true, json: async () => ({ success: true, data: { bookedSlots: [] } }) };
      }),
    );

    render(<BookConsultationForm />);
    fireEvent.click(screen.getByRole("button", { name: "Select test date" }));
    await waitFor(() => expect(screen.getByRole("button", { name: /10:00 AM/ })).toBeEnabled());
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Morgan Lee" } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "morgan@example.com" } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: "+1 555 0100" } });
    fireEvent.click(screen.getByRole("button", { name: /Request this booking/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That time has just been booked.");
    expect(
      screen.queryByRole("heading", { name: "Booking request received" }),
    ).not.toBeInTheDocument();
  });
});
