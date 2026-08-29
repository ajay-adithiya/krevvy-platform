"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useAboutContent,
  useUpdateAboutContent,
  useCreateAboutPillar,
  useUpdateAboutPillar,
  useDeleteAboutPillar
} from "@/features/cms/hooks/use-cms";
import { AboutPillar } from "@/features/cms/api/cms.service";

const formSchema = z.object({
  credoEyebrow: z.string().optional(),
  credoTitle: z.string().optional(),
  narrativeText: z.string().optional(),
  enterpriseTitle: z.string().optional(),
  enterpriseDescription: z.string().optional(),
  manufacturingBaseTitle: z.string().optional(),
  manufacturingBaseSubtitle: z.string().optional(),
  certificationTitle: z.string().optional(),
  certificationDescription: z.string().optional(),
  certificationBadgeLabel: z.string().optional(),
});

const pillarSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  iconName: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
});

export default function AboutContentPage() {
  const { data: aboutData, isLoading } = useAboutContent();
  const { mutate: updateAbout, isPending } = useUpdateAboutContent();
  const { mutate: createPillar } = useCreateAboutPillar();
  const { mutate: updatePillar } = useUpdateAboutPillar();
  const { mutate: deletePillar } = useDeleteAboutPillar();

  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<AboutPillar | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const pillarForm = useForm<z.infer<typeof pillarSchema>>({
    resolver: zodResolver(pillarSchema),
    defaultValues: { title: "", description: "", iconName: "", displayOrder: 0 },
  });

  useEffect(() => {
    if (aboutData?.content) {
      form.reset(aboutData.content);
    }
  }, [aboutData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => updateAbout(values);

  const handleOpenPillarModal = (pillar?: AboutPillar) => {
    if (pillar) {
      setEditingPillar(pillar);
      pillarForm.reset({ ...pillar });
    } else {
      setEditingPillar(null);
      pillarForm.reset({ title: "", description: "", iconName: "star", displayOrder: 0 });
    }
    setIsPillarModalOpen(true);
  };

  const onPillarSubmit = (values: z.infer<typeof pillarSchema>) => {
    if (editingPillar) {
      updatePillar({ id: editingPillar.id, data: values }, { onSuccess: () => setIsPillarModalOpen(false) });
    } else {
      createPillar(values, { onSuccess: () => setIsPillarModalOpen(false) });
    }
  };

  const handleDeletePillar = (id: string) => {
    if (confirm("Are you sure you want to delete this pillar?")) {
      deletePillar(id);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About Page</h1>
        <p className="text-muted-foreground">Manage the content and pillars of the About Us page.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Credo Section</h2>
            <FormField control={form.control} name="credoEyebrow" render={({ field }) => (
              <FormItem><FormLabel>Credo Eyebrow</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="credoTitle" render={({ field }) => (
              <FormItem><FormLabel>Credo Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="narrativeText" render={({ field }) => (
              <FormItem><FormLabel>Narrative</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Enterprise & Manufacturing</h2>
            <FormField control={form.control} name="enterpriseTitle" render={({ field }) => (
              <FormItem><FormLabel>Enterprise Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="enterpriseDescription" render={({ field }) => (
              <FormItem><FormLabel>Enterprise Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="manufacturingBaseTitle" render={({ field }) => (
              <FormItem><FormLabel>Manufacturing Base Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="manufacturingBaseSubtitle" render={({ field }) => (
              <FormItem><FormLabel>Manufacturing Base Subtitle</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h2 className="text-lg font-semibold">Certification</h2>
            <FormField control={form.control} name="certificationTitle" render={({ field }) => (
              <FormItem><FormLabel>Certification Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="certificationDescription" render={({ field }) => (
              <FormItem><FormLabel>Certification Description</FormLabel><FormControl><Textarea {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="certificationBadgeLabel" render={({ field }) => (
              <FormItem><FormLabel>Certification Badge Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Page Content
          </Button>
        </form>
      </Form>

      <div className="space-y-4 border rounded-md p-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">About Pillars</h2>
          <Button onClick={() => handleOpenPillarModal()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Pillar</Button>
        </div>

        {aboutData?.pillars && aboutData.pillars.length > 0 ? (
          <div className="grid gap-2 mt-4">
            {aboutData.pillars.map((pillar) => (
              <div key={pillar.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                <div>
                  <p className="font-medium">{pillar.title} (Order: {pillar.displayOrder})</p>
                  <p className="text-xs text-muted-foreground">{pillar.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon-sm" variant="ghost" onClick={() => handleOpenPillarModal(pillar)}><Edit2 className="w-4 h-4" /></Button>
                  <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDeletePillar(pillar.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No pillars added yet.</p>
        )}
      </div>

      <Dialog open={isPillarModalOpen} onOpenChange={setIsPillarModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingPillar ? "Edit Pillar" : "Add Pillar"}</DialogTitle></DialogHeader>
          <Form {...pillarForm}>
            <form onSubmit={pillarForm.handleSubmit(onPillarSubmit)} className="space-y-4">
              <FormField control={pillarForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={pillarForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={pillarForm.control} name="iconName" render={({ field }) => (
                  <FormItem><FormLabel>Icon Name</FormLabel><FormControl><Input {...field} placeholder="e.g. star" /></FormControl></FormItem>
                )} />
                <FormField control={pillarForm.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
              </div>
              <DialogFooter><Button type="submit">Save Pillar</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
