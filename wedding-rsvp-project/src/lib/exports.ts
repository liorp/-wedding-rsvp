import type { Guest } from "@/types";

function downloadCSV(data: Array<Array<string | number>>, filename: string) {
  const bom = "\ufeff";
  const csv = bom + data.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const anchor = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })),
    download: filename,
  });
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function exportAllGuests(guests: Guest[]) {
  const header = ["#", "שם מלא", "טלפון", "סטטוס", "מספר אורחים", "תאריך רישום"];
  const rows = [...guests]
    .sort((a, b) => Number(b.attending) - Number(a.attending))
    .map((guest, index) => [
      index + 1,
      guest.full_name,
      guest.phone || "",
      guest.attending ? "מגיע" : "לא מגיע",
      guest.attending ? guest.guest_count : "-",
      new Date(guest.created_at).toLocaleDateString("he-IL"),
    ]);
  downloadCSV([header, ...rows], "כל_האורחים.csv");
}

export function exportAttendingGuests(guests: Guest[]) {
  const attending = guests.filter((guest) => guest.attending);
  const header = ["#", "שם מלא", "טלפון", "מספר אורחים", "תאריך רישום"];
  const rows = attending.map((guest, index) => [
    index + 1,
    guest.full_name,
    guest.phone || "",
    guest.guest_count,
    new Date(guest.created_at).toLocaleDateString("he-IL"),
  ]);
  const total = attending.reduce((sum, guest) => sum + (guest.guest_count || 1), 0);
  downloadCSV([header, ...rows, ["", "", "", "", ""], ["", 'סה"כ אורחים', "", total, ""]], "מגיעים.csv");
}

export function exportNotAttendingGuests(guests: Guest[]) {
  const notAttending = guests.filter((guest) => !guest.attending);
  const header = ["#", "שם מלא", "טלפון", "תאריך רישום"];
  const rows = notAttending.map((guest, index) => [
    index + 1,
    guest.full_name,
    guest.phone || "",
    new Date(guest.created_at).toLocaleDateString("he-IL"),
  ]);
  downloadCSV([header, ...rows], "לא_מגיעים.csv");
}
