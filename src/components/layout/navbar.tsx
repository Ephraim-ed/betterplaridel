import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { Menu } from "@/components/animate-ui/icons/menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/site.config";

type NavItem = (typeof site.nav)[number];

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";

function NavLink({ item, onNavigate, children }: { item: NavItem; onNavigate?: () => void; children?: ReactNode }) {
  return (
    <Link
      to={item.to}
      hash={"hash" in item ? item.hash : undefined}
      onClick={onNavigate}
      className={`inline-flex items-center gap-1 ${linkClass}`}
      // Home-page sections need an exact match; other links stay active on their sub-pages.
      activeOptions={{ exact: item.to === "/", includeHash: true }}
      activeProps={{ className: "!text-foreground font-medium" }}
    >
      {item.label}
      {children}
    </Link>
  );
}

// Desktop: sub-pages open in a dropdown on hover, or while keyboard focus is inside it.
// A clicked link gives up focus, so the dropdown closes once the pointer leaves.
// The padding at the top of the panel bridges the gap so the pointer can move into it.
function NavDropdown({ item }: { item: NavItem & { children: readonly { label: string; to: string; description: string }[] } }) {
  return (
    <div
      className="group relative"
      onClick={(e) => (e.target as HTMLElement).closest("a")?.blur()}
    >
      <NavLink item={item}>
        <ChevronDownIcon
          aria-hidden
          className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
        />
      </NavLink>
      <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul aria-label={item.label} className="w-64 rounded-xl border border-line bg-popover p-1.5 shadow-lg">
          {item.children.map((child) => (
            <li key={child.to}>
              <Link
                to={child.to}
                className="block rounded-lg px-3 py-2 transition-colors hover:bg-muted focus-visible:bg-muted"
                activeProps={{ className: "bg-muted" }}
              >
                <span className="block text-sm font-medium">{child.label}</span>
                <span className="block text-xs text-muted-foreground">{child.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DesktopNav() {
  return site.nav.map((item) =>
    "children" in item ? <NavDropdown key={item.label} item={item} /> : <NavLink key={item.label} item={item} />,
  );
}

// Mobile: sub-pages are listed under their parent, indented.
function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  return site.nav.map((item) => (
    <div key={item.label} className="flex flex-col gap-4">
      <NavLink item={item} onNavigate={onNavigate} />
      {"children" in item && (
        <div className="ml-1 flex flex-col gap-4 border-l border-line pl-4">
          {item.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={linkClass}
              activeProps={{ className: "!text-foreground font-medium" }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  ));
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src="/betterplaridel-symbol.svg" alt="" aria-hidden className="h-8 w-auto" />
          <span className="flex flex-col items-end text-brand">
            <span className="text-xl leading-none font-extrabold tracking-[-0.04em]">
              <span className="font-medium">Better</span>Plaridel
            </span>
            <span className="-mt-0.5 font-mono text-[0.6rem] leading-none font-medium text-brand/70">.org</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <DesktopNav />
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
              <MobileNav onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
