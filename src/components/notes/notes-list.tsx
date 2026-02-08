import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./empty-state";
import { NoteCard } from "./note-card";

const sampleNotes = [
  {
    id: "1",
    title: "Patient Follow-up",
    content:
      "Patient reported significant improvement in symptoms. Blood pressure normalized at 120/80. Continue current medication regimen for another 2 weeks.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Initial Consultation",
    content:
      "Patient presents with mild hypertension. Prescribed medication and recommended lifestyle changes including diet modification and regular exercise.",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    title: "Lab Results Review",
    content:
      "Reviewed recent lab work. All markers within normal range except slightly elevated cholesterol. Discussed dietary changes with patient.",
    timestamp: "3 days ago",
  },
];

export function NotesList() {
  const hasNotes = sampleNotes.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Notes History</h2>
        <Badge>{sampleNotes.length} notes</Badge>
      </div>

      {hasNotes ? (
        <div className="space-y-4">
          {sampleNotes.map((note) => (
            <NoteCard key={note.id} title={note.title} content={note.content} timestamp={note.timestamp} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
