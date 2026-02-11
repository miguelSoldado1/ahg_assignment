import { NextRequest } from "next/server";
import { PATCH } from "@/app/api/patients/[patientId]/notes/[noteId]/route";
import { GET, POST } from "@/app/api/patients/[patientId]/notes/route";
import { db } from "@/db/drizzle";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/drizzle", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("drizzle-orm", () => ({
  and: vi.fn((left, right) => ({ left, right, type: "and" })),
  eq: vi.fn((col, val) => ({ col, val, type: "eq" })),
  desc: vi.fn((col) => ({ col, type: "desc" })),
  sql: vi.fn((strings, ...values) => ({ strings, values, type: "sql" })),
}));

describe("API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/patients/[patientId]/notes", () => {
    const mockPatientId = "550e8400-e29b-41d4-a716-446655440000";
    const mockNoteId = "660e8400-e29b-41d4-a716-446655440000";

    it("should create a note with valid data", async () => {
      const mockPatient = {
        id: mockPatientId,
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockNote = {
        id: mockNoteId,
        patientId: mockPatientId,
        title: "Initial Consultation",
        content: "Patient presents with mild hypertension.",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock patient existence check
      const fromMock = vi.fn().mockReturnThis();
      const whereMock = vi.fn().mockReturnThis();
      const limitMock = vi.fn().mockResolvedValue([mockPatient]);

      vi.mocked(db.select).mockReturnValue({
        from: fromMock,
      } as unknown as ReturnType<typeof db.select>);

      fromMock.mockReturnValue({
        where: whereMock,
      });

      whereMock.mockReturnValue({
        limit: limitMock,
      });

      // Mock note creation
      const valuesMock = vi.fn().mockReturnThis();
      const returningMock = vi.fn().mockResolvedValue([mockNote]);

      vi.mocked(db.insert).mockReturnValue({
        values: valuesMock,
      } as unknown as ReturnType<typeof db.insert>);

      valuesMock.mockReturnValue({
        returning: returningMock,
      });

      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          title: "Initial Consultation",
          content: "Patient presents with mild hypertension.",
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ patientId: mockPatientId }),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.title).toBe("Initial Consultation");
    });

    it("should return 400 for invalid patient ID format", async () => {
      const request = new Request(`http://localhost:3000/api/patients/invalid-uuid/notes`, {
        method: "POST",
        body: JSON.stringify({
          title: "Test Note",
          content: "Test content",
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ patientId: "invalid-uuid" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid patient ID");
    });

    it("should return 404 when patient does not exist", async () => {
      // Mock patient not found
      const fromMock = vi.fn().mockReturnThis();
      const whereMock = vi.fn().mockReturnThis();
      const limitMock = vi.fn().mockResolvedValue([]);

      vi.mocked(db.select).mockReturnValue({
        from: fromMock,
      } as unknown as ReturnType<typeof db.select>);

      fromMock.mockReturnValue({
        where: whereMock,
      });

      whereMock.mockReturnValue({
        limit: limitMock,
      });

      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          title: "Test Note",
          content: "Test content",
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ patientId: mockPatientId }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Patient not found");
    });

    it("should return 400 for missing title", async () => {
      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          title: "",
          content: "Test content",
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ patientId: mockPatientId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid input");
    });

    it("should return 400 for missing content", async () => {
      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          title: "Test Title",
          content: "",
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ patientId: mockPatientId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid input");
    });
  });

  describe("GET /api/patients/[patientId]/notes", () => {
    const mockPatientId = "550e8400-e29b-41d4-a716-446655440000";

    it("should return notes for a valid patient", async () => {
      const mockPatient = {
        id: mockPatientId,
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockNotes = [
        {
          id: "660e8400-e29b-41d4-a716-446655440001",
          patientId: mockPatientId,
          title: "Initial Consultation",
          content: "Patient presents with mild hypertension.",
          createdAt: new Date("2026-02-08"),
          updatedAt: new Date("2026-02-08"),
        },
        {
          id: "660e8400-e29b-41d4-a716-446655440002",
          patientId: mockPatientId,
          title: "Follow-up Visit",
          content: "Blood pressure improved.",
          createdAt: new Date("2026-02-07"),
          updatedAt: new Date("2026-02-07"),
        },
      ];

      // Mock patient existence check (first select call)
      const fromMock1 = vi.fn().mockReturnThis();
      const whereMock1 = vi.fn().mockReturnThis();
      const limitMock1 = vi.fn().mockResolvedValueOnce([mockPatient]);

      // Mock total count (second select call)
      const fromMock2 = vi.fn().mockReturnThis();
      const whereMock2 = vi.fn().mockResolvedValueOnce([{ totalCount: 2 }]);

      // Mock notes query (third select call)
      const fromMock3 = vi.fn().mockReturnThis();
      const whereMock3 = vi.fn().mockReturnThis();
      const orderByMock = vi.fn().mockReturnThis();
      const limitMock = vi.fn().mockReturnThis();
      const offsetMock = vi.fn().mockResolvedValueOnce(mockNotes);

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: fromMock1,
          } as unknown as ReturnType<typeof db.select>;
        }
        if (callCount === 2) {
          return {
            from: fromMock2,
          } as unknown as ReturnType<typeof db.select>;
        }
        return {
          from: fromMock3,
        } as unknown as ReturnType<typeof db.select>;
      });

      fromMock1.mockReturnValue({
        where: whereMock1,
      });

      whereMock1.mockReturnValue({
        limit: limitMock1,
      });

      fromMock2.mockReturnValue({
        where: whereMock2,
      });

      fromMock3.mockReturnValue({
        where: whereMock3,
      });

      whereMock3.mockReturnValue({
        orderBy: orderByMock,
      });

      orderByMock.mockReturnValue({
        limit: limitMock,
      });

      limitMock.mockReturnValue({
        offset: offsetMock,
      });

      const request = new NextRequest(`http://localhost:3000/api/patients/${mockPatientId}/notes?page=1&limit=2`);

      const context = {
        params: Promise.resolve({ patientId: mockPatientId }),
      };

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.notes)).toBe(true);
      expect(data.notes).toHaveLength(2);
      expect(data.notes[0].title).toBe("Initial Consultation");
      expect(data.total).toBe(2);
    });

    it("should return 400 for invalid patient ID format", async () => {
      const request = new NextRequest("http://localhost:3000/api/patients/invalid-uuid/notes");

      const context = {
        params: Promise.resolve({ patientId: "invalid-uuid" }),
      };

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid patient ID");
    });

    it("should return 404 when patient does not exist", async () => {
      // Mock patient not found
      const fromMock = vi.fn().mockReturnThis();
      const whereMock = vi.fn().mockReturnThis();
      const limitMock = vi.fn().mockResolvedValue([]);

      vi.mocked(db.select).mockReturnValue({
        from: fromMock,
      } as unknown as ReturnType<typeof db.select>);

      fromMock.mockReturnValue({
        where: whereMock,
      });

      whereMock.mockReturnValue({
        limit: limitMock,
      });

      const request = new NextRequest(`http://localhost:3000/api/patients/${mockPatientId}/notes`);

      const context = {
        params: Promise.resolve({ patientId: mockPatientId }),
      };

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Patient not found");
    });
  });

  describe("PATCH /api/patients/[patientId]/notes/[noteId]", () => {
    const mockPatientId = "550e8400-e29b-41d4-a716-446655440000";
    const mockNoteId = "660e8400-e29b-41d4-a716-446655440000";

    it("should update note content with valid data", async () => {
      const mockPatient = {
        id: mockPatientId,
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedNote = {
        id: mockNoteId,
        patientId: mockPatientId,
        title: "Initial Consultation",
        content: "Updated content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock patient existence check
      const fromMock = vi.fn().mockReturnThis();
      const whereMock = vi.fn().mockReturnThis();
      const limitMock = vi.fn().mockResolvedValue([mockPatient]);

      vi.mocked(db.select).mockReturnValue({
        from: fromMock,
      } as unknown as ReturnType<typeof db.select>);

      fromMock.mockReturnValue({
        where: whereMock,
      });

      whereMock.mockReturnValue({
        limit: limitMock,
      });

      // Mock note update
      const setMock = vi.fn().mockReturnThis();
      const updateWhereMock = vi.fn().mockReturnThis();
      const returningMock = vi.fn().mockResolvedValue([updatedNote]);

      vi.mocked(db.update).mockReturnValue({
        set: setMock,
      } as unknown as ReturnType<typeof db.update>);

      setMock.mockReturnValue({
        where: updateWhereMock,
      });

      updateWhereMock.mockReturnValue({
        returning: returningMock,
      });

      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes/${mockNoteId}`, {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated content" }),
      });

      const response = await PATCH(request, {
        params: Promise.resolve({ patientId: mockPatientId, noteId: mockNoteId }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("id", mockNoteId);
      expect(data).toHaveProperty("content", "Updated content");
    });

    it("should return 400 for invalid patient ID format", async () => {
      const request = new Request("http://localhost:3000/api/patients/invalid/notes/123", {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated content" }),
      });

      const response = await PATCH(request, {
        params: Promise.resolve({ patientId: "invalid", noteId: mockNoteId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
    });

    it("should return 400 for invalid note ID format", async () => {
      const request = new Request("http://localhost:3000/api/patients/123/notes/invalid", {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated content" }),
      });

      const response = await PATCH(request, {
        params: Promise.resolve({ patientId: mockPatientId, noteId: "invalid" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
    });

    it("should return 400 for missing content", async () => {
      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes/${mockNoteId}`, {
        method: "PATCH",
        body: JSON.stringify({ content: "" }),
      });

      const response = await PATCH(request, {
        params: Promise.resolve({ patientId: mockPatientId, noteId: mockNoteId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid input");
    });

    it("should return 404 when patient does not exist", async () => {
      const fromMock = vi.fn().mockReturnThis();
      const whereMock = vi.fn().mockReturnThis();
      const limitMock = vi.fn().mockResolvedValue([]);

      vi.mocked(db.select).mockReturnValue({
        from: fromMock,
      } as unknown as ReturnType<typeof db.select>);

      fromMock.mockReturnValue({
        where: whereMock,
      });

      whereMock.mockReturnValue({
        limit: limitMock,
      });

      const request = new Request(`http://localhost:3000/api/patients/${mockPatientId}/notes/${mockNoteId}`, {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated content" }),
      });

      const response = await PATCH(request, {
        params: Promise.resolve({ patientId: mockPatientId, noteId: mockNoteId }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Patient not found");
    });
  });
});
