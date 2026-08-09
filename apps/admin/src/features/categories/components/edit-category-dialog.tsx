"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Category } from "../types/category.types";
import { CategoryForm } from "./category-form";

interface EditCategoryDialogProps {
  category: Category;
  trigger?: React.ReactNode;
}

export function EditCategoryDialog({
  category,
  trigger,
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>

          <DialogDescription>
            Update category details.
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          mode="edit"
          category={category}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}