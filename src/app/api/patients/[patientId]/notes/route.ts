import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note, patient } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

interface Context {
  params: Promise<{ patientId: string }>;
}

const patientIdSchema = z.uuid("Invalid patient ID format");

export async function GET(_request: Request, context: Context) {
  try {
    const { patientId } = await context.params;
    const validatedId = patientIdSchema.safeParse(patientId);
    if (!validatedId.success) {
      return NextResponse.json({ error: "Invalid patient ID", details: validatedId.error }, { status: 400 });
    }

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, validatedId.data)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const notes = await db
      .select()
      .from(note)
      .where(eq(note.patientId, validatedId.data))
      .orderBy(desc(note.createdAt));
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

const createNoteSchema = z.object({
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

export async function POST(req: Request, context: Context) {
  try {
    const { patientId } = await context.params;
    const validatedId = patientIdSchema.safeParse(patientId);
    if (!validatedId.success) {
      return NextResponse.json({ error: "Invalid patient ID", details: validatedId.error }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = createNoteSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input", details: validatedData.error }, { status: 400 });
    }

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, validatedId.data)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const [newNote] = await db
      .insert(note)
      .values({ ...validatedData.data, patientId: validatedId.data })
      .returning();

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
