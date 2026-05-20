import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, STORAGE_KEYS } from "@/config";
import { loadSettings, saveSettings } from "@/lib/settings";
import type { AppConfig } from "@/types";

describe("settings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads default config when no settings are saved", () => {
    expect(loadSettings()).toEqual(DEFAULT_CONFIG);
  });

  it("merges editable saved settings but keeps Supabase values from config", () => {
    localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({
        coupleNames: "שם אחד & שם שני",
        supabaseUrl: "https://stored.invalid",
        supabaseAnonKey: "stored-key",
      }),
    );

    expect(loadSettings()).toMatchObject({
      coupleNames: "שם אחד & שם שני",
      supabaseUrl: DEFAULT_CONFIG.supabaseUrl,
      supabaseAnonKey: DEFAULT_CONFIG.supabaseAnonKey,
    });
  });

  it("does not persist Supabase values to localStorage", () => {
    const settings: AppConfig = {
      ...DEFAULT_CONFIG,
      coupleNames: "שם אחד & שם שני",
      supabaseUrl: "https://runtime.supabase.co",
      supabaseAnonKey: "runtime-key",
    };

    saveSettings(settings);

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "{}") as Partial<AppConfig>;
    expect(saved.coupleNames).toBe("שם אחד & שם שני");
    expect(saved.supabaseUrl).toBeUndefined();
    expect(saved.supabaseAnonKey).toBeUndefined();
  });
});
