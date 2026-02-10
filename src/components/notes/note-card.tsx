"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteNote, updateNote } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/formatters";
import { tryCatch } from "@/try-catch";
import { PencilIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";
import { mutate } from "swr";
import { Textarea } from "../ui/textarea";
import { NoteActionButton } from "./note-action-button";
import type { Note } from "@/db/schema";

interface NoteCardProps {
  note: Note;
  patientId: string;
}

export function NoteCard({ note, patientId }: NoteCardProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const { error } = await tryCatch(deleteNote(note.id, patientId));
      if (error) {
        toast.error("Failed to delete note", {
          description: error.message ?? "An unexpected error occurred. Please try again.",
        });
        return;
      }

      toast.success("Note deleted successfully");
      mutate(patientId);
    });
  }

  function handleEdit() {
    if (!isEditing) {
      return setIsEditing(true);
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return toast.error("Note content cannot be empty");
    }

    if (trimmedContent === note.content) {
      return setIsEditing(false);
    }

    startTransition(async () => {
      const { error } = await tryCatch(updateNote({ content: trimmedContent, patientId: patientId, noteId: note.id }));
      if (error) {
        toast.error("Failed to update note", {
          description: error.message ?? "An unexpected error occurred. Please try again.",
        });
        return;
      }

      toast.success("Note updated successfully");
      setIsEditing(false);
      mutate(patientId);
    });
  }

  function handleCancelEdit() {
    setContent(note.content);
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{note.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{formatTimestamp(note.createdAt)}</Badge>
            <NoteActionButton onClick={handleDelete} disabled={isPending || isEditing} aria-label="Delete note">
              <Trash2Icon className="text-destructive" />
            </NoteActionButton>
            <NoteActionButton aria-label="Edit note" disabled={isPending} onClick={handleEdit}>
              {isEditing ? <SaveIcon /> : <PencilIcon />}
            </NoteActionButton>
            {isEditing && (
              <NoteActionButton disabled={isPending} onClick={handleCancelEdit} aria-label="Cancel editing">
                <XIcon />
              </NoteActionButton>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea autoFocus value={content} onChange={(e) => setContent(e.target.value)} disabled={isPending} />
        ) : (
          <p className="text-muted-foreground min-h-16.5 w-full rounded-lg px-2.75 py-2.25 text-base whitespace-pre-wrap md:text-sm">
            {content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
