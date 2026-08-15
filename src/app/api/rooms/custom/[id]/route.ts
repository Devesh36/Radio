import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fsDeleteRoom, fsUpdateRoom, isMissingTableError } from "@/lib/custom-rooms-store";
import { createAdminSupabase, persistenceUnavailable } from "@/lib/supabase/server";
import {
  asBoolean,
  clip,
  genericError,
  isUuid,
  readJson,
  sanitizeBackgroundUrl,
} from "@/lib/validate";

function failDb() {
  return NextResponse.json(genericError(), { status: 500 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (persistenceUnavailable()) {
    return NextResponse.json(genericError(), { status: 503 });
  }

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: room, error } = await supabase
      .from("custom_rooms")
      .select("id, clerk_user_id, slug")
      .eq("id", id)
      .maybeSingle();

    if (!error && room) {
      if (room.clerk_user_id !== userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      await supabase.from("custom_tracks").delete().eq("room_id", id);
      await supabase.from("custom_rooms").delete().eq("id", id);
      await supabase.from("battle_states").delete().eq("room_slug", room.slug);
      await supabase.from("radio_epochs").delete().eq("room_slug", room.slug);
      return NextResponse.json({ ok: true });
    }

    if (error && !isMissingTableError(error)) {
      return failDb();
    }
    if (process.env.NODE_ENV === "production") {
      return failDb();
    }
  }

  const deleted = fsDeleteRoom(id, userId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if ("title" in body) patch.title = clip(body.title, 80);
  if ("tagline" in body) patch.tagline = clip(body.tagline, 120);
  if ("background_url" in body) patch.background_url = sanitizeBackgroundUrl(body.background_url);
  if ("chat_enabled" in body) patch.chat_enabled = asBoolean(body.chat_enabled, true);
  if ("battle_enabled" in body) patch.battle_enabled = asBoolean(body.battle_enabled, true);

  if (typeof patch.title === "string" && !patch.title) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (persistenceUnavailable()) {
    return NextResponse.json(genericError(), { status: 503 });
  }

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: room, error } = await supabase
      .from("custom_rooms")
      .select("id, clerk_user_id")
      .eq("id", id)
      .maybeSingle();

    if (!error && room) {
      if (room.clerk_user_id !== userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      const { error: updateError } = await supabase.from("custom_rooms").update(patch).eq("id", id);
      if (updateError) return failDb();
      return NextResponse.json({ ok: true });
    }

    if (error && !isMissingTableError(error)) {
      return failDb();
    }
    if (process.env.NODE_ENV === "production") {
      return failDb();
    }
  }

  const updated = fsUpdateRoom(id, userId, {
    title: typeof patch.title === "string" ? patch.title : undefined,
    tagline: typeof patch.tagline === "string" ? patch.tagline : undefined,
    background_url: typeof patch.background_url === "string" ? patch.background_url : undefined,
    chat_enabled: typeof patch.chat_enabled === "boolean" ? patch.chat_enabled : undefined,
    battle_enabled: typeof patch.battle_enabled === "boolean" ? patch.battle_enabled : undefined,
  });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
