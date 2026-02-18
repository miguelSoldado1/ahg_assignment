import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note, patient } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
});

type Context = {
  params: Promise<z.infer<typeof paramsSchema>>;
};

const DEFAULT_PAGE_SIZE = 2;
const DEFAULT_PAGE = 1;

const searchParamsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export async function GET(request: NextRequest, context: Context) {
  try {
    const params = await context.params;
    const validatedParams = paramsSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json({ error: "Invalid patient ID", details: validatedParams.error }, { status: 400 });
    }

    const patientId = validatedParams.data.patientId;

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, patientId)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validatedSearchParams = searchParamsSchema.safeParse(searchParams);
    if (!validatedSearchParams.success) {
      return NextResponse.json({ error: "Invalid parameters", details: validatedSearchParams.error }, { status: 400 });
    }

    const { page = DEFAULT_PAGE, limit = DEFAULT_PAGE_SIZE } = validatedSearchParams.data;

    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(note)
      .where(eq(note.patientId, patientId));

    const notes = await db
      .select()
      .from(note)
      .where(eq(note.patientId, patientId))
      .orderBy(desc(note.createdAt), desc(note.id))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({ notes, total: Math.ceil(totalCount / limit) }, { status: 200 });
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
    const params = await context.params;
    const validatedParams = paramsSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json({ error: "Invalid patient ID", details: validatedParams.error }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = createNoteSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input", details: validatedData.error }, { status: 400 });
    }

    const patientId = validatedParams.data.patientId;

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, patientId)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const [newNote] = await db
      .insert(note)
      .values({ ...validatedData.data, patientId: validatedParams.data.patientId })
      .returning();

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
