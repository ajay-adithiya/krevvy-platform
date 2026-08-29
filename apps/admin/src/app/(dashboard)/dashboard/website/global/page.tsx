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
import { useGlobalContent, useUpdateGlobalContent, useCreateAmazonModalBenefit, useUpdateAmazonModalBenefit, useDeleteAmazonModalBenefit } from "@/features/cms/hooks/use-cms";

const formSchema = z.object({
  seoGlobalTitle: z.string().optional(),
  seoGlobalDescription: z.string().optional(),
  footerBrandDescription: z.string().optional(),
  copyrightText: z.string().optional(),
  complianceText: z.string().optional(),
  mobileMenuOpenLabel: z.string().optional(),
  mobileMenuCloseLabel: z.string().optional(),
  companyName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  hqAddress: z.string().optional(),
  businessHours: z.string().optional(),
  buyOnAmazonLabel: z.string().optional(),
  amazonModalTitle: z.string().optional(),
  amazonModalSubtitle: z.string().optional(),
  amazonModalTrustText: z.string().optional(),
  amazonModalVerifiedLabel: z.string().optional(),
  amazonModalItemLabel: z.string().optional(),
  amazonModalPriceLabel: z.string().optional(),
  amazonModalContinueLabel: z.string().optional(),
  amazonModalCancelLabel: z.string().optional(),
});

export default function GlobalSettingsPage() {
  const { data: globalData, isLoading } = useGlobalContent();
  const { mutate: updateGlobal, isPending } = useUpdateGlobalContent();

  const { mutate: createBenefit } = useCreateAmazonModalBenefit();
  const { mutate: updateBenefit } = useUpdateAmazonModalBenefit();
  const { mutate: deleteBenefit } = useDeleteAmazonModalBenefit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (globalData?.content) {
      form.reset(globalData.content);
    }
  }, [globalData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateGlobal(values);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Content</h1>
        <p className="text-muted-foreground">Manage global site settings, SEO, and contact information.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">SEO & Branding</h2>
            <FormField control={form.control} name="seoGlobalTitle" render={({ field }) => (
              <FormItem><FormLabel>Global SEO Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="seoGlobalDescription" render={({ field }) => (
              <FormItem><FormLabel>Global SEO Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="footerBrandDescription" render={({ field }) => (
              <FormItem><FormLabel>Footer Brand Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="contactPhone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="contactEmail" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="hqAddress" render={({ field }) => (
              <FormItem><FormLabel>HQ Address</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="businessHours" render={({ field }) => (
              <FormItem><FormLabel>Business Hours</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Amazon Hand-off</h2>
            <FormField control={form.control} name="buyOnAmazonLabel" render={({ field }) => (
              <FormItem><FormLabel>Global 'Buy on Amazon' Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="amazonModalTitle" render={({ field }) => (
              <FormItem><FormLabel>Modal Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="amazonModalSubtitle" render={({ field }) => (
              <FormItem><FormLabel>Modal Subtitle</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="amazonModalContinueLabel" render={({ field }) => (
                <FormItem><FormLabel>Continue Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="amazonModalCancelLabel" render={({ field }) => (
                <FormItem><FormLabel>Cancel Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="amazonModalVerifiedLabel" render={({ field }) => (
                <FormItem><FormLabel>Verified Partner Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="amazonModalTrustText" render={({ field }) => (
                <FormItem><FormLabel>Trust Text</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="amazonModalItemLabel" render={({ field }) => (
                <FormItem><FormLabel>Selected Item Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="amazonModalPriceLabel" render={({ field }) => (
                <FormItem><FormLabel>Price Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="mt-8 border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold">Amazon Modal Benefits</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => createBenefit({ title: 'New Benefit', description: 'Benefit description' })}>Add Benefit</Button>
              </div>
              <div className="space-y-4">
                {globalData?.amazonModalBenefits?.map((benefit) => (
                  <div key={benefit.id} className="flex gap-4 items-start border p-4 rounded-md">
                    <div className="flex-1 space-y-4">
                      <Input value={benefit.title} onChange={(e) => updateBenefit({ id: benefit.id, data: { title: e.target.value } })} placeholder="Title" />
                      <Input value={benefit.description} onChange={(e) => updateBenefit({ id: benefit.id, data: { description: e.target.value } })} placeholder="Description" />
                      <Input value={benefit.iconName || ''} onChange={(e) => updateBenefit({ id: benefit.id, data: { iconName: e.target.value } })} placeholder="Icon Name (e.g. ShieldCheck)" />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => deleteBenefit(benefit.id)}>Delete</Button>
                  </div>
                ))}
                {(!globalData?.amazonModalBenefits || globalData.amazonModalBenefits.length === 0) && (
                  <p className="text-sm text-muted-foreground">No benefits added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Miscellaneous</h2>
            <FormField control={form.control} name="copyrightText" render={({ field }) => (
              <FormItem><FormLabel>Copyright Text</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="complianceText" render={({ field }) => (
              <FormItem><FormLabel>Compliance Text</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="mobileMenuOpenLabel" render={({ field }) => (
                <FormItem><FormLabel>Mobile Menu Open Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="mobileMenuCloseLabel" render={({ field }) => (
                <FormItem><FormLabel>Mobile Menu Close Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
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
