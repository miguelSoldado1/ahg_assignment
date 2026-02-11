"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPatient, createPatientSchema } from "@/api/patients";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNotesNavigation } from "@/hooks/use-notes-navigation";
import { ERROR_TITLE, SUCCESS_TITLE } from "@/lib/utils";
import { tryCatch } from "@/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";
import { Spinner } from "../ui/spinner";

export function AddPatientDialog() {
  const { setPatientId } = useNotesNavigation();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createPatientSchema>>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: { name: "" },
    mode: "onSubmit",
  });

  async function onSubmit(data: z.infer<typeof createPatientSchema>) {
    const { error, data: userData } = await tryCatch(createPatient(data));
    if (error) {
      return toast.error(ERROR_TITLE, {
        description: error.message ?? "An unexpected error occurred while creating the patient. Please try again.",
      });
    }

    toast.success(SUCCESS_TITLE, { description: "Patient created successfully" });
    setPatientId(userData.id);
    mutate("patients");
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <UserPlusIcon />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Create a new patient record</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} id="add-patient-form" className="space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Patient Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter patient name"
                  aria-invalid={fieldState.invalid}
                  disabled={form.formState.isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={form.formState.isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-patient-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            Create Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
