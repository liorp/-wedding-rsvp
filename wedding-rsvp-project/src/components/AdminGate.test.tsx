import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminGate } from "@/components/AdminGate";
import type { WeddingSupabaseClient } from "@/lib/supabase";

function supabaseWithSignIn(result: unknown) {
  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue(result),
    },
  } as unknown as WeddingSupabaseClient;
}

describe("AdminGate", () => {
  it("signs in with Supabase Auth credentials", async () => {
    const browserUser = userEvent.setup();
    const admin = { id: "admin-1", email: "admin@example.com" };
    const supabase = supabaseWithSignIn({ data: { user: admin }, error: null });
    const onEnter = vi.fn();

    render(<AdminGate supabase={supabase} onEnter={onEnter} />);
    await browserUser.type(screen.getByPlaceholderText("admin@example.com"), "admin@example.com");
    await browserUser.type(screen.getByPlaceholderText("סיסמה"), "secret-password");
    await browserUser.click(screen.getByRole("button", { name: "כניסה" }));

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "secret-password",
    });
    expect(onEnter).toHaveBeenCalledWith(admin);
  });

  it("shows an error when Supabase is not configured", async () => {
    const user = userEvent.setup();

    render(<AdminGate supabase={null} onEnter={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("admin@example.com"), "admin@example.com");
    await user.type(screen.getByPlaceholderText("סיסמה"), "secret-password");
    await user.click(screen.getByRole("button", { name: "כניסה" }));

    expect(await screen.findByText("Supabase לא מוגדר")).toBeInTheDocument();
  });
});
