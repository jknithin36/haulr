import { cn } from "@/lib/utils";

export const avatarPalettes = [
  ["#ffd6a5", "#ff8fab", "#a0c4ff"],
  ["#bdeaff", "#7b9cff", "#c9b6ff"],
  ["#c7f9cc", "#57cc99", "#80ed99"],
  ["#ffe5b4", "#f4a261", "#e9c46a"],
  ["#e0c3fc", "#8ec5fc", "#f9c5d1"],
  ["#fde2e4", "#f08080", "#ffd6a5"],
  ["#d0f4de", "#a9def9", "#e4c1f9"],
  ["#fcf6bd", "#ff99c8", "#d0f4de"],
  ["#cddafd", "#6c8cff", "#b8f2e6"],
  ["#ffcfd2", "#b28dff", "#fbe7c6"],
];

// FNV-1a, so the same name always gets the same gradient everywhere.
export function hash(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

// Fine grain laid over the gradient so it doesn't look flat.
export const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function GradientAvatar({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const [a, b, c] = avatarPalettes[(hash(seed) >>> 8) % avatarPalettes.length];
  return (
    <span
      aria-hidden
      className={cn(
        "relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/10",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 25% 20%, ${a}, transparent 60%), radial-gradient(circle at 80% 85%, ${b}, transparent 65%), ${c}`,
      }}
    >
      <span
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: noise }}
      />
    </span>
  );
}
