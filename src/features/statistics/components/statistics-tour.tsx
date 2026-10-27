import { useContext, useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { CircleHelpIcon, XIcon } from "lucide-react";
import { cn } from "cn";
import { WelcomeContext } from "@/components/layout/welcome-screen";
import { Button } from "@/components/ui/button";
import { tourGraphics, type TourGraphic } from "./tour-graphics";

export type TourStep = { title: string; body: string; graphic?: TourGraphic };

const storageKey = (id: string) => `betterplaridel:tour:${id}`;

// A short walkthrough that opens by itself on a visitor's first time in a module, and any time from the
// "Quick tour" button. Whether it has been seen is remembered in this browser only.
export function StatisticsTour({ id, steps }: { id: string; steps: readonly TourStep[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Opens a moment after the page appears (and the welcome screen is gone), only for visitors who haven't seen it
  // in this browser.
  const welcomeShowing = useContext(WelcomeContext);
  useEffect(() => {
    if (welcomeShowing) return;
    const timer = setTimeout(() => {
      try {
        if (!localStorage.getItem(storageKey(id))) setOpen(true);
      } catch {
        // Storage can be blocked; the tour is then only available from the button.
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [id, welcomeShowing]);

  function change(next: boolean) {
    setOpen(next);
    if (next) return setIndex(0);
    try {
      localStorage.setItem(storageKey(id), "seen");
    } catch {
      // Not remembering is fine.
    }
  }

  const step = steps[index];
  const last = index === steps.length - 1;

  return (
    <Dialog.Root open={open} onOpenChange={change}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <CircleHelpIcon aria-hidden />
          Quick tour
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-popover p-5 pt-5 text-popover-foreground shadow-xl ring-1 ring-foreground/10 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="-mt-1 mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-brand">
              Step {index + 1} of {steps.length}
            </p>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" className="-mr-1.5" aria-label="Close tour">
                <XIcon />
              </Button>
            </Dialog.Close>
          </div>

          {step.graphic &&
            (() => {
              const Graphic = tourGraphics[step.graphic];
              return (
                <div key={`g${index}`} className="mb-4 overflow-hidden rounded-xl bg-brand/5 ring-1 ring-brand/15">
                  <Graphic />
                </div>
              );
            })()}
          <Dialog.Title key={`t${index}`} className="animate-in text-lg font-semibold tracking-tight fade-in-0 slide-in-from-right-2">
            {step.title}
          </Dialog.Title>
          <Dialog.Description key={`d${index}`} className="mt-2 animate-in text-sm leading-relaxed text-muted-foreground fade-in-0 slide-in-from-right-2">
            {step.body}
          </Dialog.Description>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden>
              {steps.map((s, i) => (
                <span
                  key={s.title}
                  className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-5 bg-brand" : "w-1.5 bg-border")}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {index > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => setIndex(index - 1)}>
                  Back
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => change(false)}>
                  Skip
                </Button>
              )}
              <Button size="sm" onClick={() => (last ? change(false) : setIndex(index + 1))}>
                {last ? "Got it" : "Next"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
