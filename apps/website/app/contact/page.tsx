import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Krevvy",
  description: "Get in touch with the Krevvy team.",
};

export default function ContactPage() {
  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-24 md:py-32 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">
          Contact Us
        </h1>
        <p className="text-xl text-foreground/80 leading-relaxed mb-12">
          We're here to help. If you have questions about our products, need support, or just want to share feedback, we'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="hello@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 mt-4"
              >
                Submit Request
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-2">Customer Support</h3>
              <p className="text-foreground/70 mb-1">
                For order inquiries, warranty claims, and product assistance.
              </p>
              <a href="mailto:support@krevvy.com" className="font-medium hover:underline">
                support@krevvy.com
              </a>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Business Inquiries</h3>
              <p className="text-foreground/70 mb-1">
                For wholesale, partnerships, and press.
              </p>
              <a href="mailto:hello@krevvy.com" className="font-medium hover:underline">
                hello@krevvy.com
              </a>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Hours of Operation</h3>
              <p className="text-foreground/70">
                Monday - Friday <br/>
                9:00 AM - 6:00 PM (IST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
