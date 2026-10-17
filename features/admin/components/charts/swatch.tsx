/**
 * Gray steps of the foreground, darkest first. Monochrome by design; identity
 * also comes from the legend order and the printed values.
 */
export const shareSteps = [1, 0.62, 0.36, 0.18];

export function Swatch({ step }: { step: number }) {
  return (
    <span
      aria-hidden
      className="size-2.5 shrink-0 rounded-[3px] bg-foreground"
      style={{ opacity: shareSteps[step] }}
    />
  );
}
