import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RsvpForm } from "@/components/RsvpForm";

describe("RsvpForm", () => {
  it("validates required name before submission", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<RsvpForm supabase={null} onSuccess={onSuccess} />);
    await user.click(screen.getByRole("button", { name: /אישור הגעה/ }));

    expect(await screen.findByText("נא להזין שם מלא")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("saves a local attending RSVP and reports success", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<RsvpForm supabase={null} onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText("שם מלא *"), "ישראל ישראלי");
    await user.type(screen.getByLabelText("מספר טלפון"), "0501234567");
    await user.click(screen.getByRole("button", { name: "3 אורחים" }));
    await user.click(screen.getByRole("button", { name: /אישור הגעה/ }));

    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "ישראל ישראלי",
        phone: "0501234567",
        attending: true,
        guest_count: 3,
      }),
    );
  });
});
