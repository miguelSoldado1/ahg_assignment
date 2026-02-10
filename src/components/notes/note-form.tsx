"use client";

import { toast } from "sonner";
import { createNote } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useQueryState } from "nuqs";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

const noteFormSchema = z.object({
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

const ERROR_TITLE = "Oops, something went wrong";

export function NoteForm() {
  const [patientId] = useQueryState("patient_id", { defaultValue: "", shallow: true });
  const form = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { title: "", content: "" },
    mode: "onSubmit",
  });

  async function onSubmit(data: z.infer<typeof noteFormSchema>) {
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

    toast.success("Note created successfully");
    mutate(patientId);
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
          {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
          {form.formState.isSubmitting ? "Saving..." : "Save Note"}
        </Button>
      </CardFooter>
    </Card>
  );
}
