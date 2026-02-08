"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/api";
import { formatTimestamp } from "@/lib/formatters";
import { useQueryState } from "nuqs";
import useSWR from "swr";
import { EmptyState } from "./empty-state";
import { NoteCard } from "./note-card";
import type { Note } from "@/db/schema";

export function NotesList() {
  const [patientId] = useQueryState("patient_id", { defaultValue: "", shallow: true });
  const { data: notes, error, isLoading } = useSWR<Note[]>(patientId ? `/api/notes/${patientId}` : null, fetcher);

  if (!patientId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">Notes History</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm">Enter a patient ID to view notes</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">Notes History</h2>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-sm">Loading notes...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">Notes History</h2>
        </div>
        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            <p className="text-destructive text-sm font-medium">Something went wrong</p>
            <p className="text-muted-foreground/70 mt-1 text-xs">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNotes = notes && notes.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Notes History</h2>
        {hasNotes && (
          <Badge>
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {hasNotes ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              content={note.content}
              timestamp={formatTimestamp(note.createdAt)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
