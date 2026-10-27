import { OfficialCards } from "../officials/components/official-cards";
import { punongBarangays, SOURCE } from "../officials/official-data";

const sections = [
  {
    id: "punong-barangays",
    title: "Punong Barangays",
    subtitle: "Barangay captains of the 19 barangays. Click one to see their kagawads and SK Chairperson.",
    officials: punongBarangays,
  },
];

export function BarangaysPage() {
  return (
    <section className="pb-24">
      <OfficialCards sections={sections} />
      <p className="container-page mt-8 text-sm text-muted-foreground">
        Source:{" "}
        <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
          {SOURCE.label}
        </a>
        .
      </p>
    </section>
  );
}
