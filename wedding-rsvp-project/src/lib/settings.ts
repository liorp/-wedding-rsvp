import { DEFAULT_CONFIG, STORAGE_KEYS } from "@/config";
import type { AppConfig } from "@/types";

export function loadSettings(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    const saved = raw ? (JSON.parse(raw) as Partial<AppConfig>) : {};
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      supabaseUrl: DEFAULT_CONFIG.supabaseUrl,
      supabaseAnonKey: DEFAULT_CONFIG.supabaseAnonKey,
      adminPassword: saved.adminPassword || DEFAULT_CONFIG.adminPassword,
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveSettings(settings: AppConfig) {
  const { supabaseUrl, supabaseAnonKey, ...editable } = settings;
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(editable));
}
