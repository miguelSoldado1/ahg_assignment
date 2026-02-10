import { z } from "zod";
import type { Note, Patient } from "@/db/schema.js";

export async function getPatients(): Promise<Patient[]> {
  const response = await fetch("/api/patients");
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch patients");
  }

  return result;
}

export async function getNotes(patientId: string): Promise<Note[]> {
  const response = await fetch(`/api/patients/${patientId}/notes`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch notes");
  }

  return result;
}

export const createNoteSchema = z.object({
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
  patientId: z.string().min(1, "Patient ID is required"),
});

export async function createNote(data: z.infer<typeof createNoteSchema>): Promise<Note> {
  const response = await fetch(`/api/patients/${data.patientId}/notes`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create note");
  }

  return result;
}

export async function deleteNote(noteId: string, patientId: string): Promise<void> {
  const response = await fetch(`/api/patients/${patientId}/notes/${noteId}`, {
    method: "DELETE",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete note");
  }
}

export const createPatientSchema = z.object({
  name: z.string().min(1, "Patient name is required").max(100, "Name is too long"),
});

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
