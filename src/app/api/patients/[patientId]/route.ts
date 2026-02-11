import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { patient } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

const paramsSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
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

    const patientId = validatedParams.data.patientId;
    const [deletedPatient] = await db.delete(patient).where(eq(patient.id, patientId)).returning();

    if (!deletedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
