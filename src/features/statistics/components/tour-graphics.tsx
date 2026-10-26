import type { ReactNode } from "react";
import { densityBreaks, densityClass, densityRamp } from "../demographics/colors";
import { barangayBySlug, barangays, density, fmt, LATEST } from "../demographics/data";
import { barangayShapes, MAP_SIZE } from "../demographics/map";
import { incomeColors, sourceColors } from "../income/colors";
import { bulacan, localSources, nationwide, peso, percent, plaridel, selfReliance, totalIncome } from "../income/data";

// Small illustrations for the quick tour, one per step. Drawn in the dashboard's own colors with plain SVG.
const BRAND = "#047857";
const YELLOW = "#e5a800";

const Frame = ({ children, label }: { children: ReactNode; label: string }) => (
  <svg viewBox="0 0 320 112" role="img" aria-label={label} className="h-28 w-full">
    {children}
  </svg>
);

const pop = (i: number) => ({ className: "animate-in fade-in-0 zoom-in-95 fill-mode-backwards", style: { animationDelay: `${i * 90}ms`, animationDuration: "400ms" } });

// The real barangay map, scaled to fit a box. `highlight` pushes every other barangay to the background.
function MiniMap({ x, y, width, highlight }: { x: number; y: number; width: number; highlight?: string }) {
  const k = width / MAP_SIZE.width;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {barangays.map((b, i) => (
        <path
          key={b.psgc}
          d={barangayShapes[b.psgc].d}
          fill={densityRamp[densityClass(density(b.population[LATEST], b.areaKm2))]}
          stroke="white"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity={highlight && highlight !== b.psgc ? 0.35 : 1}
          {...pop(i / 3)}
        />
      ))}
    </g>
  );
}

function Overview() {
  const tiles = [
    { x: 12, label: "Population", value: "114,432" },
    { x: 114, label: "Land area", value: "32.44 km²" },
    { x: 216, label: "Growth", value: "+6.1%" },
  ];
  return (
    <Frame label="Cards showing population, land area and growth">
      {tiles.map((t, i) => (
        <g key={t.label} {...pop(i)} style={{ ...pop(i).style, transformOrigin: `${t.x + 46}px 56px` }}>
          <rect x={t.x} y={10} width={92} height={92} rx={10} className="fill-card stroke-border" />
          <text x={t.x + 10} y={30} fontSize={9} className="fill-muted-foreground">{t.label}</text>
          <text x={t.x + 10} y={56} fontSize={t.value.length > 7 ? 13 : 15} fontWeight={600} className="fill-foreground">{t.value}</text>
          <path d={`M${t.x + 10} 90 C ${t.x + 30} 84, ${t.x + 46} 92, ${t.x + 82} 72`} fill="none" stroke={BRAND} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  );
}

function Pick() {
  const target = barangayBySlug("tabang") ?? barangays[0];
  const [cx, cy] = barangayShapes[target.psgc].center;
  const k = 190 / MAP_SIZE.width;
  const mx = 8 + cx * k;
  const my = 1 + cy * k;
  return (
    <Frame label="The barangay map with one barangay selected, and its card beside it">
      <MiniMap x={8} y={1} width={190} highlight={target.psgc} />
      <g transform={`translate(${mx} ${my})`} {...pop(8)}>
        <path d="M0 0 l0 16 l4 -4 l3.5 8 l3 -1.3 l-3.5 -8 l5.5 0Z" className="fill-foreground stroke-background" strokeWidth={1.2} strokeLinejoin="round" />
      </g>
      <g {...pop(9)}>
        <rect x={212} y={18} width={100} height={76} rx={10} className="fill-card stroke-border" />
        <text x={222} y={36} fontSize={10} fontWeight={600} className="fill-foreground">{target.name}</text>
        <text x={222} y={56} fontSize={13} fontWeight={600} fill={BRAND}>{fmt.number(target.population[LATEST])}</text>
        <text x={222} y={68} fontSize={8} className="fill-muted-foreground">residents</text>
        <rect x={222} y={77} width={64} height={6} rx={3} className="fill-muted" />
      </g>
    </Frame>
  );
}

function Legend() {
  const labels = densityRamp.map((_, i) => {
    const lo = densityBreaks[i - 1];
    const hi = densityBreaks[i];
    return lo === undefined ? `Under ${fmt.number(hi)}` : hi === undefined ? `${fmt.number(lo)}+` : `${fmt.number(lo)}–${fmt.number(hi - 1)}`;
  });
  return (
    <Frame label="The barangay map shaded from fewer to more residents per square kilometre, with its color scale">
      <MiniMap x={8} y={1} width={190} />
      <text x={214} y={16} fontSize={8} className="fill-muted-foreground">Residents per km²</text>
      {densityRamp.map((c, i) => (
        <g key={c} {...pop(i + 2)}>
          <rect x={214} y={24 + i * 17} width={14} height={12} rx={3} fill={c} />
          <text x={235} y={33.5 + i * 17} fontSize={9} className="fill-foreground">{labels[i]}</text>
        </g>
      ))}
    </Frame>
  );
}

function Charts() {
  const bars = [78, 62, 54, 40, 34, 22];
  return (
    <Frame label="A bar chart beside a table, with a chart and table switch">
      <g {...pop(0)}>
        <rect x={16} y={10} width={80} height={20} rx={10} className="fill-muted/60 stroke-border" />
        <rect x={19} y={13} width={36} height={14} rx={7} fill={BRAND} />
        <text x={37} y={23} fontSize={8} textAnchor="middle" fill="white">Chart</text>
        <text x={76} y={23} fontSize={8} textAnchor="middle" className="fill-muted-foreground">Table</text>
      </g>
      {bars.map((h, i) => (
        <rect key={i} x={20 + i * 22} y={104 - h * 0.85} width={14} height={h * 0.85} rx={3} fill={BRAND} opacity={0.35 + (i === 0 ? 0.65 : 0)} {...pop(i + 1)} />
      ))}
      <g {...pop(7)}>
        <rect x={168} y={14} width={140} height={90} rx={8} className="fill-card stroke-border" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={178} y={26 + r * 20} width={44} height={6} rx={3} className={r === 0 ? "fill-foreground/70" : "fill-muted-foreground/40"} />
            <rect x={238} y={26 + r * 20} width={28} height={6} rx={3} className="fill-muted-foreground/30" />
            <rect x={276} y={26 + r * 20} width={20} height={6} rx={3} className="fill-muted-foreground/30" />
          </g>
        ))}
      </g>
    </Frame>
  );
}

const pillarChips = ["Economy", "Government", "Infrastructure", "Resiliency", "Innovation"];

function Cmci() {
  return (
    <Frame label="Plaridel's rank among 509 municipalities, built from five pillars">
      <g {...pop(0)} style={{ ...pop(0).style, transformOrigin: "62px 56px" }}>
        <circle cx={62} cy={56} r={44} className="fill-brand/10" stroke={BRAND} strokeWidth={3} />
        <text x={62} y={58} fontSize={24} fontWeight={700} textAnchor="middle" className="fill-foreground">46th</text>
        <text x={62} y={76} fontSize={9} textAnchor="middle" className="fill-muted-foreground">of 509</text>
      </g>
      {pillarChips.map((name, i) => (
        <g key={name} {...pop(i + 1)}>
          <rect x={132 + (i % 2) * 90} y={14 + Math.floor(i / 2) * 32 + (i === 4 ? 0 : 0)} width={84} height={24} rx={12} className="fill-card stroke-border" />
          <circle cx={146 + (i % 2) * 90} cy={26 + Math.floor(i / 2) * 32} r={4} fill={i % 2 ? YELLOW : BRAND} />
          <text x={156 + (i % 2) * 90} y={29.5 + Math.floor(i / 2) * 32} fontSize={9} className="fill-foreground">{name}</text>
        </g>
      ))}
    </Frame>
  );
}

function Scores() {
  return (
    <Frame label="Five pillars of 20 points each make a score out of 100, and a lower rank is better">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} {...pop(i)}>
          <rect x={16 + i * 58} y={16} width={54} height={30} rx={6} fill={BRAND} opacity={0.35 + i * 0.13} />
          <text x={43 + i * 58} y={35} fontSize={12} fontWeight={600} textAnchor="middle" fill="white">20</text>
        </g>
      ))}
      <text x={16} y={64} fontSize={9} className="fill-muted-foreground">5 pillars × 20 points = 100</text>
      <path d="M20 90 H300" className="stroke-border" strokeWidth={4} strokeLinecap="round" />
      <path d="M20 90 H44" stroke={BRAND} strokeWidth={4} strokeLinecap="round" />
      <text x={20} y={106} fontSize={9} className="fill-muted-foreground">1st (best)</text>
      <text x={300} y={106} fontSize={9} textAnchor="end" className="fill-muted-foreground">509th</text>
    </Frame>
  );
}

function Pillars() {
  return (
    <Frame label="Two smooth lines, green for Plaridel and yellow for the category average">
      <defs>
        <linearGradient id="tg-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={BRAND} stopOpacity={0.35} /><stop offset="1" stopColor={BRAND} stopOpacity={0} /></linearGradient>
        <linearGradient id="tg-y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={YELLOW} stopOpacity={0.3} /><stop offset="1" stopColor={YELLOW} stopOpacity={0} /></linearGradient>
      </defs>
      <path d="M16 70 C 60 50, 90 40, 130 56 S 210 80, 250 44 S 290 30, 304 34 V104 H16Z" fill="url(#tg-y)" />
      <path d="M16 70 C 60 50, 90 40, 130 56 S 210 80, 250 44 S 290 30, 304 34" fill="none" stroke={YELLOW} strokeWidth={3} strokeLinecap="round" {...pop(0)} />
      <path d="M16 84 C 60 76, 90 60, 130 38 S 200 30, 250 62 S 290 70, 304 56 V104 H16Z" fill="url(#tg-g)" />
      <path d="M16 84 C 60 76, 90 60, 130 38 S 200 30, 250 62 S 290 70, 304 56" fill="none" stroke={BRAND} strokeWidth={3} strokeLinecap="round" {...pop(1)} />
      <g fontSize={9} className="fill-muted-foreground">
        <rect x={16} y={8} width={14} height={3} rx={1.5} fill={BRAND} /><text x={36} y={13}>Plaridel</text>
        <rect x={86} y={8} width={14} height={3} rx={1.5} fill={YELLOW} /><text x={106} y={13}>Category average</text>
      </g>
    </Frame>
  );
}

function Indicators() {
  const rows = [
    { w: 150, tick: 120 },
    { w: 96, tick: 130 },
    { w: 190, tick: 150 },
    { w: 70, tick: 100 },
  ];
  return (
    <Frame label="Bars for each sub-indicator against a grey average tick, with an info icon beside each label">
      {rows.map((r, i) => (
        <g key={i} {...pop(i)}>
          <rect x={16} y={12 + i * 24} width={52} height={6} rx={3} className="fill-muted-foreground/40" />
          <circle cx={78} cy={15 + i * 24} r={5} className="fill-none stroke-muted-foreground/60" />
          <text x={78} y={15.5 + i * 24} fontSize={7} fontWeight={600} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground">i</text>
          <rect x={92} y={9 + i * 24} width={r.w} height={12} rx={3} fill={BRAND} />
          <rect x={92 + r.tick} y={5 + i * 24} width={2.5} height={20} rx={1} className="fill-slate-500" />
        </g>
      ))}
    </Frame>
  );
}

function IncomeSplit() {
  const total = totalIncome(plaridel);
  const parts = [
    { label: "Raised locally", value: plaridel.local, color: incomeColors.local },
    { label: "National allotment", value: plaridel.nta, color: incomeColors.nta },
    { label: "", value: plaridel.interest + plaridel.otherShares, color: incomeColors.interest },
  ];
  let x = 16;
  return (
    <Frame label={`Plaridel's ${peso.millions(total)} yearly income, split into money raised locally and the national allotment`}>
      <g {...pop(0)}>
        <text x={16} y={30} fontSize={20} fontWeight={700} className="fill-foreground">
          {peso.millions(total)}
        </text>
      </g>
      <text x={16} y={44} fontSize={9} className="fill-muted-foreground">
        a year, counted as regular income
      </text>
      {parts.map((p, i) => {
        const w = (p.value / total) * 288;
        const at = x;
        x += w;
        return (
          <g key={i} {...pop(i + 1)}>
            <rect x={at} y={56} width={Math.max(w - 1, 1)} height={22} rx={3} fill={p.color} />
            {p.label && (
              <text x={at} y={94} fontSize={9} className="fill-muted-foreground">
                {p.label} <tspan className="fill-foreground" fontWeight={600}>{percent(p.value / total, 0)}</tspan>
              </text>
            )}
          </g>
        );
      })}
    </Frame>
  );
}

function Reliance() {
  const max = Math.ceil(Math.max(...bulacan.map(selfReliance)) * 10) / 10;
  const at = (n: number) => 20 + (n / max) * 280;
  return (
    <Frame label="Bulacan municipalities on a self-reliance scale, with Plaridel and the national median marked">
      <path d="M20 62 H300" className="stroke-border" strokeWidth={1.5} />
      <g {...pop(0)}>
        <rect x={at(nationwide.medianSelfReliance) - 1} y={44} width={2.5} height={36} rx={1} fill={YELLOW} />
        <text x={at(nationwide.medianSelfReliance)} y={96} fontSize={9} textAnchor="middle" className="fill-muted-foreground">
          National median {percent(nationwide.medianSelfReliance)}
        </text>
      </g>
      {bulacan
        .filter((l) => l !== plaridel)
        .map((l, i) => (
          <g key={l.name} {...pop(1 + i / 4)}>
            <circle cx={at(selfReliance(l))} cy={62} r={4} className="fill-slate-400/50" />
          </g>
        ))}
      <g {...pop(6)}>
        <circle cx={at(selfReliance(plaridel))} cy={62} r={8} fill={BRAND} className="stroke-card" strokeWidth={3} />
        <text x={at(selfReliance(plaridel))} y={38} fontSize={10} fontWeight={600} textAnchor="middle" className="fill-foreground">
          Plaridel {percent(selfReliance(plaridel))}
        </text>
      </g>
      <text x={20} y={20} fontSize={9} className="fill-muted-foreground">Share of income raised locally</text>
    </Frame>
  );
}

function Sources() {
  const rows = [
    { label: "National Tax Allotment", value: plaridel.nta, color: incomeColors.nta },
    ...[...localSources]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map((s) => ({ label: s.label, value: s.amount, color: sourceColors[s.key] })),
  ];
  return (
    <Frame label="Income sources as bars on one scale, each with an info icon">
      {rows.map((r, i) => (
        <g key={r.label} {...pop(i)}>
          <text x={16} y={22 + i * 24} fontSize={9} className="fill-foreground">{r.label}</text>
          <circle cx={128} cy={19 + i * 24} r={5} className="fill-none stroke-muted-foreground/60" />
          <text x={128} y={19.5 + i * 24} fontSize={7} fontWeight={600} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground">i</text>
          <rect x={142} y={13 + i * 24} width={(r.value / plaridel.nta) * 120} height={11} rx={3} fill={r.color} />
          <text x={304} y={22 + i * 24} fontSize={9} textAnchor="end" className="fill-muted-foreground">{peso.millions(r.value)}</text>
        </g>
      ))}
    </Frame>
  );
}

function Compare() {
  const rows = [...bulacan.slice(0, 4), plaridel];
  const max = totalIncome(bulacan[0]);
  return (
    <Frame label="Bulacan municipalities as bars split into local money and the national allotment, with Plaridel highlighted">
      {rows.map((l, i) => {
        const w = (totalIncome(l) / max) * 200;
        const local = (l.local / totalIncome(l)) * w;
        const isPlaridel = l === plaridel;
        return (
          <g key={l.name} {...pop(i)}>
            {isPlaridel && <rect x={8} y={8 + i * 20} width={304} height={18} rx={4} className="fill-brand/10" />}
            <text x={16} y={20.5 + i * 20} fontSize={9} fontWeight={isPlaridel ? 600 : 400} className={isPlaridel ? "fill-foreground" : "fill-muted-foreground"}>
              {l.name}
            </text>
            <rect x={96} y={12 + i * 20} width={local} height={10} rx={2} fill={incomeColors.local} />
            <rect x={96 + local + 1} y={12 + i * 20} width={Math.max(w - local - 1, 1)} height={10} rx={2} fill={incomeColors.nta} />
          </g>
        );
      })}
    </Frame>
  );
}

export const tourGraphics = { overview: Overview, pick: Pick, legend: Legend, charts: Charts, cmci: Cmci, scores: Scores, pillars: Pillars, indicators: Indicators, income: IncomeSplit, reliance: Reliance, sources: Sources, compare: Compare } as const;
export type TourGraphic = keyof typeof tourGraphics;
