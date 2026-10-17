import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const columns = [
  {
    title: "Ship",
    links: [
      { label: "Car shipping", href: "/ship/cars" },
      { label: "Furniture shipping", href: "/ship/furniture" },
      { label: "Heavy items", href: "/ship/heavy-items" },
      { label: "Freight", href: "/ship/freight" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Browse shipments", href: "/shipments" },
      { label: "Find truck space", href: "/loads" },
      { label: "Post a shipment", href: "/shipments/new" },
      { label: "Get an estimate", href: "/estimate" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

// Brand marks drawn with the current text color.
const socialIcons = {
  x: {
    viewBox: "0 0 512 512",
    d: "M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z",
  },
  linkedin: {
    viewBox: "0 0 32 32",
    d: "M8.268 28H2.463V9.306h5.805zM5.362 6.756C3.506 6.756 2 5.218 2 3.362a3.362 3.362 0 0 1 6.724 0c0 1.856-1.506 3.394-3.362 3.394M29.994 28h-5.792v-9.1c0-2.169-.044-4.95-3.018-4.95c-3.018 0-3.481 2.356-3.481 4.794V28h-5.799V9.306h5.567v2.55h.081c.775-1.469 2.668-3.019 5.492-3.019c5.875 0 6.955 3.869 6.955 8.894V28z",
  },
  slack: {
    viewBox: "0 0 256 256",
    d: "M53.841 161.32c0 14.832-11.987 26.82-26.819 26.82S.203 176.152.203 161.32c0-14.831 11.987-26.818 26.82-26.818H53.84zm13.41 0c0-14.831 11.987-26.818 26.819-26.818s26.819 11.987 26.819 26.819v67.047c0 14.832-11.987 26.82-26.82 26.82c-14.83 0-26.818-11.988-26.818-26.82zM94.07 53.638c-14.832 0-26.82-11.987-26.82-26.819S79.239 0 94.07 0s26.819 11.987 26.819 26.819v26.82zm0 13.613c14.832 0 26.819 11.987 26.819 26.819s-11.987 26.819-26.82 26.819H26.82C11.987 120.889 0 108.902 0 94.069c0-14.83 11.987-26.818 26.819-26.818zM201.55 94.07c0-14.832 11.987-26.82 26.818-26.82s26.82 11.988 26.82 26.82s-11.988 26.819-26.82 26.819H201.55zm-13.41 0c0 14.832-11.988 26.819-26.82 26.819c-14.831 0-26.818-11.987-26.818-26.82V26.82C134.502 11.987 146.489 0 161.32 0s26.819 11.987 26.819 26.819zM161.32 201.55c14.832 0 26.82 11.987 26.82 26.818s-11.988 26.82-26.82 26.82c-14.831 0-26.818-11.988-26.818-26.82V201.55zm0-13.41c-14.831 0-26.818-11.988-26.818-26.82c0-14.831 11.987-26.818 26.819-26.818h67.25c14.832 0 26.82 11.987 26.82 26.819s-11.988 26.819-26.82 26.819z",
  },
};

// TODO: replace with Haulr's real profile URLs.
const socials = [
  { label: "X", icon: socialIcons.x, href: "https://x.com" },
  {
    label: "LinkedIn",
    icon: socialIcons.linkedin,
    href: "https://www.linkedin.com",
  },
  { label: "Slack", icon: socialIcons.slack, href: "https://slack.com" },
];

export function SiteFooter() {
  return (
    <footer className="px-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div className="flex flex-col items-start gap-5">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <LogoMark className="h-6" />
              Haulr
            </Link>
            <p className="max-w-xs text-pretty text-muted-foreground">
              The easier way to ship cars, furniture, and freight.
            </p>
            <ul className="-ml-2 flex gap-1">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "text-muted-foreground",
                    )}
                  >
                    <svg
                      viewBox={social.icon.viewBox}
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path fill="currentColor" d={social.icon.d} />
                    </svg>
                    <span className="sr-only">{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <p className="text-sm font-medium">{column.title}</p>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2026 Haulr. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
