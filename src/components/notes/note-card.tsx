"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteNote } from "@/lib/api";
import { formatTimestamp } from "@/lib/formatters";
import { tryCatch } from "@/try-catch";
import { Trash2Icon } from "lucide-react";
import { mutate } from "swr";
import type { Note } from "@/db/schema";

interface NoteCardProps {
  note: Note;
  patientId: string;
}

export function NoteCard({ note, patientId }: NoteCardProps) {
  const [isPending, startTransition] = useTransition();

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
            <Badge variant="secondary">{formatTimestamp(note.createdAt)}</Badge>
            <Button variant="ghost" size="icon-xs" onClick={handleDelete} disabled={isPending} aria-label="Delete note">
              <Trash2Icon className="text-destructive size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">{note.content}</p>
      </CardContent>
    </Card>
  );
}
