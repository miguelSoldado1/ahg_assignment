import type { Note } from "@/db/schema";

export type GetNotesResponse = {
  notes: Note[];
  total: number;
};
