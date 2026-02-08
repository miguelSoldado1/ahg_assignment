import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground text-sm">No notes found for this patient</p>
        <p className="text-muted-foreground/70 mt-1 text-xs">Create your first note using the form on the left</p>
      </CardContent>
    </Card>
  );
}
