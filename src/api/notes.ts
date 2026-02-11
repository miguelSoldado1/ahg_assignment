import { z } from "zod";
import type { GetNotesResponse } from "./types";
import type { Note } from "@/db/schema";

// ============================================================================
// SCHEMAS
// ============================================================================

export const getNotesSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  page: z.number().min(1).default(1),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
  patientId: z.string().min(1, "Patient ID is required"),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
  patientId: z.string().min(1, "Patient ID is required"),
  noteId: z.string().min(1, "Note ID is required"),
});

export const deleteNoteSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  noteId: z.string().min(1, "Note ID is required"),
});

// ============================================================================
// API FUNCTIONS
// ============================================================================

export async function getNotes({ patientId, page }: z.infer<typeof getNotesSchema>): Promise<GetNotesResponse> {
  const response = await fetch(`/api/patients/${patientId}/notes?page=${page}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch notes");
  }

  return result;
}

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

export async function updateNote(data: z.infer<typeof updateNoteSchema>): Promise<Note> {
  const response = await fetch(`/api/patients/${data.patientId}/notes/${data.noteId}`, {
    method: "PATCH",
    body: JSON.stringify({ content: data.content }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to update note");
  }

  return result;
}

export async function deleteNote({ noteId, patientId }: z.infer<typeof deleteNoteSchema>): Promise<void> {
  const response = await fetch(`/api/patients/${patientId}/notes/${noteId}`, {
    method: "DELETE",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete note");
  }
}
