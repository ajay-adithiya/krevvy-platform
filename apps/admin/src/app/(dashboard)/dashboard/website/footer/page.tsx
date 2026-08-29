"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useFooterGroups,
  useCreateFooterGroup,
  useUpdateFooterGroup,
  useDeleteFooterGroup,
  useCreateFooterLink,
  useUpdateFooterLink,
  useDeleteFooterLink
} from "@/features/cms/hooks/use-cms";
import { FooterGroup, FooterLink } from "@/features/cms/api/cms.service";

const groupSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
});

const linkSchema = z.object({
  id: z.string().optional(),
  groupId: z.string().min(1, "Required"),
  label: z.string().min(1, "Required"),
  targetView: z.string().min(1, "Required"),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
});

export default function FooterPage() {
  const { data: groups, isLoading } = useFooterGroups();
  const { mutate: createGroup } = useCreateFooterGroup();
  const { mutate: updateGroup } = useUpdateFooterGroup();
  const { mutate: deleteGroup } = useDeleteFooterGroup();

  const { mutate: createLink } = useCreateFooterLink();
  const { mutate: updateLink } = useUpdateFooterLink();
  const { mutate: deleteLink } = useDeleteFooterLink();

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FooterGroup | null>(null);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);

  const groupForm = useForm<z.infer<typeof groupSchema>>({ resolver: zodResolver(groupSchema), defaultValues: { isVisible: true, displayOrder: 0 } });
  const linkForm = useForm<z.infer<typeof linkSchema>>({ resolver: zodResolver(linkSchema), defaultValues: { isVisible: true, displayOrder: 0 } });

  const handleOpenGroupModal = (group?: FooterGroup) => {
    setEditingGroup(group || null);
    if (group) groupForm.reset({ ...group });
    else groupForm.reset({ title: "", displayOrder: 0, isVisible: true });
    setIsGroupModalOpen(true);
  };

  const handleOpenLinkModal = (groupId: string, link?: FooterLink) => {
    setEditingLink(link || null);
    if (link) linkForm.reset({ ...link, groupId });
    else linkForm.reset({ groupId, label: "", targetView: "", displayOrder: 0, isVisible: true });
    setIsLinkModalOpen(true);
  };

  const onGroupSubmit = (values: z.infer<typeof groupSchema>) => {
    if (editingGroup) updateGroup({ id: editingGroup.id, data: values }, { onSuccess: () => setIsGroupModalOpen(false) });
    else createGroup(values, { onSuccess: () => setIsGroupModalOpen(false) });
  };

  const onLinkSubmit = (values: z.infer<typeof linkSchema>) => {
    if (editingLink) updateLink({ id: editingLink.id, data: values }, { onSuccess: () => setIsLinkModalOpen(false) });
    else createLink(values, { onSuccess: () => setIsLinkModalOpen(false) });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Footer</h1>
          <p className="text-muted-foreground">Manage footer link groups.</p>
        </div>
        <Button onClick={() => handleOpenGroupModal()}><Plus className="w-4 h-4 mr-2" /> Add Group</Button>
      </div>

      <div className="space-y-4">
        {groups?.map((group) => (
          <div key={group.id} className="border rounded-md p-4 bg-muted/10">
            <div className="flex items-center justify-between mb-2 border-b pb-2">
              <div>
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <p className="text-xs text-muted-foreground">Order: {group.displayOrder} | {group.isVisible ? 'Visible' : 'Hidden'}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => handleOpenLinkModal(group.id)}><Plus className="w-4 h-4 text-primary" /></Button>
                <Button size="icon-sm" variant="ghost" onClick={() => handleOpenGroupModal(group)}><Edit2 className="w-4 h-4" /></Button>
                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => confirm("Delete group?") && deleteGroup(group.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="grid gap-2">
              {group.links?.map(link => (
                <div key={link.id} className="flex justify-between items-center p-2 bg-card border rounded">
                  <div className="text-sm">
                    <span className="font-medium">{link.label}</span> <span className="text-muted-foreground">→ {link.targetView}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon-sm" variant="ghost" onClick={() => handleOpenLinkModal(group.id, link)}><Edit2 className="w-3 h-3" /></Button>
                    <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => confirm("Delete link?") && deleteLink(link.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingGroup ? "Edit Group" : "Add Group"}</DialogTitle></DialogHeader>
          <Form {...groupForm}>
            <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-4">
              <FormField control={groupForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={groupForm.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={groupForm.control} name="isVisible" render={({ field }) => (
                  <FormItem><FormLabel>Visible</FormLabel><FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="ml-2 mt-10" /></FormControl></FormItem>
                )} />
              </div>
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingLink ? "Edit Link" : "Add Link"}</DialogTitle></DialogHeader>
          <Form {...linkForm}>
            <form onSubmit={linkForm.handleSubmit(onLinkSubmit)} className="space-y-4">
              <FormField control={linkForm.control} name="label" render={({ field }) => (
                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={linkForm.control} name="targetView" render={({ field }) => (
                <FormItem><FormLabel>Target View</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={linkForm.control} name="displayOrder" render={({ field }) => (
                  <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={linkForm.control} name="isVisible" render={({ field }) => (
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
