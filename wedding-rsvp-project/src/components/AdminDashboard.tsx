import { Download, MessageCircle, RefreshCw, Settings, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SettingsEditor } from "@/components/SettingsEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportAllGuests, exportAttendingGuests, exportNotAttendingGuests } from "@/lib/exports";
import { whatsappLink } from "@/lib/links";
import { listGuests, type WeddingSupabaseClient } from "@/lib/supabase";
import { clearLocalGuests, getLocalGuests } from "@/lib/storage";
import type { AppConfig, Guest } from "@/types";

type AdminDashboardProps = {
  config: AppConfig;
  supabase: WeddingSupabaseClient | null;
  onSettingsSave: (config: AppConfig) => void;
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="font-display text-3xl font-bold text-primary">{value}</div>
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({ config, supabase, onSettingsSave }: AdminDashboardProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      if (supabase) setGuests(await listGuests(supabase));
      else setGuests(getLocalGuests());
    } catch (error) {
      const message = error instanceof Error ? error.message : "שגיאה לא ידועה";
      setLoadError(`שגיאה בטעינה מ-Supabase: ${message}`);
      setGuests(getLocalGuests());
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const attending = guests.filter((guest) => guest.attending);
    return {
      attending,
      totalGuests: attending.reduce((sum, guest) => sum + (guest.guest_count || 1), 0),
      attendingPercent: guests.length ? Math.round((attending.length / guests.length) * 100) : 0,
    };
  }, [guests]);

  function sendToAll() {
    const recipients = guests.filter((guest) => guest.attending && guest.phone);
    if (!recipients.length) {
      window.alert("אין אורחים מגיעים עם מספר טלפון");
      return;
    }

    let index = 0;
    const next = () => {
      const link = whatsappLink(recipients[index], config);
      window.open(link, "_blank");
      index += 1;
      if (index < recipients.length && window.confirm(`להמשיך לשליחה ל-${recipients[index].full_name}?`)) next();
    };

    if (window.confirm(`לשלוח תזכורת WhatsApp ל-${recipients.length} אורחים?`)) next();
  }

  return (
    <Tabs defaultValue="guests" dir="rtl" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="guests">
          <Users className="ml-2 h-4 w-4" />
          רשימת אורחים
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="ml-2 h-4 w-4" />
          הגדרות
        </TabsTrigger>
      </TabsList>

      <TabsContent value="guests" className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
            רענן
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearLocalGuests();
              void load();
            }}
          >
            <Trash2 className="h-4 w-4" />
            נקה מטמון
          </Button>
          <Button variant="secondary" size="sm" onClick={sendToAll}>
            <MessageCircle className="h-4 w-4" />
            שלח לכולם
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label='סה"כ רישומים' value={guests.length} />
          <Stat label="מגיעים" value={stats.attending.length} />
          <Stat label="לא מגיעים" value={guests.length - stats.attending.length} />
          <Stat label='סה"כ אורחים' value={stats.totalGuests} />
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span>אחוז המגיעים</span>
              <span className="text-primary">{stats.attendingPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.attendingPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => exportAllGuests(guests)}>
            <Download className="h-4 w-4" />
            כולם
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportAttendingGuests(guests)}>
            <Download className="h-4 w-4" />
            מגיעים
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportNotAttendingGuests(guests)}>
            <Download className="h-4 w-4" />
            לא מגיעים
          </Button>
        </div>

        {loadError ? <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{loadError}</div> : null}

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                {["שם מלא", "טלפון", "סטטוס", "אורחים", "תאריך", ""].map((heading) => (
                  <th key={heading} className="px-3 py-3 text-right font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-8 text-center text-muted-foreground" colSpan={6}>
                    טוען...
                  </td>
                </tr>
              ) : guests.length ? (
                guests.map((guest) => (
                  <tr key={guest.id || `${guest.full_name}-${guest.created_at}`} className="border-t bg-card">
                    <td className="px-3 py-3 font-semibold">{guest.full_name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{guest.phone || "-"}</td>
                    <td className="px-3 py-3">
                      <Badge variant={guest.attending ? "secondary" : "destructive"}>{guest.attending ? "מגיע" : "לא מגיע"}</Badge>
                    </td>
                    <td className="px-3 py-3 text-center">{guest.attending ? guest.guest_count : "-"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{new Date(guest.created_at).toLocaleDateString("he-IL")}</td>
                    <td className="px-3 py-3">
                      {guest.phone && guest.attending ? (
                        <Button asChild size="icon" variant="secondary" aria-label={`שליחת WhatsApp ל-${guest.full_name}`}>
                          <a href={whatsappLink(guest, config)} target="_blank" rel="noreferrer">
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-8 text-center text-muted-foreground" colSpan={6}>
                    עדיין אין רישומים
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <SettingsEditor config={config} onSave={onSettingsSave} />
      </TabsContent>
    </Tabs>
  );
}
