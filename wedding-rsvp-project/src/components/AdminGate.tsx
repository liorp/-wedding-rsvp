import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppConfig } from "@/types";

type AdminGateProps = {
  config: AppConfig;
  onEnter: () => void;
};

export function AdminGate({ config, onEnter }: AdminGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function check() {
    if (password === config.adminPassword) {
      onEnter();
      return;
    }
    setError(true);
    window.setTimeout(() => setError(false), 1500);
  }

  return (
    <div className="mx-auto max-w-xs space-y-4 text-center">
      <LockKeyhole className="mx-auto h-10 w-10 text-primary" />
      <h2 className="font-display text-2xl font-bold">כניסת מנהל</h2>
      <Input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && check()}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      <Button className="w-full" onClick={check}>
        כניסה
      </Button>
      {error ? <p className="text-sm font-semibold text-destructive">סיסמה שגויה</p> : null}
    </div>
  );
}
