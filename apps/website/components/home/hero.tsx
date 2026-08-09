import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40 border-b">
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          Elevate Your Everyday <br className="hidden md:block" />
          <span className="text-foreground/80">With Krevvy.</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 sm:text-xl">
          Discover our collection of premium, modern consumer products designed for the Indian lifestyle. Experience uncompromising quality.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90 w-full sm:w-auto"
          >
            View Products
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
          >
            Our Story
          </Link>
        </div>
      </div>
      
      {/* Background decoration elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 to-background dark:from-neutral-900 dark:to-background opacity-50"></div>
    </section>
  );
}
