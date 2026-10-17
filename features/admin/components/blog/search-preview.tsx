function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Roughly how the post shows up in a Google result. */
export function SearchPreview({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-background p-4 font-sans">
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-semibold">
          H
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm">Haulr</span>
          <span className="truncate text-xs text-muted-foreground">
            https://haulr.com › blog › {slug || "post"}
          </span>
        </span>
      </div>
      <p className="mt-1 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
        {clip(title || "Post title", 60)}
      </p>
      <p className="text-sm leading-normal text-muted-foreground">
        {description
          ? clip(description, 155)
          : "Add a meta description to control the text shown here."}
      </p>
    </div>
  );
}
