import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = { q: string; a: React.ReactNode };

/** Question list with the first answer open. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion defaultValue={[items[0].q]}>
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger className="py-5 text-base hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pr-8 pb-5 text-base text-muted-foreground">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
