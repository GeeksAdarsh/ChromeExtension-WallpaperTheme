const NAME_KEY = "quiet-stars-name";
const MARK_KEY = "quiet-stars-bookmarks";
const SHOW_KEY = "quiet-stars-bookmarks-visible";
const NOTE_KEY = "quiet-stars-note";
const NOTE_OPEN_KEY = "quiet-stars-note-open";
const CITY_OPEN_KEY = "quiet-stars-city-open";
const CITY_KEY = "quiet-stars-city";
const WEATHER_KEY = "quiet-stars-weather";
const FOCUS_KEY = "quiet-stars-focus";
const PLACE_KEY = "quiet-stars-places";
const WALL_KEY = "quiet-stars-wall";

const memory = Object.create(null);
const STORE_KEYS = [
  NAME_KEY,
  MARK_KEY,
  SHOW_KEY,
  NOTE_KEY,
  NOTE_OPEN_KEY,
  CITY_OPEN_KEY,
  CITY_KEY,
  WEATHER_KEY,
  FOCUS_KEY,
  PLACE_KEY,
  WALL_KEY,
];

function stored(key) {
  if (Object.prototype.hasOwnProperty.call(memory, key)) return memory[key];
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function keep(key, value) {
  const text = String(value);
  memory[key] = text;
  try {
    localStorage.setItem(key, text);
  } catch (error) {
    /* the other computer may drop localStorage on a new tab */
  }
  try {
    chrome.storage?.local?.set({ [key]: text });
  } catch (error) {
    /* preview pages have no extension storage */
  }
}

function drop(key) {
  delete memory[key];
  try {
    localStorage.removeItem(key);
  } catch (error) {
    /* ignore */
  }
  try {
    chrome.storage?.local?.remove(key);
  } catch (error) {
    /* ignore */
  }
}

const walls = [
  { name: "Night", hue: "navy", bg: "radial-gradient(900px 560px at 50% 38%, #24345c 0%, #070b16 72%)", rgb: "246, 243, 236", far: 1, spark: true },
  { name: "Day", hue: "cream", light: true, bg: "radial-gradient(900px 560px at 50% 38%, #fff6e4 0%, #f0e2c8 70%)", rgb: "110, 78, 40", far: 2, spark: true },
  { name: "Ink", hue: "black", bg: "#050506", rgb: "220, 220, 216", far: 4, spark: false },
  { name: "Linen", hue: "mint", light: true, bg: "#e5f3ea", rgb: "46, 92, 64", far: 4, spark: false },
  { name: "Dusk", hue: "rust", bg: "radial-gradient(800px 420px at 50% 100%, #8a3a22 0%, #140c0c 70%)", rgb: "255, 214, 186", far: 2, spark: true },
  { name: "Morning", hue: "peach", light: true, bg: "radial-gradient(800px 420px at 50% 100%, #f0a88a 0%, #fff1e6 68%)", rgb: "140, 62, 40", far: 2, spark: true },
  { name: "Sea", hue: "teal", bg: "radial-gradient(900px 520px at 50% 30%, #0e6a74 0%, #041416 70%)", rgb: "210, 244, 240", far: 1, spark: true },
  { name: "Shore", hue: "cyan", light: true, bg: "radial-gradient(900px 520px at 50% 30%, #9fd8e4 0%, #e7f7f8 68%)", rgb: "24, 84, 98", far: 1, spark: true },
  { name: "Pine", hue: "forest", bg: "radial-gradient(800px 480px at 50% 80%, #1f6a3e 0%, #06140e 70%)", rgb: "214, 240, 220", far: 2, spark: false },
  { name: "Sage", hue: "green", light: true, bg: "radial-gradient(800px 480px at 50% 80%, #8ec9a0 0%, #eef8f0 70%)", rgb: "30, 90, 52", far: 2, spark: false },
  { name: "Ember", hue: "orange", bg: "radial-gradient(700px 360px at 50% 108%, #c25a18 0%, #140a06 72%)", rgb: "255, 206, 150", far: 2, spark: true },
  { name: "Clay", hue: "terra", light: true, bg: "radial-gradient(700px 360px at 50% 108%, #e08a62 0%, #fff3ea 72%)", rgb: "120, 52, 28", far: 2, spark: true },
  { name: "Moon", hue: "moon", bg: "#0c1020", rgb: "236, 236, 232", far: 3, spark: false, moon: "rgba(244, 244, 236, 0.22)" },
  { name: "Pale moon", hue: "moonlight", light: true, bg: "#f3f1ea", rgb: "70, 70, 64", far: 3, spark: false, moon: "rgba(120, 120, 110, 0.28)" },
  { name: "Fog", hue: "slate", bg: "radial-gradient(900px 600px at 50% 45%, #5c6a7a 0%, #1a222c 72%)", rgb: "226, 232, 238", far: 2, spark: false },
  { name: "Haze", hue: "gray", light: true, bg: "radial-gradient(900px 600px at 50% 45%, #c5ced6 0%, #f4f6f8 72%)", rgb: "52, 62, 72", far: 2, spark: false },
  { name: "Paper", hue: "coffee", bg: "#3a2a1c", rgb: "244, 226, 200", far: 5, spark: false },
  { name: "Ivory", hue: "ivory", light: true, bg: "#f6e7cf", rgb: "120, 84, 40", far: 5, spark: false },
  { name: "Snow", hue: "ice", bg: "radial-gradient(800px 500px at 50% 20%, #4e88b8 0%, #071018 70%)", rgb: "230, 244, 255", far: 1, spark: true },
  { name: "Cloud", hue: "sky", light: true, bg: "radial-gradient(800px 500px at 50% 20%, #8ec0ee 0%, #f3f8fd 70%)", rgb: "28, 70, 120", far: 1, spark: true },
  { name: "Aurora", hue: "aurora", bg: "radial-gradient(900px 240px at 50% 0%, #3dcea0 0%, #06110e 62%)", rgb: "210, 255, 230", far: 2, spark: false },
  { name: "Meadow", hue: "meadow", light: true, bg: "radial-gradient(900px 240px at 50% 0%, #7dce8a 0%, #f3fbf3 64%)", rgb: "28, 90, 46", far: 2, spark: false },
  { name: "Sand", hue: "amber", bg: "radial-gradient(800px 420px at 50% 100%, #c4922a 0%, #161006 70%)", rgb: "255, 226, 170", far: 2, spark: true },
  { name: "Wheat", hue: "gold", light: true, bg: "radial-gradient(800px 420px at 50% 100%, #e6c15a 0%, #fff8e6 70%)", rgb: "110, 78, 16", far: 2, spark: true },
  { name: "Plum", hue: "plum", bg: "radial-gradient(860px 520px at 50% 36%, #6a2a78 0%, #120814 72%)", rgb: "248, 220, 240", far: 2, spark: true },
  { name: "Lilac", hue: "lilac", light: true, bg: "radial-gradient(860px 520px at 50% 36%, #d2b0e4 0%, #f8f2fb 72%)", rgb: "90, 40, 110", far: 2, spark: true },
  { name: "Coal", hue: "steel", bg: "#1c3144", rgb: "214, 228, 236", far: 4, spark: false },
  { name: "Stone", hue: "stone", light: true, bg: "#d9d4cc", rgb: "58, 54, 48", far: 4, spark: false },
  { name: "Dawn", hue: "rose", bg: "radial-gradient(900px 380px at 50% 100%, #a84868 0%, #140810 72%)", rgb: "255, 220, 226", far: 2, spark: false },
  { name: "Blush", hue: "pink", light: true, bg: "radial-gradient(900px 380px at 50% 100%, #f0a0b4 0%, #fff5f7 72%)", rgb: "130, 42, 64", far: 2, spark: false },
  { name: "Lake", hue: "lake", bg: "radial-gradient(900px 560px at 50% 36%, #1d4e66 0%, #07141c 74%)", rgb: "214, 236, 244", far: 3, spark: false },
  { name: "Still", hue: "water", light: true, bg: "radial-gradient(900px 520px at 50% 28%, #d7f0f6 0%, #eef8fb 70%)", rgb: "24, 72, 88", far: 3, spark: false },
  { name: "Cedar", hue: "moss", bg: "#243018", rgb: "226, 236, 186", far: 3, spark: false },
  { name: "Fern", hue: "lime", light: true, bg: "#e4f0b8", rgb: "62, 84, 20", far: 3, spark: false },
  { name: "Wine", hue: "wine", bg: "radial-gradient(760px 460px at 50% 70%, #8a2034 0%, #14060a 72%)", rgb: "255, 214, 214", far: 2, spark: true },
  { name: "Rose", hue: "rosewater", light: true, bg: "radial-gradient(760px 460px at 50% 70%, #f0b0b8 0%, #fff4f4 72%)", rgb: "128, 40, 52", far: 2, spark: true },
  { name: "Silver", hue: "silver", bg: "radial-gradient(900px 560px at 50% 40%, #8a94a0 0%, #2a3038 74%)", rgb: "244, 246, 248", far: 1, spark: true },
  { name: "Pearl", hue: "pearl", light: true, bg: "radial-gradient(900px 560px at 50% 40%, #f7f7f8 0%, #d5d8de 74%)", rgb: "48, 54, 64", far: 1, spark: true },
  { name: "Orbit", hue: "orbit", bg: "#10141c", rgb: "220, 224, 230", far: 3, spark: false, ring: "rgba(220, 224, 230, 0.45)" },
  { name: "Halo", hue: "halo", light: true, bg: "#f4f2ea", rgb: "70, 74, 64", far: 3, spark: false, ring: "rgba(90, 84, 50, 0.35)" },
  { name: "Mist", hue: "spotlight", bg: "radial-gradient(420px 280px at 50% 42%, #6a6048 0%, #0c0c0e 68%)", rgb: "240, 230, 200", far: 3, spark: false },
  { name: "Veil", hue: "wash", light: true, bg: "radial-gradient(420px 280px at 50% 42%, #fff 0%, #d9e4f2 68%)", rgb: "40, 58, 88", far: 3, spark: false },
  { name: "Olive", hue: "olive", bg: "#3a4218", rgb: "236, 236, 186", far: 3, spark: false },
  { name: "Parchment", hue: "yellow", light: true, bg: "#f3e38a", rgb: "96, 72, 10", far: 3, spark: false },
  { name: "Blue hour", hue: "indigo", bg: "radial-gradient(900px 560px at 50% 30%, #3a3ca8 0%, #0a0820 72%)", rgb: "220, 220, 255", far: 1, spark: true },
  { name: "Sky", hue: "periwinkle", light: true, bg: "radial-gradient(900px 560px at 50% 30%, #b7c4ff 0%, #eef1ff 72%)", rgb: "42, 48, 120", far: 1, spark: true },
  { name: "Ash", hue: "taupe", bg: "#5a463c", rgb: "248, 236, 226", far: 3, spark: false },
  { name: "Chalk", hue: "chalk", light: true, bg: "#f7efe6", rgb: "96, 72, 56", far: 3, spark: false },
  { name: "Quiet", hue: "quiet", bg: "#101010", rgb: "180, 180, 176", far: 8, spark: false },
  { name: "Blank", hue: "white", light: true, bg: "#ffffff", rgb: "70, 70, 66", far: 8, spark: false },
  { name: "Violet", hue: "violet", bg: "radial-gradient(1100px 720px at 50% 40%, #6a4cae 0%, #1a1030 74%)", rgb: "236, 224, 255", far: 2, spark: true },
  { name: "Soft violet", hue: "softviolet", light: true, bg: "radial-gradient(680px 460px at 50% 42%, #f6f1fc 0%, #cfc0ee 58%, #5c4a90 100%)", rgb: "72, 56, 104", far: 2, spark: true },
  { name: "Graphite", hue: "graphite", bg: "radial-gradient(900px 560px at 50% 40%, #6a6a72 0%, #2a2a2e 74%)", rgb: "232, 232, 234", far: 2, spark: true },
  { name: "Grey", hue: "grey", light: true, bg: "radial-gradient(760px 520px at 50% 42%, #e4e4e6 0%, #b4b4b8 50%, #5a5a60 100%)", rgb: "36, 36, 40", far: 2, spark: true },
  { name: "Smoke", hue: "smoke", bg: "#141416", rgb: "196, 196, 198", far: 5, spark: false },
  { name: "Lead", hue: "lead", bg: "#2c2e32", rgb: "220, 220, 222", far: 3, spark: false },
  { name: "Iron", hue: "iron", bg: "radial-gradient(800px 520px at 50% 40%, #6a7078 0%, #1c1f24 74%)", rgb: "230, 232, 234", far: 2, spark: true },
  { name: "Pewter", hue: "pewter", bg: "#3c4a58", rgb: "220, 230, 236", far: 2, spark: false },
  { name: "Storm", hue: "storm", light: true, bg: "radial-gradient(980px 420px at 50% 0%, #d7dbe0 0%, #f4f5f6 72%)", rgb: "48, 52, 58", far: 2, spark: true },
  { name: "Concrete", hue: "concrete", light: true, bg: "#9a9ca0", rgb: "28, 28, 32", far: 3, spark: false },
  { name: "Nickel", hue: "nickel", light: true, bg: "radial-gradient(900px 560px at 50% 36%, #e4e7eb 0%, #8e949c 78%)", rgb: "32, 36, 42", far: 2, spark: true },
  { name: "Dove", hue: "dove", light: true, bg: "#ddd8d2", rgb: "58, 52, 46", far: 3, spark: false },
  { name: "Overcast", hue: "overcast", light: true, bg: "radial-gradient(900px 560px at 50% 18%, #f7f8f9 0%, #b7bec6 70%)", rgb: "42, 48, 56", far: 1, spark: true },
  { name: "Granite", hue: "granite", bg: "#6a6660", rgb: "244, 240, 232", far: 2, spark: false },
  { name: "Zinc", hue: "zinc", light: true, bg: "radial-gradient(820px 520px at 50% 40%, #f1f1f2 0%, #c5c6ca 62%, #9a9ba0 100%)", rgb: "36, 36, 40", far: 3, spark: false },
  { name: "Soot", hue: "soot", bg: "#3a342f", rgb: "236, 228, 218", far: 3, spark: false },
  { name: "Ash grey", hue: "ashgrey", light: true, bg: "radial-gradient(640px 420px at 50% 50%, #f2f2f2 0%, #8a8a8e 100%)", rgb: "30, 30, 32", far: 2, spark: true },
  { name: "Petal", hue: "petal", light: true, bg: "radial-gradient(560px 380px at 50% 46%, #fff8f6 0%, #f6cfd6 58%, #f0b7c2 100%)", rgb: "120, 48, 64", far: 2, spark: true },
  { name: "Apricot", hue: "apricot", light: true, bg: "radial-gradient(620px 400px at 50% 42%, #fff6ee 0%, #f6d2b4 60%, #f0b98e 100%)", rgb: "120, 62, 28", far: 2, spark: true },
  { name: "Canopy", hue: "canopy", light: true, bg: "radial-gradient(980px 300px at 50% 0%, #b7e6c6 0%, rgba(183, 230, 198, 0) 68%), #f7fbf7", rgb: "32, 88, 52", far: 2, spark: false },
  { name: "Sea glass", hue: "seaglass", light: true, bg: "radial-gradient(980px 300px at 50% 0%, #b7e4dc 0%, rgba(183, 228, 220, 0) 70%), #f4fbf9", rgb: "24, 88, 80", far: 2, spark: false },
  { name: "Honey", hue: "honey", light: true, bg: "radial-gradient(640px 420px at 50% 40%, #fff8e8 0%, #f3dd9a 62%, #e8c56a 100%)", rgb: "110, 78, 16", far: 2, spark: true },
  { name: "Orchid", hue: "orchid", light: true, bg: "radial-gradient(620px 400px at 50% 44%, #fbf7fd 0%, #e4d0f2 60%, #d2b4e8 100%)", rgb: "88, 42, 110", far: 2, spark: true },
  { name: "Glacier", hue: "glacier", light: true, bg: "radial-gradient(980px 300px at 50% 0%, #c5dff6 0%, rgba(197, 223, 246, 0) 70%), #f5f9fd", rgb: "28, 70, 110", far: 2, spark: false },
  { name: "Coral", hue: "coral", light: true, bg: "radial-gradient(600px 400px at 50% 48%, #fff5f2 0%, #f7c2b4 58%, #f0a090 100%)", rgb: "130, 52, 40", far: 2, spark: true },
  { name: "Lagoon", hue: "lagoon", bg: "radial-gradient(720px 480px at 0% 100%, #0e7a6c 0%, #061210 68%)", rgb: "210, 244, 236", far: 2, spark: true },
  { name: "Foam", hue: "foam", light: true, bg: "radial-gradient(640px 420px at 100% 0%, #b6efe2 0%, #f7fbf9 70%)", rgb: "22, 88, 76", far: 2, spark: false },
  { name: "Copper", hue: "copper", bg: "radial-gradient(560px 640px at 0% 42%, #b25a30 0%, #140c08 66%)", rgb: "255, 220, 196", far: 2, spark: true },
  { name: "Saffron", hue: "saffron", light: true, bg: "radial-gradient(680px 460px at 100% 100%, #f0c14a 0%, #fff8e6 68%)", rgb: "112, 74, 10", far: 2, spark: true },
  { name: "Mulberry", hue: "mulberry", bg: "radial-gradient(520px 620px at 100% 38%, #7a2458 0%, #140810 64%)", rgb: "255, 214, 230", far: 2, spark: true },
  { name: "Flax", hue: "flax", light: true, bg: "radial-gradient(1100px 700px at 0% 50%, #f3e2b0 0%, #fbf7ee 72%)", rgb: "104, 76, 28", far: 3, spark: false },
  { name: "Tide", hue: "tide", bg: "radial-gradient(640px 420px at 0% 0%, #1a4a88 0%, #070c16 66%)", rgb: "214, 228, 255", far: 1, spark: true },
  { name: "Porcelain", hue: "porcelain", light: true, bg: "radial-gradient(380px 260px at 36% 40%, #f7fbff 0%, #d5e4f2 70%)", rgb: "36, 64, 96", far: 3, spark: false },
  { name: "Cinder", hue: "cinder", bg: "radial-gradient(420px 240px at 50% 108%, #d05a28 0%, #100806 62%)", rgb: "255, 214, 186", far: 2, spark: true },
  { name: "Buttercup", hue: "buttercup", light: true, bg: "radial-gradient(1200px 220px at 50% 0%, #f6e27a 0%, #fffdf4 70%)", rgb: "102, 74, 8", far: 2, spark: false },
  { name: "Fig", hue: "fig", bg: "radial-gradient(480px 680px at 0% 55%, #5a2468 0%, #100814 64%)", rgb: "244, 220, 248", far: 2, spark: true },
  { name: "Wisteria", hue: "wisteria", light: true, bg: "radial-gradient(700px 460px at 0% 0%, #d8c4f0 0%, #faf7fd 72%)", rgb: "78, 42, 108", far: 2, spark: false },
  { name: "Kelp", hue: "kelp", bg: "radial-gradient(760px 500px at 0% 100%, #1a5a38 0%, #06140c 68%)", rgb: "214, 240, 220", far: 2, spark: false },
  { name: "Pistachio", hue: "pistachio", light: true, bg: "radial-gradient(900px 640px at 100% 46%, #c6e6a0 0%, #f7fbf2 70%)", rgb: "52, 84, 22", far: 2, spark: false },
  { name: "Cobalt", hue: "cobalt", bg: "radial-gradient(340px 240px at 50% 40%, #2a3ec8 0%, #080818 62%)", rgb: "220, 224, 255", far: 1, spark: true },
  { name: "Powder", hue: "powder", light: true, bg: "radial-gradient(460px 320px at 58% 36%, #f4f8ff 0%, #c5d6f0 68%)", rgb: "32, 58, 108", far: 2, spark: true },
  { name: "Brick", hue: "brick", bg: "radial-gradient(640px 420px at 100% 100%, #8a3028 0%, #140808 66%)", rgb: "255, 214, 206", far: 2, spark: true },
  { name: "Shell", hue: "shell", light: true, bg: "radial-gradient(860px 560px at 0% 42%, #f8d4c8 0%, #fff8f5 72%)", rgb: "122, 58, 44", far: 2, spark: false },
  { name: "Umber", hue: "umber", bg: "radial-gradient(1100px 280px at 50% 0%, #6a4030 0%, #120c08 64%)", rgb: "244, 226, 210", far: 3, spark: false },
  { name: "Marigold", hue: "marigold", light: true, bg: "radial-gradient(520px 380px at 78% 32%, #f6d36a 0%, #fff6e0 70%)", rgb: "108, 72, 8", far: 2, spark: true },
  { name: "Iris", hue: "iris", light: true, bg: "#efe6f8", rgb: "78, 48, 112", far: 3, spark: false, ring: "rgba(110, 70, 150, 0.35)" },
  { name: "Harbor", hue: "harbor", bg: "#0c2038", rgb: "214, 230, 244", far: 2, spark: true, moon: "rgba(210, 230, 246, 0.28)" },
  { name: "Blossom", hue: "blossom", light: true, bg: "radial-gradient(540px 400px at 18% 78%, #f6c0d0 0%, #fff6f8 70%)", rgb: "120, 42, 64", far: 2, spark: true },
  { name: "Spruce", hue: "spruce", bg: "radial-gradient(800px 900px at 50% 0%, #1e4a38 0%, #06110c 58%)", rgb: "214, 236, 220", far: 2, spark: false },
  { name: "Dune", hue: "dune", light: true, bg: "radial-gradient(1400px 360px at 50% 100%, #e8c4a8 0%, #fbf6f0 66%)", rgb: "112, 72, 42", far: 3, spark: false },
];

let wallIndex = Number(stored(WALL_KEY)) || 0;
if (wallIndex < 0 || wallIndex >= walls.length) wallIndex = 0;
let wall = walls[wallIndex];

const defaultMarks = [
  { id: "mail", name: "Mail", url: "https://mail.google.com", icon: "mail" },
];

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeStar(kind) {
  const far = kind === "far";
  const mid = kind === "mid";
  let nx = Math.random();
  let ny = Math.random();
  if (kind === "near") {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      nx = Math.random();
      ny = Math.random();
      const overClock = nx > 0.3 && nx < 0.7 && ny > 0.28 && ny < 0.62;
      if (!overClock) break;
    }
  }
  return {
    nx,
    ny,
    r: far ? 0.3 + Math.random() * 0.45 : mid ? 0.75 + Math.random() * 0.55 : 1.8 + Math.random() * 1.3,
    kind,
    phase: Math.random() * Math.PI * 2,
    tw: 0.25 + Math.random() * (far ? 0.7 : 1.3),
    drift: 0.0008 + Math.random() * (far ? 0.0015 : 0.003),
  };
}

const stars = [
  ...Array.from({ length: 560 }, () => makeStar("far")),
  ...Array.from({ length: 110 }, () => makeStar("mid")),
  ...Array.from({ length: 28 }, () => makeStar("near")),
];

let width = 0;
let height = 0;
let dpr = 1;
let pointerX = 0;
let pointerY = 0;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawSpark(x, y, radius, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${wall.rgb})`;
  ctx.fillStyle = `rgb(${wall.rgb})`;
  ctx.lineWidth = 0.7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(radius * 0.34, 0.6), 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.moveTo(0, -radius);
  ctx.lineTo(0, radius);
  ctx.stroke();
  ctx.restore();
}

function drawSky(now) {
  ctx.clearRect(0, 0, width, height);
  const t = now / 1000;
  const ox = pointerX * 6;
  const oy = pointerY * 4;

  if (wall.moon) {
    const mx = width * 0.8;
    const my = height * 0.16;
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 110);
    glow.addColorStop(0, wall.moon);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mx, my, 110, 0, Math.PI * 2);
    ctx.fill();
  }

  if (wall.ring) {
    ctx.strokeStyle = wall.ring;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.46, Math.min(width, 900) * 0.28, Math.min(height, 700) * 0.16, -0.2, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (wall.line) {
    ctx.strokeStyle = wall.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.08, height * 0.62);
    ctx.lineTo(width * 0.92, height * 0.62);
    ctx.stroke();
  }

  let farSeen = 0;
  for (const star of stars) {
    if (star.kind === "far") {
      farSeen += 1;
      if (farSeen % wall.far !== 0) continue;
    }
    if (star.kind === "near" && !wall.spark) continue;
    if (!reduced) star.ny -= star.drift * 0.016;
    if (star.ny < -0.02) star.ny = 1.02;
    const pulse = 0.5 + 0.5 * Math.sin(t * star.tw + star.phase);
    const depth = star.kind === "far" ? 0.25 : star.kind === "mid" ? 0.7 : 1;
    const x = star.nx * width + ox * depth;
    const y = star.ny * height + oy * depth;

    if (star.kind === "near") {
      const alpha = 0.25 + pulse * 0.75;
      drawSpark(x, y, star.r * (0.72 + pulse * 0.38), alpha);
      continue;
    }

    const alpha = (star.kind === "far" ? 0.15 + pulse * 0.45 : 0.28 + pulse * 0.55) * (wall.light ? 0.72 : 1);
    ctx.beginPath();
    ctx.fillStyle = `rgba(${wall.rgb}, ${alpha})`;
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

let last = 0;
function frame(now) {
  if (now - last > 32) {
    drawSky(now);
    last = now;
  }
  if (!reduced) requestAnimationFrame(frame);
}

window.addEventListener("resize", () => {
  resize();
  drawSky(performance.now());
});

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX / width - 0.5;
  pointerY = event.clientY / height - 0.5;
});

const wallButton = document.getElementById("wall-next");

function applyWall(index) {
  wallIndex = (index + walls.length) % walls.length;
  wall = walls[wallIndex];
  document.body.style.background = wall.bg;
  document.body.classList.toggle("is-light", Boolean(wall.light));
  wallButton.title = `${wall.name}. Click for a different wallpaper.`;
  wallButton.setAttribute("aria-label", `Another wallpaper, now ${wall.name}`);
  keep(WALL_KEY, String(wallIndex));
}

function randomWall() {
  const choices = [];
  for (let i = 0; i < walls.length; i += 1) {
    if (i !== wallIndex && walls[i].hue !== wall.hue) choices.push(i);
  }
  const pool = choices.length ? choices : [wallIndex];
  applyWall(pool[Math.floor(Math.random() * pool.length)]);
}

applyWall(wallIndex);
wallButton.addEventListener("click", () => {
  randomWall();
  drawSky(performance.now());
});

resize();
drawSky(0);
if (!reduced) requestAnimationFrame(frame);

const greet = document.getElementById("greet");
const hm = document.getElementById("hm");
const ampm = document.getElementById("ampm");
const dateEl = document.getElementById("date");
const who = document.getElementById("who");

function tick() {
  const now = new Date();
  const hour = now.getHours();
  greet.textContent = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const parts = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(now);

  hm.textContent = `${parts.find((part) => part.type === "hour").value}:${parts.find((part) => part.type === "minute").value}`;
  ampm.textContent = (parts.find((part) => part.type === "dayPeriod")?.value || "").toUpperCase();
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

tick();
setInterval(tick, 1000);

who.textContent = stored(NAME_KEY) || "Adarsh";

who.addEventListener("click", () => {
  const input = document.createElement("input");
  input.className = "name-input";
  input.value = who.textContent.trim();
  input.maxLength = 24;
  const pop = document.createElement("div");
  pop.className = "name-pop";
  pop.appendChild(input);
  who.hidden = true;
  who.parentElement.appendChild(pop);
  input.focus();
  input.select();

  const finish = (save) => {
    if (save) {
      const next = input.value.trim() || "Adarsh";
      who.textContent = next;
      keep(NAME_KEY, next);
    }
    pop.remove();
    who.hidden = false;
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finish(true);
    if (event.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true));
});

const search = document.getElementById("search");
search.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = new FormData(search).get("q")?.toString().trim() || document.getElementById("q").value.trim();
  if (!query) return;

  const direct = /^(https?:\/\/|[\w-]+\.[\w.-]+)/i.test(query) && !query.includes(" ");
  if (direct) {
    window.location.href = /^https?:\/\//i.test(query) ? query : `https://${query}`;
    return;
  }
  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});

document.addEventListener("keydown", (event) => {
  const typing = event.target.matches("input, textarea");
  if (event.key === "/" && !typing) {
    event.preventDefault();
    document.getElementById("q").focus();
  }
});

const dock = document.getElementById("dock");
const editor = document.getElementById("editor");
const bookmarkPanel = document.getElementById("bookmark-panel");
const bookmarkToggle = document.getElementById("bookmark-toggle");

function setBookmarksVisible(visible) {
  bookmarkPanel.hidden = !visible;
  bookmarkToggle.textContent = visible ? "Hide" : "Bookmarks";
  bookmarkToggle.setAttribute("aria-expanded", String(visible));
  if (!visible) editor.hidden = true;
  keep(SHOW_KEY, visible ? "1" : "0");
}

setBookmarksVisible(stored(SHOW_KEY) !== "0");

bookmarkToggle.addEventListener("click", () => {
  setBookmarksVisible(bookmarkPanel.hidden);
});

const focusToggle = document.getElementById("focus-toggle");

function setFocus(on) {
  document.body.classList.toggle("is-focus", on);
  focusToggle.textContent = on ? "Exit" : "Focus";
  focusToggle.setAttribute("aria-pressed", String(on));
  keep(FOCUS_KEY, on ? "1" : "0");
}

setFocus(stored(FOCUS_KEY) === "1");
focusToggle.addEventListener("click", () => {
  setFocus(!document.body.classList.contains("is-focus"));
  if (!document.body.classList.contains("is-focus")) clampPlaces();
});

function readPlaces() {
  try {
    return JSON.parse(stored(PLACE_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function settle(left, top, wrap) {
  const pad = 16;
  const snap = 64;
  const width = wrap.offsetWidth || 280;
  const height = wrap.offsetHeight || 42;
  const maxLeft = Math.max(pad, window.innerWidth - width - pad);
  const maxTop = Math.max(pad, window.innerHeight - height - pad);
  let x = Math.min(Math.max(pad, left), maxLeft);
  let y = Math.min(Math.max(pad, top), maxTop);
  if (x < snap) x = pad;
  if (y < snap) y = pad;
  if (maxLeft - x < snap) x = maxLeft;
  if (maxTop - y < snap) y = maxTop;
  return { left: x, top: y };
}

function placeWrap(wrap, pos) {
  wrap.classList.add("is-placed");
  wrap.style.left = `${pos.left}px`;
  wrap.style.top = `${pos.top}px`;
}

function clampPlaces() {
  if (document.body.classList.contains("is-focus")) return;
  document.querySelectorAll(".floater.is-placed").forEach((wrap) => {
    const pos = settle(parseFloat(wrap.style.left) || 16, parseFloat(wrap.style.top) || 16, wrap);
    placeWrap(wrap, pos);
  });
}

function bindDrag(wrap) {
  let active = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;
  let moved = false;

  const begin = (event, id) => {
    if (active || event.button !== 0 || event.target.closest("input, label, .pill-hide, .word-hide, .row-delete, .point-text, .point-edit")) return;
    const rect = wrap.getBoundingClientRect();
    active = true;
    pointerId = id;
    startX = event.clientX;
    startY = event.clientY;
    originLeft = rect.left;
    originTop = rect.top;
    moved = false;
  };

  const moveTo = (clientX, clientY) => {
    const dx = clientX - startX;
    const dy = clientY - startY;
    if (!moved && Math.hypot(dx, dy) < 6) return;
    moved = true;
    wrap.classList.add("is-dragging");
    placeWrap(wrap, { left: originLeft + dx, top: originTop + dy });
  };

  const end = () => {
    if (!active) return;
    wrap.classList.remove("is-dragging");
    if (moved) {
      const pos = settle(parseFloat(wrap.style.left) || originLeft, parseFloat(wrap.style.top) || originTop, wrap);
      placeWrap(wrap, pos);
      const saved = readPlaces();
      saved[wrap.id] = pos;
      keep(PLACE_KEY, JSON.stringify(saved));
      wrap.dataset.dragged = "1";
    }
    active = false;
    pointerId = null;
  };

  wrap.addEventListener("pointerdown", (event) => begin(event, event.pointerId));
  window.addEventListener("pointermove", (event) => {
    if (!active || event.pointerId !== pointerId) return;
    moveTo(event.clientX, event.clientY);
  });
  window.addEventListener("pointerup", (event) => {
    if (!active || event.pointerId !== pointerId) return;
    end();
  });
  window.addEventListener("pointercancel", (event) => {
    if (!active || event.pointerId !== pointerId) return;
    end();
  });

  wrap.addEventListener("mousedown", (event) => {
    if (active) return;
    begin(event, "mouse");
  });
  window.addEventListener("mousemove", (event) => {
    if (!active || pointerId !== "mouse") return;
    moveTo(event.clientX, event.clientY);
  });
  window.addEventListener("mouseup", () => {
    if (!active || pointerId !== "mouse") return;
    end();
  });
}

for (const [id, pos] of Object.entries(readPlaces())) {
  const wrap = document.getElementById(id);
  if (wrap && Number.isFinite(pos?.left) && Number.isFinite(pos?.top)) placeWrap(wrap, pos);
}
clampPlaces();
window.addEventListener("resize", clampPlaces);

document.getElementById("weather-wrap") && bindDrag(document.getElementById("weather-wrap"));
document.getElementById("note-wrap") && bindDrag(document.getElementById("note-wrap"));

const noteToggle = document.getElementById("note-toggle");
const noteWrap = document.getElementById("note-wrap");
const noteList = document.getElementById("note-list");
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");

function loadNotes() {
  const raw = stored(NOTE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((item) => item && item.text);
  } catch (error) {
    return [{ id: crypto.randomUUID(), text: raw, done: false }];
  }
  return [];
}

let notes = loadNotes();

function saveNotes() {
  keep(NOTE_KEY, JSON.stringify(notes));
}

function syncNotes() {
  const open = notes.length > 0 && stored(NOTE_OPEN_KEY) !== "0";
  noteWrap.hidden = !open;
  noteToggle.hidden = open;
}

function renderNotes() {
  noteList.innerHTML = "";
  for (const item of notes) {
    const row = document.createElement("li");
    row.className = item.done ? "point is-done" : "point";

    const label = document.createElement("label");
    label.className = "point-check";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = item.done;
    box.setAttribute("aria-label", item.done ? `Done: ${item.text}` : item.text);
    box.addEventListener("change", () => {
      item.done = box.checked;
      saveNotes();
      renderNotes();
    });
    label.append(box);

    const text = document.createElement("button");
    text.type = "button";
    text.className = "point-text";
    text.textContent = item.text;
    text.title = "Click to edit";
    text.addEventListener("click", () => beginEdit(item, text));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "row-delete";
    remove.setAttribute("aria-label", `Delete ${item.text}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      notes = notes.filter((entry) => entry.id !== item.id);
      saveNotes();
      renderNotes();
      syncNotes();
    });

    row.append(label, text, remove);
    noteList.appendChild(row);
  }
  syncNotes();
}

function beginEdit(item, textButton) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "point-edit";
  input.value = item.text;
  input.maxLength = 280;
  textButton.replaceWith(input);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  let closed = false;
  const finish = (save) => {
    if (closed) return;
    closed = true;
    if (save) {
      const next = input.value.trim();
      if (next) item.text = next;
    }
    saveNotes();
    renderNotes();
  };
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
    }
  });
  input.addEventListener("blur", () => finish(true));
}

function showNotes() {
  keep(NOTE_OPEN_KEY, "1");
  noteWrap.hidden = false;
  noteToggle.hidden = true;
  noteInput.focus();
}

noteToggle.addEventListener("click", showNotes);
document.getElementById("note-hide").addEventListener("click", () => {
  keep(NOTE_OPEN_KEY, "0");
  syncNotes();
});

function addPoint() {
  const text = noteInput.value.trim();
  if (!text) return;
  notes.push({ id: crypto.randomUUID(), text, done: false });
  noteInput.value = "";
  saveNotes();
  keep(NOTE_OPEN_KEY, "1");
  renderNotes();
  noteInput.focus();
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addPoint();
});

noteInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addPoint();
});

renderNotes();

const weatherBtn = document.getElementById("weather");
const weatherLabel = document.getElementById("weather-label");
const weatherMark = document.getElementById("weather-mark");
const weatherWrap = document.getElementById("weather-wrap");
const cityToggle = document.getElementById("city-toggle");
let city = null;
try {
  city = JSON.parse(stored(CITY_KEY) || "null");
} catch (error) {
  city = null;
}

function syncCity() {
  const open = Boolean(city?.name) && stored(CITY_OPEN_KEY) !== "0";
  weatherWrap.hidden = !open;
  cityToggle.hidden = open;
}

function skyKind(code) {
  const n = Number(code);
  if (!Number.isFinite(n)) return "";
  if (n <= 1) return "sun";
  if (n <= 3 || n === 45 || n === 48) return "cloud";
  return "rain";
}

function showWeather(text, kind) {
  weatherLabel.textContent = text || "";
  const marks = {
    sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.1"></circle><path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6 5.8 18.2"></path></svg>`,
    cloud: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 17.2h8.4a3.3 3.3 0 0 0 .3-6.6 4.3 4.3 0 0 0-8.2 1.3 2.7 2.7 0 0 0-.5 5.3z"></path></svg>`,
    rain: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 14.6h7.6a3 3 0 0 0 .3-6 3.9 3.9 0 0 0-7.5 1.2 2.5 2.5 0 0 0-.4 4.8z"></path><path d="M9 17.4v1.7M12 17.4v1.7M15 17.4v1.7"></path></svg>`,
  };
  if (!marks[kind]) {
    weatherMark.hidden = true;
    weatherMark.innerHTML = "";
    return;
  }
  weatherMark.hidden = false;
  weatherMark.innerHTML = marks[kind];
}

async function loadWeather() {
  syncCity();
  if (!city?.name) {
    showWeather("");
    return;
  }

  let cache = null;
  try {
    cache = JSON.parse(stored(WEATHER_KEY) || "null");
  } catch (error) {
    cache = null;
  }
  if (cache && cache.name === city.name && cache.kind && Date.now() - cache.at < 30 * 60 * 1000) {
    showWeather(cache.label, cache.kind);
    return;
  }

  showWeather(city.name);
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code`,
    );
    const data = await response.json();
    const temp = Math.round(data.current.temperature_2m);
    const kind = skyKind(data.current.weather_code);
    const label = `${city.name} · ${temp}°`;
    showWeather(label, kind);
    keep(WEATHER_KEY, JSON.stringify({ name: city.name, label, kind, at: Date.now() }));
  } catch (error) {
    showWeather(city.name);
  }
}

loadWeather();

function showCity() {
  keep(CITY_OPEN_KEY, "1");
  weatherWrap.hidden = false;
  cityToggle.hidden = true;
  if (!city?.name) openCityEditor();
}

cityToggle.addEventListener("click", showCity);
document.getElementById("weather-hide").addEventListener("click", () => {
  keep(CITY_OPEN_KEY, "0");
  syncCity();
});

function openCityEditor() {
  if (weatherWrap.dataset.dragged === "1") {
    delete weatherWrap.dataset.dragged;
    return;
  }
  const input = document.createElement("input");
  input.className = "name-input";
  input.value = city?.name || "";
  input.placeholder = "City";
  input.maxLength = 40;
  const pop = document.createElement("div");
  pop.className = "name-pop";
  pop.appendChild(input);
  weatherBtn.hidden = true;
  weatherBtn.parentElement.appendChild(pop);
  input.focus();
  input.select();

  let closed = false;
  const finish = async (save) => {
    if (closed) return;
    closed = true;
    const typed = input.value.trim();
    pop.remove();
    weatherBtn.hidden = false;
    if (!save) {
      syncCity();
      return;
    }
    if (!typed) {
      city = null;
      drop(CITY_KEY);
      drop(WEATHER_KEY);
      loadWeather();
      syncCity();
      return;
    }
    showWeather(typed);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(typed)}&count=1&language=en`,
      );
      const data = await response.json();
      const place = data.results?.[0];
      if (!place) {
        showWeather("City not found");
        weatherWrap.hidden = false;
        cityToggle.hidden = true;
        return;
      }
      city = { name: place.name, latitude: place.latitude, longitude: place.longitude };
      keep(CITY_KEY, JSON.stringify(city));
      keep(CITY_OPEN_KEY, "1");
      drop(WEATHER_KEY);
      loadWeather();
    } catch (error) {
      showWeather("Weather unavailable");
    }
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finish(true);
    if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
    }
  });
  input.addEventListener("blur", () => finish(true));
}

weatherBtn.addEventListener("click", openCityEditor);

function loadMarks() {
  try {
    const saved = JSON.parse(stored(MARK_KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    /* keep the default mail bookmark */
  }
  return defaultMarks.map((mark) => ({ ...mark }));
}

let marks = loadMarks();

function saveMarks() {
  keep(MARK_KEY, JSON.stringify(marks));
}

function safeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.href;
}

function mailGlyph() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"></rect><path d="M4 7l8 6 8-6"></path></svg>`;
}

function renderDock() {
  dock.innerHTML = "";

  for (const mark of marks) {
    const link = document.createElement("a");
    link.className = "mark";
    link.href = mark.url;
    link.title = mark.url;

    const glyph = document.createElement("span");
    glyph.className = "glyph";
    if (mark.icon === "mail") {
      glyph.innerHTML = mailGlyph();
    } else {
      const img = document.createElement("img");
      img.alt = "";
      img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(mark.url)}`;
      img.addEventListener("error", () => {
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = mark.name.slice(0, 1).toUpperCase();
        img.replaceWith(letter);
      });
      glyph.appendChild(img);
    }

    const label = document.createElement("span");
    label.textContent = mark.name;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.setAttribute("aria-label", `Remove ${mark.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      marks = marks.filter((item) => item.id !== mark.id);
      saveMarks();
      renderDock();
    });

    link.append(glyph, label, remove);
    dock.appendChild(link);
  }

  const add = document.createElement("button");
  add.type = "button";
  add.className = "add";
  add.setAttribute("aria-expanded", String(!editor.hidden));
  add.innerHTML = `<span class="add-glyph">+</span><span>Add</span>`;
  add.addEventListener("click", () => {
    editor.hidden = !editor.hidden;
    add.setAttribute("aria-expanded", String(!editor.hidden));
    if (!editor.hidden) document.getElementById("bm-name").focus();
  });
  dock.appendChild(add);
}

renderDock();

editor.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("bm-name").value.trim();
  const href = safeUrl(document.getElementById("bm-url").value);
  if (!name || !href) return;

  const host = new URL(href).hostname;
  const icon = /(^|\.)mail\.google\.com$|(^|\.)gmail\.com$/i.test(host) ? "mail" : "favicon";
  marks.push({
    id: crypto.randomUUID(),
    name,
    url: href,
    icon,
  });
  saveMarks();
  editor.reset();
  editor.hidden = true;
  renderDock();
});

function placeSaved() {
  document.querySelectorAll(".floater.is-placed").forEach((wrap) => {
    wrap.classList.remove("is-placed");
    wrap.style.left = "";
    wrap.style.top = "";
  });
  for (const [id, pos] of Object.entries(readPlaces())) {
    const wrap = document.getElementById(id);
    if (wrap && Number.isFinite(pos?.left) && Number.isFinite(pos?.top)) placeWrap(wrap, pos);
  }
  clampPlaces();
}

function restoreSaved() {
  const nextWall = Number(stored(WALL_KEY)) || 0;
  if (nextWall !== wallIndex) applyWall(nextWall);
  who.textContent = stored(NAME_KEY) || "Adarsh";
  setBookmarksVisible(stored(SHOW_KEY) !== "0");
  setFocus(stored(FOCUS_KEY) === "1");
  notes = loadNotes();
  renderNotes();
  try {
    city = JSON.parse(stored(CITY_KEY) || "null");
  } catch (error) {
    city = null;
  }
  loadWeather();
  marks = loadMarks();
  renderDock();
  placeSaved();
}

async function pullChromeStore() {
  if (!chrome.storage?.local) return;
  const items = await chrome.storage.local.get(STORE_KEYS);
  const found = STORE_KEYS.some((key) => typeof items[key] === "string");
  if (!found) {
    const seed = {};
    for (const key of STORE_KEYS) {
      const value = stored(key);
      if (value != null) seed[key] = value;
    }
    if (Object.keys(seed).length) chrome.storage.local.set(seed);
    return;
  }
  for (const key of STORE_KEYS) {
    if (typeof items[key] === "string") memory[key] = items[key];
  }
  restoreSaved();
}

pullChromeStore();

chrome.storage?.onChanged?.addListener((changes, area) => {
  if (area !== "local" || document.querySelector(".point-edit")) return;
  if (!changes[NOTE_KEY] && !changes[NOTE_OPEN_KEY]) return;
  for (const key of [NOTE_KEY, NOTE_OPEN_KEY]) {
    const next = changes[key]?.newValue;
    if (typeof next === "string" && next !== memory[key]) memory[key] = next;
  }
  notes = loadNotes();
  renderNotes();
});
