import { notFound } from "next/navigation";
import { RoomExperience } from "@/components/room/RoomExperience";
import { resolveRoom } from "@/lib/rooms-server";

export async function generateStaticParams() {
  return [
    { slug: "chai-tapri" },
    { slug: "truck-dhaba" },
    { slug: "hostel-midnight" },
    { slug: "std-booth" },
    { slug: "night-bus" },
    { slug: "baraat-street" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = await resolveRoom(slug);
  if (!resolved) return { title: "Room not found" };
  return {
    title: `${resolved.room.name} — Baithak`,
    description: resolved.room.tagline,
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = await resolveRoom(slug);

  if (!resolved) notFound();

  return <RoomExperience room={resolved.room} />;
}
