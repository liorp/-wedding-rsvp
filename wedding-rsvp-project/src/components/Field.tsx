import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FieldProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
