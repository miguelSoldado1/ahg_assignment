import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PatientSelector() {
  return (
    <Card>
      <CardContent className="flex items-end gap-4">
        <Field className="flex-1">
          <Label htmlFor="patient-id" className="text-foreground block text-sm font-medium">
            Patient ID
          </Label>
          <Input id="patient-id" placeholder="Enter patient ID (e.g., PAT-12345)" />
        </Field>
        <Button>Load Patient</Button>
      </CardContent>
    </Card>
  );
}
