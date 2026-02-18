"use client";

import { Suspense } from "react";
import { AddPatientDialog } from "@/components/notes/add-patient-dialog";
import { NoteForm } from "@/components/notes/note-form";
import { NotesList } from "@/components/notes/notes-list";
import { PatientSelector } from "@/components/notes/patient-selector";
import { ShieldPlusIcon } from "lucide-react";

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-8 p-8">
      <Suspense>
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldPlusIcon className="text-foreground size-10" />
            <div>
              <h1 className="text-foreground text-3xl font-bold">Patient Notes</h1>
              <p className="text-muted-foreground">Create and manage patient medical notes</p>
            </div>
          </div>
          <AddPatientDialog />
        </header>
        <section aria-label="Patient selection">
          <PatientSelector />
        </section>
        <section aria-label="Patient notes management" className="grid items-start gap-8 lg:grid-cols-2">
          <NoteForm />
          <NotesList />
        </section>
      </Suspense>
    </main>
  );
}
