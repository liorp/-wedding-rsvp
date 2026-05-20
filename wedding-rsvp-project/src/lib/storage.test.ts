import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "@/config";
import { clearLocalGuests, getLocalGuests, saveLocalGuest } from "@/lib/storage";
import type { Guest } from "@/types";

const guest: Guest = {
  id: "guest-1",
  full_name: "ישראל ישראלי",
  phone: "0501234567",
  attending: true,
  guest_count: 2,
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("local guest storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty list when storage is empty or invalid", () => {
    expect(getLocalGuests()).toEqual([]);

    localStorage.setItem(STORAGE_KEYS.guests, "not-json");
    expect(getLocalGuests()).toEqual([]);
  });

  it("prepends saved guests", () => {
    saveLocalGuest({ ...guest, id: "first" });
    saveLocalGuest({ ...guest, id: "second" });

    expect(getLocalGuests().map((item) => item.id)).toEqual(["second", "first"]);
  });

  it("clears saved guests", () => {
    saveLocalGuest(guest);
    clearLocalGuests();

    expect(getLocalGuests()).toEqual([]);
  });
});
