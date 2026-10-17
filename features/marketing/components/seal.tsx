import { cn } from "@/lib/utils";

type SealProps = {
  org: string;
  title: string;
  subtitle: string;
  year?: string;
  className?: string;
};

export function Seal({
  org,
  title,
  subtitle,
  year = "2026",
  className,
}: SealProps) {
  const id = `seal-${org.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <svg
      viewBox="0 0 340 190"
      role="img"
      aria-label={`${org} ${year} ${title}, ${subtitle}`}
      className={cn(
        "h-auto w-36 overflow-visible text-[oklch(0.39_0.103_245)] dark:text-foreground",
        className,
      )}
    >
      <defs>
        <path id={`${id}-top`} d="M 49,100 A 121,66 0 0,1 291,100" />
        <path id={`${id}-bottom`} d="M 47,99 A 123,66 0 0,0 293,99" />
      </defs>
      <ellipse
        cx="170"
        cy="95"
        rx="164"
        ry="85"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <ellipse
        cx="170"
        cy="95"
        rx="157"
        ry="78"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.85"
      />
      <text
        fill="currentColor"
        fontSize="17"
        fontWeight="600"
        letterSpacing="2.5"
      >
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {org.toUpperCase()}
        </textPath>
      </text>
      <path
        d="M83 67H113 M227 67H257"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <text
        x="170"
        y="69"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        letterSpacing="2"
      >
        {year}
      </text>
      <text
        x="170"
        y="106"
        textAnchor="middle"
        fill="currentColor"
        fontSize="27"
        fontWeight="800"
      >
        {title}
      </text>
      <path
        d="M42 86l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z M298 86l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z"
        fill="currentColor"
      />
      <text
        fill="currentColor"
        fontSize="13"
        fontWeight="500"
        letterSpacing="0.5"
      >
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          {subtitle}
        </textPath>
      </text>
    </svg>
  );
}
