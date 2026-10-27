import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChartColumnIcon,
  ChevronDownIcon,
  InfoIcon,
  LandmarkIcon,
  LayoutGridIcon,
  MegaphoneIcon,
  PhoneIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Menu } from "@/components/animate-ui/icons/menu";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/site.config";

type NavItem = (typeof site.nav)[number];
type SubItem = { label: string; to: string; description: string };

// Shown in the mobile menu and the Statistics dropdown.
const icons: Record<string, LucideIcon> = {
  Services: LayoutGridIcon,
  Hotlines: PhoneIcon,
  Officials: LandmarkIcon,
  Statistics: ChartColumnIcon,
  Announcements: MegaphoneIcon,
  About: InfoIcon,
  Demographics: UsersIcon,
  Competitiveness: TrendingUpIcon,
  Income: WalletIcon,
};

function linkTo(item: NavItem) {
  return {
    to: item.to,
    hash: "hash" in item ? item.hash : undefined,
    // Home-page sections need an exact match; other links stay active on their sub-pages.
    activeOptions: { exact: item.to === "/", includeHash: true },
  };
}

// Desktop links are pills; the current page's is tinted green.
const pillClass =
  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const pillActive = { className: "!bg-brand/10 !text-brand font-medium" };

// Desktop: sub-pages open in a dropdown on hover, or while keyboard focus is inside it.
// A clicked link gives up focus, so the dropdown closes once the pointer leaves.
// The padding at the top of the panel bridges the gap so the pointer can move into it.
function NavDropdown({ item }: { item: NavItem & { children: readonly SubItem[] } }) {
  return (
    <div className="group relative flex items-center" onClick={(e) => (e.target as HTMLElement).closest("a")?.blur()}>
      <Link {...linkTo(item)} className={pillClass} activeProps={pillActive}>
        {item.label}
        <ChevronDownIcon
          aria-hidden
          className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
        />
      </Link>
      <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <ul aria-label={item.label} className="w-88 rounded-2xl border border-line bg-popover p-2 shadow-xl shadow-black/5">
          {item.children.map((child) => {
            const Icon = icons[child.label];
            return (
              <li key={child.to}>
                <Link
                  to={child.to}
                  className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted focus-visible:bg-muted"
                  activeProps={{ className: "bg-muted" }}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition-colors group-hover/item:bg-brand group-hover/item:text-white">
                    {Icon && <Icon aria-hidden className="size-4.5" />}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{child.label}</span>
                    <span className="block text-xs text-muted-foreground">{child.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function DesktopNav() {
  return site.nav.map((item) =>
    "children" in item ? (
      <NavDropdown key={item.label} item={item} />
    ) : (
      <Link key={item.label} {...linkTo(item)} className={pillClass} activeProps={pillActive}>
        {item.label}
      </Link>
    ),
  );
}

// Mobile: full-width rows with icons; sub-pages are listed under their parent, indented.
const rowClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-5 [&_svg]:shrink-0";
const rowActive = { className: "!bg-brand/10 !text-brand font-medium" };

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  return site.nav.map((item) => {
    const Icon = icons[item.label];
    return (
      <div key={item.label}>
        <Link {...linkTo(item)} onClick={onNavigate} className={rowClass} activeProps={rowActive}>
          {Icon && <Icon aria-hidden />}
          {item.label}
        </Link>
        {"children" in item && (
          <div className="mt-1 ml-5.5 flex flex-col gap-0.5 border-l border-line pl-3">
            {item.children.map((child) => {
              const ChildIcon = icons[child.label];
              return (
                <Link
                  key={child.to}
                  to={child.to}
                  onClick={onNavigate}
                  className={cn(rowClass, "py-2 text-[15px] [&_svg]:size-4")}
                  activeProps={rowActive}
                >
                  {ChildIcon && <ChildIcon aria-hidden />}
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  });
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <BrandLogo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <DesktopNav />
        </div>

        <Button asChild className="hidden h-9 rounded-full px-4 lg:inline-flex">
          <Link to={site.primaryCta.to} hash={site.primaryCta.hash}>
            {site.primaryCta.label}
          </Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-lg" className="lg:hidden" aria-label="Open menu">
              {/* The menu icon morphs into an X while the sheet is open. */}
              <Menu animate={open} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 max-w-[85vw]">
            <SheetHeader className="border-b border-line">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Link to="/" onClick={() => setOpen(false)} className="w-fit">
                <BrandLogo />
              </Link>
            </SheetHeader>
            <div className="flex flex-col gap-1 overflow-y-auto px-3 py-2">
              <MobileNav onNavigate={() => setOpen(false)} />
            </div>
            <SheetFooter className="border-t border-line">
              <Button asChild size="lg" className="w-full rounded-full">
                <Link to={site.primaryCta.to} hash={site.primaryCta.hash} onClick={() => setOpen(false)}>
                  {site.primaryCta.label}
                </Link>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
