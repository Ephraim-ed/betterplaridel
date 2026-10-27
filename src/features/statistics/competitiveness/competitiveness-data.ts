// Cities and Municipalities Competitiveness Index (CMCI) by the DTI's National Competitiveness Council.
// Raw copy: src/data/competitiveness.json; its "source" block explains where each table came from.
// Ranks are within the LGU's category; scores are out of 100 (20 per pillar, 2 per sub-indicator).
import data from "@/data/competitiveness.json";

export const CMCI_YEAR = data.year;

export const category = data.category;

export type Indicator = { name: string; score: number; categoryAverage: number };

export type Pillar = {
  key: string;
  name: string;
  score: number;
  rank: number;
  categoryAverage: number;
  categoryBest: number;
  indicators: Indicator[];
};

export const overall = data.overall;

export const pillars: Pillar[] = data.pillars;

// Every Bulacan city and municipality, highest overall score first.
export type BulacanLgu = { name: string; category: string; rank: number; score: number };

export const bulacan: BulacanLgu[] = data.bulacan;
