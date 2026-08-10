"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "../../types";
import { ProductCard } from "./product-card";

interface ProductBrowserProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductBrowser({ initialProducts, categories }: ProductBrowserProps) {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);

  // Sync state if URL search params change
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    setSelectedCategoryId(categoryFromUrl);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Search Filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Category Filter
      const matchesCategory = selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
      
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategoryId]);

  return (
    <div className="flex flex-col gap-8">
      {/* Browsing Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl shadow-sm border">
        
        {/* Search Input */}
        <div className="w-full sm:w-1/2 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        {/* Category Select */}
        <div className="w-full sm:w-auto min-w-[200px]">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full h-10 px-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.filter(category => category.isActive).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-muted/30 rounded-2xl border border-dashed">
          <h2 className="text-2xl font-bold mb-2">No products found.</h2>
          <p className="text-foreground/70">
            Try adjusting your search or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
