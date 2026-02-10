"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteNote } from "@/api";
import * as DialogCore from "@/components/ui/dialog";
import { tryCatch } from "@/try-catch";
import { Trash2Icon } from "lucide-react";
import { mutate } from "swr";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { NoteActionButton } from "./note-action-button";

interface DeleteNoteButtonProps {
  disabled?: boolean;
  noteId: string;
  patientId: string;
}

export function DeleteNoteButton({ disabled, noteId, patientId }: DeleteNoteButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const { error } = await tryCatch(deleteNote(noteId, patientId));
      if (error) {
        toast.error("Failed to delete note", {
          description: error.message ?? "An unexpected error occurred. Please try again.",
        });
        return;
      }

      toast.success("Note deleted successfully");
      setShowDeleteDialog(false);
      mutate(patientId);
    });
  }

  return (
    <DialogCore.Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
      <DialogCore.DialogTrigger asChild disabled={disabled || isPending}>
        <NoteActionButton onClick={() => setShowDeleteDialog(true)} aria-label="Delete note">
          <Trash2Icon className="text-destructive" />
        </NoteActionButton>
      </DialogCore.DialogTrigger>
      <DialogCore.DialogContent className="min-w-xl">
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Are you absolutely sure you want to delete this note?</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>
            This action cannot be undone. This will permanently delete the item and remove it from our servers.
          </DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <DialogCore.DialogFooter>
          <Button disabled={isPending} onClick={() => setShowDeleteDialog(false)} variant="outline">
            {isPending && <Spinner />}
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleDelete} variant="destructive">
            {isPending && <Spinner />}
            Delete
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );

  // return (
  // <>
  //   <NoteActionButton onClick={() => setShowDeleteDialog(true)} disabled={disabled} aria-label="Delete note">
  //     <Trash2Icon className="text-destructive" />
  //   </NoteActionButton>
  //   <DeleteConfirmationDialog
  //     isPending={disabled}
  //     onConfirm={handleDelete}
  //     onOpenChange={setShowDeleteDialog}
  //     open={showDeleteDialog}
  //   />
  // </>
  // );
}
