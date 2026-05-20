export type Guest = {
  id?: string;
  full_name: string;
  phone: string | null;
  attending: boolean;
  guest_count: number;
  created_at: string;
};

export type AppConfig = {
  coupleNames: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  wazeLink: string;
  bitPhone: string;
  payboxPhone: string;
  adminPassword: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  whatsappOpening: string;
  whatsappClosing: string;
};

export type RSVPFormState = {
  full_name: string;
  phone: string;
  attending: boolean;
  guest_count: number;
};
