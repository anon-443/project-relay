export const heroDemoSteps = [
  { label: "01 / DISCOVER", title: "Brief located", detail: "Mobile checkout redesign is matched to product-design specialists." },
  { label: "02 / MATCH", title: "Skills aligned", detail: "Mobile UX, systems thinking, and prototyping are prioritised." },
  { label: "03 / CONNECT", title: "Proposal ready", detail: "A focused conversation can now move into the shared workboard." },
] as const;

export function getNextHeroDemoStep(currentIndex: number): number {
  return (currentIndex + 1) % heroDemoSteps.length;
}
