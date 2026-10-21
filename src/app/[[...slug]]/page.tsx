import { ClientOnly } from "./client";

// Every URL is handled by this one page; TanStack Router takes over in the
// browser and decides what to render. Only the index route is prerendered.
export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page() {
  return <ClientOnly />;
}
