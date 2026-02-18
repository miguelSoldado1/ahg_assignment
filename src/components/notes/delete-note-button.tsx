"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteNote } from "@/api/notes";
import { DeleteDialog } from "@/components/delete-dialog";
import { useNotesNavigation } from "@/hooks/use-notes-navigation";
import { ERROR_TITLE, SUCCESS_TITLE } from "@/lib/utils";
import { tryCatch } from "@/try-catch";
import { Trash2Icon } from "lucide-react";
import { mutate } from "swr";
import { NoteActionButton } from "./note-action-button";

type DeleteNoteButtonProps = {
  disabled?: boolean;
  noteId: string;
  patientId: string;
};

export function DeleteNoteButton({ disabled, noteId, patientId }: DeleteNoteButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { setPage } = useNotesNavigation();

  async function handleDelete() {
    const { error } = await tryCatch(deleteNote({ noteId, patientId }));
    if (error) {
      return toast.error(ERROR_TITLE, {
        description: error.message ?? "An unexpected error occurred. Please try again.",
      });
    }

    toast.success(SUCCESS_TITLE, { description: "Note deleted successfully" });
    mutate([patientId, 1]);
    setShowDeleteDialog(false);
    setPage(1);
  }

  return (
    <DeleteDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}
      onConfirm={handleDelete}
      disabled={disabled}
    >
      <NoteActionButton aria-label="Delete note" disabled={disabled}>
        <Trash2Icon className="text-destructive" />
      </NoteActionButton>
    </DeleteDialog>
  );
}
