import { describe, expect, it } from "vitest";
import { bitLink, calendarLink, payboxLink, whatsappLink } from "@/lib/links";
import type { AppConfig, Guest } from "@/types";

const config: AppConfig = {
  coupleNames: "נועה & יונתן",
  weddingDate: "2026-09-14T18:00",
  venueName: "אולם השושנה",
  venueAddress: "דרך השרון 12, תל אביב",
  wazeLink: "https://waze.com/example",
  bitPhone: "050-111-2222",
  payboxPhone: "050-333-4444",
  adminPassword: "secret",
  supabaseUrl: "https://example.supabase.co",
  supabaseAnonKey: "anon",
  whatsappOpening: "פתיחה",
  whatsappClosing: "סיום",
};

const guest: Guest = {
  id: "guest-1",
  full_name: "ישראל ישראלי",
  phone: "050-123-4567",
  attending: true,
  guest_count: 2,
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("links", () => {
  it("builds a Google Calendar URL with event dates and location", () => {
    const url = new URL(calendarLink(config));

    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("חתונת נועה & יונתן");
    const dates = url.searchParams.get("dates") || "";
    const [start, end] = dates.split("/");
    expect(start).toMatch(/^20260914T\d{6}Z$/);
    expect(end).toMatch(/^20260914T\d{6}Z$/);
    expect(Date.parse(end.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z"))).toBe(
      Date.parse(start.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z")) + 4 * 60 * 60 * 1000,
    );
    expect(url.searchParams.get("location")).toBe(config.venueAddress);
  });

  it("normalizes Bit and PayBox phone links", () => {
    expect(bitLink("050-111-2222")).toBe("https://www.bitpay.co.il/app/pay?phoneNumber=0501112222");
    expect(payboxLink("050-333-4444")).toBe("https://payboxapp.page.link/pay?to=972503334444");
  });

  it("builds a WhatsApp link with normalized phone and encoded message", () => {
    const url = new URL(whatsappLink(guest, config));

    expect(url.origin + url.pathname).toBe("https://wa.me/972501234567");
    const message = url.searchParams.get("text") || "";
    expect(message).toContain("פתיחה");
    expect(message).toContain("ישראל ישראלי");
    expect(message).toContain(config.venueName);
    expect(message).toContain("סיום");
  });

  it("returns an empty WhatsApp link when the guest has no phone", () => {
    expect(whatsappLink({ ...guest, phone: null }, config)).toBe("");
  });
});
