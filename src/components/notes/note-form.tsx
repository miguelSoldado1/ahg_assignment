import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function NoteForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Note</CardTitle>
        <CardDescription>Add a new medical note for this patient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <label htmlFor="note-content" className="text-foreground mb-2 block text-sm font-medium">
            Note Content
          </label>
          <Textarea id="note-content" placeholder="Enter medical note details..." rows={8} className="resize-none" />
        </Field>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Note</Button>
      </CardFooter>
    </Card>
  );
}
