"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { z } from "zod";

const patientIdSchema = z.uuid("Invalid patient ID format. Expected a UUID.");

export function PatientSelector() {
  const [patientId, setPatientId] = useQueryState("patient_id", { defaultValue: "", shallow: true });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get("patient_id") as string;

    const result = patientIdSchema.safeParse(inputValue);
    if (!result.success) {
      return setError(result.error.issues[0].message);
    }

    setError(null);
    setPatientId(inputValue);
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-end gap-4">
          <Field className="flex-1">
            <FieldLabel htmlFor="patient-id">Patient ID</FieldLabel>
            <Input
              id="patient-id"
              name="patient_id"
              placeholder="Enter patient UUID (e.g., 550e8400-e29b-41d4-a716-446655440000)"
              defaultValue={patientId}
              aria-invalid={!!error}
              aria-describedby={error ? "patient-id-error" : undefined}
            />
            <FieldError id="patient-id-error">{error}</FieldError>
          </Field>
          <Button type="submit">Load Patient</Button>
        </form>
      </CardContent>
    </Card>
  );
}
