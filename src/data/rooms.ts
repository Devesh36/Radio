import type { OfficialRoom, Track } from "@/lib/types";

const EPOCH = new Date("2026-01-01T00:00:00.000Z").getTime();

function tracks(
  items: Array<Omit<Track, "duration_sec"> & { duration_sec?: number }>,
): Track[] {
  return items.map((item) => ({
    youtubeId: item.youtubeId,
    title: item.title,
    artist: item.artist,
    cover: item.cover,
    duration_sec: item.duration_sec ?? 240,
  }));
}

/** Roadside cassette radio — 90s Kumar Sanu, Alka, Udit, Lata */
const chaiHindi = tracks([
  { youtubeId: "cNV5hLSa9H8", title: "Tujhe Dekha Toh", artist: "Lata Mangeshkar, Kumar Sanu", duration_sec: 303 },
  { youtubeId: "SBfPs-PMGTA", title: "Pehla Nasha", artist: "Udit Narayan, Sadhana Sargam", duration_sec: 258 },
  { youtubeId: "OMoU0Pfibc4", title: "Tere Naam", artist: "Udit Narayan, Alka Yagnik", duration_sec: 282 },
  { youtubeId: "N0jnLZxYwYc", title: "Mujhse Mohabbat Ka Izhaar", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 300 },
  { youtubeId: "3NWMK2MRqIk", title: "Tumsa Koi Pyaara", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 280 },
  { youtubeId: "oFxbBeYhLqM", title: "Saaton Janam Main Tere", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 320 },
]);

const chaiTamil = tracks([
  { youtubeId: "UPQZ4vuvW2s", title: "Munbe Vaa", artist: "Shreya Ghoshal, Naresh Iyer", duration_sec: 361 },
  { youtubeId: "OjU54VhRFbU", title: "New York Nagaram", artist: "A. R. Rahman", duration_sec: 335 },
  { youtubeId: "FzLpP8VBC6E", title: "Nenjukkul Peidhidum", artist: "Hariharan, Harris Jayaraj", duration_sec: 339 },
  { youtubeId: "TmrnYG2FHK4", title: "Aaromale", artist: "Alphons Joseph, A. R. Rahman", duration_sec: 348 },
  { youtubeId: "i65ivV7kGGw", title: "Hosanna", artist: "Vijay Prakash, Suzanne D'Mello, A. R. Rahman", duration_sec: 332 },
]);

const chaiTelugu = tracks([
  { youtubeId: "cC8AmhPUJPA", title: "Inkem Inkem Kavale", artist: "Sid Sriram", duration_sec: 260 },
  { youtubeId: "OCg6BWlAXSw", title: "Samajavaragamana", artist: "Sid Sriram, S. Thaman", duration_sec: 228 },
  { youtubeId: "2mDCVzruYzQ", title: "Butta Bomma", artist: "Armaan Malik, S. Thaman", duration_sec: 204 },
  { youtubeId: "wFAj0pW6xX0", title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni, Mangli", duration_sec: 251 },
  { youtubeId: "4_eEgJhsBMo", title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", duration_sec: 231 },
]);

/** Highway tape deck — truck anthems, road songs, diesel-night radio */
const dhabaHindi = tracks([
  { youtubeId: "9yT4F8hzykY", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh, Sapna Awasthi", duration_sec: 416 },
  { youtubeId: "8HDTS80dlr4", title: "Patakha Guddi", artist: "Nooran Sisters, A. R. Rahman", duration_sec: 249 },
  { youtubeId: "ttIKsnxPrMY", title: "Nadaan Parinde", artist: "Mohit Chauhan", duration_sec: 300 },
  { youtubeId: "6w67NOaRe-w", title: "Ilahi", artist: "Arijit Singh", duration_sec: 204 },
  { youtubeId: "30zJZPb-o3Q", title: "Patakha Guddi (Male)", artist: "A. R. Rahman", duration_sec: 358 },
  { youtubeId: "tD8M2BpSnwc", title: "Dekhne Walon Ne", artist: "Udit Narayan, Alka Yagnik", duration_sec: 444 },
]);

const dhabaTamil = tracks([
  { youtubeId: "2ogKpj5QuSY", title: "Aaluma Doluma", artist: "Anirudh Ravichander, Badshah", duration_sec: 207 },
  { youtubeId: "wsYW9Mm9Ggo", title: "Selfie Pulla", artist: "Vijay, Anirudh Ravichander", duration_sec: 246 },
  { youtubeId: "vxzfsBDx590", title: "Vaathi Coming", artist: "Anirudh Ravichander, Gana Balachandar", duration_sec: 233 },
  { youtubeId: "x6Q7c9RyMzk", title: "Rowdy Baby", artist: "Dhanush, Sai Pallavi, Yuvan Shankar Raja", duration_sec: 278 },
  { youtubeId: "YR12Z8f1Dh8", title: "Why This Kolaveri Di", artist: "Dhanush, Anirudh Ravichander", duration_sec: 241 },
]);

const dhabaTelugu = tracks([
  { youtubeId: "2mDCVzruYzQ", title: "Butta Bomma", artist: "Armaan Malik, S. Thaman", duration_sec: 204 },
  { youtubeId: "wFAj0pW6xX0", title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni, Mangli", duration_sec: 251 },
  { youtubeId: "4_eEgJhsBMo", title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", duration_sec: 231 },
  { youtubeId: "u_wB6byrl5k", title: "Oo Antava", artist: "Indravathi Chauhan, Devi Sri Prasad", duration_sec: 229 },
  { youtubeId: "OCg6BWlAXSw", title: "Samajavaragamana", artist: "Sid Sriram, S. Thaman", duration_sec: 228 },
]);

/** Hostel after midnight — campus, acoustic, 2000s hostel guitar */
const hostelHindi = tracks([
  { youtubeId: "mt9xg0mmt28", title: "Tum Se Hi", artist: "Mohit Chauhan", duration_sec: 258 },
  { youtubeId: "lbCRtrrMvSw", title: "Give Me Some Sunshine", artist: "Suraj Jagan, Sharman Joshi", duration_sec: 255 },
  { youtubeId: "T94PHkuydcw", title: "Kun Faya Kun", artist: "A. R. Rahman, Javed Ali, Mohit Chauhan", duration_sec: 473 },
  { youtubeId: "6w67NOaRe-w", title: "Ilahi", artist: "Arijit Singh", duration_sec: 204 },
  { youtubeId: "jHNNMj5bNQw", title: "Kabira", artist: "Rekha Bhardwaj, Arijit Singh", duration_sec: 230 },
  { youtubeId: "ttIKsnxPrMY", title: "Nadaan Parinde", artist: "Mohit Chauhan", duration_sec: 300 },
]);

const hostelTamil = tracks([
  { youtubeId: "YR12Z8f1Dh8", title: "Why This Kolaveri Di", artist: "Dhanush, Anirudh Ravichander", duration_sec: 241 },
  { youtubeId: "FzLpP8VBC6E", title: "Nenjukkul Peidhidum", artist: "Hariharan, Harris Jayaraj", duration_sec: 339 },
  { youtubeId: "TmrnYG2FHK4", title: "Aaromale", artist: "Alphons Joseph, A. R. Rahman", duration_sec: 348 },
  { youtubeId: "i65ivV7kGGw", title: "Hosanna", artist: "Vijay Prakash, Suzanne D'Mello, A. R. Rahman", duration_sec: 332 },
  { youtubeId: "UPQZ4vuvW2s", title: "Munbe Vaa", artist: "Shreya Ghoshal, Naresh Iyer", duration_sec: 361 },
]);

const hostelTelugu = tracks([
  { youtubeId: "cC8AmhPUJPA", title: "Inkem Inkem Kavale", artist: "Sid Sriram", duration_sec: 260 },
  { youtubeId: "OCg6BWlAXSw", title: "Samajavaragamana", artist: "Sid Sriram, S. Thaman", duration_sec: 228 },
  { youtubeId: "2mDCVzruYzQ", title: "Butta Bomma", artist: "Armaan Malik, S. Thaman", duration_sec: 204 },
  { youtubeId: "wFAj0pW6xX0", title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni, Mangli", duration_sec: 251 },
  { youtubeId: "4_eEgJhsBMo", title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", duration_sec: 231 },
]);

/** STD booth — long-distance love, waiting on the line */
const boothHindi = tracks([
  { youtubeId: "Umqb9KENgmk", title: "Tum Hi Ho", artist: "Arijit Singh", duration_sec: 262 },
  { youtubeId: "sK7riqg2mr4", title: "Agar Tum Saath Ho", artist: "Arijit Singh, Alka Yagnik", duration_sec: 341 },
  { youtubeId: "OMoU0Pfibc4", title: "Tere Naam", artist: "Udit Narayan, Alka Yagnik", duration_sec: 282 },
  { youtubeId: "-Hb2DeHvvEg", title: "Tujhe Bhula Diya", artist: "Mohit Chauhan, Shekhar Ravjiani, Shruti Pathak", duration_sec: 258 },
  { youtubeId: "cNV5hLSa9H8", title: "Tujhe Dekha Toh", artist: "Lata Mangeshkar, Kumar Sanu", duration_sec: 303 },
  { youtubeId: "N0jnLZxYwYc", title: "Mujhse Mohabbat Ka Izhaar", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 300 },
]);

const boothTamil = tracks([
  { youtubeId: "UPQZ4vuvW2s", title: "Munbe Vaa", artist: "Shreya Ghoshal, Naresh Iyer", duration_sec: 361 },
  { youtubeId: "OjU54VhRFbU", title: "New York Nagaram", artist: "A. R. Rahman", duration_sec: 335 },
  { youtubeId: "E7IqglHfpQg", title: "Srivalli", artist: "Sid Sriram, Devi Sri Prasad", duration_sec: 351 },
  { youtubeId: "FzLpP8VBC6E", title: "Nenjukkul Peidhidum", artist: "Hariharan, Harris Jayaraj", duration_sec: 339 },
  { youtubeId: "TmrnYG2FHK4", title: "Aaromale", artist: "Alphons Joseph, A. R. Rahman", duration_sec: 348 },
]);

const boothTelugu = tracks([
  { youtubeId: "cC8AmhPUJPA", title: "Inkem Inkem Kavale", artist: "Sid Sriram", duration_sec: 260 },
  { youtubeId: "OCg6BWlAXSw", title: "Samajavaragamana", artist: "Sid Sriram, S. Thaman", duration_sec: 228 },
  { youtubeId: "2mDCVzruYzQ", title: "Butta Bomma", artist: "Armaan Malik, S. Thaman", duration_sec: 204 },
  { youtubeId: "u_wB6byrl5k", title: "Oo Antava", artist: "Indravathi Chauhan, Devi Sri Prasad", duration_sec: 229 },
  { youtubeId: "wFAj0pW6xX0", title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni, Mangli", duration_sec: 251 },
]);

/** Night state bus — window-seat melancholy, highway wind */
const busHindi = tracks([
  { youtubeId: "6w67NOaRe-w", title: "Ilahi", artist: "Arijit Singh", duration_sec: 204 },
  { youtubeId: "8HDTS80dlr4", title: "Patakha Guddi", artist: "Nooran Sisters, A. R. Rahman", duration_sec: 249 },
  { youtubeId: "ttIKsnxPrMY", title: "Nadaan Parinde", artist: "Mohit Chauhan", duration_sec: 300 },
  { youtubeId: "9yT4F8hzykY", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh, Sapna Awasthi", duration_sec: 416 },
  { youtubeId: "jHNNMj5bNQw", title: "Kabira", artist: "Rekha Bhardwaj, Arijit Singh", duration_sec: 230 },
  { youtubeId: "QYO6AlxiRE4", title: "Subhanallah", artist: "Sreeram, Shilpa Rao", duration_sec: 206 },
]);

const busTamil = tracks([
  { youtubeId: "TmrnYG2FHK4", title: "Aaromale", artist: "Alphons Joseph, A. R. Rahman", duration_sec: 348 },
  { youtubeId: "i65ivV7kGGw", title: "Hosanna", artist: "Vijay Prakash, Suzanne D'Mello, A. R. Rahman", duration_sec: 332 },
  { youtubeId: "FzLpP8VBC6E", title: "Nenjukkul Peidhidum", artist: "Hariharan, Harris Jayaraj", duration_sec: 339 },
  { youtubeId: "OjU54VhRFbU", title: "New York Nagaram", artist: "A. R. Rahman", duration_sec: 335 },
  { youtubeId: "YR12Z8f1Dh8", title: "Why This Kolaveri Di", artist: "Dhanush, Anirudh Ravichander", duration_sec: 241 },
]);

const busTelugu = tracks([
  { youtubeId: "OCg6BWlAXSw", title: "Samajavaragamana", artist: "Sid Sriram, S. Thaman", duration_sec: 228 },
  { youtubeId: "cC8AmhPUJPA", title: "Inkem Inkem Kavale", artist: "Sid Sriram", duration_sec: 260 },
  { youtubeId: "2mDCVzruYzQ", title: "Butta Bomma", artist: "Armaan Malik, S. Thaman", duration_sec: 204 },
  { youtubeId: "4_eEgJhsBMo", title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", duration_sec: 231 },
  { youtubeId: "wFAj0pW6xX0", title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni, Mangli", duration_sec: 251 },
]);

/** Street baraat — dhol, mehndi, shaadi floor */
const baraatHindi = tracks([
  { youtubeId: "-bNwqXvMuB8", title: "Mehndi Laga Ke Rakhna", artist: "Lata Mangeshkar, Udit Narayan", duration_sec: 280 },
  { youtubeId: "cLIQzxgFeNE", title: "Nagada Sang Dhol", artist: "Shreya Ghoshal, Osman Mir", duration_sec: 208 },
  { youtubeId: "udra3Mfw2oo", title: "London Thumakda", artist: "Labh Janjua, Sonu Kakkar, Neha Kakkar", duration_sec: 215 },
  { youtubeId: "caoGNx1LF2Q", title: "Ghagra", artist: "Vishal Dadlani, Reckless", duration_sec: 302 },
  { youtubeId: "0WtRNGubWGA", title: "Balam Pichkari", artist: "Vishal Dadlani, Shalmali Kholgade", duration_sec: 288 },
  { youtubeId: "v7K4vGYL9zI", title: "Khalibali", artist: "Shivam Pathak, Shail Hada", duration_sec: 234 },
]);

const baraatTamil = tracks([
  { youtubeId: "2ogKpj5QuSY", title: "Aaluma Doluma", artist: "Anirudh Ravichander, Badshah", duration_sec: 207 },
  { youtubeId: "x6Q7c9RyMzk", title: "Rowdy Baby", artist: "Dhanush, Sai Pallavi, Yuvan Shankar Raja", duration_sec: 278 },
  { youtubeId: "wsYW9Mm9Ggo", title: "Selfie Pulla", artist: "Vijay, Anirudh Ravichander", duration_sec: 246 },
  { youtubeId: "vxzfsBDx590", title: "Vaathi Coming", artist: "Anirudh Ravichander, Gana Balachandar", duration_sec: 233 },
  { youtubeId: "YR12Z8f1Dh8", title: "Why This Kolaveri Di", artist: "Dhanush, Anirudh Ravichander", duration_sec: 241 },
]);

const baraatTelugu = tracks([
  { youtubeId: "2mDCVzruYzQ", title: "Butta Bomma", artist: "Armaan Malik, S. Thaman", duration_sec: 204 },
  { youtubeId: "wFAj0pW6xX0", title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni, Mangli", duration_sec: 251 },
  { youtubeId: "u_wB6byrl5k", title: "Oo Antava", artist: "Indravathi Chauhan, Devi Sri Prasad", duration_sec: 229 },
  { youtubeId: "4_eEgJhsBMo", title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava", duration_sec: 231 },
  { youtubeId: "OCg6BWlAXSw", title: "Samajavaragamana", artist: "Sid Sriram, S. Thaman", duration_sec: 228 },
]);

export const officialRooms: OfficialRoom[] = [
  {
    slug: "chai-tapri",
    name: "Roadside Chai Tapri",
    tagline:
      "Rain on tin sheet, simmering ginger tea, boiling brass kettle whistle, distant radio play.",
    emoji: "☕",
    accent: "#c47a52",
    gradientA: "#2a1c14",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/chai-tapri.jpg",
    ambienceIds: { default: "F74m01xL2D0", hindi: "F74m01xL2D0" },
    radioEpoch: EPOCH,
    catalogs: { hindi: chaiHindi, tamil: chaiTamil, telugu: chaiTelugu },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "truck-dhaba",
    name: "Highway Truck Dhaba",
    tagline:
      "Highway night air, heavy diesel idling rumble, charpai creaks, loud tape deck playing truck classics.",
    emoji: "🚛",
    accent: "#c47a52",
    gradientA: "#241810",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/truck-dhaba.jpg",
    ambienceIds: { default: "q1YFXYv54YI" },
    radioEpoch: EPOCH + 3600000,
    catalogs: { hindi: dhabaHindi, tamil: dhabaTamil, telugu: dhabaTelugu },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "hostel-midnight",
    name: "Hostel Room After Midnight",
    tagline:
      "Muffled corridor whispers, distant acoustic guitar strums, quiet ceiling fan, flipping notebook pages.",
    emoji: "🛏️",
    accent: "#c47a52",
    gradientA: "#1c1816",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/hostel-midnight.jpg",
    ambienceIds: { default: "8s6uWbBq7T0" },
    radioEpoch: EPOCH + 7200000,
    catalogs: { hindi: hostelHindi, tamil: hostelTamil, telugu: hostelTelugu },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "std-booth",
    name: "Yellow STD/ISD Booth",
    tagline:
      "Glowing yellow signboard, rotary dial clicks, timer pulse, 1 rupee coin drop.",
    emoji: "📞",
    accent: "#c47a52",
    gradientA: "#2a2408",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/std-booth.jpg",
    ambienceIds: { default: "8s6uWbBq7T0" },
    radioEpoch: EPOCH + 10800000,
    catalogs: { hindi: boothHindi, tamil: boothTamil, telugu: boothTelugu },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "night-bus",
    name: "Non-AC Night State Bus",
    tagline:
      "Rumbling diesel engine, open window highway wind, brass whistle blow, conductor ticket punch.",
    emoji: "🚌",
    accent: "#c47a52",
    gradientA: "#1a1612",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/night-bus.jpg",
    ambienceIds: { default: "X2yM9X3U_rU" },
    radioEpoch: EPOCH + 14400000,
    catalogs: { hindi: busHindi, tamil: busTamil, telugu: busTelugu },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "baraat-street",
    name: "Street Baraat Band",
    tagline:
      "Brass trumpet flourishes, deep dhol beats, petromax gas lamp hiss, festive echo.",
    emoji: "🥁",
    accent: "#c47a52",
    gradientA: "#2e140c",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/baraat-street.jpg",
    ambienceIds: { default: "rT7F9rZq2vQ" },
    radioEpoch: EPOCH + 18000000,
    catalogs: { hindi: baraatHindi, tamil: baraatTamil, telugu: baraatTelugu },
    chatEnabled: false,
    battleEnabled: false,
  },
];

export function getOfficialRoom(slug: string): OfficialRoom | undefined {
  return officialRooms.find((room) => room.slug === slug);
}

export function getAmbienceId(
  room: OfficialRoom,
  language: keyof OfficialRoom["catalogs"],
): string {
  return room.ambienceIds[language] ?? room.ambienceIds.default;
}

export function trackToCustomTrack(track: Track, index: number) {
  return {
    youtube_id: track.youtubeId,
    title: track.title,
    artist: track.artist,
    duration_sec: track.duration_sec,
    position: index,
  };
}
