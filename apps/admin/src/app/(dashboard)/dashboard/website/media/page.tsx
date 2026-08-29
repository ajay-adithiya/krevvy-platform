"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaAssets, useDeleteMediaAsset } from "@/features/cms/hooks/use-cms";

export default function MediaPage() {
  const { data: media, isLoading } = useMediaAssets();
  const { mutate: deleteMedia } = useDeleteMediaAsset();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this media asset? Make sure it is not in use elsewhere.")) {
      deleteMedia(id);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage uploaded assets and images.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media?.map((asset) => (
          <div key={asset.id} className="group relative border rounded-md overflow-hidden bg-muted/20 flex flex-col">
            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
              <img src={asset.url} alt={asset.altText || 'Media Asset'} className="object-cover w-full h-full" />
            </div>
            <div className="p-2 text-xs truncate border-t flex-1 flex flex-col justify-between">
              <span className="truncate block font-medium" title={asset.publicId}>{asset.publicId}</span>
              {asset.altText && <span className="truncate block text-muted-foreground mt-1" title={asset.altText}>{asset.altText}</span>}
              <div className="mt-2 text-right">
                <Button size="icon-sm" variant="destructive" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(asset.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {(!media || media.length === 0) && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-md">
            No media assets found. Upload images through individual content pages or the Product editor.
          </div>
        )}
      </div>
    </div>
  );
}
