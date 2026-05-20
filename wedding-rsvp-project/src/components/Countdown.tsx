type CountdownProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-16 text-center">
      <div className="font-display text-4xl font-bold leading-none text-primary sm:text-5xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-xs font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

export function Countdown({ days, hours, minutes, seconds }: CountdownProps) {
  return (
    <div className="grid grid-cols-4 gap-2 rounded-lg border bg-card/80 p-4 shadow-sm">
      <Unit value={days} label="ימים" />
      <Unit value={hours} label="שעות" />
      <Unit value={minutes} label="דקות" />
      <Unit value={seconds} label="שניות" />
    </div>
  );
}
