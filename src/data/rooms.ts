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
  { youtubeId: "iSUK1QoK9-E", title: "Pehla Nasha", artist: "Udit Narayan, Sadhana Sargam", duration_sec: 297 },
  { youtubeId: "OMoU0Pfibc4", title: "Tere Naam", artist: "Udit Narayan, Alka Yagnik", duration_sec: 282 },
  { youtubeId: "9u-r5W4WVO4", title: "Tip Tip Barsa Paani", artist: "Alka Yagnik, Udit Narayan", duration_sec: 312 },
  { youtubeId: "bWNkpJdkOj4", title: "Dholna", artist: "Lata Mangeshkar, Udit Narayan", duration_sec: 313 },
  { youtubeId: "hw_HpTI_Wkw", title: "Ho Gaya Hai Tujhko", artist: "Lata Mangeshkar, Udit Narayan", duration_sec: 285 },
  { youtubeId: "s1LozokQjIg", title: "Mere Khwabon Mein", artist: "Lata Mangeshkar", duration_sec: 240 },
  { youtubeId: "OEpFiDKqH7E", title: "Are Re Are", artist: "Lata Mangeshkar, Udit Narayan", duration_sec: 300 },
  { youtubeId: "jBpRItrod-Q", title: "Ruk Ja O Dil Deewane", artist: "Udit Narayan", duration_sec: 312 },
  { youtubeId: "fTauOK8J-U8", title: "Ek Ladki Ko Dekha", artist: "Kumar Sanu", duration_sec: 268 },
  { youtubeId: "XaPnZTljQbI", title: "Teri Chunariya", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 310 },
  { youtubeId: "5SvIuD6wJRI", title: "Do Dil Mil Rahe Hain", artist: "Kumar Sanu", duration_sec: 305 },
  { youtubeId: "W5lusYuAW0s", title: "Pardesi Pardesi", artist: "Udit Narayan, Alka Yagnik, Sapna Awasthi", duration_sec: 340 },
  { youtubeId: "vzWWTX83C_Q", title: "Tujhe Yaad Na Meri Aayi", artist: "Udit Narayan, Alka Yagnik", duration_sec: 318 },
  { youtubeId: "gmXlGQAg400", title: "Koi Mil Gaya", artist: "Udit Narayan, Alka Yagnik", duration_sec: 292 },
  { youtubeId: "RVQsBlI35vw", title: "Mera Dil Bhi Kitna Pagal Hai", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 312 },
  { youtubeId: "3NWMK2MRqIk", title: "Tumsa Koi Pyaara", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 280 },
  { youtubeId: "f0oiheLlFW4", title: "Saaton Janam Main Tere", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 320 },
  { youtubeId: "asVkFSVdJPo", title: "Mujhse Mohabbat Ka Izhaar", artist: "Kumar Sanu, Alka Yagnik", duration_sec: 300 },
  { youtubeId: "96YVQBjrtWE", title: "Zara Sa Jhoom Loon Main", artist: "Asha Bhosle, Abhijeet", duration_sec: 300 },
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
  { youtubeId: "zAT2ydBOwcU", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh, Sapna Awasthi", duration_sec: 416 },
  { youtubeId: "8HDTS80dlr4", title: "Patakha Guddi", artist: "Nooran Sisters, A. R. Rahman", duration_sec: 249 },
  { youtubeId: "30zJZPb-o3Q", title: "Patakha Guddi (Male)", artist: "A. R. Rahman", duration_sec: 358 },
  { youtubeId: "dmwWAZYS-q4", title: "Dekhne Walon Ne", artist: "Udit Narayan, Alka Yagnik", duration_sec: 444 },
  { youtubeId: "XLJCtZK0x5M", title: "Beedi", artist: "Sunidhi Chauhan, Sukhwinder Singh", duration_sec: 240 },
  { youtubeId: "4dsFQFCvVGU", title: "Kajra Re", artist: "Alisha Chinai, Javed Ali, Shankar Mahadevan", duration_sec: 300 },
  { youtubeId: "SS3lIQdKP-A", title: "Masakali", artist: "Mohit Chauhan", duration_sec: 270 },
  { youtubeId: "9a4izd3Rvdw", title: "Challa", artist: "Rabbi Shergill", duration_sec: 311 },
  { youtubeId: "GmCn31pq8i0", title: "Ghanan Ghanan", artist: "A. R. Rahman, Udit Narayan, Alka Yagnik", duration_sec: 280 },
  { youtubeId: "xwwAVRyNmgQ", title: "Jai Ho", artist: "Sukhwinder Singh, A. R. Rahman", duration_sec: 260 },
  { youtubeId: "2uUmHTgT65I", title: "Dhoom Machale", artist: "Sunidhi Chauhan", duration_sec: 240 },
  { youtubeId: "Jn5hsfbhWx4", title: "Munni Badnaam Hui", artist: "Mamta Sharma", duration_sec: 250 },
  { youtubeId: "ZTmF2v59CtI", title: "Sheila Ki Jawani", artist: "Sunidhi Chauhan, Vishal Dadlani", duration_sec: 260 },
  { youtubeId: "zE7Pwgl6sLA", title: "Fevicol Se", artist: "Wajid, Mamta Sharma", duration_sec: 280 },
  { youtubeId: "ruEQPQX90fI", title: "Character Dheela", artist: "Neeraj Shridhar, Amrita Kak", duration_sec: 240 },
  { youtubeId: "l_MyUGq7pgs", title: "Malhari", artist: "Vishal Dadlani", duration_sec: 240 },
  { youtubeId: "_KhQT-LGb-4", title: "Aankh Marey", artist: "Mika Singh, Neha Kakkar, Kumar Sanu", duration_sec: 229 },
  { youtubeId: "HoCwa6gnmM0", title: "Nashe Si Chadh Gayi", artist: "Arijit Singh", duration_sec: 228 },
  { youtubeId: "59mHbOOYY0E", title: "Hookah Bar", artist: "Himesh Reshammiya", duration_sec: 250 },
  { youtubeId: "1tVL11ULjYY", title: "The Humma Song", artist: "A. R. Rahman, Badshah, Tanishk", duration_sec: 180 },
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
  { youtubeId: "jHNNMj5bNQw", title: "Kabira", artist: "Rekha Bhardwaj, Arijit Singh", duration_sec: 230 },
  { youtubeId: "2mWaqsC3U7k", title: "Phir Se Ud Chala", artist: "Mohit Chauhan", duration_sec: 270 },
  { youtubeId: "p9DQINKZxWE", title: "Sadda Haq", artist: "Mohit Chauhan", duration_sec: 300 },
  { youtubeId: "7PzwOiW8-n0", title: "Aal Izz Well", artist: "Sonu Nigam, Shaan, Swanand Kirkire", duration_sec: 273 },
  { youtubeId: "ewvddSUEONQ", title: "Behti Hawa Sa Tha Woh", artist: "Shaan, Shantanu Moitra", duration_sec: 300 },
  { youtubeId: "fSS_R91Nimw", title: "Iktara", artist: "Kavita Seth, Amitabh Bhattacharya", duration_sec: 250 },
  { youtubeId: "ttIKsnxPrMY", title: "Nadaan Parinde", artist: "Mohit Chauhan", duration_sec: 300 },
  { youtubeId: "V056WNg3ECo", title: "Zoobi Doobi", artist: "Sonu Nigam, Shreya Ghoshal", duration_sec: 240 },
  { youtubeId: "2Z0Put0teCM", title: "Senorita", artist: "Farhan Akhtar, Hrithik Roshan, Abhay Deol", duration_sec: 230 },
  { youtubeId: "EiItLWWxgOI", title: "Pani Da Rang", artist: "Ayushmann Khurrana", duration_sec: 240 },
  { youtubeId: "3EfX3kAM1Ks", title: "Yeh Dooriyan", artist: "Mohit Chauhan", duration_sec: 280 },
  { youtubeId: "n0PoVxBMUyE", title: "Jaane Kyun", artist: "Vishal-Shekhar", duration_sec: 240 },
  { youtubeId: "cmMiyZaSELo", title: "Khuda Jaane", artist: "KK, Shilpa Rao", duration_sec: 280 },
  { youtubeId: "JBCx0QyP8VQ", title: "Pehli Nazar Mein", artist: "Atif Aslam", duration_sec: 260 },
  { youtubeId: "rTuxUAuJRyY", title: "Tera Hone Laga Hoon", artist: "Atif Aslam, Alisha Chinai", duration_sec: 260 },
  { youtubeId: "2drIKUOCZxU", title: "Ajab Si", artist: "KK", duration_sec: 250 },
  { youtubeId: "9coA7bcpJII", title: "Dil Chahta Hai", artist: "Shankar Mahadevan", duration_sec: 268 },
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
  { youtubeId: "IJq0yyWug1k", title: "Tum Hi Ho", artist: "Arijit Singh", duration_sec: 262 },
  { youtubeId: "6SGRn9OHtFY", title: "Agar Tum Saath Ho", artist: "Arijit Singh, Alka Yagnik", duration_sec: 341 },
  { youtubeId: "-Hb2DeHvvEg", title: "Tujhe Bhula Diya", artist: "Mohit Chauhan, Shekhar Ravjiani", duration_sec: 258 },
  { youtubeId: "g0eO74UmRBs", title: "Kal Ho Naa Ho", artist: "Sonu Nigam", duration_sec: 300 },
  { youtubeId: "284Ov7ysmfA", title: "Channa Mereya", artist: "Arijit Singh", duration_sec: 289 },
  { youtubeId: "H2f7MZaw3Yo", title: "Samjhawan", artist: "Arijit Singh, Shreya Ghoshal", duration_sec: 269 },
  { youtubeId: "cs1e0fRyI18", title: "Hawayein", artist: "Arijit Singh", duration_sec: 289 },
  { youtubeId: "VOLKJJvfAbg", title: "Bekhayali", artist: "Sachet Tandon", duration_sec: 250 },
  { youtubeId: "zlt38OOqwDc", title: "Raabta", artist: "Arijit Singh", duration_sec: 240 },
  { youtubeId: "jAUSF4_ygJg", title: "Aas Paas Hai Khuda", artist: "Rahat Fateh Ali Khan", duration_sec: 280 },
  { youtubeId: "MJyKN-8UncM", title: "Shayad", artist: "Arijit Singh", duration_sec: 240 },
  { youtubeId: "Qdz5n1Xe5Qo", title: "Tera Ban Jaunga", artist: "Akhil Sachdeva, Tulsi Kumar", duration_sec: 230 },
  { youtubeId: "1I2aa1sf5NA", title: "Enna Sona", artist: "Arijit Singh", duration_sec: 220 },
  { youtubeId: "FJ55SHCzt88", title: "Humdard", artist: "Arijit Singh", duration_sec: 260 },
  { youtubeId: "2ltGXfmI6mk", title: "Muskurane", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "eHRrZ5DQCV4", title: "Sunn Raha Hai", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "pkzOBl1p7y4", title: "Jeene Laga Hoon", artist: "Atif Aslam, Shreya Ghoshal", duration_sec: 240 },
  { youtubeId: "5gwy0gcjIkI", title: "Tere Sang Yaara", artist: "Atif Aslam", duration_sec: 250 },
  { youtubeId: "-fWejtOkCYs", title: "Hamari Adhuri Kahani", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "6FURuLYrR_Q", title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", duration_sec: 270 },
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
  { youtubeId: "QYO6AlxiRE4", title: "Subhanallah", artist: "Sreeram, Shilpa Rao", duration_sec: 206 },
  { youtubeId: "k6BnSIs3XUQ", title: "Phir Le Aya Dil", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "4tiVPuLbbHg", title: "Yeh Jo Des Hai Tera", artist: "A. R. Rahman", duration_sec: 300 },
  { youtubeId: "g62J-8nV5FI", title: "Challa", artist: "Romy, Vivek Hariharan", duration_sec: 311 },
  { youtubeId: "AEIVhBS6baE", title: "Gerua", artist: "Arijit Singh, Antara Mitra", duration_sec: 280 },
  { youtubeId: "nJZcbidTutE", title: "Sooraj Dooba Hain", artist: "Arijit Singh, Aditi Singh Sharma", duration_sec: 230 },
  { youtubeId: "7mTDBsdfw88", title: "Safarnama", artist: "Lucky Ali", duration_sec: 240 },
  { youtubeId: "FFpgYjL2aJo", title: "Luka Chuppi", artist: "Lata Mangeshkar, A. R. Rahman", duration_sec: 300 },
  { youtubeId: "ru_5PA8cwkE", title: "Mitwa", artist: "Shafqat Amanat Ali, Shankar Mahadevan", duration_sec: 361 },
  { youtubeId: "Ezsb5afVXQQ", title: "Ud-daa Punjab", artist: "Vishal Dadlani, Amit Trivedi", duration_sec: 240 },
  { youtubeId: "cyKZXbxx2lc", title: "Ikk Kudi", artist: "Shahid Mallya", duration_sec: 250 },
  { youtubeId: "BKx_B1VZ2kw", title: "Ae Watan", artist: "Sunidhi Chauhan", duration_sec: 230 },
  { youtubeId: "56ZzM4mz4yY", title: "Dil Dhadakne Do", artist: "Shankar-Ehsaan-Loy", duration_sec: 240 },
  { youtubeId: "R0XjwtP_iTY", title: "Khaabon Ke Parinday", artist: "Mohit Chauhan, Alyssa Mendonsa", duration_sec: 240 },
  { youtubeId: "GtNrQy90Ih4", title: "Saibo", artist: "Shreya Ghoshal, Tochi Raina", duration_sec: 240 },
  { youtubeId: "neIYLnOHkpw", title: "Bhaag Milkha Bhaag", artist: "Arif Lohar, Shankar Mahadevan", duration_sec: 280 },
  { youtubeId: "bnqLzCsffwY", title: "Chak De India", artist: "Sukhwinder Singh", duration_sec: 270 },
  { youtubeId: "YKcmMmJlKNk", title: "Manjha", artist: "Mohan Kannan", duration_sec: 260 },
  { youtubeId: "iEJPDYrLtsI", title: "Ishq Shava", artist: "Raghav Mathur, Shilpa Rao", duration_sec: 250 },
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

/** Gujarati Garba — dandiya, dhol, Navratri night */
const baraatHindi = tracks([
  { youtubeId: "4a25J3p0kVI", title: "Dholi Taro", artist: "Kavita Krishnamurthy, Vinod Rathod", duration_sec: 280 },
  { youtubeId: "3X7x4Ye-tqo", title: "Nagada Sang Dhol", artist: "Shreya Ghoshal, Osman Mir", duration_sec: 208 },
  { youtubeId: "xJsvTCMg0qA", title: "Mor Bani Thanghat Kare", artist: "Osman Mir, Aditi Paul", duration_sec: 240 },
  { youtubeId: "BzcKINXf-rs", title: "Chogada", artist: "Darshan Raval, Asees Kaur", duration_sec: 250 },
  { youtubeId: "rz1hAo3Hiy4", title: "Dholida", artist: "Neha Kakkar, Udit Narayan, Palak Muchhal", duration_sec: 240 },
  { youtubeId: "msSE3WK243M", title: "Sanedo", artist: "Darshan Raval, Raja Hasan", duration_sec: 230 },
  { youtubeId: "9LtJYw1eY30", title: "Kamariya", artist: "Darshan Raval, Aastha Gill", duration_sec: 200 },
  { youtubeId: "Rbz1qFlRL_Y", title: "Maine Payal Hai Chhankai", artist: "Falguni Pathak", duration_sec: 280 },
  { youtubeId: "Xna3I11v9Vs", title: "Chudi Jo Khanki", artist: "Falguni Pathak", duration_sec: 260 },
  { youtubeId: "4V2SU8LMXxo", title: "Meri Chunar Udd Udd Jaye", artist: "Falguni Pathak", duration_sec: 270 },
  { youtubeId: "PUKYPjz6g-U", title: "Yaad Piya Ki Aane Lagi", artist: "Falguni Pathak", duration_sec: 280 },
  { youtubeId: "hNAvRwuamfA", title: "Indhana Winva", artist: "Falguni Pathak", duration_sec: 260 },
  { youtubeId: "tTfF5klskmo", title: "Radha Ne Shyam Mali Jashe", artist: "Sachin-Jigar, Shruti Pathak", duration_sec: 240 },
  { youtubeId: "6MpjP4w8Gtk", title: "Tara Vina Shyam", artist: "Atul Purohit", duration_sec: 300 },
  { youtubeId: "pMFT_6AF6vA", title: "Ude Re Gulaal", artist: "Kailash Kher", duration_sec: 280 },
  { youtubeId: "2pHEAyOCQx4", title: "Jai Jai Garvi Gujarat", artist: "Parthiv Gohil", duration_sec: 240 },
  { youtubeId: "ccqg6e2rfLU", title: "Gori Radha Ne Kalo Kaan", artist: "Kirtidan Gadhvi", duration_sec: 240 },
  { youtubeId: "Jv8KRwF1zQs", title: "Moti Veraana", artist: "Amit Trivedi, Osman Mir", duration_sec: 250 },
  { youtubeId: "rH9D6EErmWw", title: "Jantar Vage", artist: "Kirtidan Gadhvi", duration_sec: 240 },
  { youtubeId: "4mKvTgpcrLI", title: "He Odhaji", artist: "Aishwarya Majmudar", duration_sec: 240 },
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

/** Rainy Tokyo window — Ghibli, Nujabes beats, piano. No vocals. */
const japanLofi = tracks([
  { youtubeId: "qYcoJpqCha4", title: "aruarian dance", artist: "Nujabes", duration_sec: 250 },
  { youtubeId: "IXa0kLOKfwQ", title: "Counting Stars", artist: "Nujabes", duration_sec: 247 },
  { youtubeId: "HkHaXlMnMCo", title: "Another Reflection", artist: "Nujabes", duration_sec: 225 },
  { youtubeId: "4XMQ_IkErYg", title: "Horizon", artist: "Nujabes", duration_sec: 240 },
  { youtubeId: "FWMe6S2CEpc", title: "Beat laments the world", artist: "Nujabes", duration_sec: 260 },
  { youtubeId: "d0IOz7xMGZY", title: "One Day", artist: "Uyama Hiroto", duration_sec: 240 },
  { youtubeId: "TK1Ij_-mank", title: "One Summer's Day", artist: "Joe Hisaishi", duration_sec: 300 },
  { youtubeId: "f7SS57LFPco", title: "Merry-Go-Round of Life", artist: "Joe Hisaishi", duration_sec: 311 },
  { youtubeId: "BF3JGIvK71I", title: "My Neighbour Totoro", artist: "Joe Hisaishi", duration_sec: 248 },
  { youtubeId: "pR4iCWB-VVQ", title: "A Town with an Ocean View", artist: "Joe Hisaishi", duration_sec: 240 },
  { youtubeId: "l0GN40EL1VU", title: "Summer", artist: "Joe Hisaishi", duration_sec: 300 },
  { youtubeId: "gYBsmbJrXQ4", title: "Mother's Broom", artist: "Joe Hisaishi", duration_sec: 200 },
  { youtubeId: "MZgBjQFMPvk", title: "Path of the Wind", artist: "Joe Hisaishi", duration_sec: 227 },
  { youtubeId: "z45xGGTo3J0", title: "energy flow", artist: "Ryuichi Sakamoto", duration_sec: 311 },
  { youtubeId: "LGs_vGt0MY8", title: "Merry Christmas, Mr. Lawrence", artist: "Ryuichi Sakamoto", duration_sec: 280 },
  { youtubeId: "uxTdTaNIUxo", title: "Avril 14th", artist: "Aphex Twin", duration_sec: 120 },
]);

/** Quiet table, rain on the pane — instrumental beats and chill electronica */
const cafeLofi = tracks([
  { youtubeId: "dm4tkSNKfFI", title: "Awake", artist: "Tycho", duration_sec: 280 },
  { youtubeId: "3H4y5vIxw4c", title: "Montana", artist: "Tycho", duration_sec: 320 },
  { youtubeId: "SDNA934EEVk", title: "A Walk", artist: "Tycho", duration_sec: 320 },
  { youtubeId: "IuGO6WHcruU", title: "Hours", artist: "Tycho", duration_sec: 340 },
  { youtubeId: "aBkTkxKDduc", title: "Sweden", artist: "C418", duration_sec: 216 },
  { youtubeId: "mukiMaOSLEs", title: "Wet Hands", artist: "C418", duration_sec: 90 },
  { youtubeId: "DZ47H84Bc_Q", title: "Mice on Venus", artist: "C418", duration_sec: 281 },
  { youtubeId: "laZusNy8QiY", title: "Haggstrom", artist: "C418", duration_sec: 200 },
  { youtubeId: "UhWjWdlnmEw", title: "Clark", artist: "C418", duration_sec: 190 },
  { youtubeId: "TCd6PfxOy0Y", title: "Veridis Quo", artist: "Daft Punk", duration_sec: 345 },
  { youtubeId: "Js4CLSsH--c", title: "People Everywhere (Still Alive)", artist: "Khruangbin", duration_sec: 240 },
  { youtubeId: "oxoqm05c7yA", title: "Sun", artist: "憂鬱", duration_sec: 240 },
  { youtubeId: "ulj5UJ5GHvE", title: "Alberto Balsalm", artist: "Aphex Twin", duration_sec: 312 },
  { youtubeId: "qYcoJpqCha4", title: "aruarian dance", artist: "Nujabes", duration_sec: 250 },
  { youtubeId: "IXa0kLOKfwQ", title: "Counting Stars", artist: "Nujabes", duration_sec: 247 },
  { youtubeId: "HkHaXlMnMCo", title: "Another Reflection", artist: "Nujabes", duration_sec: 225 },
]);

/** Monsoon balcony — rain on the rail, fan creak, distant thunder, soft Hindi */
const monsoonHindi = tracks([
  { youtubeId: "9u-r5W4WVO4", title: "Tip Tip Barsa Paani", artist: "Alka Yagnik, Udit Narayan", duration_sec: 312 },
  { youtubeId: "6SGRn9OHtFY", title: "Agar Tum Saath Ho", artist: "Arijit Singh, Alka Yagnik", duration_sec: 341 },
  { youtubeId: "IJq0yyWug1k", title: "Tum Hi Ho", artist: "Arijit Singh", duration_sec: 262 },
  { youtubeId: "H2f7MZaw3Yo", title: "Samjhawan", artist: "Arijit Singh, Shreya Ghoshal", duration_sec: 269 },
  { youtubeId: "cs1e0fRyI18", title: "Hawayein", artist: "Arijit Singh", duration_sec: 289 },
  { youtubeId: "284Ov7ysmfA", title: "Channa Mereya", artist: "Arijit Singh", duration_sec: 289 },
  { youtubeId: "g0eO74UmRBs", title: "Kal Ho Naa Ho", artist: "Sonu Nigam", duration_sec: 300 },
  { youtubeId: "2ltGXfmI6mk", title: "Muskurane", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "MJyKN-8UncM", title: "Shayad", artist: "Arijit Singh", duration_sec: 240 },
  { youtubeId: "k6BnSIs3XUQ", title: "Phir Le Aya Dil", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "zlt38OOqwDc", title: "Raabta", artist: "Arijit Singh", duration_sec: 240 },
  { youtubeId: "VOLKJJvfAbg", title: "Bekhayali", artist: "Sachet Tandon", duration_sec: 250 },
  { youtubeId: "vzWWTX83C_Q", title: "Tujhe Yaad Na Meri Aayi", artist: "Udit Narayan, Alka Yagnik", duration_sec: 318 },
  { youtubeId: "5SvIuD6wJRI", title: "Do Dil Mil Rahe Hain", artist: "Kumar Sanu", duration_sec: 305 },
  { youtubeId: "Qdz5n1Xe5Qo", title: "Tera Ban Jaunga", artist: "Akhil Sachdeva, Tulsi Kumar", duration_sec: 230 },
  { youtubeId: "eHRrZ5DQCV4", title: "Sunn Raha Hai", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "-fWejtOkCYs", title: "Hamari Adhuri Kahani", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "AEIVhBS6baE", title: "Gerua", artist: "Arijit Singh, Antara Mitra", duration_sec: 280 },
  { youtubeId: "-Hb2DeHvvEg", title: "Tujhe Bhula Diya", artist: "Mohit Chauhan, Shekhar Ravjiani", duration_sec: 258 },
  { youtubeId: "6FURuLYrR_Q", title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", duration_sec: 270 },
]);

/** Maidan floodlights — stadium anthems, chart bangers, last-over energy */
const cricketHindi = tracks([
  { youtubeId: "bnqLzCsffwY", title: "Chak De India", artist: "Sukhwinder Singh", duration_sec: 270 },
  { youtubeId: "xwwAVRyNmgQ", title: "Jai Ho", artist: "Sukhwinder Singh, A. R. Rahman", duration_sec: 260 },
  { youtubeId: "l_MyUGq7pgs", title: "Malhari", artist: "Vishal Dadlani", duration_sec: 240 },
  { youtubeId: "2uUmHTgT65I", title: "Dhoom Machale", artist: "Sunidhi Chauhan", duration_sec: 240 },
  { youtubeId: "neIYLnOHkpw", title: "Bhaag Milkha Bhaag", artist: "Arif Lohar, Shankar Mahadevan", duration_sec: 280 },
  { youtubeId: "HoCwa6gnmM0", title: "Nashe Si Chadh Gayi", artist: "Arijit Singh", duration_sec: 228 },
  { youtubeId: "ZTmF2v59CtI", title: "Sheila Ki Jawani", artist: "Sunidhi Chauhan, Vishal Dadlani", duration_sec: 260 },
  { youtubeId: "Jn5hsfbhWx4", title: "Munni Badnaam Hui", artist: "Mamta Sharma", duration_sec: 250 },
  { youtubeId: "zAT2ydBOwcU", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh, Sapna Awasthi", duration_sec: 416 },
  { youtubeId: "4dsFQFCvVGU", title: "Kajra Re", artist: "Alisha Chinai, Javed Ali, Shankar Mahadevan", duration_sec: 300 },
  { youtubeId: "SS3lIQdKP-A", title: "Masakali", artist: "Mohit Chauhan", duration_sec: 270 },
  { youtubeId: "59mHbOOYY0E", title: "Hookah Bar", artist: "Himesh Reshammiya", duration_sec: 250 },
  { youtubeId: "_KhQT-LGb-4", title: "Aankh Marey", artist: "Mika Singh, Neha Kakkar, Kumar Sanu", duration_sec: 229 },
  { youtubeId: "ruEQPQX90fI", title: "Character Dheela", artist: "Neeraj Shridhar, Amrita Kak", duration_sec: 240 },
  { youtubeId: "XLJCtZK0x5M", title: "Beedi", artist: "Sunidhi Chauhan, Sukhwinder Singh", duration_sec: 240 },
  { youtubeId: "zE7Pwgl6sLA", title: "Fevicol Se", artist: "Wajid, Mamta Sharma", duration_sec: 280 },
  { youtubeId: "nJZcbidTutE", title: "Sooraj Dooba Hain", artist: "Arijit Singh, Aditi Singh Sharma", duration_sec: 230 },
  { youtubeId: "1tVL11ULjYY", title: "The Humma Song", artist: "A. R. Rahman, Badshah, Tanishk", duration_sec: 180 },
  { youtubeId: "8HDTS80dlr4", title: "Patakha Guddi", artist: "Nooran Sisters, A. R. Rahman", duration_sec: 249 },
  { youtubeId: "dmwWAZYS-q4", title: "Dekhne Walon Ne", artist: "Udit Narayan, Alka Yagnik", duration_sec: 444 },
]);

/** Platform lamp glow — travel songs, waiting on the line, night train air */
const railwayHindi = tracks([
  { youtubeId: "6w67NOaRe-w", title: "Ilahi", artist: "Arijit Singh", duration_sec: 204 },
  { youtubeId: "AEIVhBS6baE", title: "Gerua", artist: "Arijit Singh, Antara Mitra", duration_sec: 280 },
  { youtubeId: "k6BnSIs3XUQ", title: "Phir Le Aya Dil", artist: "Arijit Singh", duration_sec: 280 },
  { youtubeId: "4tiVPuLbbHg", title: "Yeh Jo Des Hai Tera", artist: "A. R. Rahman", duration_sec: 300 },
  { youtubeId: "g62J-8nV5FI", title: "Challa", artist: "Romy, Vivek Hariharan", duration_sec: 311 },
  { youtubeId: "9a4izd3Rvdw", title: "Challa", artist: "Rabbi Shergill", duration_sec: 311 },
  { youtubeId: "7mTDBsdfw88", title: "Safarnama", artist: "Lucky Ali", duration_sec: 240 },
  { youtubeId: "8HDTS80dlr4", title: "Patakha Guddi", artist: "Nooran Sisters, A. R. Rahman", duration_sec: 249 },
  { youtubeId: "ru_5PA8cwkE", title: "Mitwa", artist: "Shafqat Amanat Ali, Shankar Mahadevan", duration_sec: 361 },
  { youtubeId: "FFpgYjL2aJo", title: "Luka Chuppi", artist: "Lata Mangeshkar, A. R. Rahman", duration_sec: 300 },
  { youtubeId: "56ZzM4mz4yY", title: "Dil Dhadakne Do", artist: "Shankar-Ehsaan-Loy", duration_sec: 240 },
  { youtubeId: "R0XjwtP_iTY", title: "Khaabon Ke Parinday", artist: "Mohit Chauhan, Alyssa Mendonsa", duration_sec: 240 },
  { youtubeId: "YKcmMmJlKNk", title: "Manjha", artist: "Mohan Kannan", duration_sec: 260 },
  { youtubeId: "iEJPDYrLtsI", title: "Ishq Shava", artist: "Raghav Mathur, Shilpa Rao", duration_sec: 250 },
  { youtubeId: "QYO6AlxiRE4", title: "Subhanallah", artist: "Sreeram, Shilpa Rao", duration_sec: 206 },
  { youtubeId: "BKx_B1VZ2kw", title: "Ae Watan", artist: "Sunidhi Chauhan", duration_sec: 230 },
  { youtubeId: "W5lusYuAW0s", title: "Pardesi Pardesi", artist: "Udit Narayan, Alka Yagnik, Sapna Awasthi", duration_sec: 340 },
  { youtubeId: "GtNrQy90Ih4", title: "Saibo", artist: "Shreya Ghoshal, Tochi Raina", duration_sec: 240 },
  { youtubeId: "cyKZXbxx2lc", title: "Ikk Kudi", artist: "Shahid Mallya", duration_sec: 250 },
  { youtubeId: "Ezsb5afVXQQ", title: "Ud-daa Punjab", artist: "Vishal Dadlani, Amit Trivedi", duration_sec: 240 },
]);

/** Desk lamp, rain on glass — piano and study beats. No vocals. */
const studyLofi = tracks([
  { youtubeId: "sR2W2scFS4Y", title: "Nuvole Bianche", artist: "Ludovico Einaudi", duration_sec: 358 },
  { youtubeId: "1e9B31FLT-s", title: "Experience", artist: "Ludovico Einaudi", duration_sec: 327 },
  { youtubeId: "TCGvZCbcE0Q", title: "Divenire", artist: "Ludovico Einaudi", duration_sec: 402 },
  { youtubeId: "5LRwYKpV-6A", title: "Fly", artist: "Ludovico Einaudi", duration_sec: 260 },
  { youtubeId: "7maJOI3QMu0", title: "River Flows in You", artist: "Yiruma", duration_sec: 218 },
  { youtubeId: "imGaOIm5HOk", title: "Kiss the Rain", artist: "Yiruma", duration_sec: 240 },
  { youtubeId: "PeU3LS_s03I", title: "May Be", artist: "Yiruma", duration_sec: 240 },
  { youtubeId: "z45xGGTo3J0", title: "energy flow", artist: "Ryuichi Sakamoto", duration_sec: 311 },
  { youtubeId: "InyT9Gyoz_o", title: "On The Nature Of Daylight", artist: "Max Richter", duration_sec: 372 },
  { youtubeId: "S-Xm7s9eGxU", title: "Gymnopédie No.1", artist: "Erik Satie", duration_sec: 200 },
  { youtubeId: "fZrm9h3JRGs", title: "Clair de lune", artist: "Claude Debussy", duration_sec: 300 },
  { youtubeId: "mukiMaOSLEs", title: "Wet Hands", artist: "C418", duration_sec: 90 },
  { youtubeId: "aBkTkxKDduc", title: "Sweden", artist: "C418", duration_sec: 216 },
  { youtubeId: "uxTdTaNIUxo", title: "Avril 14th", artist: "Aphex Twin", duration_sec: 120 },
  { youtubeId: "TK1Ij_-mank", title: "One Summer's Day", artist: "Joe Hisaishi", duration_sec: 300 },
  { youtubeId: "f7SS57LFPco", title: "Merry-Go-Round of Life", artist: "Joe Hisaishi", duration_sec: 311 },
]);

/** Wet windshield streaks — instrumental synthwave and night electronica */
const nightDrive = tracks([
  { youtubeId: "8GW6sLrK40k", title: "Resonance", artist: "HOME", duration_sec: 213 },
  { youtubeId: "mbMoY1dxbEY", title: "We're Finally Landing", artist: "HOME", duration_sec: 142 },
  { youtubeId: "sG2yDNSSwaY", title: "Before The Night", artist: "HOME", duration_sec: 240 },
  { youtubeId: "EL_LaR7iZqM", title: "Decay", artist: "HOME", duration_sec: 240 },
  { youtubeId: "rDBbaGCCIhk", title: "Accelerated", artist: "Miami Nights 1984", duration_sec: 235 },
  { youtubeId: "5dNP-a-XXx0", title: "Overdrive", artist: "Lazerhawk", duration_sec: 240 },
  { youtubeId: "KdPstczVF6A", title: "Journeys", artist: "Timecop1983", duration_sec: 240 },
  { youtubeId: "er416Ad3R1g", title: "Turbo Killer", artist: "Carpenter Brut", duration_sec: 220 },
  { youtubeId: "L93-7vRfxNs", title: "Aerodynamic", artist: "Daft Punk", duration_sec: 213 },
  { youtubeId: "CqZgd6-xQl8", title: "Voyager", artist: "Daft Punk", duration_sec: 227 },
  { youtubeId: "TCd6PfxOy0Y", title: "Veridis Quo", artist: "Daft Punk", duration_sec: 345 },
  { youtubeId: "xBTqRd09y3E", title: "Nightvision", artist: "Daft Punk", duration_sec: 104 },
  { youtubeId: "f9cKyVJuV2Y", title: "Solar Sailer", artist: "Daft Punk", duration_sec: 162 },
  { youtubeId: "mqgEYRtWMJU", title: "The Son of Flynn", artist: "Daft Punk", duration_sec: 95 },
  { youtubeId: "3H4y5vIxw4c", title: "Montana", artist: "Tycho", duration_sec: 320 },
  { youtubeId: "dm4tkSNKfFI", title: "Awake", artist: "Tycho", duration_sec: 280 },
]);

/** Rain on glass — piano, ambient, pure instrumental */
const rainyWindow = tracks([
  { youtubeId: "sR2W2scFS4Y", title: "Nuvole Bianche", artist: "Ludovico Einaudi", duration_sec: 358 },
  { youtubeId: "1e9B31FLT-s", title: "Experience", artist: "Ludovico Einaudi", duration_sec: 327 },
  { youtubeId: "InyT9Gyoz_o", title: "On The Nature Of Daylight", artist: "Max Richter", duration_sec: 372 },
  { youtubeId: "z45xGGTo3J0", title: "energy flow", artist: "Ryuichi Sakamoto", duration_sec: 311 },
  { youtubeId: "S-Xm7s9eGxU", title: "Gymnopédie No.1", artist: "Erik Satie", duration_sec: 200 },
  { youtubeId: "fZrm9h3JRGs", title: "Clair de lune", artist: "Claude Debussy", duration_sec: 300 },
  { youtubeId: "mukiMaOSLEs", title: "Wet Hands", artist: "C418", duration_sec: 90 },
  { youtubeId: "aBkTkxKDduc", title: "Sweden", artist: "C418", duration_sec: 216 },
  { youtubeId: "DZ47H84Bc_Q", title: "Mice on Venus", artist: "C418", duration_sec: 281 },
  { youtubeId: "uxTdTaNIUxo", title: "Avril 14th", artist: "Aphex Twin", duration_sec: 120 },
  { youtubeId: "7maJOI3QMu0", title: "River Flows in You", artist: "Yiruma", duration_sec: 218 },
  { youtubeId: "imGaOIm5HOk", title: "Kiss the Rain", artist: "Yiruma", duration_sec: 240 },
  { youtubeId: "TCGvZCbcE0Q", title: "Divenire", artist: "Ludovico Einaudi", duration_sec: 402 },
  { youtubeId: "5LRwYKpV-6A", title: "Fly", artist: "Ludovico Einaudi", duration_sec: 260 },
  { youtubeId: "TK1Ij_-mank", title: "One Summer's Day", artist: "Joe Hisaishi", duration_sec: 300 },
  { youtubeId: "qYcoJpqCha4", title: "aruarian dance", artist: "Nujabes", duration_sec: 250 },
]);

/** Current chart heat for the last set */
const gymHits = tracks([
  { youtubeId: "ekr2nIex040", title: "APT.", artist: "ROSÉ, Bruno Mars", duration_sec: 169 },
  { youtubeId: "eVli-tstM5E", title: "Espresso", artist: "Sabrina Carpenter", duration_sec: 175 },
  { youtubeId: "cF1Na4AIecM", title: "Please Please Please", artist: "Sabrina Carpenter", duration_sec: 186 },
  { youtubeId: "Zf1d8SGuxfs", title: "Million Dollar Baby", artist: "Tommy Richman", duration_sec: 167 },
  { youtubeId: "H58vbez_m4E", title: "Not Like Us", artist: "Kendrick Lamar", duration_sec: 274 },
  { youtubeId: "tvTRZJ-4EyI", title: "HUMBLE.", artist: "Kendrick Lamar", duration_sec: 177 },
  { youtubeId: "NLZRYQMLDW4", title: "DNA.", artist: "Kendrick Lamar", duration_sec: 185 },
  { youtubeId: "6ONRf7h3Mdk", title: "SICKO MODE", artist: "Travis Scott, Drake", duration_sec: 312 },
  { youtubeId: "To4SWGZkEPk", title: "greedy", artist: "Tate McRae", duration_sec: 131 },
  { youtubeId: "m4_9TFeMfJE", title: "Paint The Town Red", artist: "Doja Cat", duration_sec: 231 },
  { youtubeId: "suAR1PYFNYA", title: "Houdini", artist: "Dua Lipa", duration_sec: 185 },
  { youtubeId: "PsO6ZnUZI0g", title: "Stronger", artist: "Kanye West", duration_sec: 311 },
  { youtubeId: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd", duration_sec: 200 },
  { youtubeId: "XXYlFuWEuKI", title: "Save Your Tears", artist: "The Weeknd", duration_sec: 215 },
  { youtubeId: "7wtfhZwyrcc", title: "Believer", artist: "Imagine Dragons", duration_sec: 204 },
  { youtubeId: "fKopy74weus", title: "Thunder", artist: "Imagine Dragons", duration_sec: 187 },
]);

export const officialRooms: OfficialRoom[] = [
  {
    slug: "japanese-lofi",
    name: "Japanese Lofi",
    tagline:
      "Rain on a Tokyo window, vinyl crackle — Ghibli piano and Nujabes beats, no vocals.",
    emoji: "🎧",
    accent: "#c47a52",
    gradientA: "#1a1418",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/japan-lofi.jpg",
    ambienceIds: { default: "8s6uWbBq7T0" },
    radioEpoch: EPOCH + 21600000,
    catalogs: { hindi: japanLofi, tamil: japanLofi, telugu: japanLofi },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "cafe-lofi",
    name: "Cafe Lofi",
    tagline:
      "Espresso steam, rain on glass — instrumental beats and chill electronica, no vocals.",
    emoji: "🌧️",
    accent: "#c47a52",
    gradientA: "#1c1612",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/cafe-lofi.jpg",
    ambienceIds: { default: "gaGrHUekGrc" },
    radioEpoch: EPOCH + 25200000,
    catalogs: { hindi: cafeLofi, tamil: cafeLofi, telugu: cafeLofi },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "gym-room",
    name: "Gym Room",
    tagline:
      "Iron plates, chalk in the air, current chart heat for the last set.",
    emoji: "🏋️",
    accent: "#c47a52",
    gradientA: "#1a120e",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/gym-room.jpg",
    ambienceIds: { default: "q1YFXYv54YI" },
    radioEpoch: EPOCH + 28800000,
    catalogs: { hindi: gymHits, tamil: gymHits, telugu: gymHits },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "study-lofi",
    name: "Study Lofi",
    tagline:
      "Desk lamp glow, rain on the pane — piano and study beats, no vocals.",
    emoji: "📚",
    accent: "#c47a52",
    gradientA: "#1a1614",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/study-lofi.jpg",
    ambienceIds: { default: "8s6uWbBq7T0" },
    radioEpoch: EPOCH + 32400000,
    catalogs: { hindi: studyLofi, tamil: studyLofi, telugu: studyLofi },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "night-drive",
    name: "Night Drive",
    tagline:
      "Wet windshield, dashboard glow — instrumental synthwave for the night highway.",
    emoji: "🌃",
    accent: "#c47a52",
    gradientA: "#121820",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/night-drive.jpg",
    ambienceIds: { default: "X2yM9X3U_rU" },
    radioEpoch: EPOCH + 36000000,
    catalogs: { hindi: nightDrive, tamil: nightDrive, telugu: nightDrive },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "rainy-window",
    name: "Rainy Window",
    tagline:
      "Droplets on glass, streetlights blurred — piano and ambient instrumentals, no vocals.",
    emoji: "🪟",
    accent: "#c47a52",
    gradientA: "#161418",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/rainy-window.jpg",
    ambienceIds: { default: "gaGrHUekGrc" },
    radioEpoch: EPOCH + 39600000,
    catalogs: { hindi: rainyWindow, tamil: rainyWindow, telugu: rainyWindow },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "monsoon-balcony",
    name: "Monsoon Balcony",
    tagline:
      "Rain on the railing, ceiling fan creak, distant thunder — melancholy Hindi on a wet night.",
    emoji: "☔",
    accent: "#c47a52",
    gradientA: "#1c1a16",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/monsoon-balcony.jpg",
    ambienceIds: { default: "F74m01xL2D0" },
    radioEpoch: EPOCH + 43200000,
    catalogs: { hindi: monsoonHindi, tamil: monsoonHindi, telugu: monsoonHindi },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "cricket-ground",
    name: "Cricket Ground",
    tagline:
      "Maidan floodlights, plastic chairs, boundary rope — stadium anthems and chart bangers.",
    emoji: "🏏",
    accent: "#c47a52",
    gradientA: "#1e1810",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/cricket-ground.jpg",
    ambienceIds: { default: "rT7F9rZq2vQ" },
    radioEpoch: EPOCH + 46800000,
    catalogs: { hindi: cricketHindi, tamil: cricketHindi, telugu: cricketHindi },
    chatEnabled: false,
    battleEnabled: false,
  },
  {
    slug: "railway-platform",
    name: "Railway Platform",
    tagline:
      "Yellow station lamp, wet tracks, steam haze — travel songs and waiting-on-the-line Hindi.",
    emoji: "🚉",
    accent: "#c47a52",
    gradientA: "#1a1610",
    gradientB: "#14110f",
    imageUrl: "/images/rooms/railway-platform.jpg",
    ambienceIds: { default: "X2yM9X3U_rU" },
    radioEpoch: EPOCH + 50400000,
    catalogs: { hindi: railwayHindi, tamil: railwayHindi, telugu: railwayHindi },
    chatEnabled: false,
    battleEnabled: false,
  },
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
    name: "Gujarati Garba",
    tagline:
      "Dandiya sticks clack, dhol thunder, manjira shimmer, temple-light Navratri night.",
    emoji: "🪔",
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
