const MOTES = [
  { left: "8%", delay: "0s", duration: "18s", size: 3 },
  { left: "16%", delay: "3s", duration: "22s", size: 2 },
  { left: "24%", delay: "7s", duration: "16s", size: 4 },
  { left: "33%", delay: "1s", duration: "24s", size: 2 },
  { left: "41%", delay: "9s", duration: "19s", size: 3 },
  { left: "48%", delay: "4s", duration: "21s", size: 2 },
  { left: "55%", delay: "12s", duration: "17s", size: 5 },
  { left: "62%", delay: "2s", duration: "23s", size: 2 },
  { left: "70%", delay: "6s", duration: "20s", size: 3 },
  { left: "77%", delay: "11s", duration: "18s", size: 2 },
  { left: "84%", delay: "5s", duration: "25s", size: 4 },
  { left: "91%", delay: "8s", duration: "16s", size: 2 },
  { left: "12%", delay: "14s", duration: "21s", size: 3 },
  { left: "38%", delay: "10s", duration: "19s", size: 2 },
  { left: "67%", delay: "15s", duration: "22s", size: 3 },
];

export function RoomAtmosphere() {
  return (
    <div className="room-atmosphere" aria-hidden="true">
      {MOTES.map((mote, index) => (
        <span
          key={index}
          className="room-mote"
          style={{
            left: mote.left,
            width: mote.size,
            height: mote.size,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}
    </div>
  );
}
