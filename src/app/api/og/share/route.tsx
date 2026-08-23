import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function clip(value: string, max: number) {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = clip(searchParams.get("title") ?? "Now Playing", 52);
  const artist = clip(searchParams.get("artist") ?? "", 42);
  const room = clip(searchParams.get("room") ?? "Radio", 28);
  const vid = searchParams.get("vid") ?? "";
  const thumb = /^[a-zA-Z0-9_-]{11}$/.test(vid)
    ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#14110f",
          padding: 48,
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            borderRadius: 32,
            background: "#1f1a17",
            padding: 40,
            gap: 40,
            alignItems: "center",
          }}
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt=""
              width={280}
              height={280}
              style={{ borderRadius: 24, objectFit: "cover", flexShrink: 0 }}
            />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                color: "#c47a52",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              radio.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 44,
                fontWeight: 700,
                color: "#f3e6d8",
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
            {artist ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 14,
                  fontSize: 26,
                  color: "rgba(243,230,216,0.68)",
                }}
              >
                {artist}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                marginTop: 28,
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(196,122,82,0.16)",
                color: "#c47a52",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {room}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
