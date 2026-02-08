import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function DELETE(_req: Request, { params }: { params: Promise<{ patientId: string; noteId: string }> }) {
  try {
    const { patientId, noteId } = await params;

    const noteIdValidation = z.uuid("Invalid note ID format").safeParse(noteId);
    const patientIdValidation = z.uuid("Invalid patient ID format").safeParse(patientId);

    if (!noteIdValidation.success) {
      return NextResponse.json({ error: noteIdValidation.error.issues[0].message }, { status: 400 });
    }

    if (!patientIdValidation.success) {
      return NextResponse.json({ error: patientIdValidation.error.issues[0].message }, { status: 400 });
    }

    const [deletedNote] = await db
      .delete(note)
      .where(and(eq(note.id, noteId), eq(note.patientId, patientId)))
      .returning();

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found or does not belong to this patient" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
