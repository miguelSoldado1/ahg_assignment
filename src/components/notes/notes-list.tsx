"use client";

import { getNotes } from "@/api/notes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNotesNavigation } from "@/hooks/use-notes-navigation";
import useSWR from "swr";
import { Spinner } from "../ui/spinner";
import { EmptyState } from "./empty-state";
import { NoteCard } from "./note-card";
import { NotesListPagination } from "./notes-list-pagination";

export function NotesList() {
  const { patientId, page, setPage } = useNotesNavigation();
  const { data, error, isLoading } = useSWR(patientId ? [patientId, page] : null, ([patientId, page]) =>
    getNotes({ patientId, page }),
  );

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
          <CardContent className="flex items-center justify-center p-12">
            <Spinner className="size-8" />
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

  const hasNotes = data && data.notes.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Notes History</h2>
        {hasNotes && (
          <Badge>
            {data.notes.length} note{data.notes.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      {hasNotes ? (
        <div className="space-y-4">
          {data.notes.map((note) => (
            <NoteCard key={note.id} note={note} patientId={patientId} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      <NotesListPagination numberOfPages={data?.total} currentPage={page} setPage={setPage} />
    </div>
  );
}
