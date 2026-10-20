/* ══ opengraph-image.tsx — the 1200x630 card for "/" ═══════════════
   The layout asks for a summary_large_image twitter card but shipped no
   image, so every share rendered as a blank box. Next's file convention
   injects this into both og:image and twitter:image, with the dimensions
   and alt it needs. Issue #3.                                        ══ */
import { renderOgCard } from "@/lib/ogCard";
import { homeCard } from "@/lib/ogContent";

const card = homeCard();

export const alt = card.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgCard(card);
}
