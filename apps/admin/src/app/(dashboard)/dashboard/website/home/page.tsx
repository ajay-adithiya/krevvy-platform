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
import { Textarea } from "@/components/ui/textarea";
import { useHomeContent, useUpdateHomeContent } from "@/features/cms/hooks/use-cms";

const formSchema = z.object({
  heroEyebrow: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroCtaLabel: z.string().optional(),
  searchPlaceholder: z.string().optional(),
  searchButtonLabel: z.string().optional(),
  collectionEyebrow: z.string().optional(),
  collectionTitle: z.string().optional(),
  collectionDescription: z.string().optional(),
});

export default function HomeContentPage() {
  const { data: homeData, isLoading } = useHomeContent();
  const { mutate: updateHome, isPending } = useUpdateHomeContent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (homeData) {
      form.reset(homeData);
    }
  }, [homeData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateHome(values);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home Page</h1>
        <p className="text-muted-foreground">Manage the content of the home page hero and collections.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Hero Section</h2>
            <FormField control={form.control} name="heroEyebrow" render={({ field }) => (
              <FormItem><FormLabel>Hero Eyebrow</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="heroTitle" render={({ field }) => (
              <FormItem><FormLabel>Hero Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
              <FormItem><FormLabel>Hero Subtitle</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="heroCtaLabel" render={({ field }) => (
              <FormItem><FormLabel>CTA Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="searchPlaceholder" render={({ field }) => (
                <FormItem><FormLabel>Search Placeholder</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="searchButtonLabel" render={({ field }) => (
                <FormItem><FormLabel>Search Button Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Collection Section</h2>
            <FormField control={form.control} name="collectionEyebrow" render={({ field }) => (
              <FormItem><FormLabel>Collection Eyebrow</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="collectionTitle" render={({ field }) => (
              <FormItem><FormLabel>Collection Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="collectionDescription" render={({ field }) => (
              <FormItem><FormLabel>Collection Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
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
