"use client";

import { getAllPatients } from "@/api/patients";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotesNavigation } from "@/hooks/use-notes-navigation";
import useSWR from "swr";

export function PatientSelector() {
  const { patientId, setPatientId } = useNotesNavigation();
  const { data: patients, isLoading } = useSWR("patients", getAllPatients);

  return (
    <Card>
      <CardContent>
        <div className="flex items-end gap-4">
          <Field className="flex-1">
            <FieldLabel htmlFor="patient-select">Select Patient</FieldLabel>
            <Select value={patientId} onValueChange={setPatientId} disabled={isLoading}>
              <SelectTrigger id="patient-select" className="w-full">
                <SelectValue placeholder={isLoading ? "Loading patients..." : "Select a patient"} />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom">
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button onClick={() => setPatientId("")} variant="outline" disabled={!patientId}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
