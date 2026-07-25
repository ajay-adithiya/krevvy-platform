"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { useCategories } from "@/features/categories/hooks/use-categories";

import { useCreateProduct } from "../hooks/use-create-product";
import {
  createProductSchema,
  CreateProductFormValues,
} from "../schemas/create-product.schema";

interface CreateProductFormProps {
  onSuccess: () => void;
}

export function CreateProductForm({
  onSuccess,
}: CreateProductFormProps) {
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const createProductMutation = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      amazonUrl: "",
      categoryId: "",
      isFeatured: false,
      isActive: true,
    },
  });

  useEffect(() => {
    register("categoryId");
    register("isFeatured");
    register("isActive");
  }, [register]);

  const categoryId = watch("categoryId");
  const isFeatured = watch("isFeatured");
  const isActive = watch("isActive");

  const onSubmit = (values: CreateProductFormValues) => {
    console.log("Submitted Values:", values);

    createProductMutation.mutate(values, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>

        <Input
          id="name"
          placeholder="Grass Sickle Cutter Head"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">
          Short Description
        </Label>

        <Input
          id="shortDescription"
          placeholder="Short description"
          {...register("shortDescription")}
        />

        {errors.shortDescription && (
          <p className="text-sm text-red-500">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          rows={5}
          placeholder="Product description..."
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price + Amazon URL */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price
          </Label>

          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price")}
          />

          {errors.price && (
            <p className="text-sm text-red-500">
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amazonUrl">
            Amazon URL
          </Label>

          <Input
            id="amazonUrl"
            placeholder="https://amazon.in/..."
            {...register("amazonUrl")}
          />

          {errors.amazonUrl && (
            <p className="text-sm text-red-500">
              {errors.amazonUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>
          Category
        </Label>

        <Select
          value={categoryId}
          onValueChange={(value) =>
            setValue("categoryId", value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>

          <SelectContent>
            {categoriesLoading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {errors.categoryId && (
          <p className="text-sm text-red-500">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Switches */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <Label>
              Featured Product
            </Label>

            <p className="text-sm text-muted-foreground">
              Display as featured.
            </p>
          </div>

          <Switch
            checked={isFeatured}
            onCheckedChange={(checked) =>
              setValue("isFeatured", checked, {
                shouldDirty: true,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <Label>
              Active
            </Label>

            <p className="text-sm text-muted-foreground">
              Product is available.
            </p>
          </div>

          <Switch
            checked={isActive}
            onCheckedChange={(checked) =>
              setValue("isActive", checked)
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={createProductMutation.isPending}
        >
          {createProductMutation.isPending
            ? "Creating..."
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}