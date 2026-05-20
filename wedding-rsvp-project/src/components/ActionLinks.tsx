import { CalendarPlus, Gift, MapPinned, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bitLink, calendarLink, payboxLink } from "@/lib/links";
import type { AppConfig } from "@/types";

export function ActionLinks({ config }: { config: AppConfig }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button asChild>
        <a href={calendarLink(config)} target="_blank" rel="noreferrer">
          <CalendarPlus className="h-4 w-4" />
          הוסף ליומן
        </a>
      </Button>
      <Button asChild variant="secondary">
        <a href={config.wazeLink} target="_blank" rel="noreferrer">
          <MapPinned className="h-4 w-4" />
          נווט ב-Waze
        </a>
      </Button>
      {config.bitPhone ? (
        <Button asChild variant="accent">
          <a href={bitLink(config.bitPhone)} target="_blank" rel="noreferrer">
            <Gift className="h-4 w-4" />
            שלח מתנה בביט
          </a>
        </Button>
      ) : null}
      {config.payboxPhone ? (
        <Button asChild variant="outline">
          <a href={payboxLink(config.payboxPhone)} target="_blank" rel="noreferrer">
            <Package className="h-4 w-4" />
            שלח מתנה בPayBox
          </a>
        </Button>
      ) : null}
    </div>
  );
}
