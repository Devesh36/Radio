import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { brand } from "@/data/brand";
import { RoomExperience } from "@/components/room/RoomExperience";
import { userOwnsCustomRoom } from "@/lib/room-auth";
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
    title: `${resolved.room.name} — ${brand.name}`,
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

  const { userId } = await auth();
  const initialIsHost =
    resolved.type === "custom" && (await userOwnsCustomRoom(slug, userId));

  return <RoomExperience room={resolved.room} initialIsHost={initialIsHost} />;
}
