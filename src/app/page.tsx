import { NoteForm } from "@/components/notes/note-form";
import { NotesList } from "@/components/notes/notes-list";
import { PatientSelector } from "@/components/notes/patient-selector";

export default function Page() {
  return (
    <main className="bg-muted/30 min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-1">
          <h1 className="text-foreground text-3xl font-bold">Patient Notes</h1>
          <p className="text-muted-foreground">Create and manage patient medical notes</p>
        </header>
        <section aria-label="Patient selection">
          <PatientSelector />
        </section>
        <section aria-label="Patient notes management" className="grid gap-8 lg:grid-cols-2">
          <NoteForm />
          <NotesList />
        </section>
      </div>
    </main>
  );
}
