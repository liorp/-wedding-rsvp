import { ArrowRight, LockKeyhole, Plus } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { ActionLinks } from "@/components/ActionLinks";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminGate } from "@/components/AdminGate";
import { Countdown } from "@/components/Countdown";
import { RsvpForm } from "@/components/RsvpForm";
import { SuccessScreen } from "@/components/SuccessScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountdown } from "@/hooks/useCountdown";
import { loadSettings, saveSettings } from "@/lib/settings";
import { createWeddingSupabase } from "@/lib/supabase";
import type { AppConfig, Guest } from "@/types";

type View = "rsvp" | "success" | "admin-gate" | "admin";

export default function App() {
  const [config, setConfig] = useState<AppConfig>(loadSettings);
  const [view, setView] = useState<View>("rsvp");
  const [submittedGuest, setSubmittedGuest] = useState<Guest | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const countdown = useCountdown(config.weddingDate);
  const weddingDate = new Date(config.weddingDate);
  const supabase = useMemo(() => createWeddingSupabase(config), [config]);

  useEffect(() => {
    if (!supabase) {
      setAdminUser(null);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setAdminUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  function handleSettingsSave(nextConfig: AppConfig) {
    saveSettings(nextConfig);
    setConfig(nextConfig);
  }

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    setAdminUser(null);
    setView("rsvp");
  }

  const screenTitle =
    view === "admin" ? "לוח ניהול" : view === "admin-gate" ? "ניהול" : view === "success" ? "העדכון התקבל" : "אישור הגעה";

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,hsl(var(--background))_0%,#f2eadc_48%,#e6d6c1_100%)] px-4 py-8 text-right sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="animate-fade-up text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.32em] text-muted-foreground">אתם מוזמנים לחתונה של</p>
          <h1 className="bg-[linear-gradient(90deg,#9a742d,#d4b15f,#2b7a78,#9a742d)] bg-[length:200%_auto] bg-clip-text font-display text-5xl font-bold leading-tight text-transparent animate-shimmer sm:text-6xl">
            {config.coupleNames}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {weddingDate.toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} | {config.venueName}
          </p>
        </header>

        <Countdown {...countdown} />

        <Card className="animate-fade-up bg-card/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-3xl">{screenTitle}</CardTitle>
            {view === "rsvp" ? <CardDescription>נשמח אם תאשרו השתתפותכם</CardDescription> : null}
          </CardHeader>
          <CardContent>
            {view === "rsvp" ? (
              <div className="space-y-5">
                <RsvpForm
                  supabase={supabase}
                  onSuccess={(guest) => {
                    setSubmittedGuest(guest);
                    setView("success");
                  }}
                />
                <div className="border-t pt-5">
                  <ActionLinks config={config} />
                </div>
              </div>
            ) : null}

            {view === "success" && submittedGuest ? <SuccessScreen guest={submittedGuest} config={config} /> : null}

            {view === "admin-gate" && !adminUser ? (
              <AdminGate
                supabase={supabase}
                onEnter={(user) => {
                  setAdminUser(user);
                  setView("admin");
                }}
              />
            ) : null}

            {view === "admin" && adminUser ? (
              <AdminDashboard config={config} supabase={supabase} onSettingsSave={handleSettingsSave} onSignOut={() => void handleSignOut()} />
            ) : null}
          </CardContent>
        </Card>

        <footer className="flex flex-wrap items-center justify-center gap-2 text-center">
          {view !== "rsvp" && view !== "success" ? (
            <Button variant="ghost" size="sm" onClick={() => setView("rsvp")}>
              <ArrowRight className="h-4 w-4" />
              חזרה לטופס
            </Button>
          ) : null}
          {view === "success" ? (
            <Button variant="ghost" size="sm" onClick={() => setView("rsvp")}>
              <Plus className="h-4 w-4" />
              רישום נוסף
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (adminUser) setView(view === "admin" ? "rsvp" : "admin");
              else setView("admin-gate");
            }}
          >
            <LockKeyhole className="h-4 w-4" />
            {view === "admin" ? "יציאה מניהול" : "ניהול"}
          </Button>
        </footer>

        <p className="text-center text-xs font-semibold text-muted-foreground">
          {supabase ? "מחובר ל-Supabase" : "מצב מקומי עד להגדרת Supabase"}
        </p>
      </div>
    </main>
  );
}
