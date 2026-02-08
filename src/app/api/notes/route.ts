import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { z } from "zod";

const createNoteSchema = z.object({
  patientId: z.string().min(1, "Patient Id is required"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createNoteSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input", details: validatedData.error }, { status: 400 });
    }

    const [newNote] = await db.insert(note).values(validatedData.data).returning();
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
