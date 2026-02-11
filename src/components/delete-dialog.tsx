"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import * as DialogCore from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<unknown> | unknown;
  // trigger element passed as children (required)
  children: React.ReactNode;
  disabled?: boolean;
};

export function DeleteDialog({ open, onOpenChange, onConfirm, children, disabled }: DeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm();
    });
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCore.DialogTrigger asChild disabled={disabled || isPending}>
        {children}
      </DialogCore.DialogTrigger>
      <DialogCore.DialogContent className="min-w-xl">
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Are you absolutely sure you want to delete this item?</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>
            This action cannot be undone. This will permanently delete the item and remove it from our servers.
          </DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <DialogCore.DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            {isPending && <Spinner />}
            Cancel
          </Button>
          <Button disabled={isPending} variant="destructive" onClick={handleConfirm}>
            {isPending && <Spinner />}
            Delete
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
