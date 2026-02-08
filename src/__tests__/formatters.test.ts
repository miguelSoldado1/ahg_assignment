import { formatDate, formatTimestamp } from "@/lib/formatters";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Formatters", () => {
  describe("formatTimestamp", () => {
    beforeEach(() => {
      // Mock current time to have consistent tests
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-08T12:00:00Z"));
    });

    it('should format recent timestamps as "X minutes ago"', () => {
      const date = new Date("2026-02-08T11:30:00Z"); // 30 minutes ago
      expect(formatTimestamp(date)).toBe("30 minutes ago");
    });

    it("should handle singular minute", () => {
      const date = new Date("2026-02-08T11:59:00Z"); // 1 minute ago
      expect(formatTimestamp(date)).toBe("1 minute ago");
    });

    it('should format timestamps as "X hours ago" when less than 24 hours', () => {
      const date = new Date("2026-02-08T09:00:00Z"); // 3 hours ago
      expect(formatTimestamp(date)).toBe("3 hours ago");
    });

    it("should handle singular hour", () => {
      const date = new Date("2026-02-08T11:00:00Z"); // 1 hour ago
      expect(formatTimestamp(date)).toBe("1 hour ago");
    });

    it('should format timestamps as "X days ago" when less than 7 days', () => {
      const date = new Date("2026-02-06T12:00:00Z"); // 2 days ago
      expect(formatTimestamp(date)).toBe("2 days ago");
    });

    it("should handle singular day", () => {
      const date = new Date("2026-02-07T12:00:00Z"); // 1 day ago
      expect(formatTimestamp(date)).toBe("1 day ago");
    });

    it("should format old timestamps as localized date string", () => {
      const date = new Date("2026-01-01T12:00:00Z"); // More than 7 days ago
      const result = formatTimestamp(date);
      // Check if it's a valid date string (format may vary by locale)
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it("should handle timestamps in the future gracefully", () => {
      const date = new Date("2026-02-09T12:00:00Z"); // 1 day in the future
      const result = formatTimestamp(date);
      // Should still return a string, format may vary
      expect(typeof result).toBe("string");
    });
  });

  describe("formatDate", () => {
    it("should format date with default locale", () => {
      const date = new Date("2026-02-08T12:00:00Z");
      const result = formatDate(date);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should format date with custom options", () => {
      const date = new Date("2026-02-08T12:00:00Z");
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const result = formatDate(date, options);
      expect(typeof result).toBe("string");
      expect(result).toMatch(/February/);
    });

    it("should handle Date objects correctly", () => {
      const date = new Date("2026-01-01");
      const result = formatDate(date);
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });
});
