import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "@/components/animate-ui/icons/menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/site.config";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return site.nav.map((item) => (
    <Link
      key={item.label}
      to={item.to}
      hash={"hash" in item ? item.hash : undefined}
      onClick={onNavigate}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      activeOptions={{ exact: true, includeHash: true }}
      activeProps={{ className: "!text-foreground font-medium" }}
    >
      {item.label}
    </Link>
  ));
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">
            {site.name.charAt(0)}
          </span>
          {site.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
        </div>

        <Button asChild className="hidden h-9 rounded-full px-4 md:inline-flex">
          <Link to={site.primaryCta.to} hash={site.primaryCta.hash}>
            {site.primaryCta.label}
          </Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-lg" className="md:hidden" aria-label="Open menu">
              {/* The menu icon morphs into an X while the sheet is open. */}
              <Menu animate={open} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>{site.name}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4 [&_a]:text-base">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
