import { work } from "@/content";

// Carousel order; hidden entries stay out of the carousel, palette and stack links.
export const projects = ["vestra", "a", "logos"]
  .map((id) => work.find((item) => item.id === id)!)
  .filter((item) => !item.hidden);
