import { CheckCircle2 } from "lucide-react";
import { ActionLinks } from "@/components/ActionLinks";
import type { AppConfig, Guest } from "@/types";

type SuccessScreenProps = {
  guest: Guest;
  config: AppConfig;
};

export function SuccessScreen({ guest, config }: SuccessScreenProps) {
  const date = new Date(config.weddingDate);

  return (
    <div className="space-y-5 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-bold text-primary">{guest.attending ? "נשמח לראותכם!" : "תודה על העדכון"}</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          {guest.attending ? `${guest.full_name}, אנחנו שמחים שתצטרפו אלינו.` : `${guest.full_name}, תודה שעדכנתם אותנו.`}
        </p>
      </div>

      {guest.attending ? (
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p>{date.toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p>{date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</p>
            <p>{config.venueName}</p>
          </div>
          <ActionLinks config={config} />
        </div>
      ) : null}
    </div>
  );
}
