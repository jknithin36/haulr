import { TableOfContents } from "@/features/blog/components/table-of-contents";
import { getLegalDoc, type LegalDocId } from "@/features/legal/legal-queries";
import type { LegalBlock } from "@/lib/demo-data/legal";

function renderBlock(block: LegalBlock, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="text-pretty">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul
          key={i}
          className="flex list-disc flex-col gap-2 pl-5 marker:text-foreground/40"
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    case "contact":
      return (
        <p key={i} className="text-pretty">
          {block.text}{" "}
          <a
            href={`mailto:${block.email}`}
            className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/70"
          >
            {block.email}
          </a>
          .
        </p>
      );
  }
}

/** Shared layout for the terms and privacy pages. */
export async function LegalPage({ id }: { id: LegalDocId }) {
  const doc = await getLegalDoc(id);
  const headings = doc.sections.map((s) => ({ id: s.id, text: s.title }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-8 pb-16 md:gap-12 md:pt-12 md:pb-24">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {doc.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {doc.updated}
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
        <div className="flex max-w-[68ch] flex-col gap-10 text-[17px] leading-relaxed text-foreground/80">
          <p className="text-pretty text-lg text-foreground">{doc.intro}</p>
          {doc.sections.map((section) => (
            <section key={section.id} className="flex flex-col gap-4">
              <h2
                id={section.id}
                className="scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground"
              >
                {section.title}
              </h2>
              {section.blocks.map(renderBlock)}
            </section>
          ))}
        </div>
        <aside className="max-lg:hidden">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export function LegalPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl animate-pulse flex-col gap-10 pt-8 md:gap-12 md:pt-12">
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="h-10 w-1/2 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
      </div>
      <div className="flex max-w-[68ch] flex-col gap-3">
        <div className="h-5 w-full rounded bg-muted" />
        <div className="h-5 w-5/6 rounded bg-muted" />
        <div className="h-5 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
