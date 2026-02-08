"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useQueryState } from "nuqs";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { Input } from "../ui/input";

const createNoteSchema = z.object({
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

export function NoteForm() {
  const [patientId] = useQueryState("patient_id", { defaultValue: "", shallow: true });
  const { mutate } = useSWRConfig();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!patientId) {
      setError("Please select a patient first");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const result = createNoteSchema.safeParse({ title, content });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create note");
      }

      // Reset form and revalidate notes list
      e.currentTarget.reset();
      mutate(`/api/notes/${patientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Note</CardTitle>
        <CardDescription>Add a new medical note for this patient</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="note-title">Note Title</FieldLabel>
            <Input
              id="note-title"
              name="title"
              placeholder="e.g., Follow-up Visit, Initial Consultation..."
              disabled={!patientId || isSubmitting}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="note-content">Note Content</FieldLabel>
            <Textarea
              id="note-content"
              name="content"
              placeholder="Enter medical note details..."
              rows={8}
              className="resize-none"
              disabled={!patientId || isSubmitting}
              aria-invalid={!!error}
              aria-describedby={error ? "note-content-error" : undefined}
            />
            <FieldError id="note-content-error">{error}</FieldError>
          </Field>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!patientId || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Note"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
