/* ══ HorizonBackdrop.tsx — the six landscapes behind the hero board
   A photograph is picked at random when the hero mounts, then HomeHero
   cycles slowly through the rest with a cross-fade. The images live in
   public/assets/scenes and are shot-style landscapes with the horizon in
   the lower third, so the framed board always sits on solid ground.
   Light mode washes them in globals.css (.light .hero-horizon img).   ═ */

export type Scene = {
  id: string;
  name: string;
  img: string;
  alt: string;
};

export const SCENES: Scene[] = [
  { id: "alpine", name: "Alpine dawn", img: "/assets/scenes/alpine.jpg", alt: "Snow-dusted mountain ridges in dawn mist" },
  { id: "forest", name: "Forest mist", img: "/assets/scenes/forest.jpg", alt: "Pine ridges fading into morning fog" },
  { id: "ocean", name: "Ocean dusk", img: "/assets/scenes/ocean.jpg", alt: "Calm sea horizon under a dusk sky" },
  { id: "desert", name: "Desert night", img: "/assets/scenes/desert.jpg", alt: "Dune ridges under a star-filled night sky" },
  { id: "aurora", name: "Aurora", img: "/assets/scenes/aurora.jpg", alt: "Northern lights over arctic ridges" },
  { id: "monsoon", name: "Monsoon", img: "/assets/scenes/monsoon.jpg", alt: "Green mountain ridges under monsoon rain" },
];
