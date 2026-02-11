"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deletePatient } from "@/api/patients";
import { useNotesNavigation } from "@/hooks/use-notes-navigation";
import { tryCatch } from "@/try-catch";
import { Trash2Icon } from "lucide-react";
import { mutate } from "swr";
import { DeleteDialog } from "../delete-dialog";
import { Button } from "../ui/button";

export function DeletePatientButton() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { patientId, setPatientId } = useNotesNavigation();

  async function handleDelete() {
    const { error } = await tryCatch(deletePatient({ patientId }));
    if (error) {
      return toast.error("Failed to delete note", {
        description: error.message ?? "An unexpected error occurred. Please try again.",
      });
    }

    toast.success("Patient deleted successfully");
    setShowDeleteDialog(false);
    setPatientId("");
    mutate("patients");
  }

  return (
    <DeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete}>
      <Button variant="destructive">
        <Trash2Icon className="size-4" />
        Delete
      </Button>
    </DeleteDialog>
  );
}
