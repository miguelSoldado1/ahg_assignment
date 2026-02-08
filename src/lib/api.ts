import { z } from "zod";
import type { Note } from "@/db/schema.js";

export async function getNotes(patientId: string): Promise<Note[]> {
  const response = await fetch(`/api/notes/${patientId}`);
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
  const response = await fetch("/api/notes", {
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
