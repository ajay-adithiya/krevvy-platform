"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCreateSpecification,
  useUpdateSpecification,
  useDeleteSpecification,
} from "../hooks/use-product-repeatables";

interface ProductSpecificationsProps {
  productId: string;
  specifications: any[];
}

export function ProductSpecifications({ productId, specifications = [] }: ProductSpecificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const createMutation = useCreateSpecification(productId);
  const updateMutation = useUpdateSpecification(productId);
  const deleteMutation = useDeleteSpecification(productId);

  const handleOpen = (spec?: any) => {
    if (spec) {
      setEditing(spec);
      setName(spec.name);
      setValue(spec.value);
      setDisplayOrder(spec.displayOrder);
    } else {
      setEditing(null);
      setName("");
      setValue("");
      setDisplayOrder(specifications.length);
    }
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: { name, value, displayOrder } },
        { onSuccess: () => setIsOpen(false) }
      );
    } else {
      createMutation.mutate(
        { productId, name, value, displayOrder },
        { onSuccess: () => setIsOpen(false) }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this specification?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Specifications</h3>
        <Button size="sm" onClick={() => handleOpen()}><Plus className="w-4 h-4 mr-2" /> Add Specification</Button>
      </div>

      {specifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No specifications added.</p>
      ) : (
        <div className="grid gap-2">
          {specifications.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
              <div>
                <p className="font-medium text-sm">
                  <span className="text-muted-foreground">{s.name}:</span> {s.value}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => handleOpen(s)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Specification" : "Add Specification"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dimensions" />
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 10x20 cm" />
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
