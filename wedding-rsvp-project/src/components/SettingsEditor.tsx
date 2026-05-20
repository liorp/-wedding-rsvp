import { Save, RotateCcw } from "lucide-react";
import { useState } from "react";
import { DEFAULT_CONFIG } from "@/config";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppConfig } from "@/types";

type SettingsEditorProps = {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
};

type EditableKey = keyof Pick<
  AppConfig,
  "coupleNames" | "weddingDate" | "venueName" | "venueAddress" | "wazeLink" | "bitPhone" | "payboxPhone" | "whatsappOpening" | "whatsappClosing"
>;

const fields: Array<{ key: EditableKey; label: string; placeholder?: string; type?: string }> = [
  { key: "coupleNames", label: "שמות הזוג", placeholder: "שם & שם" },
  { key: "venueName", label: "שם האולם", placeholder: "שם האולם, עיר" },
  { key: "venueAddress", label: "כתובת מלאה", placeholder: "רחוב, מספר, עיר" },
  { key: "wazeLink", label: "קישור Waze", placeholder: "https://waze.com/ul?..." },
  { key: "bitPhone", label: "מספר טלפון לביט", placeholder: "050-0000000" },
  { key: "payboxPhone", label: "מספר טלפון לPayBox", placeholder: "050-0000000" },
  { key: "whatsappOpening", label: "פתיחת הודעת WhatsApp" },
  { key: "whatsappClosing", label: "סיום הודעת WhatsApp" },
];

export function SettingsEditor({ config, onSave }: SettingsEditorProps) {
  const [draft, setDraft] = useState(config);
  const [saved, setSaved] = useState(false);
  const dateValue = draft.weddingDate.split("T")[0] || "";
  const timeValue = draft.weddingDate.includes("T") ? draft.weddingDate.split("T")[1].slice(0, 5) : "18:00";

  function update(key: EditableKey, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save() {
    onSave(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function reset() {
    setDraft({ ...DEFAULT_CONFIG, supabaseUrl: config.supabaseUrl, supabaseAnonKey: config.supabaseAnonKey });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-2xl font-bold">הגדרות האירוע</h3>
        <p className="text-sm text-muted-foreground">פרטי Supabase נטענים מקובץ env/config בזמן build.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="תאריך" htmlFor="wedding-date">
          <Input
            id="wedding-date"
            type="date"
            dir="ltr"
            value={dateValue}
            onChange={(event) => update("weddingDate", `${event.target.value}T${timeValue}`)}
          />
        </Field>
        <Field label="שעה" htmlFor="wedding-time">
          <Input
            id="wedding-time"
            type="time"
            dir="ltr"
            value={timeValue}
            onChange={(event) => update("weddingDate", `${dateValue}T${event.target.value}`)}
          />
        </Field>
      </div>

      <div className="grid gap-4">
        {fields.map((field) => (
          <Field key={field.key} label={field.label} htmlFor={field.key}>
            <Input
              id={field.key}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={draft[field.key]}
              onChange={(event) => update(field.key, event.target.value)}
            />
          </Field>
        ))}
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={save} variant={saved ? "secondary" : "default"}>
          <Save className="h-4 w-4" />
          {saved ? "נשמר" : "שמור שינויים"}
        </Button>
        <Button variant="outline" size="icon" onClick={reset} aria-label="איפוס הגדרות">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
