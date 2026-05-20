import type { AppConfig } from "@/types";

export const STORAGE_KEYS = {
  settings: "wedding_settings",
  guests: "wedding_guests",
} as const;

export const DEFAULT_CONFIG: AppConfig = {
  coupleNames: "נועה & יונתן",
  weddingDate: "2026-09-14T18:00",
  venueName: "אולם השושנה, תל אביב",
  venueAddress: "דרך השרון 12, תל אביב",
  wazeLink: "https://waze.com/ul?ll=32.0853,34.7818&navigate=yes",
  bitPhone: "",
  payboxPhone: "",
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || "admin123",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  whatsappOpening: "הגיע הרגע! היום המיוחד שלנו כאן",
  whatsappClosing: "נסעו בזהירות ונתראה בשמחות!",
};
