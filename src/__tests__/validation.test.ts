import { describe, expect, it } from "vitest";
import { z } from "zod";

// These schemas mirror the ones in the API routes
const createNoteSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

const patientIdSchema = z.uuid("Invalid patient ID format");

describe("Note Validation Schema", () => {
  describe("createNoteSchema", () => {
    it("should accept valid note data", () => {
      const validData = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Patient Follow-up",
        content: "Patient shows improvement after treatment.",
      };

      const result = createNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject note with invalid UUID", () => {
      const invalidData = {
        patientId: "invalid-uuid",
        title: "Test Note",
        content: "Test content",
      };

      const result = createNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Invalid patient ID format");
      }
    });

    it("should reject note with empty title", () => {
      const invalidData = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        title: "",
        content: "Test content",
      };

      const result = createNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Note title is required");
      }
    });

    it("should reject note with empty content", () => {
      const invalidData = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Test Title",
        content: "",
      };

      const result = createNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Note content is required");
      }
    });

    it("should reject note with title exceeding 200 characters", () => {
      const invalidData = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        title: "a".repeat(201),
        content: "Test content",
      };

      const result = createNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Title is too long");
      }
    });

    it("should reject note with content exceeding 10000 characters", () => {
      const invalidData = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Test Title",
        content: "a".repeat(10001),
      };

      const result = createNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Note content is too long");
      }
    });

    it("should accept note with maximum allowed lengths", () => {
      const validData = {
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        title: "a".repeat(200),
        content: "a".repeat(10000),
      };

      const result = createNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("patientIdSchema", () => {
    it("should accept valid UUID", () => {
      const result = patientIdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000");
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID format", () => {
      const result = patientIdSchema.safeParse("not-a-uuid");
      expect(result.success).toBe(false);
    });

    it("should reject empty string", () => {
      const result = patientIdSchema.safeParse("");
      expect(result.success).toBe(false);
    });
  });
});
