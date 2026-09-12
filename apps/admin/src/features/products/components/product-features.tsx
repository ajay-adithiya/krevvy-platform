"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
} from "../hooks/use-product-repeatables";

interface ProductFeaturesProps {
  productId: string;
  features: any[];
}

export function ProductFeatures({ productId, features = [] }: ProductFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const createMutation = useCreateFeature(productId);
  const updateMutation = useUpdateFeature(productId);
  const deleteMutation = useDeleteFeature(productId);

  const handleOpen = (feature?: any) => {
    if (feature) {
      setEditing(feature);
      setTitle(feature.title);
      setDescription(feature.description);
      setDisplayOrder(feature.displayOrder);
    } else {
      setEditing(null);
      setTitle("");
      setDescription("");
      setDisplayOrder(features.length);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: { title, description, displayOrder } },
        { onSuccess: () => setIsOpen(false) }
      );
    } else {
      createMutation.mutate(
        { productId, title, description, displayOrder },
        { onSuccess: () => setIsOpen(false) }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this feature?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Features</h3>
        <Button size="sm" onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-2" /> Add Feature</Button>
      </div>

      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground">No features added.</p>
      ) : (
        <div className="grid gap-2">
          {features.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => handleOpen(f)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(f.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Feature" : "Add Feature"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Display Order</label>
              <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
