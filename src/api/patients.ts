import z from "zod";
import type { Patient } from "@/db/schema";

// ============================================================================
// SCHEMAS
// ============================================================================

export const createPatientSchema = z.object({
  name: z.string().min(1, "Patient name is required").max(100, "Name is too long"),
});

export const deletePatientSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
});

// ============================================================================
// API FUNCTIONS
// ============================================================================

export async function getAllPatients(): Promise<Patient[]> {
  const response = await fetch("/api/patients");
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch patients");
  }

  return result;
}

export async function createPatient(data: z.infer<typeof createPatientSchema>): Promise<Patient> {
  const response = await fetch("/api/patients", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create patient");
  }

  return result;
}

export async function deletePatient(data: z.infer<typeof deletePatientSchema>): Promise<void> {
  const response = await fetch(`/api/patients/${data.patientId}`, { method: "DELETE" });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete patient");
  }
}
