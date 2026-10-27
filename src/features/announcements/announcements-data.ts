// Announcements, newest first. Raw copy: src/data/announcements.json.
// TODO: replace with real announcements.
import data from "@/data/announcements.json";

export type Announcement = { date: string; tag: string; title: string; body: string };

export const announcements: Announcement[] = data.announcements;
