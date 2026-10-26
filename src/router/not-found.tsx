import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <section className="container-page grid place-items-center py-16 sm:py-24 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/betterplaridel-404.svg"
        alt=""
        width={800}
        height={600}
        className="w-full max-w-sm animate-in duration-500 fade-in-0 zoom-in-95"
      />
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild size="lg" className="mt-8 h-11 rounded-full px-6">
        <Link to="/">Back home</Link>
      </Button>
    </section>
  );
}
