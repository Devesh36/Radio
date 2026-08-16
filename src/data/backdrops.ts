export const roomBackdrops = [
  { src: "/images/hero-kulhad.jpg", label: "Kulhad" },
  { src: "/images/rooms/chai-tapri.jpg", label: "Chai tapri" },
  { src: "/images/rooms/truck-dhaba.jpg", label: "Truck dhaba" },
  { src: "/images/rooms/hostel-midnight.jpg", label: "Hostel" },
  { src: "/images/rooms/std-booth.jpg", label: "STD booth" },
  { src: "/images/rooms/night-bus.jpg", label: "Night bus" },
  { src: "/images/rooms/baraat-street.jpg", label: "Garba" },
] as const;

export const DEFAULT_BACKDROP = roomBackdrops[0].src;

const allowed = new Set<string>(roomBackdrops.map((item) => item.src));

export function isAllowedBackdrop(src: string): boolean {
  return allowed.has(src);
}
