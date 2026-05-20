import { STORAGE_KEYS } from "@/config";
import type { Guest } from "@/types";

export function getLocalGuests(): Guest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.guests) || "[]") as Guest[];
  } catch {
    return [];
  }
}

export function saveLocalGuest(guest: Guest) {
  const guests = getLocalGuests();
  guests.unshift(guest);
  localStorage.setItem(STORAGE_KEYS.guests, JSON.stringify(guests));
}

export function clearLocalGuests() {
  localStorage.removeItem(STORAGE_KEYS.guests);
}
