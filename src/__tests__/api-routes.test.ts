import { GET } from "@/app/api/notes/[patientId]/route";
import { POST } from "@/app/api/notes/route";
import { db } from "@/db/drizzle";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db/drizzle", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col, val) => ({ col, val, type: "eq" })),
  desc: vi.fn((col) => ({ col, type: "desc" })),
}));

describe("API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/notes", () => {
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

      const request = new Request("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify({
          patientId: mockPatientId,
          title: "Initial Consultation",
          content: "Patient presents with mild hypertension.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.title).toBe("Initial Consultation");
    });

    it("should return 400 for invalid patient ID format", async () => {
      const request = new Request("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify({
          patientId: "invalid-uuid",
          title: "Test Note",
          content: "Test content",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid input");
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

      const request = new Request("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify({
          patientId: mockPatientId,
          title: "Test Note",
          content: "Test content",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Patient not found");
    });

    it("should return 400 for missing title", async () => {
      const request = new Request("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify({
          patientId: mockPatientId,
          title: "",
          content: "Test content",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid input");
    });

    it("should return 400 for missing content", async () => {
      const request = new Request("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify({
          patientId: mockPatientId,
          title: "Test Title",
          content: "",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid input");
    });
  });

  describe("GET /api/notes/:patientId", () => {
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

      // Mock notes query (second select call)
      const fromMock2 = vi.fn().mockReturnThis();
      const whereMock2 = vi.fn().mockReturnThis();
      const orderByMock = vi.fn().mockResolvedValueOnce(mockNotes);

      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: fromMock1,
          } as unknown as ReturnType<typeof db.select>;
        } else {
          return {
            from: fromMock2,
          } as unknown as ReturnType<typeof db.select>;
        }
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

      whereMock2.mockReturnValue({
        orderBy: orderByMock,
      });

      const request = new Request(`http://localhost:3000/api/notes/${mockPatientId}`);

      const context = {
        params: Promise.resolve({ patientId: mockPatientId }),
      };

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].title).toBe("Initial Consultation");
    });

    it("should return 400 for invalid patient ID format", async () => {
      const request = new Request("http://localhost:3000/api/notes/invalid-uuid");

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

      const request = new Request(`http://localhost:3000/api/notes/${mockPatientId}`);

      const context = {
        params: Promise.resolve({ patientId: mockPatientId }),
      };

      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Patient not found");
    });
  });
});
