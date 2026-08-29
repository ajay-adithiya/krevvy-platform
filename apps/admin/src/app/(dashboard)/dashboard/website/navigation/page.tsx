"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useNavigations,
  useCreateNavigation,
  useUpdateNavigation,
  useDeleteNavigation
} from "@/features/cms/hooks/use-cms";
import { NavigationItem } from "@/features/cms/api/cms.service";

const formSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Required"),
  targetView: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
});

export default function NavigationPage() {
  const { data: navItems, isLoading } = useNavigations();
  const { mutate: createNav } = useCreateNavigation();
  const { mutate: updateNav } = useUpdateNavigation();
  const { mutate: deleteNav } = useDeleteNavigation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { label: "", targetView: "", displayOrder: 0, isVisible: true },
  });

  const handleOpenModal = (item?: NavigationItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({ ...item });
    } else {
      setEditingItem(null);
      form.reset({ label: "", targetView: "", displayOrder: 0, isVisible: true });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingItem) {
      updateNav({ id: editingItem.id, data: values }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createNav(values, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this navigation item?")) {
      deleteNav(id);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
          <p className="text-muted-foreground">Manage header navigation items.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
      </div>

      <div className="grid gap-2 border rounded-md p-4 bg-muted/10">
        {navItems && navItems.length > 0 ? navItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">Target: {item.targetView} | Order: {item.displayOrder} | {item.isVisible ? 'Visible' : 'Hidden'}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon-sm" variant="ghost" onClick={() => handleOpenModal(item)}><Edit2 className="w-4 h-4" /></Button>
              <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No navigation items added yet.</p>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Edit Navigation Item" : "Add Navigation Item"}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="label" render={({ field }) => (
                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="targetView" render={({ field }) => (
                <FormItem><FormLabel>Target View</FormLabel><FormControl><Input {...field} placeholder="e.g. products" /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="isVisible" render={({ field }) => (
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
