"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

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
  useFaqContent,
  useUpdateFaqContent,
  useCreateFaqCategory,
  useUpdateFaqCategory,
  useDeleteFaqCategory,
  useCreateFaqItem,
  useUpdateFaqItem,
  useDeleteFaqItem
} from "@/features/cms/hooks/use-cms";
import { FaqCategory, FaqItem } from "@/features/cms/api/cms.service";

const formSchema = z.object({
  headerEyebrow: z.string().optional(),
  headerTitle: z.string().optional(),
  headerSubtitle: z.string().optional(),
  fallbackSupportText: z.string().optional(),
  allFaqsLabel: z.string().optional(),
});

const categorySchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, "Required"),
  displayLabel: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
});

const itemSchema = z.object({
  id: z.string().optional(),
  faqCategoryId: z.string().min(1, "Required"),
  question: z.string().min(1, "Required"),
  answer: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
});

export default function FaqContentPage() {
  const { data: faqData, isLoading } = useFaqContent();
  const { mutate: updateFaq, isPending } = useUpdateFaqContent();

  const { mutate: createCategory } = useCreateFaqCategory();
  const { mutate: updateCategory } = useUpdateFaqCategory();
  const { mutate: deleteCategory } = useDeleteFaqCategory();

  const { mutate: createItem } = useCreateFaqItem();
  const { mutate: updateItem } = useUpdateFaqItem();
  const { mutate: deleteItem } = useDeleteFaqItem();

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: {} });
  const catForm = useForm<z.infer<typeof categorySchema>>({ resolver: zodResolver(categorySchema), defaultValues: { isVisible: true, displayOrder: 0 } });
  const itemForm = useForm<z.infer<typeof itemSchema>>({ resolver: zodResolver(itemSchema), defaultValues: { isVisible: true, displayOrder: 0 } });

  useEffect(() => {
    if (faqData?.content) form.reset(faqData.content);
  }, [faqData, form]);

  const handleOpenCatModal = (cat?: FaqCategory) => {
    setEditingCategory(cat || null);
    if (cat) catForm.reset({ ...cat });
    else catForm.reset({ slug: "", displayLabel: "", displayOrder: 0, isVisible: true });
    setIsCatModalOpen(true);
  };

  const handleOpenItemModal = (categoryId: string, item?: FaqItem) => {
    setEditingItem(item || null);
    setSelectedCategoryId(categoryId);
    if (item) itemForm.reset({ ...item, faqCategoryId: categoryId });
    else itemForm.reset({ faqCategoryId: categoryId, question: "", answer: "", displayOrder: 0, isVisible: true });
    setIsItemModalOpen(true);
  };

  const onCatSubmit = (values: z.infer<typeof categorySchema>) => {
    if (editingCategory) updateCategory({ id: editingCategory.id, data: values }, { onSuccess: () => setIsCatModalOpen(false) });
    else createCategory(values, { onSuccess: () => setIsCatModalOpen(false) });
  };

  const onItemSubmit = (values: z.infer<typeof itemSchema>) => {
    if (editingItem) updateItem({ id: editingItem.id, data: values }, { onSuccess: () => setIsItemModalOpen(false) });
    else createItem(values, { onSuccess: () => setIsItemModalOpen(false) });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Page</h1>
        <p className="text-muted-foreground">Manage FAQ page headers, categories, and questions.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(v => updateFaq(v))} className="space-y-4 border rounded-md p-4">
          <h2 className="text-lg font-semibold">Header Settings</h2>
          <FormField control={form.control} name="headerEyebrow" render={({ field }) => (
            <FormItem><FormLabel>Eyebrow</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="headerTitle" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="headerSubtitle" render={({ field }) => (
            <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="fallbackSupportText" render={({ field }) => (
            <FormItem><FormLabel>Fallback Support Text</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="allFaqsLabel" render={({ field }) => (
            <FormItem><FormLabel>All FAQs Category Label</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
          )} />
          <Button type="submit" disabled={isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Header</Button>
        </form>
      </Form>

      <div className="space-y-4 border rounded-md p-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">FAQ Categories & Items</h2>
          <Button onClick={() => handleOpenCatModal()} size="sm"><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
        </div>

        {faqData?.categories?.map((cat) => (
          <div key={cat.id} className="border rounded-md p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2 border-b pb-2">
              <div>
                <h3 className="font-semibold text-lg">{cat.displayLabel} <span className="text-sm font-normal text-muted-foreground">({cat.slug})</span></h3>
                <p className="text-xs text-muted-foreground">Order: {cat.displayOrder} | {cat.isVisible ? 'Visible' : 'Hidden'}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => handleOpenItemModal(cat.id)}><Plus className="w-4 h-4 text-primary" /></Button>
                <Button size="icon-sm" variant="ghost" onClick={() => handleOpenCatModal(cat)}><Edit2 className="w-4 h-4" /></Button>
                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => confirm("Delete category?") && deleteCategory(cat.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              {cat.faqs?.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-card border rounded">
                  <div>
                    <p className="text-sm font-medium">{item.question}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-lg">{item.answer}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon-sm" variant="ghost" onClick={() => handleOpenItemModal(cat.id, item)}><Edit2 className="w-3 h-3" /></Button>
                    <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => confirm("Delete item?") && deleteItem(item.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <Form {...catForm}>
            <form onSubmit={catForm.handleSubmit(onCatSubmit)} className="space-y-4">
              <FormField control={catForm.control} name="displayLabel" render={({ field }) => (
                <FormItem><FormLabel>Display Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={catForm.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={catForm.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={catForm.control} name="isVisible" render={({ field }) => (
                  <FormItem><FormLabel>Visible</FormLabel><FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="ml-2 mt-10" /></FormControl></FormItem>
                )} />
              </div>
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Edit Question" : "Add Question"}</DialogTitle></DialogHeader>
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
              <FormField control={itemForm.control} name="question" render={({ field }) => (
                <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={itemForm.control} name="answer" render={({ field }) => (
                <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea {...field} className="min-h-[100px]" /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={itemForm.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={itemForm.control} name="isVisible" render={({ field }) => (
                  <FormItem><FormLabel>Visible</FormLabel><FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="ml-2 mt-10" /></FormControl></FormItem>
                )} />
              </div>
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
