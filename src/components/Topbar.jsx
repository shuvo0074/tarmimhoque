// Topbar: fixed site header with brand, section nav, and hire CTA.
// Views: web and mobile (section links hidden on mobile).
import { memo } from "react";
import { NAV_ITEMS, PROFILE } from "../data/portfolio";

function TopbarComponent() {
  return (
    <header className="topbar">
      <a className="brand" href="#hero">
        ST
      </a>
      <nav className="topbar-links">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="button button-ghost" href={`mailto:${PROFILE.email}`}>
        Hire Me
      </a>
    </header>
  );
}

export const Topbar = memo(TopbarComponent);
