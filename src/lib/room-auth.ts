import { fsGetRoomBySlug } from "@/lib/custom-rooms-store";
import { createAdminSupabase } from "@/lib/supabase/server";

export async function getCustomRoomOwner(slug: string): Promise<{
  id: string;
  clerk_user_id: string;
} | null> {
  const supabase = createAdminSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("custom_rooms")
      .select("id, clerk_user_id")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data?.clerk_user_id) {
      return { id: data.id as string, clerk_user_id: data.clerk_user_id as string };
    }
  }

  const stored = fsGetRoomBySlug(slug);
  if (!stored) return null;
  return { id: stored.id, clerk_user_id: stored.clerk_user_id };
}

export async function userOwnsCustomRoom(slug: string, userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const owner = await getCustomRoomOwner(slug);
  return owner?.clerk_user_id === userId;
}
