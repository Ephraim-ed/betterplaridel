import { useEffect, useState } from "react";
import {
  CloudDrizzleIcon,
  CloudFogIcon,
  CloudIcon,
  CloudLightningIcon,
  CloudMoonIcon,
  CloudRainIcon,
  CloudSunIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  type LucideIcon,
} from "lucide-react";
import { formatNumber, tel } from "@/features/hotlines/format";
import { hotlineGroups, numberOf } from "@/features/hotlines/hotlines-data";

// Live data comes straight from two free services that need no key: Open-Meteo for the weather in Plaridel,
// and Frankfurter for the European Central Bank's daily reference rates. Either one simply doesn't show if it
// can't be reached.
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=14.887&longitude=120.857&current=temperature_2m,weather_code,is_day&timezone=Asia%2FManila";
const CURRENCIES = ["USD", "EUR", "JPY", "SGD"];
const RATES_URL = `https://api.frankfurter.dev/v2/rates?base=PHP&quotes=${CURRENCIES.join(",")}`;
const ROTATE_MS = 5000;

const rescue = hotlineGroups[0].contacts.find((c) => c.name === "Plaridel Rescue");
const rescueNumber = rescue && numberOf(rescue.number);

type Weather = { temperature: number; label: string; Icon: LucideIcon };
type Rate = { currency: string; pesos: number; date: string };

// Open-Meteo reports conditions as WMO weather codes.
function describe(code: number, isDay: boolean): Omit<Weather, "temperature"> {
  if (code === 0) return { label: "Clear", Icon: isDay ? SunIcon : MoonIcon };
  if (code <= 2) return { label: "Partly cloudy", Icon: isDay ? CloudSunIcon : CloudMoonIcon };
  if (code === 3) return { label: "Cloudy", Icon: CloudIcon };
  if (code <= 48) return { label: "Foggy", Icon: CloudFogIcon };
  if (code <= 57) return { label: "Drizzle", Icon: CloudDrizzleIcon };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Rain", Icon: CloudRainIcon };
  if (code >= 95) return { label: "Thunderstorm", Icon: CloudLightningIcon };
  return { label: "Cloudy", Icon: CloudIcon };
}

const today = new Intl.DateTimeFormat("en-PH", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Manila",
});

function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(WEATHER_URL, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(({ current }) =>
        setWeather({ temperature: Math.round(current.temperature_2m), ...describe(current.weather_code, current.is_day === 1) }),
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return weather;
}

// Pesos per unit of each currency, shown one at a time in turn.
function useRate() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(RATES_URL, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((rows: { quote: string; rate: number; date: string }[]) =>
        setRates(
          CURRENCIES.flatMap((currency) => {
            const row = rows.find((r) => r.quote === currency);
            return row ? [{ currency, pesos: 1 / row.rate, date: row.date }] : [];
          }),
        ),
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (rates.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % rates.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [rates.length]);
  return rates[index];
}

export function TopBar() {
  const weather = useWeather();
  const rate = useRate();

  return (
    <div className="container-page flex h-full items-center justify-center gap-3 text-xs text-muted-foreground sm:justify-end sm:gap-4">
      <time className="hidden sm:inline">{today.format(new Date())}</time>
      {weather && (
        <span className="inline-flex items-center gap-1" title={`${weather.label} in Plaridel now`}>
          <weather.Icon aria-hidden className="size-3.5" />
          <span className="sr-only">{weather.label},</span>
          <span className="font-medium text-foreground tabular-nums">{weather.temperature}°C</span>
        </span>
      )}
      {rate && (
        <span
          key={rate.currency}
          title={`Pesos per ${rate.currency}, European Central Bank reference rate for ${rate.date}`}
          className="hidden animate-in font-medium text-brand tabular-nums duration-500 fade-in-0 slide-in-from-bottom-1 sm:inline motion-reduce:animate-none"
        >
          {rate.currency} ₱{rate.pesos.toFixed(2)}
        </span>
      )}
      <span aria-hidden className="h-3.5 w-px bg-line" />
      <a href="tel:911" className="inline-flex items-center gap-1 font-semibold text-red-600 hover:underline">
        <PhoneIcon aria-hidden className="size-3.5" />
        911
      </a>
      {rescueNumber && (
        <>
          <span aria-hidden>·</span>
          <a href={tel(rescueNumber)} className="text-foreground hover:underline">
            Rescue {formatNumber(rescueNumber)}
          </a>
        </>
      )}
    </div>
  );
}
