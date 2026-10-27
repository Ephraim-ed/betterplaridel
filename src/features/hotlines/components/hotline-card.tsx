import { AnimateIcon } from "@animate-ui/react/icons";
import { Phone } from "@/components/animate-ui/icons/phone";
import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { Smartphone } from "@/components/animate-ui/icons/smartphone";
import { formatNumber, tel } from "../format";

// A plain number, or one with a short caption (e.g. "From Globe mobile").
// `dial` overrides what the phone dials, e.g. "0447940119,1009" for a trunkline + local.
export type PhoneNumber = string | { number: string; label: string; dial?: string };

export type Hotline = {
  name: string;
  number: PhoneNumber; // "TBA" until confirmed; not callable
  note?: string;
  otherNumbers?: readonly PhoneNumber[];
};

const normalize = (n: PhoneNumber) =>
  typeof n === "string" ? { number: n, label: undefined, dial: undefined } : n;

function numberType(number: string) {
  const d = number.replace(/\D/g, "");
  if (/^09\d{9}$/.test(d)) return { type: "Mobile", Icon: Smartphone };
  if (/^0\d{9}$/.test(d)) return { type: "Landline", Icon: Phone };
  return { type: "Hotline", Icon: PhoneCall };
}

export function HotlineCard({ hotline, emergency = false }: { hotline: Hotline; emergency?: boolean }) {
  const primary = normalize(hotline.number);
  const numbers = primary.number === "TBA" ? [] : [primary, ...(hotline.otherNumbers ?? []).map(normalize)];
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-line bg-background p-5">
      <div>
        <p className="font-semibold">{hotline.name}</p>
        {hotline.note && <p className="text-sm text-muted-foreground">{hotline.note}</p>}
      </div>
      <ul className="grid gap-2">
        {numbers.length === 0 && (
          <li className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">Number to follow</li>
        )}
        {numbers.map(({ number, label, dial }) => {
          const { type, Icon } = numberType(number);
          return (
            <li key={number}>
              <AnimateIcon animateOnHover asChild>
                <a
                  href={dial ? `tel:${dial}` : tel(number)}
                  aria-label={`Call ${hotline.name} (${label ?? type}): ${formatNumber(number)}`}
                  title={type}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-foreground transition-colors ${
                    emergency ? "bg-red-600/10 hover:bg-red-600/15" : "bg-brand/10 hover:bg-brand/15"
                  }`}
                >
                  <Icon
                    size={16}
                    aria-hidden
                    className={emergency ? "text-red-600" : "text-brand"}
                    {...(emergency && { animate: true, loop: true, loopDelay: 1500 })}
                  />
                  <span className="grid min-w-0">
                    <span className="font-semibold tabular-nums">{formatNumber(number)}</span>
                    {label && <span className="text-xs text-muted-foreground">{label}</span>}
                  </span>
                </a>
              </AnimateIcon>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
