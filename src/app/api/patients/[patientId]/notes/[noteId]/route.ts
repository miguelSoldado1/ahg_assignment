import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note, patient } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
  noteId: z.uuid("Invalid note ID format"),
});

interface Context {
  params: Promise<z.infer<typeof paramsSchema>>;
}

export async function DELETE(_req: Request, context: Context) {
  try {
    const params = await context.params;
    const validatedParams = paramsSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json({ error: validatedParams.error }, { status: 400 });
    }

    const { patientId, noteId } = validatedParams.data;

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

const updateNoteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

export async function PATCH(req: Request, context: Context) {
  try {
    const params = await context.params;
    const validatedParams = paramsSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json({ error: validatedParams.error }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateNoteSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input", details: validatedData.error }, { status: 400 });
    }

    const { patientId, noteId } = validatedParams.data;

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, patientId)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const [updatedNote] = await db
      .update(note)
      .set({ content: validatedData.data.content, updatedAt: new Date() })
      .where(and(eq(note.id, noteId), eq(note.patientId, patientId)))
      .returning();

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
