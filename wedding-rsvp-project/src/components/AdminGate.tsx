import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@supabase/supabase-js";
import type { WeddingSupabaseClient } from "@/lib/supabase";

type AdminGateProps = {
  supabase: WeddingSupabaseClient | null;
  onEnter: (user: User) => void;
};

export function AdminGate({ supabase, onEnter }: AdminGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function signIn() {
    if (!supabase) {
      setError("Supabase לא מוגדר");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (!data.user) throw new Error("לא התקבל משתמש מחובר");
      onEnter(data.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "שגיאה לא ידועה";
      setError(`התחברות נכשלה: ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xs space-y-4 text-center">
      <LockKeyhole className="mx-auto h-10 w-10 text-primary" />
      <h2 className="font-display text-2xl font-bold">כניסת מנהל</h2>
      <Input
        type="email"
        dir="ltr"
        placeholder="admin@example.com"
        value={email}
        autoComplete="email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        type="password"
        placeholder="סיסמה"
        value={password}
        autoComplete="current-password"
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && void signIn()}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      <Button className="w-full" onClick={() => void signIn()} disabled={submitting || !email || !password}>
        {submitting ? "מתחבר..." : "כניסה"}
      </Button>
      {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
    </div>
  );
}
