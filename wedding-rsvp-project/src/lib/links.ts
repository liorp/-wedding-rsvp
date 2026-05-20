import type { AppConfig, Guest } from "@/types";

export function calendarLink(config: AppConfig) {
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = new Date(config.weddingDate);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `חתונת ${config.coupleNames}`,
    dates: `${format(start)}/${format(end)}`,
    location: config.venueAddress,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function bitLink(phone: string) {
  return `https://www.bitpay.co.il/app/pay?phoneNumber=${phone.replace(/-/g, "")}`;
}

export function payboxLink(phone: string) {
  return `https://payboxapp.page.link/pay?to=972${phone.replace(/^0/, "").replace(/-/g, "")}`;
}

export function whatsappLink(guest: Guest, config: AppConfig) {
  if (!guest.phone) return "";
  const date = new Date(config.weddingDate);
  const time = date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  const message = `${config.whatsappOpening}

${guest.full_name} היקר/ה,

אנחנו כל כך שמחים שאתם חלק מהיום הזה ומחכים לראותכם.

${config.coupleNames}
${config.venueName}
${config.venueAddress}
קבלת פנים בשעה ${time}

${config.whatsappClosing}`;
  const phone = guest.phone.replace(/[^0-9]/g, "").replace(/^0/, "972");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
