export const roomBackdrops = [
  { src: "/images/hero-kulhad.jpg", label: "Kulhad" },
  { src: "/images/rooms/chai-tapri.jpg", label: "Chai tapri" },
  { src: "/images/rooms/truck-dhaba.jpg", label: "Truck dhaba" },
  { src: "/images/rooms/hostel-midnight.jpg", label: "Hostel" },
  { src: "/images/rooms/std-booth.jpg", label: "STD booth" },
  { src: "/images/rooms/night-bus.jpg", label: "Night bus" },
  { src: "/images/rooms/baraat-street.jpg", label: "Garba" },
  { src: "/images/rooms/japan-lofi.jpg", label: "Japanese lofi" },
  { src: "/images/rooms/cafe-lofi.jpg", label: "Cafe lofi" },
  { src: "/images/rooms/gym-room.jpg", label: "Gym" },
  { src: "/images/rooms/study-lofi.jpg", label: "Study lofi" },
  { src: "/images/rooms/night-drive.jpg", label: "Night drive" },
  { src: "/images/rooms/rainy-window.jpg", label: "Rainy window" },
  { src: "/images/rooms/monsoon-balcony.jpg", label: "Monsoon balcony" },
  { src: "/images/rooms/cricket-ground.jpg", label: "Cricket ground" },
  { src: "/images/rooms/railway-platform.jpg", label: "Railway platform" },
] as const;

export const DEFAULT_BACKDROP = roomBackdrops[0].src;

const allowed = new Set<string>(roomBackdrops.map((item) => item.src));

export function isAllowedBackdrop(src: string): boolean {
  return allowed.has(src);
}
