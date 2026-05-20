import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Field";
import { insertGuest, type WeddingSupabaseClient } from "@/lib/supabase";
import { saveLocalGuest } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { validatePhone } from "@/lib/validation";
import type { Guest, RSVPFormState } from "@/types";

type RsvpFormProps = {
  supabase: WeddingSupabaseClient | null;
  onSuccess: (guest: Guest) => void;
};

const guestCountOptions = [1, 2, 3, 4, 5, 6];

export function RsvpForm({ supabase, onSuccess }: RsvpFormProps) {
  const [form, setForm] = useState<RSVPFormState>({ full_name: "", phone: "", attending: true, guest_count: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof RSVPFormState>(key: K, value: RSVPFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const phoneCheck = validatePhone(form.phone);

  async function submit() {
    if (!form.full_name.trim()) {
      setError("נא להזין שם מלא");
      return;
    }
    if (phoneCheck !== true) {
      setError(phoneCheck);
      return;
    }

    setLoading(true);
    setError("");
    const guest: Guest = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      full_name: form.full_name.trim(),
      phone: form.phone || null,
      attending: form.attending,
      guest_count: form.attending ? Number(form.guest_count) : 0,
      created_at: new Date().toISOString(),
    };

    try {
      if (supabase) await insertGuest(supabase, guest);
      else saveLocalGuest(guest);
    } catch (err) {
      console.error(err);
      saveLocalGuest(guest);
    } finally {
      setLoading(false);
      onSuccess(guest);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="שם מלא *" htmlFor="full-name">
        <Input
          id="full-name"
          placeholder="הכניסו את שמכם המלא"
          value={form.full_name}
          onChange={(event) => set("full_name", event.target.value)}
        />
      </Field>

      <Field label="מספר טלפון" htmlFor="phone">
        <div className="relative">
          <Input
            id="phone"
            inputMode="tel"
            placeholder="050-0000000"
            value={form.phone}
            onChange={(event) => set("phone", event.target.value)}
            className={cn("pl-10", form.phone && phoneCheck !== true && "border-destructive focus-visible:ring-destructive")}
          />
          {form.phone ? (
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              {phoneCheck === true ? <Check className="h-4 w-4 text-secondary" /> : <X className="h-4 w-4 text-destructive" />}
            </span>
          ) : null}
        </div>
        {form.phone && phoneCheck !== true ? <p className="text-xs text-destructive">{phoneCheck}</p> : null}
      </Field>

      <Field label="האם תגיעו?">
        <div className="grid grid-cols-2 gap-2">
          <Button variant={form.attending ? "default" : "outline"} onClick={() => set("attending", true)}>
            <Check className="h-4 w-4" />
            מגיע/ה
          </Button>
          <Button variant={!form.attending ? "destructive" : "outline"} onClick={() => set("attending", false)}>
            <X className="h-4 w-4" />
            לא מגיע/ה
          </Button>
        </div>
      </Field>

      {form.attending ? (
        <Field label="מספר אורחים כולל עצמכם">
          <div className="grid grid-cols-6 gap-2">
            {guestCountOptions.map((count) => (
              <Button
                key={count}
                size="icon"
                variant={form.guest_count === count ? "default" : "outline"}
                onClick={() => set("guest_count", count)}
                aria-label={`${count} אורחים`}
              >
                {count}
              </Button>
            ))}
          </div>
        </Field>
      ) : null}

      {error ? <p className="text-center text-sm font-semibold text-destructive">{error}</p> : null}

      <Button className="w-full" size="lg" onClick={submit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {loading ? "שומר..." : "אישור הגעה"}
      </Button>
    </div>
  );
}
