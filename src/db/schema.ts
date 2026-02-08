import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const note = pgTable("note", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: text("patient_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Note = typeof note.$inferSelect;
export type NewNote = typeof note.$inferInsert;
