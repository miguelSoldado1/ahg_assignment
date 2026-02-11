"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { createNote, createNoteSchema } from "@/api/notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotesNavigation } from "@/hooks/use-notes-navigation";
import { ERROR_TITLE, SUCCESS_TITLE } from "@/lib/utils";
import { tryCatch } from "@/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";
import { Spinner } from "../ui/spinner";

const createNoteFormSchema = createNoteSchema.omit({ patientId: true });

export function NoteForm() {
  const { patientId } = useNotesNavigation();
  const form = useForm<z.infer<typeof createNoteFormSchema>>({
    resolver: zodResolver(createNoteFormSchema),
    defaultValues: { title: "", content: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset();
  }, [form, patientId]);

  async function onSubmit(data: z.infer<typeof createNoteFormSchema>) {
    if (!patientId) {
      return toast.error(ERROR_TITLE, {
        description: "Patient ID is missing. Please select a patient before creating a note.",
      });
    }

    const { error } = await tryCatch(createNote({ ...data, patientId }));
    if (error) {
      return toast.error(ERROR_TITLE, {
        description: error.message ?? "An unexpected error occurred while creating the note. Please try again.",
      });
    }

    toast.success(SUCCESS_TITLE, { description: "Note created successfully" });
    mutate([patientId, 1]);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Note</CardTitle>
        <CardDescription>Add a new medical note for this patient</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="note-form">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter note title"
                  aria-invalid={fieldState.invalid}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Enter note content"
                  aria-invalid={fieldState.invalid}
                  disabled={form.formState.isSubmitting}
                  rows={6}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="note-form" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner />}
          {form.formState.isSubmitting ? "Saving..." : "Save Note"}
        </Button>
      </CardFooter>
    </Card>
  );
}
