"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProductsContent, useUpdateProductsContent } from "@/features/cms/hooks/use-cms";

const formSchema = z.object({
  pageEyebrow: z.string().optional(),
  pageTitle: z.string().optional(),
  pageSubtitle: z.string().optional(),
  emptySearchMessage: z.string().optional(),
  allProductsLabel: z.string().optional(),
  viewTechSpecsLabel: z.string().optional(),
  hideTechSpecsLabel: z.string().optional(),
  categoriesFilterLabel: z.string().optional(),
  newArrivalsFilterLabel: z.string().optional(),
  bestSellersFilterLabel: z.string().optional(),
  onDiscountFilterLabel: z.string().optional(),
  inStockLabel: z.string().optional(),
  warrantyLabel: z.string().optional(),
  featuresHeadingLabel: z.string().optional(),
  clearFilterLabel: z.string().optional(),
  viewDetailsButtonLabel: z.string().optional(),
});

export default function ProductsContentPage() {
  const { data: productsData, isLoading } = useProductsContent();
  const { mutate: updateProducts, isPending } = useUpdateProductsContent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (productsData) {
      form.reset(productsData);
    }
  }, [productsData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProducts(values);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products Page</h1>
        <p className="text-muted-foreground">Manage the content of the products listing page.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Page Header</h2>
            <FormField control={form.control} name="pageEyebrow" render={({ field }) => (
              <FormItem><FormLabel>Eyebrow</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="pageTitle" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="pageSubtitle" render={({ field }) => (
              <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">UI Labels</h2>
            <FormField control={form.control} name="emptySearchMessage" render={({ field }) => (
              <FormItem><FormLabel>Empty Search Message</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="allProductsLabel" render={({ field }) => (
              <FormItem><FormLabel>All Products Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="viewTechSpecsLabel" render={({ field }) => (
                <FormItem><FormLabel>View Tech Specs Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="hideTechSpecsLabel" render={({ field }) => (
                <FormItem><FormLabel>Hide Tech Specs Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <h3 className="text-md font-semibold mt-6 mb-2">Filter & Badges</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="categoriesFilterLabel" render={({ field }) => (
                <FormItem><FormLabel>Categories Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="newArrivalsFilterLabel" render={({ field }) => (
                <FormItem><FormLabel>New Arrivals Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="bestSellersFilterLabel" render={({ field }) => (
                <FormItem><FormLabel>Best Sellers Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="onDiscountFilterLabel" render={({ field }) => (
                <FormItem><FormLabel>On Discount Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="clearFilterLabel" render={({ field }) => (
                <FormItem><FormLabel>Clear Filter Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="inStockLabel" render={({ field }) => (
                <FormItem><FormLabel>In Stock Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <h3 className="text-md font-semibold mt-6 mb-2">Product Card Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="warrantyLabel" render={({ field }) => (
                <FormItem><FormLabel>Warranty Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="featuresHeadingLabel" render={({ field }) => (
                <FormItem><FormLabel>Features Heading Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="viewDetailsButtonLabel" render={({ field }) => (
                <FormItem><FormLabel>View Details Button Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
