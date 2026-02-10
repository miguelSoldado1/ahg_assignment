"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPatient, createPatientSchema } from "@/api";
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
import { tryCatch } from "@/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, UserPlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

const ERROR_TITLE = "Oops, something went wrong";

export function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createPatientSchema>>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: { name: "" },
    mode: "onSubmit",
  });

  async function onSubmit(data: z.infer<typeof createPatientSchema>) {
    const { error } = await tryCatch(createPatient(data));
    if (error) {
      return toast.error(ERROR_TITLE, {
        description: error.message ?? "An unexpected error occurred while creating the patient. Please try again.",
      });
    }

    toast.success("Patient created successfully");
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
            {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
            Create Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
