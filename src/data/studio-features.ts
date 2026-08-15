export const studioFeatureGroups = [
  {
    label: "Playback",
    items: [
      { title: "Pick any song", body: "Play what you want." },
      { title: "Skip, seek, go back", body: "You’re not stuck on the radio." },
      { title: "You’re the radio", body: "Playback follows you." },
    ],
  },
  {
    label: "Catalog",
    items: [
      { title: "Add from YouTube", body: "Paste a link. Up to 15 songs." },
      { title: "Remove tracks", body: "Swap songs when the mood changes." },
      { title: "Hindi, Tamil, Telugu", body: "Public rooms stay Hindi-only." },
    ],
  },
  {
    label: "Your baithak",
    items: [
      { title: "Name, URL, backdrop", body: "Title, /r/ slug, tagline, image." },
      { title: "Share the door", body: "Send /r/your-room to friends." },
    ],
  },
  {
    label: "Together",
    items: [
      { title: "Room chat", body: "Public rooms have none." },
      { title: "Song battles", body: "Nominate and vote the next round." },
      { title: "Share this song", body: "Copy the track and room link." },
    ],
  },
] as const;
