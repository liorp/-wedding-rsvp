import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AppConfig, Guest } from "@/types";

export type WeddingSupabaseClient = SupabaseClient;

export function createWeddingSupabase(config: AppConfig): WeddingSupabaseClient | null {
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

export async function insertGuest(client: WeddingSupabaseClient, guest: Guest) {
  const { id: _id, created_at: _createdAt, ...row } = guest;
  const { error } = await client.from("guests").insert(row);
  if (error) throw error;
}

export async function listGuests(client: WeddingSupabaseClient) {
  const { data, error } = await client.from("guests").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Guest[];
}
