"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteNote } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/formatters";
import { tryCatch } from "@/try-catch";
import { PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { mutate } from "swr";
import { Textarea } from "../ui/textarea";
import type { Note } from "@/db/schema";

interface NoteCardProps {
  note: Note;
  patientId: string;
}

export function NoteCard({ note, patientId }: NoteCardProps) {
  const [isPending, startTransition] = useTransition();
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{note.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{formatTimestamp(note.updatedAt)}</Badge>
            <Button variant="ghost" size="icon-xs" onClick={handleDelete} disabled={isPending} aria-label="Delete note">
              <Trash2Icon className="text-destructive size-4" />
            </Button>
            <Button variant="ghost" size="icon-xs" aria-label="Edit note" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? <SaveIcon className="size-4" /> : <PencilIcon className="size-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea defaultValue={note.content} />
        ) : (
          <p className="text-muted-foreground min-h-16.5 w-full rounded-lg px-2.75 py-2.25 text-base whitespace-pre-wrap md:text-sm">
            {note.content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
