import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const patientIdSchema = z.string().min(1, "Patient ID is required");

export async function GET(_request: Request, context: { params: Promise<{ patientId: string }> }) {
  try {
    const { patientId } = await context.params;
    const validatedId = patientIdSchema.safeParse(patientId);
    if (!validatedId.success) {
      return NextResponse.json({ error: "Invalid patient ID", details: validatedId.error }, { status: 400 });
    }

    const notes = await db.select().from(note).where(eq(note.patientId, validatedId.data));
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
