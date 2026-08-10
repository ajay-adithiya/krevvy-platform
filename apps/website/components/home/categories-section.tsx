import Link from "next/link";
import { Category } from "../../types";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const activeCategories = categories.filter((category) => category.isActive);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Shop by Category</h2>
          <p className="mt-4 text-foreground/70 max-w-2xl">
            Find exactly what you're looking for by browsing our product categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group block p-8 rounded-2xl border bg-card hover:border-foreground/20 transition-all duration-300 hover:shadow-md"
            >
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-foreground/70 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
