import { Mail } from "@/components/animate-ui/icons/mail";
import { MessageCircle } from "@/components/animate-ui/icons/message-circle";
import { Phone } from "@/components/animate-ui/icons/phone";

// Animate UI has no brand logos, so Facebook is a plain "f" mark that tilts on hover
// (the parent link carries the `group` class).
function Facebook({ size }: { size: number }) {
  return (
    <svg
      aria-hidden
      viewBox="3.5 3.5 17 17"
      width={size}
      height={size}
      fill="currentColor"
      className="transition-transform duration-300 group-hover:-rotate-12"
    >
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.24-1.46 1.49-1.46h1.6V4.46A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H8v3h2.4V21h3.1Z" />
    </svg>
  );
}

// Icon for a contact's label ("Phone", "Email", "WhatsApp", "Facebook"); animates when its link is hovered.
export function ContactIcon({ label, size = 16 }: { label: string; size?: number }) {
  switch (label) {
    case "Email":
      return <Mail size={size} />;
    case "WhatsApp":
      return <MessageCircle size={size} />;
    case "Facebook":
      return <Facebook size={size} />;
    default:
      return <Phone size={size} />;
  }
}
