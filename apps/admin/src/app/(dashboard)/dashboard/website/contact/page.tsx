"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
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
import {
  useContactContent,
  useUpdateContactContent,
  useCreateContactInquiryOption,
  useUpdateContactInquiryOption,
  useDeleteContactInquiryOption,
} from "@/features/cms/hooks/use-cms";
import { ContactInquiryOption } from "@/features/cms/api/cms.service";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  headerEyebrow: z.string().optional(),
  headerTitle: z.string().optional(),
  headerSubtitle: z.string().optional(),
  warrantyCardTitle: z.string().optional(),
  warrantyCardText: z.string().optional(),
  formNameLabel: z.string().optional(),
  formEmailLabel: z.string().optional(),
  formPhoneLabel: z.string().optional(),
  formCategoryLabel: z.string().optional(),
  formMessageLabel: z.string().optional(),
  formSubmitLabel: z.string().optional(),
  validationRequiredMessage: z.string().optional(),
  validationEmailMessage: z.string().optional(),
  successMessageTitle: z.string().optional(),
  successMessageDescription: z.string().optional(),
  successResetButtonLabel: z.string().optional(),
  contactTouchpointsHeading: z.string().optional(),
  contactPhoneHeading: z.string().optional(),
  contactEmailHeading: z.string().optional(),
  contactAddressHeading: z.string().optional(),
  formLoadingMessage: z.string().optional(),
  successTicketPrefixLabel: z.string().optional(),
});

const inquiryOptionSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1, "Required"),
  label: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
});

export default function ContactContentPage() {
  const { data: contactData, isLoading } = useContactContent();
  const { mutate: updateContact, isPending } = useUpdateContactContent();

  const { mutate: createOption } = useCreateContactInquiryOption();
  const { mutate: updateOption } = useUpdateContactInquiryOption();
  const { mutate: deleteOption } = useDeleteContactInquiryOption();

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ContactInquiryOption | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const optionForm = useForm<z.infer<typeof inquiryOptionSchema>>({
    resolver: zodResolver(inquiryOptionSchema),
    defaultValues: { value: "", label: "", displayOrder: 0, isVisible: true },
  });

  useEffect(() => {
    if (contactData?.content) {
      form.reset(contactData.content);
    }
  }, [contactData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateContact(values);
  };

  const handleOpenOptionModal = (option?: ContactInquiryOption) => {
    if (option) {
      setEditingOption(option);
      optionForm.reset({ ...option });
    } else {
      setEditingOption(null);
      optionForm.reset({ value: "", label: "", displayOrder: 0, isVisible: true });
    }
    setIsOptionModalOpen(true);
  };

  const onOptionSubmit = (values: z.infer<typeof inquiryOptionSchema>) => {
    if (editingOption) {
      updateOption({ id: editingOption.id, data: values }, { onSuccess: () => setIsOptionModalOpen(false) });
    } else {
      createOption(values, { onSuccess: () => setIsOptionModalOpen(false) });
    }
  };

  const handleDeleteOption = (id: string) => {
    if (confirm("Are you sure you want to delete this option?")) {
      deleteOption(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Page</h1>
        <p className="text-muted-foreground">Manage form labels, messages, and contact page text.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Header & Warranty</h2>
            <FormField control={form.control} name="headerEyebrow" render={({ field }) => (
              <FormItem><FormLabel>Header Eyebrow</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="headerTitle" render={({ field }) => (
              <FormItem><FormLabel>Header Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="headerSubtitle" render={({ field }) => (
              <FormItem><FormLabel>Header Subtitle</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="warrantyCardTitle" render={({ field }) => (
              <FormItem><FormLabel>Warranty Card Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="warrantyCardText" render={({ field }) => (
              <FormItem><FormLabel>Warranty Card Text</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Touchpoints Headings</h2>
            <FormField control={form.control} name="contactTouchpointsHeading" render={({ field }) => (
              <FormItem><FormLabel>Main Touchpoints Heading</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="contactPhoneHeading" render={({ field }) => (
                <FormItem><FormLabel>Phone Box Heading</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="contactEmailHeading" render={({ field }) => (
                <FormItem><FormLabel>Email Box Heading</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="contactAddressHeading" render={({ field }) => (
                <FormItem><FormLabel>Address Box Heading</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Form Labels</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="formNameLabel" render={({ field }) => (
                <FormItem><FormLabel>Name Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="formEmailLabel" render={({ field }) => (
                <FormItem><FormLabel>Email Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="formPhoneLabel" render={({ field }) => (
                <FormItem><FormLabel>Phone Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="formCategoryLabel" render={({ field }) => (
                <FormItem><FormLabel>Category Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="formMessageLabel" render={({ field }) => (
              <FormItem><FormLabel>Message Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="formSubmitLabel" render={({ field }) => (
              <FormItem><FormLabel>Submit Button Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Validation & Success Messages</h2>
            <FormField control={form.control} name="validationRequiredMessage" render={({ field }) => (
              <FormItem><FormLabel>Required Field Message</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="validationEmailMessage" render={({ field }) => (
              <FormItem><FormLabel>Invalid Email Message</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="successMessageTitle" render={({ field }) => (
              <FormItem><FormLabel>Success Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="successMessageDescription" render={({ field }) => (
              <FormItem><FormLabel>Success Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="successResetButtonLabel" render={({ field }) => (
              <FormItem><FormLabel>Reset Button Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="formLoadingMessage" render={({ field }) => (
              <FormItem><FormLabel>Loading Message</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="successTicketPrefixLabel" render={({ field }) => (
              <FormItem><FormLabel>Ticket Prefix Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>

      <div className="space-y-4 border rounded-md p-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Inquiry Options</h2>
          <Button onClick={() => handleOpenOptionModal()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Option</Button>
        </div>

        {contactData?.inquiryOptions && contactData.inquiryOptions.length > 0 ? (
          <div className="grid gap-2 mt-4">
            {contactData.inquiryOptions.map((option) => (
              <div key={option.id} className={`flex items-center justify-between p-3 border rounded-md bg-card ${!option.isVisible ? 'opacity-50' : ''}`}>
                <div>
                  <p className="font-medium">{option.label} (Value: {option.value})</p>
                  <p className="text-xs text-muted-foreground">Order: {option.displayOrder} • Visible: {option.isVisible ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon-sm" variant="ghost" onClick={() => handleOpenOptionModal(option)}><Edit2 className="w-4 h-4" /></Button>
                  <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteOption(option.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No inquiry options added yet.</p>
        )}
      </div>

      <Dialog open={isOptionModalOpen} onOpenChange={setIsOptionModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingOption ? "Edit Option" : "Add Option"}</DialogTitle></DialogHeader>
          <Form {...optionForm}>
            <form onSubmit={optionForm.handleSubmit(onOptionSubmit)} className="space-y-4">
              <FormField control={optionForm.control} name="label" render={({ field }) => (
                <FormItem><FormLabel>Display Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={optionForm.control} name="value" render={({ field }) => (
                <FormItem><FormLabel>Internal Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={optionForm.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={optionForm.control} name="isVisible" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md h-full justify-center">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none"><FormLabel>Visible</FormLabel></div>
                  </FormItem>
                )} />
              </div>
              <DialogFooter><Button type="submit">Save Option</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
