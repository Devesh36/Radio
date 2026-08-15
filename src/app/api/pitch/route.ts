import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { clientIp, clip, isEmail, rateLimit, readJson } from "@/lib/validate";

export async function POST(request: Request) {
  if (!rateLimit(`pitch:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | null;
  const name = clip(body?.name, 80);
  const email = clip(body?.email, 254);
  const message = clip(body?.message, 2000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { userId } = await auth();
  const supabase = createAdminSupabase();

  if (supabase) {
    const { error } = await supabase.from("pitches").insert({
      name,
      email,
      message,
      clerk_user_id: userId,
    });
    if (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
