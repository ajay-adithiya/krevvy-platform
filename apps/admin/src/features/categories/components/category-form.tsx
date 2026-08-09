"use client";

import { useCreateCategory } from "../hooks/use-create-category";
import { useUpdateCategory } from "../hooks/use-update-category";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  createCategorySchema,
  CreateCategoryFormValues,
} from "../schemas/create-category.schema";

import { Category } from "../types/category.types";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: Category;
  onSuccess: () => void;
}

export function CategoryForm({
  mode,
  category,
  onSuccess,
}: CategoryFormProps) {

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const isPending =
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  useEffect(() => {
    register("isActive");
  }, [register]);

  const name = watch("name");
  const isActive = watch("isActive");

  useEffect(() => {
    if (mode === "create" && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      setValue("slug", generatedSlug, {
        shouldValidate: true,
      });
    }
  }, [name, mode, setValue]);

  const onSubmit = async (
    values: CreateCategoryFormValues
  ) => {
    try {
      if (mode === "create") {
        await createCategoryMutation.mutateAsync(values);
      } else {
        await updateCategoryMutation.mutateAsync({
          id: category!.id,
          data: values,
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="Power Tools"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          placeholder="power-tools"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Category description..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between rounded-md border p-4">
        <div>
          <Label>Active</Label>
          <p className="text-sm text-muted-foreground">
            Category is visible and available.
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) =>
            setValue("isActive", checked, { shouldDirty: true })
          }
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {mode === "create"
            ? isPending
              ? "Creating..."
              : "Create Category"
            : isPending
              ? "Updating..."
              : "Update Category"}
        </Button>
      </div>
    </form>
  );
}
