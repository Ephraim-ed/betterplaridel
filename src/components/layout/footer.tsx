import { Link } from "@tanstack/react-router";
import { site } from "@/site.config";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{site.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{site.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/hotlines" className="hover:text-foreground">
            Hotlines
          </Link>
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            {site.email}
          </a>
        </div>
      </div>
      <div className="container-page border-t border-line py-6 text-xs text-muted-foreground">
        <p>{site.disclaimer}</p>
        <p className="mt-1">© {new Date().getFullYear()} {site.name} · {site.town}</p>
      </div>
    </footer>
  );
}
