export function validatePhone(phone: string): true | string {
  if (!phone) return true;
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits.startsWith("05") && !digits.startsWith("972")) return "מספר טלפון חייב להתחיל ב-05";
  if (digits.length < 10) return `חסרות ${10 - digits.length} ספרות במספר הטלפון`;
  if (digits.length > 12 || (digits.startsWith("05") && digits.length > 10)) return "מספר הטלפון ארוך מדי";
  return true;
}
