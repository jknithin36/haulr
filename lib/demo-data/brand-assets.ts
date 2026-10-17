/**
 * Brand images: white background with the Haulr mark and wordmark, centered.
 * Sizes are in output pixels; `mark` is the logo height, and the wordmark is
 * sized from it so every asset shares the same proportions.
 */
export type BrandAsset = {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
  mark: number;
};

export const brandAssets: BrandAsset[] = [
  {
    id: "post",
    title: "Social post",
    description: "Instagram, LinkedIn, and X posts.",
    width: 1080,
    height: 1080,
    mark: 150,
  },
  {
    id: "cover",
    title: "Cover",
    description: "X and LinkedIn header images.",
    width: 1500,
    height: 500,
    mark: 110,
  },
  {
    id: "link-preview",
    title: "Link preview",
    description: "Shown when a Haulr link is shared.",
    width: 1200,
    height: 630,
    mark: 120,
  },
];

/** Lockup proportions, relative to the mark height. */
export const lockup = {
  /** Logo aspect ratio (width / height), from logo.svg. */
  markRatio: 738 / 845,
  gap: 0.32,
  fontSize: 0.92,
  letterSpacing: -0.025,
};

export const brandInk = "#0a0a0a";
