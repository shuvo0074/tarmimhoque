// ContactSection: contact links and closing quote card.
// Views: web and mobile.
import { memo } from "react";
import { CONTACT, PROFILE } from "../../data/portfolio";

function ContactSectionComponent() {
  return (
    <section id="contact" className="panel">
      <div className="panel-content contact-layout">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>{CONTACT.title}</h2>
          <p className="section-lead">{CONTACT.lead}</p>
          <div className="contact-list">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              {PROFILE.githubLabel}
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              {PROFILE.linkedinLabel}
            </a>
          </div>
        </div>
        <div className="contact-card card" data-tilt-card>
          <p className="quote">&quot;{CONTACT.quote}&quot;</p>
          <p className="signature">— {PROFILE.name}</p>
        </div>
      </div>
    </section>
  );
}

export const ContactSection = memo(ContactSectionComponent);
