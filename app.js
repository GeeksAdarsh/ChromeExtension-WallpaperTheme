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
const DAYS_KEY = "quiet-stars-days";
const PINNED_KEY = "quiet-stars-pinned";
const LISTS_KEY = "quiet-stars-lists";
const TAB_ORDER_KEY = "quiet-stars-tab-order";
const STUDY_KEY = "quiet-stars-study";
const NOTE_SIZE_KEY = "quiet-stars-note-size";
const AUTO_KEY = "quiet-stars-wall-auto";
const WALL_DAY_KEY = "quiet-stars-wall-day";

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
  DAYS_KEY,
  PINNED_KEY,
  LISTS_KEY,
  TAB_ORDER_KEY,
  STUDY_KEY,
  NOTE_SIZE_KEY,
  AUTO_KEY,
  WALL_DAY_KEY,
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
  { name: "Crayon wind", hue: "pencilwind", light: true, bg: "#fbf8ee", rgb: "58, 56, 60", far: 1, spark: false, pencil: "wind", dot: "#4f9fe0" },
  { name: "Scribble sun", hue: "pencilsun", light: true, bg: "#fdf6e6", rgb: "96, 64, 30", far: 1, spark: false, pencil: "sun", dot: "#f0a23c" },
  { name: "Pencil hills", hue: "pencilhills", light: true, bg: "#f6f8ec", rgb: "40, 70, 50", far: 1, spark: false, pencil: "hills", dot: "#4fae74" },
  { name: "Rainbow loop", hue: "pencilloop", light: true, bg: "#fbf7f1", rgb: "70, 56, 70", far: 1, spark: false, pencil: "loop", dot: "#9b7fd1" },
  { name: "Sketch sea", hue: "pencilsea", light: true, bg: "#f2f7f8", rgb: "30, 66, 84", far: 1, spark: false, pencil: "sea", dot: "#3e9cc4" },
  { name: "Petal doodle", hue: "pencilpetal", light: true, bg: "#fdf4f1", rgb: "110, 50, 62", far: 1, spark: false, pencil: "petal", dot: "#e57f9e" },
  { name: "Crayon meadow", hue: "pencilmeadow", light: true, bg: "#f8f9ee", rgb: "46, 72, 40", far: 1, spark: false, pencil: "meadow", dot: "#6cbf6a" },
  { name: "Ribbon", hue: "pencilribbon", light: true, bg: "#f7f4fa", rgb: "64, 52, 86", far: 1, spark: false, pencil: "ribbon", dot: "#e46f8f" },
  { name: "Doodle confetti", hue: "pencilconfetti", light: true, bg: "#fffaf0", rgb: "70, 60, 50", far: 1, spark: false, pencil: "confetti", dot: "#f08a5c" },
  { name: "Kite clouds", hue: "pencilkite", light: true, bg: "#f3f7fc", rgb: "40, 60, 92", far: 1, spark: false, pencil: "kite", dot: "#ef7a5a" },
  { name: "Wind girl", hue: "drawwindgirl", light: true, bg: "#fdfbef", rgb: "56, 56, 62", far: 1, spark: false, pencil: "windgirl", dot: "#4f9fe0" },
  { name: "Flower crown", hue: "drawcrown", light: true, bg: "#fdf6f2", rgb: "96, 52, 50", far: 1, spark: false, pencil: "crowngirl", dot: "#e46f8f" },
  { name: "Rainy walk", hue: "drawumbrella", light: true, bg: "#f1f5f8", rgb: "36, 56, 76", far: 1, spark: false, pencil: "umbrella", dot: "#f08a6c" },
  { name: "Headphones", hue: "drawheadphones", light: true, bg: "#f6f5fb", rgb: "54, 48, 78", far: 1, spark: false, pencil: "headphones", dot: "#9b7fd1" },
  { name: "Astronaut", hue: "drawastronaut", light: true, bg: "#f4f3fa", rgb: "44, 46, 72", far: 1, spark: false, pencil: "astronaut", dot: "#4f9fe0" },
  { name: "Sleepy cat", hue: "drawsleepycat", light: true, bg: "#fdf7ee", rgb: "92, 62, 36", far: 1, spark: false, pencil: "sleepycat", dot: "#f3a24a" },
  { name: "Peek cat", hue: "drawpeekcat", light: true, bg: "#f8f6f1", rgb: "60, 58, 62", far: 1, spark: false, pencil: "peekcat", dot: "#5fbf7e" },
  { name: "Little fox", hue: "drawfox", light: true, bg: "#fcf7ec", rgb: "100, 56, 28", far: 1, spark: false, pencil: "fox", dot: "#f3a24a" },
  { name: "Bunny", hue: "drawbunny", light: true, bg: "#f7faf0", rgb: "60, 70, 50", far: 1, spark: false, pencil: "bunny", dot: "#e98bb0" },
  { name: "Balloon bear", hue: "drawbear", light: true, bg: "#fbf6ef", rgb: "88, 60, 40", far: 1, spark: false, pencil: "bear", dot: "#e05a56" },
  { name: "Night owl", hue: "drawowl", light: true, bg: "#f6f4ec", rgb: "78, 60, 40", far: 1, spark: false, pencil: "owl", dot: "#f2cf3a" },
  { name: "Penguins", hue: "drawpenguins", light: true, bg: "#f2f7fb", rgb: "36, 50, 70", far: 1, spark: false, pencil: "penguins", dot: "#e05a56" },
  { name: "Robin", hue: "drawrobin", light: true, bg: "#fdf8f4", rgb: "92, 52, 40", far: 1, spark: false, pencil: "robin", dot: "#e98bb0" },
  { name: "Whale", hue: "drawwhale", light: true, bg: "#f1f6f9", rgb: "30, 60, 86", far: 1, spark: false, pencil: "whale", dot: "#4f9fe0" },
  { name: "Koi pond", hue: "drawkoi", light: true, bg: "#f2f8f6", rgb: "34, 70, 64", far: 1, spark: false, pencil: "koi", dot: "#f3a24a" },
  { name: "Butterflies", hue: "drawbutterflies", light: true, bg: "#fbf9f1", rgb: "60, 56, 80", far: 1, spark: false, pencil: "butterflies", dot: "#9b7fd1" },
  { name: "Mushrooms", hue: "drawmushrooms", light: true, bg: "#f9f7ee", rgb: "86, 54, 40", far: 1, spark: false, pencil: "mushrooms", dot: "#e05a56" },
  { name: "House plants", hue: "drawplants", light: true, bg: "#f5f8f0", rgb: "40, 68, 46", far: 1, spark: false, pencil: "plants", dot: "#5fbf7e" },
  { name: "Study desk", hue: "drawstudy", light: true, bg: "#fbf8f2", rgb: "60, 54, 70", far: 1, spark: false, pencil: "study", dot: "#9b7fd1" },
  { name: "Hot air balloons", hue: "drawballoons", light: true, bg: "#f3f6fb", rgb: "44, 54, 84", far: 1, spark: false, pencil: "balloons", dot: "#f08a6c" },
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

const PENCIL = {
  blue: "#4f9fe0",
  sky: "#8cc4ee",
  pink: "#e98bb0",
  rose: "#e46f8f",
  coral: "#f08a6c",
  orange: "#f3a24a",
  yellow: "#f2cf3a",
  green: "#5fbf7e",
  leaf: "#8cc75a",
  teal: "#3fb0aa",
  purple: "#9b7fd1",
  red: "#e05a56",
  brown: "#a7825a",
  graphite: "#5d5c62",
};

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function spline(points, w, h) {
  const pts = points.map(([x, y]) => [x * w, y * h]);
  const n = pts.length - 1;
  return (t) => {
    const f = Math.min(n - 1e-6, Math.max(0, t * n));
    const i = Math.floor(f);
    const u = f - i;
    const a = pts[Math.max(0, i - 1)];
    const b = pts[i];
    const c = pts[i + 1];
    const d = pts[Math.min(n, i + 2)];
    const mix = (k) => 0.5 * (2 * b[k] + (c[k] - a[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * u * u * u);
    return [mix(0), mix(1)];
  };
}

function pencilStroke(p, rand, points, color, weight = 1.2, alpha = 0.55) {
  p.strokeStyle = color;
  p.lineCap = "round";
  p.lineJoin = "round";
  for (let pass = 0; pass < 2; pass += 1) {
    p.globalAlpha = alpha * (pass ? 0.5 : 1);
    p.lineWidth = weight * (pass ? 0.65 : 1);
    p.setLineDash(Array.from({ length: 6 }, (_, k) => (k % 2 ? 0.5 + rand() * 1.8 : 2 + rand() * 9)));
    p.lineDashOffset = rand() * 12;
    p.beginPath();
    points.forEach(([x, y], index) => {
      const jx = x + (rand() - 0.5) * 0.9;
      const jy = y + (rand() - 0.5) * 0.9;
      if (index) p.lineTo(jx, jy);
      else p.moveTo(jx, jy);
    });
    p.stroke();
  }
  p.setLineDash([]);
  p.globalAlpha = 1;
}

function band(p, rand, curve, { colors, count = 12, gap = 3.4, wobble = 2.4, steps = 160, weight = 1.2, alpha = 0.55, twist = 0 }) {
  for (let i = 0; i < count; i += 1) {
    const t0 = rand() * 0.08;
    const t1 = 1 - rand() * 0.08;
    const phase = rand() * Math.PI * 2;
    const points = [];
    for (let s = 0; s <= steps; s += 1) {
      const t = t0 + ((t1 - t0) * s) / steps;
      const [x, y] = curve(t);
      const [ax, ay] = curve(Math.max(0, t - 0.003));
      const [bx, by] = curve(Math.min(1, t + 0.003));
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const spread = (0.35 + 0.65 * Math.sin(Math.PI * t)) * (twist ? Math.max(0.12, Math.abs(Math.cos(t * Math.PI * twist))) : 1);
      const off = ((i - (count - 1) / 2) * gap + Math.sin(t * 11 + phase) * wobble) * spread;
      points.push([x - ((by - ay) / len) * off, y + ((bx - ax) / len) * off]);
    }
    pencilStroke(p, rand, points, colors[i % colors.length], weight, alpha * (0.7 + rand() * 0.3));
  }
}

function hatch(p, rand, shape, [bx, by, bw, bh], color, { angle = -0.6, gap = 4, alpha = 0.4, weight = 1 } = {}) {
  p.save();
  p.beginPath();
  shape(p);
  p.clip();
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  const reach = Math.hypot(bw, bh) / 2 + 4;
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  for (let d = -reach; d <= reach; d += gap * (0.75 + rand() * 0.5)) {
    const points = [];
    for (let s = -reach; s <= reach; s += 10) points.push([cx - uy * d + ux * s, cy + ux * d + uy * s]);
    pencilStroke(p, rand, points, color, weight, alpha * (0.6 + rand() * 0.4));
  }
  p.restore();
}

function scribble(p, rand, cx, cy, r, color, { loops = 14, alpha = 0.5, weight = 1.1 } = {}) {
  const points = [];
  const drift = rand() * 10;
  for (let a = 0; a <= loops * Math.PI * 2; a += 0.14) {
    const rr = r * (0.3 + 0.7 * ((Math.sin(a * 0.23 + drift) + 1) / 2)) * (0.92 + rand() * 0.16);
    points.push([cx + Math.cos(a) * rr + Math.sin(a * 0.05) * r * 0.08, cy + Math.sin(a) * rr]);
  }
  pencilStroke(p, rand, points, color, weight, alpha);
}

function ring(p, rand, cx, cy, rx, ry, color, { from = 0, to = Math.PI * 2, alpha = 0.55, weight = 1.3, tilt = 0 } = {}) {
  const points = [];
  for (let a = from; a <= to + 0.001; a += 0.06) {
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    points.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]);
  }
  pencilStroke(p, rand, points, color, weight, alpha);
}

function gull(p, rand, x, y, size) {
  const left = [];
  const right = [];
  for (let s = 0; s <= 10; s += 1) {
    const t = s / 10;
    left.push([x - size + size * t, y - Math.sin(Math.PI * t) * size * 0.45 + t * size * 0.25]);
    right.push([x + size * t, y + size * 0.25 - Math.sin(Math.PI * t) * size * 0.45 - t * size * 0.25]);
  }
  pencilStroke(p, rand, left, PENCIL.graphite, 1.2, 0.6);
  pencilStroke(p, rand, right, PENCIL.graphite, 1.2, 0.6);
}

function waveLine(y, amp, waves, w, h, shift = 0) {
  const points = [];
  for (let k = 0; k <= waves * 2; k += 1) points.push([-0.06 + (1.12 * k) / (waves * 2), y + (k % 2 ? amp : -amp) + shift * Math.sin(k)]);
  return spline(points, w, h);
}

const pencilArt = {
  wind(p, rand, w, h, s) {
    const flows = [
      [PENCIL.blue, [[-0.06, 0.6], [0.1, 0.5], [0.24, 0.56], [0.36, 0.46], [0.5, 0.5]], 16],
      [PENCIL.pink, [[0.18, 0.4], [0.3, 0.26], [0.42, 0.34], [0.36, 0.44], [0.28, 0.36], [0.4, 0.22], [0.58, 0.2]], 13],
      [PENCIL.coral, [[0.08, 0.32], [0.16, 0.2], [0.3, 0.14], [0.4, 0.16]], 10],
      [PENCIL.purple, [[0.52, 0.32], [0.66, 0.24], [0.8, 0.3], [0.92, 0.22], [1.06, 0.28]], 14],
      [PENCIL.green, [[0.58, 0.66], [0.66, 0.54], [0.76, 0.6], [0.84, 0.5], [0.96, 0.56]], 12],
      [PENCIL.yellow, [[0.42, 0.52], [0.4, 0.66], [0.36, 0.82], [0.4, 0.96]], 12],
      [PENCIL.red, [[0.06, 0.72], [0.14, 0.66], [0.2, 0.74], [0.28, 0.68]], 5],
      [PENCIL.teal, [[0.7, 0.86], [0.8, 0.78], [0.92, 0.84], [1.06, 0.76]], 10],
    ];
    for (const [color, points, count] of flows) band(p, rand, spline(points, w, h), { colors: [color], count: Math.round(count * 1.5), gap: 2.4 * s, wobble: 2.4 * s, weight: 1.4 * s, alpha: 0.62 });
  },
  sun(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const cx = w * 0.82;
    const cy = h * 0.22;
    const r = m * 0.09;
    for (let k = 0; k < 16; k += 1) {
      const a = (k / 16) * Math.PI * 2 + rand() * 0.1;
      const ray = [];
      for (let t = 0; t <= 1; t += 0.1) ray.push([cx + Math.cos(a) * r * (1.35 + t * 0.6), cy + Math.sin(a) * r * (1.35 + t * 0.6)]);
      pencilStroke(p, rand, ray, k % 2 ? PENCIL.orange : PENCIL.yellow, 1.6 * s, 0.65);
    }
    scribble(p, rand, cx, cy, r, PENCIL.yellow, { loops: 30, weight: 1.3 * s, alpha: 0.6 });
    scribble(p, rand, cx, cy, r * 0.8, PENCIL.orange, { loops: 10, weight: 1.2 * s, alpha: 0.45 });
    ring(p, rand, cx, cy, r * 1.05, r * 1.02, PENCIL.orange, { weight: 1.4 * s });
    const colors = [PENCIL.coral, PENCIL.pink, PENCIL.orange];
    colors.forEach((color, k) => band(p, rand, waveLine(0.8 + k * 0.06, 0.03, 3, w, h), { colors: [color], count: 10, gap: 3 * s, weight: 1.2 * s }));
    gull(p, rand, w * 0.16, h * 0.2, 12 * s);
    gull(p, rand, w * 0.22, h * 0.26, 9 * s);
  },
  hills(p, rand, w, h, s) {
    const tones = [PENCIL.teal, PENCIL.green, PENCIL.leaf, PENCIL.green];
    tones.forEach((color, k) => {
      const base = 0.64 + k * 0.08;
      const edge = spline(Array.from({ length: 6 }, (_, i) => [-0.06 + i * 0.224, base + (i % 2 ? -0.06 : 0.02) + rand() * 0.04]), w, h);
      const top = Array.from({ length: 81 }, (_, i) => edge(i / 80));
      const shape = (ctx2) => {
        top.forEach(([x, y], i) => (i ? ctx2.lineTo(x, y) : ctx2.moveTo(x, y)));
        ctx2.lineTo(w + 20, h + 20);
        ctx2.lineTo(-20, h + 20);
        ctx2.closePath();
      };
      hatch(p, rand, shape, [0, h * (base - 0.12), w, h * (1.12 - base)], color, { angle: k % 2 ? -0.5 : -1.1, gap: 4.6 * s, alpha: 0.32, weight: 1.1 * s });
      pencilStroke(p, rand, top, color, 1.6 * s, 0.7);
    });
    scribble(p, rand, w * 0.16, h * 0.2, Math.min(w, h) * 0.05, PENCIL.yellow, { loops: 18, weight: 1.2 * s });
    gull(p, rand, w * 0.72, h * 0.18, 11 * s);
    gull(p, rand, w * 0.78, h * 0.24, 8 * s);
  },
  loop(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const curve = (t) => {
      const a = t * Math.PI * 2 * 4.5;
      return [w * (-0.05 + 1.1 * t) + Math.cos(a) * m * 0.07, h * (0.88 - 0.72 * t) + Math.sin(a) * m * 0.07 + Math.sin(t * Math.PI) * h * 0.06];
    };
    band(p, rand, curve, { colors: [PENCIL.red, PENCIL.red, PENCIL.orange, PENCIL.orange, PENCIL.yellow, PENCIL.yellow, PENCIL.green, PENCIL.green, PENCIL.teal, PENCIL.teal, PENCIL.blue, PENCIL.blue, PENCIL.purple, PENCIL.purple], count: 14, gap: 2.6 * s, wobble: 0.8, steps: 900, weight: 1.6 * s, alpha: 0.62 });
  },
  sea(p, rand, w, h, s) {
    const m = Math.min(w, h);
    hatch(p, rand, (ctx2) => ctx2.arc(w * 0.22, h * 0.72, m * 0.09, 0, Math.PI * 2), [w * 0.22 - m * 0.1, h * 0.72 - m * 0.1, m * 0.2, m * 0.2], PENCIL.coral, { gap: 3.6 * s, alpha: 0.45, weight: 1.1 * s });
    ring(p, rand, w * 0.22, h * 0.72, m * 0.09, m * 0.09, PENCIL.coral, { weight: 1.4 * s });
    const blues = [PENCIL.sky, PENCIL.blue, PENCIL.teal, PENCIL.blue, PENCIL.sky, PENCIL.teal];
    blues.forEach((color, k) => band(p, rand, waveLine(0.7 + k * 0.05, 0.012, 5 + k, w, h), { colors: [color], count: 6, gap: 2.8 * s, wobble: 1.4 * s, weight: 1.2 * s, alpha: 0.6 }));
    gull(p, rand, w * 0.7, h * 0.22, 13 * s);
    gull(p, rand, w * 0.78, h * 0.28, 9 * s);
    gull(p, rand, w * 0.64, h * 0.3, 7 * s);
  },
  petal(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const flowers = [[0.1, 0.84, 0.13, PENCIL.pink], [0.9, 0.16, 0.11, PENCIL.coral], [0.88, 0.86, 0.08, PENCIL.purple], [0.08, 0.14, 0.06, PENCIL.rose]];
    for (const [fx, fy, size, color] of flowers) {
      const cx = w * fx;
      const cy = h * fy;
      const r = m * size;
      for (let k = 0; k < 2; k += 1) {
        const a = rand() * Math.PI * 2;
        const lx = cx + Math.cos(a) * r * 1.3;
        const ly = cy + Math.sin(a) * r * 1.3;
        hatch(p, rand, (ctx2) => ctx2.ellipse(lx, ly, r * 0.6, r * 0.22, a, 0, Math.PI * 2), [lx - r, ly - r, r * 2, r * 2], PENCIL.green, { angle: a + 1, gap: 3.4 * s, alpha: 0.4 });
        ring(p, rand, lx, ly, r * 0.6, r * 0.22, PENCIL.green, { tilt: a, weight: 1.1 * s });
      }
      const petals = 7;
      for (let k = 0; k < petals; k += 1) {
        const a = (k / petals) * Math.PI * 2 + rand() * 0.2;
        const px = cx + Math.cos(a) * r * 0.55;
        const py = cy + Math.sin(a) * r * 0.55;
        hatch(p, rand, (ctx2) => ctx2.ellipse(px, py, r * 0.5, r * 0.26, a, 0, Math.PI * 2), [px - r * 0.6, py - r * 0.6, r * 1.2, r * 1.2], color, { angle: a + 0.9, gap: 3.4 * s, alpha: 0.42 });
        ring(p, rand, px, py, r * 0.5, r * 0.26, color, { tilt: a, weight: 1.2 * s });
      }
      scribble(p, rand, cx, cy, r * 0.2, PENCIL.yellow, { loops: 14, weight: 1.2 * s, alpha: 0.7 });
    }
  },
  meadow(p, rand, w, h, s) {
    const greens = [PENCIL.green, PENCIL.leaf, PENCIL.teal];
    for (let k = 0; k < 18; k += 1) {
      const x = w * (0.03 + rand() * 0.94);
      const top = h * (0.62 + rand() * 0.18);
      const bend = (rand() - 0.5) * 40 * s;
      const stem = [];
      for (let t = 0; t <= 1; t += 0.1) stem.push([x + bend * t * t, h + 10 - (h + 10 - top) * t]);
      pencilStroke(p, rand, stem, PENCIL.green, 1.2 * s, 0.6);
      const color = [PENCIL.pink, PENCIL.yellow, PENCIL.purple, PENCIL.coral, PENCIL.blue][k % 5];
      scribble(p, rand, x + bend, top, (8 + rand() * 7) * s, color, { loops: 9, weight: 1.2 * s, alpha: 0.7 });
    }
    for (let k = 0; k < 520; k += 1) {
      const x = rand() * w;
      const base = h * (0.94 + rand() * 0.08);
      const tall = h * (0.05 + rand() * 0.12);
      const lean = (rand() - 0.5) * 30 * s;
      const blade = [];
      for (let t = 0; t <= 1; t += 0.2) blade.push([x + lean * t * t, base - tall * t]);
      pencilStroke(p, rand, blade, greens[k % 3], 1.1 * s, 0.45);
    }
  },
  ribbon(p, rand, w, h, s) {
    const curve = spline([[-0.06, 0.92], [0.18, 0.72], [0.42, 0.8], [0.62, 0.5], [0.8, 0.26], [1.06, 0.12]], w, h);
    band(p, rand, curve, { colors: [PENCIL.rose, PENCIL.coral, PENCIL.orange, PENCIL.yellow, PENCIL.green, PENCIL.teal, PENCIL.blue, PENCIL.purple], count: 24, gap: 3.6 * s, wobble: 1.2 * s, steps: 220, weight: 1.3 * s, twist: 2.5 });
    const thin = spline([[-0.06, 0.18], [0.2, 0.1], [0.4, 0.2], [0.56, 0.12]], w, h);
    band(p, rand, thin, { colors: [PENCIL.purple, PENCIL.pink], count: 6, gap: 3 * s, weight: 1.1 * s, twist: 1.5 });
  },
  confetti(p, rand, w, h, s) {
    const colors = [PENCIL.red, PENCIL.orange, PENCIL.yellow, PENCIL.green, PENCIL.teal, PENCIL.blue, PENCIL.purple, PENCIL.pink];
    let made = 0;
    for (let tries = 0; made < 54 && tries < 600; tries += 1) {
      const x = rand() * w;
      const y = rand() * h;
      if (Math.abs(x / w - 0.5) < 0.26 && Math.abs(y / h - 0.48) < 0.26) continue;
      made += 1;
      const color = colors[made % colors.length];
      const a = rand() * Math.PI;
      const size = (14 + rand() * 18) * s;
      const kind = made % 4;
      if (kind === 0) scribble(p, rand, x, y, size * 0.45, color, { loops: 7, weight: 1.2 * s, alpha: 0.65 });
      else {
        const points = [];
        for (let t = 0; t <= 1; t += 0.04) {
          const along = (t - 0.5) * size * 2.4;
          const side = kind === 1 ? Math.sin(t * Math.PI * 4) * size * 0.25 : kind === 2 ? ((Math.floor(t * 8) % 2 ? 1 : -1) * size * 0.22) : Math.sin(t * Math.PI * 2) * size * 0.4;
          points.push([x + Math.cos(a) * along - Math.sin(a) * side, y + Math.sin(a) * along + Math.cos(a) * side]);
        }
        pencilStroke(p, rand, points, color, 1.6 * s, 0.7);
      }
    }
  },
  kite(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const clouds = [[0.18, 0.2, 1], [0.84, 0.62, 0.75], [0.12, 0.74, 0.7], [0.62, 0.12, 0.55]];
    for (const [fx, fy, size] of clouds) {
      const cx = w * fx;
      const cy = h * fy;
      const r = m * 0.06 * size;
      const puffs = [[-1.4, 0.3, 0.8], [-0.5, -0.3, 1.1], [0.6, -0.15, 1], [1.4, 0.3, 0.75], [0, 0.45, 0.9]];
      const shape = (ctx2) => puffs.forEach(([dx, dy, pr]) => {
        ctx2.moveTo(cx + dx * r + pr * r, cy + dy * r);
        ctx2.arc(cx + dx * r, cy + dy * r, pr * r, 0, Math.PI * 2);
      });
      hatch(p, rand, shape, [cx - r * 2.4, cy - r * 1.5, r * 4.8, r * 2.6], PENCIL.sky, { angle: -0.4, gap: 3.6 * s, alpha: 0.4 });
      puffs.forEach(([dx, dy, pr]) => ring(p, rand, cx + dx * r, cy + dy * r, pr * r, pr * r, PENCIL.blue, { from: Math.PI * 0.95, to: Math.PI * 2.05, weight: 1.2 * s, alpha: 0.5 }));
    }
    const kx = w * 0.8;
    const ky = h * 0.24;
    const kr = m * 0.07;
    const tips = [[kx, ky - kr * 1.3], [kx + kr, ky], [kx, ky + kr * 1.5], [kx - kr, ky]];
    const quads = [PENCIL.coral, PENCIL.yellow, PENCIL.coral, PENCIL.yellow];
    tips.forEach((tip, k) => {
      const next = tips[(k + 1) % 4];
      hatch(p, rand, (ctx2) => {
        ctx2.moveTo(kx, ky);
        ctx2.lineTo(tip[0], tip[1]);
        ctx2.lineTo(next[0], next[1]);
        ctx2.closePath();
      }, [kx - kr * 1.2, ky - kr * 1.4, kr * 2.4, kr * 3], quads[k], { angle: k % 2 ? 0.7 : -0.7, gap: 3 * s, alpha: 0.5 });
    });
    pencilStroke(p, rand, [...tips, tips[0]], PENCIL.red, 1.5 * s, 0.7);
    pencilStroke(p, rand, [tips[0], tips[2]], PENCIL.red, 1.1 * s, 0.5);
    pencilStroke(p, rand, [tips[1], tips[3]], PENCIL.red, 1.1 * s, 0.5);
    const string = spline([[0.8, 0.24 + (kr * 1.5) / h], [0.76, 0.42], [0.82, 0.58], [0.74, 0.78], [0.78, 1.04]], w, h);
    pencilStroke(p, rand, Array.from({ length: 120 }, (_, i) => string(i / 119)), PENCIL.graphite, 1 * s, 0.55);
    [0.18, 0.34, 0.5].forEach((t, k) => {
      const [bx, by] = string(t);
      ring(p, rand, bx - 6 * s, by, 6 * s, 3 * s, [PENCIL.blue, PENCIL.pink, PENCIL.green][k], { tilt: 0.4, weight: 1.3 * s });
      ring(p, rand, bx + 6 * s, by, 6 * s, 3 * s, [PENCIL.blue, PENCIL.pink, PENCIL.green][k], { tilt: -0.4, weight: 1.3 * s });
    });
  },
};

const INK = {
  dark: "#3f3d44",
  hair: "#5a4636",
  mint: "#8fd9c0",
  skin: "#f0b8a0",
  grey: "#8d8c94",
};

function sketch(p, rand, s, ox, oy, k) {
  const at = ([x, y]) => [ox + x * k, oy + y * k];
  const trace = (pts, closed = false) => {
    const abs = pts.map(at);
    if (closed) abs.push(abs[0]);
    if (abs.length < 3) return abs;
    const curve = spline(abs, 1, 1);
    let length = 0;
    for (let i = 1; i < abs.length; i += 1) length += Math.hypot(abs[i][0] - abs[i - 1][0], abs[i][1] - abs[i - 1][1]);
    const n = Math.max(8, Math.round(length / 3));
    return Array.from({ length: n + 1 }, (_, i) => curve(i / n));
  };
  const bounds = (pts) => {
    const xs = pts.map(([x]) => x);
    const ys = pts.map(([, y]) => y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    return [left, top, Math.max(...xs) - left, Math.max(...ys) - top];
  };
  const solid = (shape) => {
    p.save();
    p.fillStyle = wall.bg;
    p.beginPath();
    shape(p);
    p.fill();
    p.restore();
  };
  return {
    line(pts, color, weight = 1.3, alpha = 0.7) {
      pencilStroke(p, rand, trace(pts), color, weight * s, alpha);
    },
    fill(pts, color, { angle = -0.7, gap = 3.6, alpha = 0.42, outline = color, weight = 1.3, opaque = false } = {}) {
      const path = trace(pts, true);
      const shape = (c) => path.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      if (opaque) solid(shape);
      if (color) hatch(p, rand, shape, bounds(path), color, { angle, gap: gap * s, alpha, weight: 1.05 * s });
      if (outline) pencilStroke(p, rand, path, outline, weight * s, 0.7);
    },
    oval(x, y, rx, ry, color, { fill: tone, opaque = false, tilt = 0, alpha = 0.7, weight = 1.3, angle = -0.7, gap = 3.6, from, to } = {}) {
      const [cx, cy] = at([x, y]);
      const shape = (c) => c.ellipse(cx, cy, rx * k, ry * k, tilt, 0, Math.PI * 2);
      const reach = (rx + ry) * k;
      if (opaque) solid(shape);
      if (tone) hatch(p, rand, shape, [cx - reach, cy - reach, reach * 2, reach * 2], tone, { angle, gap: gap * s, alpha: 0.42, weight: 1.05 * s });
      if (color) ring(p, rand, cx, cy, rx * k, ry * k, color, { tilt, alpha, weight: weight * s, from, to });
    },
    blob(x, y, r, color, loops = 10) {
      const [cx, cy] = at([x, y]);
      scribble(p, rand, cx, cy, r * k, color, { loops, weight: 1.2 * s, alpha: 0.75 });
    },
    band(pts, colors, count = 12, gap = 2.6, options = {}) {
      band(p, rand, spline(pts.map(at), 1, 1), { colors, count, gap: gap * s, wobble: 2 * s, weight: 1.3 * s, alpha: 0.6, ...options });
    },
  };
}

function rain(p, rand, w, h, s, color, count = 140) {
  for (let k = 0; k < count; k += 1) {
    const x = rand() * w;
    const y = rand() * h;
    const len = (10 + rand() * 14) * s;
    pencilStroke(p, rand, [[x, y], [x - len * 0.3, y + len]], color, 1.1 * s, 0.45);
  }
}

function twinkle(p, rand, x, y, size, color, s) {
  pencilStroke(p, rand, [[x - size, y], [x + size, y]], color, 1.3 * s, 0.7);
  pencilStroke(p, rand, [[x, y - size], [x, y + size]], color, 1.3 * s, 0.7);
}

function note(d, x, y, color) {
  d.oval(x, y, 0.06, 0.045, color, { fill: color, tilt: -0.4 });
  d.line([[x + 0.055, y - 0.01], [x + 0.055, y - 0.3]], color, 1.4);
  d.line([[x + 0.055, y - 0.3], [x + 0.13, y - 0.24], [x + 0.15, y - 0.16]], color, 1.4);
}

function face(d, x, y, { rx = 0.3, ry = 0.38, lips = PENCIL.red, open = false } = {}) {
  d.oval(x, y, rx, ry, INK.dark, { opaque: true, weight: 1.2 });
  const eye = (ex) => {
    if (open) d.blob(x + ex, y - ry * 0.08, 0.03, INK.dark, 8);
    else d.line([[x + ex - 0.07, y - ry * 0.1], [x + ex, y - ry * 0.02], [x + ex + 0.07, y - ry * 0.1]], INK.dark, 1.8, 0.9);
    d.line([[x + ex - 0.07, y - ry * 0.3], [x + ex, y - ry * 0.34], [x + ex + 0.07, y - ry * 0.3]], INK.dark, 1.4, 0.75);
  };
  eye(-rx * 0.4);
  eye(rx * 0.4);
  d.line([[x, y + ry * 0.02], [x - 0.03, y + ry * 0.25], [x + 0.02, y + ry * 0.3]], INK.dark, 1.3, 0.8);
  d.oval(x, y + ry * 0.55, 0.06, 0.022, lips, { fill: lips, weight: 1.1 });
  d.blob(x - rx * 0.55, y + ry * 0.3, 0.05, PENCIL.pink, 5);
  d.blob(x + rx * 0.55, y + ry * 0.3, 0.05, PENCIL.pink, 5);
}

function bust(d, color, edge) {
  d.line([[-0.11, 0.02], [-0.11, 0.2]], INK.dark, 1.1);
  d.line([[0.11, 0.02], [0.11, 0.2]], INK.dark, 1.1);
  d.fill([[-0.95, 1.4], [-0.8, 0.4], [-0.16, 0.2], [0, 0.42], [0.16, 0.2], [0.8, 0.4], [0.95, 1.4]], color, { outline: edge, angle: -1.1, opaque: true });
}

function butterfly(d, x, y, upper, lower) {
  d.oval(x - 0.34, y - 0.22, 0.34, 0.26, upper, { fill: upper, tilt: 0.5 });
  d.oval(x + 0.34, y - 0.22, 0.34, 0.26, upper, { fill: upper, tilt: -0.5, angle: 0.7 });
  d.oval(x - 0.24, y + 0.24, 0.22, 0.18, lower, { fill: lower, tilt: -0.5 });
  d.oval(x + 0.24, y + 0.24, 0.22, 0.18, lower, { fill: lower, tilt: 0.5, angle: 0.7 });
  d.blob(x - 0.36, y - 0.26, 0.08, lower, 6);
  d.blob(x + 0.36, y - 0.26, 0.08, lower, 6);
  d.oval(x, y, 0.05, 0.38, INK.dark, { fill: INK.dark, opaque: true });
  d.line([[x - 0.02, y - 0.36], [x - 0.12, y - 0.62], [x - 0.2, y - 0.66]], INK.dark, 1.1);
  d.line([[x + 0.02, y - 0.36], [x + 0.12, y - 0.62], [x + 0.2, y - 0.66]], INK.dark, 1.1);
}

function balloon(d, x, y, body, stripe) {
  const shape = [[0, -1], [0.55, -0.75], [0.62, -0.25], [0.32, 0.28], [0, 0.4], [-0.32, 0.28], [-0.62, -0.25], [-0.55, -0.75]].map(([bx, by]) => [x + bx, y + by]);
  d.fill(shape, body, { angle: -1.2 });
  for (const off of [-0.3, 0, 0.3]) d.line([[x, y - 1], [x + off * 1.4, y - 0.4], [x + off * 0.6, y + 0.34]], stripe, 1.4);
  d.line([[x - 0.2, y + 0.36], [x - 0.12, y + 0.62]], INK.dark, 1);
  d.line([[x + 0.2, y + 0.36], [x + 0.12, y + 0.62]], INK.dark, 1);
  d.fill([[x - 0.14, y + 0.62], [x + 0.14, y + 0.62], [x + 0.12, y + 0.82], [x - 0.12, y + 0.82]], PENCIL.brown, { angle: 0.8, gap: 2.6 });
}

function mushroom(d, x, y, size, cap) {
  const pt = (px, py) => [x + px * size, y + py * size];
  d.fill([pt(-0.14, 0), pt(-0.18, 0.6), pt(0.18, 0.6), pt(0.14, 0)], INK.grey, { alpha: 0.25, outline: PENCIL.brown });
  d.fill([pt(-0.6, 0.02), pt(-0.45, -0.38), pt(0, -0.55), pt(0.45, -0.38), pt(0.6, 0.02)], cap, { opaque: true, angle: -0.5 });
  for (const [dx, dy, r] of [[-0.25, -0.25, 0.08], [0.15, -0.35, 0.07], [0.35, -0.12, 0.06], [-0.05, -0.12, 0.05]]) {
    d.oval(x + dx * size, y + dy * size, r * size, r * size * 0.8, INK.grey, { opaque: true, weight: 1 });
  }
}

function penguin(d, x, y, size, scarf) {
  const pt = (px, py) => [x + px * size, y + py * size];
  d.oval(...pt(0, 0), 0.34 * size, 0.52 * size, INK.dark, { fill: INK.dark, gap: 2.6 });
  d.oval(...pt(0, 0.1), 0.21 * size, 0.38 * size, INK.grey, { opaque: true, weight: 1 });
  d.oval(...pt(-0.36, 0.05), 0.08 * size, 0.26 * size, INK.dark, { fill: INK.dark, tilt: 0.3 });
  d.oval(...pt(0.36, 0.05), 0.08 * size, 0.26 * size, INK.dark, { fill: INK.dark, tilt: -0.3 });
  d.blob(...pt(-0.1, -0.3), 0.03 * size, "#ffffff", 4);
  d.blob(...pt(-0.1, -0.3), 0.02 * size, INK.dark, 4);
  d.blob(...pt(0.1, -0.3), 0.02 * size, INK.dark, 4);
  d.fill([pt(-0.07, -0.22), pt(0.07, -0.22), pt(0, -0.12)], PENCIL.orange, { gap: 2 });
  d.oval(...pt(-0.12, 0.52), 0.1 * size, 0.04 * size, PENCIL.orange, { fill: PENCIL.orange });
  d.oval(...pt(0.12, 0.52), 0.1 * size, 0.04 * size, PENCIL.orange, { fill: PENCIL.orange });
  if (scarf) d.band([pt(-0.3, -0.12), pt(0, -0.06), pt(0.3, -0.12)], [scarf], 5, 2.2);
}

Object.assign(pencilArt, {
  windgirl(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.78, h * 0.62, m * 0.3);
    const flows = [
      [PENCIL.blue, [[0, -0.6], [-0.5, -0.5], [-1, -0.75], [-1.5, -0.55], [-2, -0.7]]],
      [PENCIL.pink, [[0, -0.66], [-0.3, -1], [-0.8, -1.2], [-1.1, -1.05], [-0.95, -0.85]]],
      [PENCIL.purple, [[0.05, -0.66], [0.4, -1.05], [0.9, -1.1], [1.3, -1.25]]],
      [PENCIL.green, [[0.2, -0.55], [0.6, -0.6], [0.9, -0.4], [1.3, -0.55]]],
      [PENCIL.coral, [[-0.1, -0.7], [-0.2, -1.2], [0.1, -1.5], [0.4, -1.4]]],
      [PENCIL.red, [[-0.25, -0.5], [-0.7, -0.3], [-1.1, -0.45], [-1.4, -0.25]]],
    ];
    for (const [color, points] of flows) d.band(points, [color], 16, 2.4);
    face(d, 0, -0.32);
    d.band([[-0.32, -0.55], [-0.12, -0.42], [0.1, -0.6], [0.32, -0.48]], [PENCIL.yellow], 12, 2.2);
    bust(d, INK.mint, PENCIL.teal);
    d.line([[-0.14, 0.22], [0, 0.3], [0.14, 0.22]], PENCIL.orange, 1.4);
    d.line([[-0.16, 0.2], [-0.34, 0.55], [-0.22, 1.3]], PENCIL.teal, 1.3);
    d.line([[0.16, 0.2], [0.34, 0.55], [0.22, 1.3]], PENCIL.teal, 1.3);
  },
  crowngirl(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.6, m * 0.3);
    d.fill([[0, -0.82], [0.46, -0.55], [0.5, 0.1], [0.62, 0.9], [0.2, 0.75], [-0.2, 0.75], [-0.62, 0.9], [-0.5, 0.1], [-0.46, -0.55]], PENCIL.brown, { angle: -1.4, gap: 3 });
    face(d, 0, -0.28, { open: true, lips: PENCIL.rose });
    bust(d, PENCIL.coral, PENCIL.red);
    const crown = [PENCIL.pink, PENCIL.yellow, PENCIL.purple, PENCIL.coral, PENCIL.pink];
    crown.forEach((color, k) => {
      const a = Math.PI * (1.1 + k * 0.2);
      const fx = Math.cos(a) * 0.36;
      const fy = -0.36 + Math.sin(a) * 0.4;
      d.oval(fx + 0.06, fy + 0.02, 0.07, 0.03, PENCIL.green, { fill: PENCIL.green, tilt: 0.5 });
      d.blob(fx, fy, 0.07, color, 10);
    });
  },
  umbrella(p, rand, w, h, s) {
    const m = Math.min(w, h);
    rain(p, rand, w, h, s, PENCIL.sky);
    const d = sketch(p, rand, s, w * 0.78, h * 0.6, m * 0.3);
    d.oval(0, 1.02, 0.5, 0.06, PENCIL.sky, { fill: PENCIL.sky });
    d.fill([[-0.13, -0.2], [-0.3, 0.6], [0.3, 0.6], [0.13, -0.2]], PENCIL.yellow, { outline: PENCIL.orange, opaque: true });
    d.line([[-0.1, 0.6], [-0.12, 0.92]], INK.dark, 1.3);
    d.line([[0.1, 0.6], [0.12, 0.92]], INK.dark, 1.3);
    d.oval(-0.14, 0.95, 0.08, 0.05, PENCIL.red, { fill: PENCIL.red });
    d.oval(0.14, 0.95, 0.08, 0.05, PENCIL.red, { fill: PENCIL.red });
    d.oval(0, -0.36, 0.15, 0.17, INK.dark, { opaque: true });
    d.fill([[-0.16, -0.36], [-0.12, -0.52], [0.05, -0.56], [0.17, -0.42], [0.18, -0.2], [0.1, -0.38], [-0.1, -0.4]], INK.hair, { gap: 2.4 });
    d.line([[0.12, -0.05], [0.04, -0.2]], INK.dark, 1.2);
    d.line([[0.04, -1.1], [0.04, -0.15], [0.1, -0.08], [0.16, -0.15]], INK.dark, 1.4);
    d.fill([[-0.75, -0.55], [-0.55, -0.98], [0.04, -1.12], [0.6, -0.98], [0.8, -0.55], [0.55, -0.62], [0.3, -0.54], [0.04, -0.62], [-0.22, -0.54], [-0.48, -0.62]], PENCIL.coral, { outline: PENCIL.red, angle: -0.4 });
  },
  headphones(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.6, m * 0.3);
    bust(d, PENCIL.teal, PENCIL.teal);
    d.line([[-0.05, 0.24], [-0.08, 0.55]], "#ffffff", 1.4);
    d.line([[0.05, 0.24], [0.08, 0.55]], "#ffffff", 1.4);
    face(d, 0, -0.26, { lips: PENCIL.coral });
    d.fill([[-0.31, -0.32], [-0.28, -0.56], [-0.08, -0.7], [0.16, -0.68], [0.32, -0.5], [0.3, -0.3], [0.12, -0.46], [-0.1, -0.42]], INK.hair, { gap: 2.4 });
    d.oval(0, -0.3, 0.38, 0.44, PENCIL.purple, { from: Math.PI * 1.02, to: Math.PI * 1.98, weight: 3 });
    d.oval(-0.36, -0.24, 0.08, 0.13, PENCIL.purple, { fill: PENCIL.purple, opaque: true, gap: 2.4 });
    d.oval(0.36, -0.24, 0.08, 0.13, PENCIL.purple, { fill: PENCIL.purple, opaque: true, gap: 2.4 });
    note(d, 0.6, -0.7, PENCIL.pink);
    note(d, 0.9, -0.35, PENCIL.yellow);
    note(d, 0.75, -1.1, PENCIL.blue);
  },
  astronaut(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const planet = sketch(p, rand, s, w * 0.16, h * 0.24, m * 0.1);
    planet.oval(0, 0, 0.7, 0.7, PENCIL.purple, { fill: PENCIL.pink });
    planet.oval(0, 0, 1.25, 0.32, PENCIL.orange, { tilt: -0.3, weight: 1.8 });
    for (let k = 0; k < 14; k += 1) twinkle(p, rand, rand() * w, rand() * h, (3 + rand() * 4) * s, k % 2 ? PENCIL.yellow : PENCIL.blue, s);
    const d = sketch(p, rand, s, w * 0.8, h * 0.5, m * 0.28);
    d.line([[-0.5, 0.3], [-1, 0.6], [-1.3, 0.3], [-1.8, 0.7]], INK.grey, 1.2);
    d.oval(-0.2, 0.82, 0.11, 0.26, INK.dark, { opaque: true, tilt: 0.2 });
    d.oval(0.2, 0.82, 0.11, 0.26, INK.dark, { opaque: true, tilt: -0.2 });
    d.oval(-0.55, 0.12, 0.26, 0.1, INK.dark, { opaque: true, tilt: -0.6 });
    d.oval(0.55, 0.0, 0.26, 0.1, INK.dark, { opaque: true, tilt: 0.8 });
    d.fill([[-0.36, -0.06], [0.36, -0.06], [0.42, 0.62], [-0.42, 0.62]], INK.grey, { outline: INK.dark, alpha: 0.22, opaque: true, gap: 5 });
    d.fill([[-0.16, 0.12], [0.16, 0.12], [0.16, 0.34], [-0.16, 0.34]], PENCIL.coral, { gap: 2.4 });
    d.oval(0, -0.42, 0.38, 0.36, INK.dark, { opaque: true });
    d.oval(0.04, -0.4, 0.26, 0.19, PENCIL.blue, { fill: PENCIL.blue, gap: 2.6 });
    d.line([[-0.1, -0.5], [0.0, -0.54]], "#ffffff", 2);
  },
  sleepycat(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.8, m * 0.26);
    d.oval(0, 0.36, 1.05, 0.2, PENCIL.purple, { fill: PENCIL.pink });
    d.oval(0, 0, 0.75, 0.4, PENCIL.orange, { fill: PENCIL.orange, opaque: true });
    for (const x of [-0.4, -0.2, 0]) d.line([[x, -0.38], [x + 0.05, -0.2]], PENCIL.brown, 1.4);
    d.band([[-0.72, 0.05], [-0.6, 0.36], [-0.1, 0.42], [0.3, 0.34]], [PENCIL.orange], 6, 2.2);
    d.fill([[0.33, -0.3], [0.38, -0.6], [0.52, -0.4]], PENCIL.orange, { opaque: true });
    d.fill([[0.62, -0.42], [0.78, -0.62], [0.82, -0.3]], PENCIL.orange, { opaque: true });
    d.oval(0.58, -0.16, 0.3, 0.26, PENCIL.orange, { fill: PENCIL.orange, opaque: true });
    d.line([[0.42, -0.18], [0.47, -0.14], [0.52, -0.18]], INK.dark, 1.2);
    d.line([[0.64, -0.18], [0.69, -0.14], [0.74, -0.18]], INK.dark, 1.2);
    d.blob(0.58, -0.08, 0.025, PENCIL.rose, 5);
    for (const dy of [-0.06, 0]) {
      d.line([[0.4, -0.06 + dy], [0.2, -0.1 + dy * 2]], INK.dark, 0.9, 0.5);
      d.line([[0.76, -0.06 + dy], [0.96, -0.1 + dy * 2]], INK.dark, 0.9, 0.5);
    }
    [[0.95, -0.6, 0.06], [1.1, -0.82, 0.08], [1.3, -1.08, 0.1]].forEach(([x, y, z]) => d.line([[x - z, y - z], [x + z, y - z], [x - z, y + z], [x + z, y + z]], PENCIL.blue, 1.3));
  },
  peekcat(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.8, h * 0.86, m * 0.3);
    d.fill([[-0.42, -0.2], [-0.36, -0.68], [-0.12, -0.38]], INK.grey, { outline: INK.dark, alpha: 0.3 });
    d.fill([[0.42, -0.2], [0.36, -0.68], [0.12, -0.38]], INK.grey, { outline: INK.dark, alpha: 0.3 });
    d.fill([[-0.34, -0.3], [-0.32, -0.56], [-0.18, -0.38]], PENCIL.pink, { outline: null });
    d.fill([[0.34, -0.3], [0.32, -0.56], [0.18, -0.38]], PENCIL.pink, { outline: null });
    d.oval(0, 0, 0.52, 0.42, INK.dark, { fill: INK.grey, opaque: true, gap: 4.4 });
    for (const x of [-0.2, 0.2]) {
      d.oval(x, -0.06, 0.1, 0.12, INK.dark, { fill: PENCIL.green, opaque: true, gap: 2.4 });
      d.oval(x, -0.06, 0.025, 0.09, INK.dark, { fill: INK.dark });
    }
    d.fill([[-0.05, 0.1], [0.05, 0.1], [0, 0.16]], PENCIL.rose, { gap: 1.8 });
    d.line([[-0.12, 0.22], [-0.06, 0.26], [0, 0.18], [0.06, 0.26], [0.12, 0.22]], INK.dark, 1.1);
    for (const dy of [0.12, 0.2]) {
      d.line([[-0.26, dy], [-0.7, dy - 0.04]], INK.dark, 0.9, 0.5);
      d.line([[0.26, dy], [0.7, dy - 0.04]], INK.dark, 0.9, 0.5);
    }
    d.line([[-1.4, 0.46], [1.6, 0.46]], PENCIL.brown, 2.4);
    d.oval(-0.34, 0.42, 0.16, 0.09, INK.dark, { fill: INK.grey, opaque: true });
    d.oval(0.34, 0.42, 0.16, 0.09, INK.dark, { fill: INK.grey, opaque: true });
  },
  fox(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.8, h * 0.66, m * 0.3);
    d.fill([[0.3, 0.72], [0.8, 0.5], [1.02, 0.1], [0.88, -0.12], [0.74, 0.28], [0.35, 0.5]], PENCIL.orange, { outline: PENCIL.red });
    d.fill([[0.88, -0.12], [1.02, 0.1], [0.98, -0.02]], PENCIL.yellow, { outline: null, gap: 2 });
    d.fill([[-0.3, -0.12], [-0.46, 0.4], [-0.4, 0.82], [0.4, 0.82], [0.46, 0.4], [0.3, -0.12]], PENCIL.orange, { outline: PENCIL.red, opaque: true, angle: -1.2 });
    d.fill([[-0.14, 0], [-0.2, 0.4], [0, 0.62], [0.2, 0.4], [0.14, 0]], PENCIL.yellow, { outline: null, gap: 3 });
    d.line([[-0.16, 0.5], [-0.16, 0.82]], PENCIL.red, 1.2);
    d.line([[0.16, 0.5], [0.16, 0.82]], PENCIL.red, 1.2);
    d.fill([[-0.42, -0.42], [-0.28, -0.96], [-0.1, -0.62], [0.1, -0.62], [0.28, -0.96], [0.42, -0.42], [0, -0.08]], PENCIL.orange, { outline: PENCIL.red, opaque: true });
    d.fill([[-0.3, -0.42], [-0.08, -0.3], [0, -0.1], [-0.2, -0.3]], PENCIL.yellow, { outline: null, gap: 2.4 });
    d.fill([[0.3, -0.42], [0.08, -0.3], [0, -0.1], [0.2, -0.3]], PENCIL.yellow, { outline: null, gap: 2.4 });
    d.blob(-0.14, -0.46, 0.03, INK.dark, 6);
    d.blob(0.14, -0.46, 0.03, INK.dark, 6);
    d.blob(0, -0.14, 0.035, INK.dark, 6);
  },
  bunny(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.7, m * 0.28);
    for (let k = 0; k < 40; k += 1) {
      const x = -1.2 + rand() * 2.6;
      d.line([[x, 0.86], [x + (rand() - 0.5) * 0.1, 0.7 - rand() * 0.12]], PENCIL.green, 1.1, 0.55);
    }
    d.oval(0, 0.3, 0.45, 0.5, INK.dark, { opaque: true });
    d.oval(-0.14, -0.84, 0.09, 0.34, INK.dark, { fill: PENCIL.pink, tilt: -0.15, opaque: true });
    d.oval(0.14, -0.84, 0.09, 0.34, INK.dark, { fill: PENCIL.pink, tilt: 0.15, opaque: true });
    d.oval(0, -0.34, 0.3, 0.26, INK.dark, { opaque: true });
    d.blob(-0.11, -0.38, 0.025, INK.dark, 5);
    d.blob(0.11, -0.38, 0.025, INK.dark, 5);
    d.blob(0, -0.28, 0.03, PENCIL.rose, 5);
    d.blob(-0.18, -0.26, 0.04, PENCIL.pink, 4);
    d.blob(0.18, -0.26, 0.04, PENCIL.pink, 4);
    d.fill([[0.3, 0.25], [0.78, 0.05], [0.36, 0.4]], PENCIL.orange, { outline: PENCIL.orange, gap: 2.4 });
    d.line([[0.78, 0.05], [0.92, -0.08]], PENCIL.green, 1.4);
    d.line([[0.78, 0.05], [0.9, 0.06]], PENCIL.green, 1.4);
  },
  bear(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.8, h * 0.74, m * 0.26);
    d.line([[0.5, -1.12], [0.42, -0.8], [0.52, -0.45], [0.36, -0.05]], INK.dark, 1);
    d.oval(0.5, -1.5, 0.3, 0.36, PENCIL.red, { fill: PENCIL.red, angle: -1 });
    d.oval(0.5, -1.5, 0.08, 0.1, "#ffffff", { from: Math.PI, to: Math.PI * 1.5, weight: 2 });
    d.oval(-0.2, 0.78, 0.16, 0.1, PENCIL.brown, { fill: PENCIL.brown });
    d.oval(0.2, 0.78, 0.16, 0.1, PENCIL.brown, { fill: PENCIL.brown });
    d.oval(0, 0.36, 0.44, 0.46, PENCIL.brown, { fill: PENCIL.brown, opaque: true });
    d.oval(0, 0.4, 0.24, 0.26, PENCIL.orange, { fill: PENCIL.yellow });
    d.oval(-0.42, 0.3, 0.1, 0.2, PENCIL.brown, { fill: PENCIL.brown, tilt: 0.3 });
    d.oval(0.36, 0.02, 0.1, 0.22, PENCIL.brown, { fill: PENCIL.brown, tilt: 0.6, opaque: true });
    d.oval(-0.28, -0.62, 0.11, 0.11, PENCIL.brown, { fill: PENCIL.brown });
    d.oval(0.28, -0.62, 0.11, 0.11, PENCIL.brown, { fill: PENCIL.brown });
    d.oval(0, -0.36, 0.36, 0.32, PENCIL.brown, { fill: PENCIL.brown, opaque: true });
    d.oval(0, -0.24, 0.14, 0.1, PENCIL.brown, { fill: PENCIL.yellow, opaque: true });
    d.blob(-0.13, -0.42, 0.03, INK.dark, 6);
    d.blob(0.13, -0.42, 0.03, INK.dark, 6);
    d.blob(0, -0.28, 0.035, INK.dark, 6);
  },
  owl(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.18, h * 0.4, m * 0.26);
    d.oval(1.3, -1.1, 0.2, 0.2, PENCIL.yellow, { fill: PENCIL.yellow });
    d.line([[-1.6, 0.62], [-0.6, 0.55], [0.4, 0.6], [1.3, 0.5]], PENCIL.brown, 3);
    for (const [x, y, a] of [[-1.1, 0.48, -0.6], [0.8, 0.44, 0.5], [1.15, 0.6, -0.3]]) d.oval(x, y, 0.16, 0.06, PENCIL.green, { fill: PENCIL.leaf, tilt: a });
    d.fill([[-0.36, -0.42], [-0.3, -0.72], [-0.14, -0.5]], PENCIL.brown, {});
    d.fill([[0.36, -0.42], [0.3, -0.72], [0.14, -0.5]], PENCIL.brown, {});
    d.oval(0, 0, 0.42, 0.56, PENCIL.brown, { fill: PENCIL.brown, opaque: true });
    d.oval(0, 0.16, 0.26, 0.34, PENCIL.orange, { fill: PENCIL.yellow, opaque: true });
    d.oval(-0.4, 0.1, 0.12, 0.32, PENCIL.brown, { fill: PENCIL.brown, tilt: 0.2 });
    d.oval(0.4, 0.1, 0.12, 0.32, PENCIL.brown, { fill: PENCIL.brown, tilt: -0.2 });
    for (const x of [-0.16, 0.16]) {
      d.oval(x, -0.24, 0.15, 0.15, INK.dark, { fill: PENCIL.yellow, opaque: true });
      d.blob(x, -0.24, 0.05, INK.dark, 8);
    }
    d.fill([[-0.06, -0.1], [0.06, -0.1], [0, 0.02]], PENCIL.orange, { gap: 1.8 });
    d.line([[-0.12, 0.56], [-0.12, 0.62]], PENCIL.orange, 2);
    d.line([[0.12, 0.56], [0.12, 0.62]], PENCIL.orange, 2);
  },
  penguins(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.74, m * 0.34);
    d.fill([[-1.6, 0.62], [-0.6, 0.5], [0.6, 0.55], [1.8, 0.48], [1.8, 1.4], [-1.6, 1.4]], PENCIL.sky, { outline: PENCIL.blue, angle: -0.2 });
    penguin(d, 0, 0, 1, PENCIL.red);
    penguin(d, 0.8, 0.18, 0.66, null);
    for (let k = 0; k < 30; k += 1) d.blob(-1.4 + rand() * 3, -1.4 + rand() * 1.2, 0.012, PENCIL.sky, 3);
  },
  robin(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.8, h * 0.28, m * 0.32);
    d.line([[-1.4, 0.7], [-0.4, 0.38], [0.6, 0.3], [1.6, -0.1]], PENCIL.brown, 2.6);
    d.line([[0.9, 0.18], [1.2, 0.45], [1.3, 0.7]], PENCIL.brown, 1.6);
    for (const [x, y] of [[-1, 0.5], [-0.7, 0.32], [1.1, 0.1], [1.3, 0.58], [1.45, -0.2], [-1.2, 0.72]]) d.blob(x, y, 0.08, PENCIL.pink, 8);
    d.fill([[-0.3, 0], [-0.75, -0.08], [-0.62, 0.12]], PENCIL.brown, {});
    d.oval(0, 0, 0.38, 0.3, PENCIL.brown, { fill: PENCIL.brown, opaque: true });
    d.oval(0.14, 0.06, 0.22, 0.2, PENCIL.red, { fill: PENCIL.coral, opaque: true });
    d.oval(0.3, -0.24, 0.19, 0.17, PENCIL.brown, { fill: PENCIL.brown, opaque: true });
    d.blob(0.36, -0.28, 0.025, INK.dark, 5);
    d.fill([[0.48, -0.26], [0.62, -0.22], [0.48, -0.18]], PENCIL.orange, { gap: 1.8 });
    d.line([[-0.04, 0.28], [-0.06, 0.36]], INK.dark, 1.2);
    d.line([[0.1, 0.28], [0.1, 0.34]], INK.dark, 1.2);
  },
  whale(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.3, h * 0.76, m * 0.3);
    d.fill([[-1, 0], [-0.6, -0.42], [0.2, -0.46], [0.8, -0.2], [0.96, 0.14], [0.5, 0.34], [-0.4, 0.3]], PENCIL.blue, { angle: -0.3, outline: PENCIL.blue });
    d.fill([[-0.98, 0], [-1.36, -0.36], [-1.2, 0], [-1.4, 0.3]], PENCIL.blue, {});
    for (const y of [0.12, 0.2, 0.28]) d.line([[0.1, y], [0.6, y - 0.06]], PENCIL.sky, 1.2);
    d.blob(0.56, -0.1, 0.03, INK.dark, 6);
    d.line([[0.6, 0.06], [0.75, 0.08], [0.88, 0.02]], INK.dark, 1.1);
    for (const dx of [-0.2, 0, 0.2]) d.line([[0.2, -0.46], [0.2 + dx * 0.4, -0.7], [0.2 + dx, -0.85]], PENCIL.sky, 1.4);
    [[0, -0.9], [0.4, -0.88], [0.2, -1]].forEach(([x, y]) => d.blob(x, y, 0.025, PENCIL.sky, 4));
    [PENCIL.sky, PENCIL.teal, PENCIL.blue].forEach((color, k) => band(p, rand, waveLine(0.86 + k * 0.05, 0.012, 6 + k, w, h), { colors: [color], count: 5, gap: 2.6 * s, weight: 1.2 * s }));
  },
  koi(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.78, h * 0.55, m * 0.28);
    for (const r of [0.9, 1.2, 1.5]) d.oval(0, 0, r, r * 0.9, PENCIL.sky, { alpha: 0.4 });
    for (const [x, y, a] of [[-1.1, -0.9, 0.3], [1.0, 0.95, -0.4], [-1.2, 1.0, 1.2]]) d.oval(x, y, 0.3, 0.26, PENCIL.green, { fill: PENCIL.leaf, tilt: a });
    const fish = (cx, cy, a, body, spot) => {
      const turn = ([fx, fy]) => [cx + fx * Math.cos(a) - fy * Math.sin(a), cy + fx * Math.sin(a) + fy * Math.cos(a)];
      d.fill([[-0.5, 0], [-0.76, -0.18], [-0.68, 0], [-0.76, 0.18]].map(turn), body, { gap: 2.6 });
      d.fill([[0.52, 0], [0.32, -0.15], [0, -0.17], [-0.3, -0.09], [-0.52, 0], [-0.3, 0.09], [0, 0.17], [0.32, 0.15]].map(turn), body, { opaque: true, gap: 3 });
      for (const pt of [[0.1, -0.05], [-0.18, 0.04], [0.3, 0.05]]) d.blob(...turn(pt), 0.05, spot, 6);
      d.blob(...turn([0.38, -0.06]), 0.015, INK.dark, 4);
    };
    fish(0, -0.55, 0.15, PENCIL.orange, PENCIL.red);
    fish(0, 0.55, Math.PI + 0.15, INK.grey, PENCIL.orange);
  },
  butterflies(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const a = sketch(p, rand, s, w * 0.16, h * 0.3, m * 0.2);
    a.line([[0.4, 0.3], [1, 0.9], [1.6, 0.6], [2.1, 1.3]], INK.grey, 1, 0.4);
    butterfly(a, 0, 0, PENCIL.blue, PENCIL.purple);
    const b = sketch(p, rand, s, w * 0.84, h * 0.7, m * 0.24);
    b.line([[-0.4, -0.3], [-1, -0.9], [-1.6, -0.5], [-2, -1.2]], INK.grey, 1, 0.4);
    butterfly(b, 0, 0, PENCIL.orange, PENCIL.yellow);
    const c = sketch(p, rand, s, w * 0.86, h * 0.2, m * 0.1);
    butterfly(c, 0, 0, PENCIL.pink, PENCIL.rose);
  },
  mushrooms(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.8, m * 0.3);
    for (let k = 0; k < 50; k += 1) {
      const x = -1.2 + rand() * 2.8;
      d.line([[x, 0.62], [x + (rand() - 0.5) * 0.08, 0.5 - rand() * 0.12]], PENCIL.green, 1.1, 0.55);
    }
    mushroom(d, 0, 0.02, 1, PENCIL.red);
    mushroom(d, -0.6, 0.3, 0.55, PENCIL.coral);
    mushroom(d, 0.5, 0.32, 0.45, PENCIL.orange);
    const spiral = [];
    for (let a = 0; a < Math.PI * 5; a += 0.2) spiral.push([1.2 + Math.cos(a) * a * 0.016, 0.38 + Math.sin(a) * a * 0.016]);
    d.fill([[0.95, 0.6], [1.5, 0.6], [1.58, 0.52], [1.5, 0.45], [1.0, 0.5]], PENCIL.yellow, { outline: PENCIL.orange, gap: 2.6 });
    d.oval(1.2, 0.38, 0.26, 0.24, PENCIL.brown, { fill: PENCIL.coral, opaque: true });
    d.line(spiral.reverse(), PENCIL.brown, 1.3);
    d.line([[1.5, 0.48], [1.52, 0.32]], PENCIL.orange, 1.1);
    d.line([[1.56, 0.5], [1.62, 0.36]], PENCIL.orange, 1.1);
  },
  plants(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.82, h * 0.72, m * 0.3);
    const leaves = [[-0.6, -0.5, -0.9], [-0.25, -0.9, -0.3], [0.3, -0.95, 0.3], [0.7, -0.45, 0.9], [0.05, -0.55, 0]];
    for (const [x, y, a] of leaves) {
      d.line([[0, 0.2], [x * 0.5, (y + 0.2) * 0.5], [x, y + 0.12]], PENCIL.green, 1.4);
      d.oval(x, y, 0.26, 0.17, PENCIL.green, { fill: PENCIL.green, tilt: a + Math.PI / 2, opaque: true, angle: a });
      d.line([[x - Math.sin(a) * 0.24, y + Math.cos(a) * 0.16], [x + Math.sin(a) * 0.24, y - Math.cos(a) * 0.16]], PENCIL.leaf, 1.1);
    }
    d.fill([[-0.36, 0.2], [0.36, 0.2], [0.28, 0.78], [-0.28, 0.78]], PENCIL.coral, { outline: PENCIL.red, opaque: true });
    d.fill([[-0.4, 0.14], [0.4, 0.14], [0.4, 0.28], [-0.4, 0.28]], PENCIL.orange, { outline: PENCIL.red, opaque: true });
    const c = sketch(p, rand, s, w * 0.14, h * 0.8, m * 0.22);
    c.oval(0, -0.3, 0.2, 0.6, PENCIL.green, { fill: PENCIL.teal });
    c.line([[-0.18, -0.2], [-0.42, -0.24], [-0.44, -0.6]], PENCIL.green, 2.4);
    c.line([[0.18, -0.4], [0.4, -0.44], [0.42, -0.72]], PENCIL.green, 2.4);
    c.blob(0, -0.92, 0.08, PENCIL.pink, 8);
    c.fill([[-0.3, 0.2], [0.3, 0.2], [0.24, 0.6], [-0.24, 0.6]], PENCIL.yellow, { outline: PENCIL.orange, opaque: true });
  },
  study(p, rand, w, h, s) {
    const m = Math.min(w, h);
    const d = sketch(p, rand, s, w * 0.2, h * 0.7, m * 0.42);
    d.line([[-1.4, 0.62], [1.6, 0.62]], PENCIL.brown, 2.4);
    const books = [[PENCIL.blue, 0.62, 0.4], [PENCIL.coral, 0.44, 0.34], [PENCIL.yellow, 0.28, 0.42], [PENCIL.green, 0.12, 0.36]];
    books.forEach(([color, bottom, half], k) => {
      const dx = (k % 2 ? 0.05 : -0.04);
      d.fill([[-half + dx, bottom], [half + dx, bottom], [half + dx, bottom - 0.16], [-half + dx, bottom - 0.16]], color, { opaque: true, angle: 0 });
      d.line([[-half + dx + 0.06, bottom - 0.08], [half + dx - 0.06, bottom - 0.08]], "#ffffff", 1.2);
    });
    d.oval(0.02, -0.1, 0.1, 0.1, PENCIL.red, { fill: PENCIL.red });
    d.line([[0.02, -0.2], [0.04, -0.28]], PENCIL.brown, 1.4);
    d.oval(0.1, -0.26, 0.06, 0.025, PENCIL.green, { fill: PENCIL.leaf, tilt: -0.4 });
    d.fill([[0.7, 0.2], [1.06, 0.2], [1.02, 0.62], [0.74, 0.62]], PENCIL.purple, { opaque: true });
    d.oval(1.1, 0.38, 0.1, 0.12, PENCIL.purple, { weight: 1.6 });
    for (const x of [0.8, 0.9, 0.98]) d.line([[x, 0.12], [x - 0.05, 0], [x + 0.03, -0.14], [x - 0.02, -0.28]], INK.grey, 1.1, 0.5);
    d.fill([[-1.2, 0.58], [-0.55, 0.42], [-0.53, 0.47], [-1.18, 0.62]], PENCIL.yellow, { gap: 2 });
    d.fill([[-0.55, 0.42], [-0.44, 0.42], [-0.53, 0.47]], INK.dark, { gap: 1.6 });
  },
  balloons(p, rand, w, h, s) {
    const m = Math.min(w, h);
    balloon(sketch(p, rand, s, w * 0.16, h * 0.32, m * 0.24), 0, 0, PENCIL.coral, PENCIL.yellow);
    balloon(sketch(p, rand, s, w * 0.84, h * 0.24, m * 0.16), 0, 0, PENCIL.blue, PENCIL.teal);
    balloon(sketch(p, rand, s, w * 0.8, h * 0.72, m * 0.2), 0, 0, PENCIL.purple, PENCIL.pink);
    for (const [cx, cy, r] of [[0.32, 0.12, 1], [0.66, 0.86, 0.8], [0.1, 0.78, 0.7]]) {
      const c = sketch(p, rand, s, w * cx, h * cy, m * 0.05 * r);
      c.oval(-0.6, 0.1, 0.6, 0.45, PENCIL.sky, { from: Math.PI * 0.9, to: Math.PI * 2 });
      c.oval(0.3, -0.1, 0.7, 0.6, PENCIL.sky, { from: Math.PI, to: Math.PI * 2 });
      c.oval(1.1, 0.12, 0.45, 0.4, PENCIL.sky, { from: Math.PI, to: Math.PI * 2.1 });
    }
  },
});

let paper = null;
let paperKey = "";

function paperFor() {
  const key = `${wall.pencil}:${width}x${height}@${dpr}`;
  if (paper && paperKey === key) return paper;
  paper = paper || document.createElement("canvas");
  paper.width = Math.floor(width * dpr);
  paper.height = Math.floor(height * dpr);
  const p = paper.getContext("2d");
  p.setTransform(dpr, 0, 0, dpr, 0, 0);
  p.clearRect(0, 0, width, height);
  const rand = seeded([...wall.pencil].reduce((sum, letter) => sum * 31 + letter.charCodeAt(0), 7));
  const scale = Math.max(0.8, Math.min(1.5, Math.min(width, height) / 800));
  p.fillStyle = "rgba(70, 64, 56, 0.05)";
  for (let k = 0; k < (width * height) / 900; k += 1) p.fillRect(rand() * width, rand() * height, 1, 1);
  pencilArt[wall.pencil]?.(p, rand, width, height, scale);
  p.globalCompositeOperation = "destination-out";
  const fade = p.createRadialGradient(width / 2, height * 0.44, 0, width / 2, height * 0.44, Math.min(width, height) * 0.46);
  fade.addColorStop(0, "rgba(0, 0, 0, 0.72)");
  fade.addColorStop(1, "rgba(0, 0, 0, 0)");
  p.fillStyle = fade;
  p.fillRect(0, 0, width, height);
  p.globalCompositeOperation = "source-over";
  paperKey = key;
  return paper;
}

function drawSky(now) {
  ctx.clearRect(0, 0, width, height);
  if (wall.pencil) {
    const art = paperFor();
    if (reduced) {
      ctx.drawImage(art, 0, 0, width, height);
      return;
    }
    const strip = 6;
    const t = now / 1000;
    for (let y = 0; y < height; y += strip) {
      const sway = Math.sin(t * 0.55 + y * 0.011) * 1.6 + Math.sin(t * 0.21 + y * 0.004) * 1.1;
      ctx.drawImage(art, 0, y * dpr, art.width, strip * dpr, sway, y, width, strip);
    }
    return;
  }
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

function clockDot(bg, onLight) {
  const found = [];
  for (const match of bg.matchAll(/#([0-9a-f]{3,8})\b/gi)) {
    let hex = match[1];
    if (hex.length === 3) hex = hex.split("").map((part) => part + part).join("");
    hex = hex.slice(0, 6);
    found.push([parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]);
  }
  for (const match of bg.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
    found.push([Number(match[1]), Number(match[2]), Number(match[3])]);
  }
  const colors = found.filter((color) => color.every((part) => Number.isFinite(part)));
  if (!colors.length) return onLight ? "rgb(70, 74, 78)" : "rgb(186, 190, 194)";

  const ranked = colors.map(([r, g, b]) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return { r, g, b, sat: max === 0 ? 0 : (max - min) / max, lum: (r + g + b) / 3 };
  }).sort((a, b) => b.sat - a.sat || Math.abs(128 - a.lum) - Math.abs(128 - b.lum));
  const pick = ranked[0];
  const max = Math.max(pick.r, pick.g, pick.b);
  const min = Math.min(pick.r, pick.g, pick.b);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === pick.r) hue = ((pick.g - pick.b) / delta) % 6;
    else if (max === pick.g) hue = (pick.b - pick.r) / delta + 2;
    else hue = (pick.r - pick.g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const sat = pick.sat < 0.12 ? 0.08 : Math.min(0.72, Math.max(0.46, pick.sat));
  const level = pick.sat < 0.12 ? (onLight ? 0.38 : 0.72) : (onLight ? 0.4 : 0.62);
  const tone = (channel) => {
    const k = (channel + hue / 30) % 12;
    const amount = sat * Math.min(level, 1 - level);
    return Math.round(255 * (level - amount * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return `rgb(${tone(0)}, ${tone(8)}, ${tone(4)})`;
}

function applyWall(index) {
  wallIndex = (index + walls.length) % walls.length;
  wall = walls[wallIndex];
  document.body.style.background = wall.bg;
  document.body.classList.toggle("is-light", Boolean(wall.light));
  document.body.style.setProperty("--clock-dot", wall.dot || clockDot(wall.bg, Boolean(wall.light)));
  wallButton.title = `${wall.name}. Click for a different wallpaper.`;
  wallButton.setAttribute("aria-label", `Another wallpaper, now ${wall.name}`);
  keep(WALL_KEY, String(wallIndex));
}

function isDaytime(date = new Date()) {
  const hour = date.getHours();
  return hour >= 7 && hour < 19;
}

function randomWall() {
  const bySun = stored(AUTO_KEY) === "sun";
  const light = isDaytime();
  const choices = [];
  for (let i = 0; i < walls.length; i += 1) {
    if (i !== wallIndex && walls[i].hue !== wall.hue && (!bySun || Boolean(walls[i].light) === light)) choices.push(i);
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
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const ampm = document.getElementById("ampm");
const dateEl = document.getElementById("date");
const who = document.getElementById("who");
let study = readStudy();
let studyNote = { text: "", until: 0 };
let notesReady = false;

function readStudy() {
  try {
    const session = JSON.parse(stored(STUDY_KEY) || "null");
    return session && Number.isFinite(session.start) && Number.isFinite(session.end) && session.end > session.start ? session : null;
  } catch (error) {
    return null;
  }
}

function showStudy(now) {
  const left = Math.ceil((study.end - now.getTime()) / 1000);
  const minutes = String(Math.floor(left / 60)).padStart(2, "0");
  const seconds = String(left % 60).padStart(2, "0");
  hourEl.textContent = minutes;
  minuteEl.textContent = seconds;
  ampm.textContent = "LEFT";
  document.getElementById("clock").setAttribute("aria-label", `${minutes} minutes ${seconds} seconds of study left`);
  const ends = new Date(study.end).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  dateEl.textContent = `Studying · ends ${ends}`;
}

function tick() {
  const now = new Date();
  const hour = now.getHours();
  greet.textContent = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  if (study && study.end > now.getTime()) {
    document.body.classList.add("is-study");
    showStudy(now);
    return;
  }
  document.body.classList.remove("is-study");
  if (study && notesReady) finishStudy(true);

  const parts = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(now);
  const hourText = parts.find((part) => part.type === "hour").value.padStart(2, "0");
  const minuteText = parts.find((part) => part.type === "minute").value;

  hourEl.textContent = hourText;
  minuteEl.textContent = minuteText;
  ampm.textContent = (parts.find((part) => part.type === "dayPeriod")?.value || "").toUpperCase();
  document.getElementById("clock").setAttribute("aria-label", `${hourText}:${minuteText} ${ampm.textContent}`);
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (studyNote.until > now.getTime()) dateEl.textContent = studyNote.text;
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

function measureWrap(wrap) {
  const hidden = wrap.hidden;
  if (hidden) {
    wrap.hidden = false;
    wrap.style.visibility = "hidden";
  }
  const width = wrap.offsetWidth;
  const height = wrap.offsetHeight;
  if (hidden) {
    wrap.hidden = true;
    wrap.style.visibility = "";
  }
  return { width: width || 280, height: height || 48 };
}

function settle(left, top, wrap) {
  const pad = 16;
  const padTop = 28;
  const snap = 64;
  const { width, height } = measureWrap(wrap);
  const maxLeft = Math.max(pad, window.innerWidth - width - pad);
  const maxTop = Math.max(padTop, window.innerHeight - height - pad);
  let x = Math.min(Math.max(pad, left), maxLeft);
  let y = Math.min(Math.max(padTop, top), maxTop);
  if (x - pad < snap) x = pad;
  if (y - padTop < snap) y = padTop;
  if (maxLeft - x < snap) x = maxLeft;
  if (maxTop - y < snap) y = maxTop;
  return { left: Math.min(Math.max(pad, x), maxLeft), top: Math.min(Math.max(padTop, y), maxTop) };
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
    if (active || event.button !== 0 || event.target.closest("input, label, .pill-hide, .word-hide, .row-delete, .point-pin, .point-text, .point-edit, .point-copy, .point-remind, .remind-pick, .point, .card-size, .day-row, .count-row, .copy-open")) return;
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

const dayStrip = document.getElementById("day-strip");
const countValue = document.getElementById("count-value");
const countUp = document.getElementById("count-up");
const countDown = document.getElementById("count-down");
const countRow = document.getElementById("count-row");
const countWeek = document.getElementById("count-week");
const statLine = document.getElementById("stat-line");
const listAdd = document.getElementById("list-add");
const copyOpen = document.getElementById("copy-open");
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LINK_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;
const DAY_START_HOUR = 4;

function formatKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayKey(date = new Date()) {
  return formatKey(new Date(date.getTime() - DAY_START_HOUR * 60 * 60 * 1000));
}

function dayLabel(key) {
  const current = dayKey();
  if (key === current) return "Today";
  const base = parseKey(current);
  if (key === formatKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() - 1))) return "Yesterday";
  const date = parseKey(key);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(date.getFullYear() !== base.getFullYear() ? { year: "numeric" } : {}),
  });
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(stored(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function cleanNotes(list) {
  return Array.isArray(list) ? list.filter((item) => item && typeof item.text === "string" && item.text) : [];
}

function cleanLists(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((entry) => entry && typeof entry.id === "string" && typeof entry.name === "string" && entry.name)
    .map((entry) => ({ id: entry.id, name: entry.name, notes: cleanNotes(entry.notes) }));
}

function loadNoteStore() {
  if (stored(DAYS_KEY) == null && stored(PINNED_KEY) == null && stored(LISTS_KEY) == null) {
    const old = loadNotes();
    const rest = old.filter((item) => !item.pinned);
    return {
      days: rest.length ? { [dayKey()]: { notes: rest, count: 0, sessions: {} } } : {},
      pinned: old.filter((item) => item.pinned),
      lists: [],
      order: [],
    };
  }
  const raw = readJSON(DAYS_KEY, {});
  const days = {};
  for (const [key, day] of Object.entries(raw && typeof raw === "object" ? raw : {})) {
    if (!DAY_PATTERN.test(key)) continue;
    const sessions = {};
    for (const [start, minutes] of Object.entries(day?.sessions && typeof day.sessions === "object" ? day.sessions : {})) {
      if (Number(minutes) > 0) sessions[start] = Math.floor(Number(minutes));
    }
    days[key] = { notes: cleanNotes(day?.notes), count: Math.max(0, Math.floor(Number(day?.count) || 0)), sessions };
  }
  const order = readJSON(TAB_ORDER_KEY, []);
  return {
    days,
    pinned: cleanNotes(readJSON(PINNED_KEY, [])),
    lists: cleanLists(readJSON(LISTS_KEY, [])),
    order: Array.isArray(order) ? order.filter((view) => typeof view === "string") : [],
  };
}

let { days, pinned, lists, order: tabOrder } = loadNoteStore();
let today = dayKey();
let viewDay = today;

function dayOf(key) {
  if (!days[key]) days[key] = { notes: [], count: 0, sessions: {} };
  return days[key];
}

function studyMinutes(key) {
  return Object.values(days[key]?.sessions || {}).reduce((sum, minutes) => sum + minutes, 0);
}

function isActive(key) {
  return Boolean(days[key]?.count || studyMinutes(key));
}

function shiftKey(key, step) {
  const date = parseKey(key);
  return formatKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + step));
}

function noteStats() {
  const base = parseKey(today);
  const monday = shiftKey(today, -((base.getDay() + 6) % 7));
  let week = 0;
  for (const [key, day] of Object.entries(days)) {
    if (key >= monday && key <= today) week += day.count;
  }
  let streak = 0;
  for (let key = isActive(today) ? today : shiftKey(today, -1); isActive(key); key = shiftKey(key, -1)) streak += 1;
  let best = 0;
  let run = 0;
  let prev = "";
  for (const key of Object.keys(days).filter(isActive).sort()) {
    run = prev && shiftKey(prev, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }
  return { week, streak, best };
}

function formatMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes}m`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function listOf(view) {
  return view.startsWith("list:") ? lists.find((entry) => `list:${entry.id}` === view) || null : null;
}

function viewNotes(view, create = false) {
  if (view.startsWith("list:")) return listOf(view)?.notes || [];
  return create ? dayOf(view).notes : days[view]?.notes || [];
}

function saveNotes() {
  for (const [key, day] of Object.entries(days)) {
    if (!day.notes.length && !day.count && !Object.keys(day.sessions).length) delete days[key];
  }
  keep(DAYS_KEY, JSON.stringify(days));
  keep(PINNED_KEY, JSON.stringify(pinned));
  keep(LISTS_KEY, JSON.stringify(lists));
}

function hasNotes() {
  return pinned.length > 0 || lists.length > 0 || Object.values(days).some((day) => day.notes.length || day.count || Object.keys(day.sessions).length);
}

function inToday(text) {
  return (days[today]?.notes || []).some((entry) => entry.text === text);
}

function copyToToday(items) {
  const target = dayOf(today).notes;
  for (const item of items) {
    if (!inToday(item.text)) target.push({ id: crypto.randomUUID(), text: item.text, done: false });
  }
  saveNotes();
  renderNotes();
}

function syncNotes() {
  const open = hasNotes() && stored(NOTE_OPEN_KEY) !== "0";
  noteWrap.hidden = !open;
  noteToggle.hidden = open;
  if (open) clampPlaces();
}

function viewLabel(view) {
  return listOf(view)?.name || dayLabel(view);
}

function makeSortable(container, selector, across, onDone) {
  let dragged = null;
  container.addEventListener("dragstart", (event) => {
    dragged = event.target.closest?.(selector) || null;
    if (!dragged || !container.contains(dragged)) {
      dragged = null;
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "");
    requestAnimationFrame(() => dragged?.classList.add("is-dragging"));
  });
  container.addEventListener("dragover", (event) => {
    if (!dragged) return;
    event.preventDefault();
    const over = event.target.closest?.(selector);
    if (!over || over === dragged || !container.contains(over)) return;
    const rect = over.getBoundingClientRect();
    const after = across ? event.clientX > rect.left + rect.width / 2 : event.clientY > rect.top + rect.height / 2;
    over[after ? "after" : "before"](dragged);
  });
  container.addEventListener("drop", (event) => {
    if (dragged) event.preventDefault();
  });
  container.addEventListener("dragend", () => {
    if (!dragged) return;
    dragged.classList.remove("is-dragging");
    dragged = null;
    onDone([...container.querySelectorAll(selector)].map((node) => node.dataset.id));
  });
}

function tabViews() {
  const dates = [...new Set([today, ...(DAY_PATTERN.test(viewDay) ? [viewDay] : []), ...Object.keys(days)])].sort().reverse();
  const fresh = [...lists.map((entry) => `list:${entry.id}`), ...dates];
  const views = tabOrder.filter((view) => fresh.includes(view));
  for (const view of fresh) {
    if (views.includes(view)) continue;
    if (!DAY_PATTERN.test(view)) {
      views.push(view);
      continue;
    }
    const older = views.findIndex((other) => DAY_PATTERN.test(other) && other < view);
    const lastDate = views.findLastIndex((other) => DAY_PATTERN.test(other));
    views.splice(older >= 0 ? older : lastDate >= 0 ? lastDate + 1 : views.length, 0, view);
  }
  return views;
}

function addTab(view, count, onRemove) {
  const item = document.createElement("span");
  item.className = view === viewDay ? "day-item is-on" : "day-item";
  item.draggable = true;
  item.dataset.id = view;
  item.title = "Drag to move";

  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "day-chip";
  chip.setAttribute("aria-pressed", String(view === viewDay));
  chip.textContent = viewLabel(view);
  if (count) {
    const badge = document.createElement("span");
    badge.className = "day-count";
    badge.textContent = count;
    chip.append(badge);
  }
  chip.addEventListener("click", () => {
    viewDay = view;
    renderNotes();
  });
  item.append(chip);

  if (view === viewDay && onRemove) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "day-remove";
    remove.setAttribute("aria-label", `Delete ${viewLabel(view)}`);
    remove.textContent = "×";
    remove.addEventListener("click", onRemove);
    item.append(remove);
  }
  dayStrip.append(item);
}

function renderDays() {
  dayStrip.innerHTML = "";
  for (const view of tabViews()) {
    const entry = listOf(view);
    if (entry) {
      addTab(view, 0, () => {
        if (entry.notes.length && !window.confirm(`Delete the ${entry.name} list and its notes?`)) return;
        lists = lists.filter((other) => other.id !== entry.id);
        viewDay = today;
        saveNotes();
        renderNotes();
      });
      continue;
    }
    const key = view;
    addTab(key, days[key]?.count || 0, key === today ? null : () => {
      if (!window.confirm(`Delete every note, count and study time saved for ${dayLabel(key)}?`)) return;
      delete days[key];
      viewDay = today;
      saveNotes();
      renderNotes();
    });
  }
  dayStrip.querySelector(".day-item.is-on")?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function openListName() {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "day-name";
  input.placeholder = "List name";
  input.maxLength = 24;
  listAdd.hidden = true;
  listAdd.after(input);
  input.focus();
  let closed = false;
  const finish = (save) => {
    if (closed) return;
    closed = true;
    const name = input.value.trim();
    input.remove();
    listAdd.hidden = false;
    if (!save || (!name && save === "blur")) return;
    const entry = { id: crypto.randomUUID(), name: name || "Special", notes: [] };
    lists.push(entry);
    viewDay = `list:${entry.id}`;
    saveNotes();
    keep(NOTE_OPEN_KEY, "1");
    renderNotes();
    noteInput.focus();
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
  input.addEventListener("blur", () => finish("blur"));
}

listAdd.addEventListener("click", openListName);

function renderCount() {
  const isList = Boolean(listOf(viewDay));
  countRow.hidden = isList;
  statLine.hidden = isList;
  const { week, streak, best } = noteStats();
  countWeek.textContent = `· ${week} this week`;
  const studied = studyMinutes(viewDay);
  statLine.textContent = [
    streak ? `${streak}-day streak` : "No streak yet",
    best > 1 ? `best ${best} days` : "",
    studied ? `${formatMinutes(studied)} studied` : "",
  ].filter(Boolean).join(" · ");
  const count = days[viewDay]?.count || 0;
  countValue.textContent = count;
  countDown.disabled = count === 0;
  const label = dayLabel(viewDay);
  countUp.setAttribute("aria-label", `Add one application for ${label}`);
  countDown.setAttribute("aria-label", `Remove one application for ${label}`);
}

function linkFor(raw) {
  const trimmed = raw.replace(/[),.;:!?]+$/, "");
  try {
    const url = new URL(/^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { url, rest: raw.slice(trimmed.length) };
  } catch (error) {
    return null;
  }
}

function fillText(target, text) {
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const found = linkFor(match[0]);
    if (!found) continue;
    target.append(text.slice(last, match.index));
    const link = document.createElement("a");
    link.className = "point-link";
    link.href = found.url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = found.url.href;
    const path = found.url.pathname === "/" && !found.url.search ? "" : "/…";
    link.textContent = `${found.url.hostname.replace(/^www\./, "")}${path}`;
    target.append(link, found.rest);
    last = match.index + match[0].length;
  }
  target.append(text.slice(last));
}

function removeNote(item) {
  pinned = pinned.filter((entry) => entry.id !== item.id);
  for (const day of Object.values(days)) day.notes = day.notes.filter((entry) => entry.id !== item.id);
  for (const entry of lists) entry.notes = entry.notes.filter((other) => other.id !== item.id);
}

function renderNotes() {
  noteList.innerHTML = "";
  if (!DAY_PATTERN.test(viewDay) && !listOf(viewDay)) viewDay = today;
  renderDays();
  renderCount();
  const isList = Boolean(listOf(viewDay));
  const own = viewNotes(viewDay);
  const list = isList ? own : [...pinned, ...own];
  const copyable = viewDay === today ? [] : own.filter((item) => !item.done && !inToday(item.text));
  copyOpen.hidden = copyable.length === 0;
  copyOpen.onclick = () => copyToToday(copyable);
  for (const item of list) {
    const row = document.createElement("li");
    row.className = item.done ? "point is-done" : "point";
    row.draggable = true;
    row.dataset.id = item.id;

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

    const text = document.createElement("div");
    text.className = "point-text";
    text.tabIndex = 0;
    fillText(text, item.text);
    text.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      beginEdit(item, text);
    });
    text.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.target !== text) return;
      event.preventDefault();
      beginEdit(item, text);
    });

    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = item.pinned ? "point-pin is-on" : "point-pin";
    pin.setAttribute("aria-label", item.pinned ? `Unpin ${item.text}` : `Pin ${item.text} to every day`);
    pin.setAttribute("aria-pressed", String(Boolean(item.pinned)));
    pin.title = item.pinned ? "Unpin" : "Pin to every day";
    pin.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5h8l-1.2 6.2 2.7 2.1v1.7H6.5v-1.7l2.7-2.1z"></path><path d="M12 14.5v5"></path></svg>`;
    pin.addEventListener("click", () => {
      removeNote(item);
      item.pinned = !item.pinned;
      if (item.pinned) pinned.push(item);
      else viewNotes(viewDay, true).unshift(item);
      saveNotes();
      renderNotes();
    });

    if (item.remind) {
      const when = document.createElement("span");
      when.className = "point-when";
      when.textContent = `↻ ${remindLabel(item.remind)}`;
      text.append(when);
    }

    const parts = [label, text];
    if (!item.pinned) {
      const bell = document.createElement("button");
      bell.type = "button";
      bell.className = viewDay !== today ? "point-remind is-far" : "point-remind";
      bell.title = item.remind ? `Remind ${remindLabel(item.remind)}` : "Remind me later";
      bell.setAttribute("aria-label", item.remind ? `Change reminder for ${item.text}` : `Remind me about ${item.text}`);
      bell.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 16.5h11l-1.4-2V10a4.1 4.1 0 0 0-8.2 0v4.5z"></path><path d="M10.4 19a1.7 1.7 0 0 0 3.2 0"></path></svg>`;
      bell.addEventListener("click", () => openRemind(item, row));
      parts.push(bell);
    }
    if (viewDay !== today && !item.pinned) {
      const copied = inToday(item.text);
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = copied ? "point-copy is-copied" : "point-copy";
      copy.disabled = copied;
      copy.title = copied ? "Already in Today" : "Copy to Today";
      copy.setAttribute("aria-label", copied ? `${item.text} is already in Today` : `Copy ${item.text} to Today`);
      copy.innerHTML = copied
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"></path></svg>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4.5 11.5 9 16"></path><path d="M5 11.5h9.5a5 5 0 0 1 5 5V18"></path></svg>`;
      copy.addEventListener("click", () => copyToToday([item]));
      parts.push(copy);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "row-delete";
    remove.setAttribute("aria-label", `Delete ${item.text}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      removeNote(item);
      saveNotes();
      renderNotes();
    });

    row.append(...parts, pin, remove);
    noteList.appendChild(row);
  }
  syncNotes();
}

function remindLabel(key) {
  if (key === shiftKey(today, 1)) return "tomorrow";
  return parseKey(key).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function openRemind(item, row) {
  document.querySelector(".remind-pick")?.remove();
  const pick = document.createElement("li");
  pick.className = "remind-pick";
  const choices = [["Tomorrow", 1], ["3 days", 3], ["1 week", 7], ["2 weeks", 14]];
  const close = () => {
    pick.remove();
    document.removeEventListener("pointerdown", outside, true);
  };
  const outside = (event) => {
    if (!pick.contains(event.target)) close();
  };
  const set = (key) => {
    if (key) item.remind = key;
    else delete item.remind;
    close();
    saveNotes();
    renderNotes();
  };
  for (const [name, step] of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.addEventListener("click", () => set(shiftKey(today, step)));
    pick.append(button);
  }
  if (item.remind) {
    const clear = document.createElement("button");
    clear.type = "button";
    clear.textContent = "No reminder";
    clear.addEventListener("click", () => set(null));
    pick.append(clear);
  }
  pick.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  row.after(pick);
  pick.querySelector("button").focus();
  document.addEventListener("pointerdown", outside, true);
}

function deliverReminders() {
  const all = [...Object.values(days).flatMap((day) => day.notes), ...lists.flatMap((entry) => entry.notes)];
  let moved = false;
  for (const item of all) {
    if (!item.remind || item.remind > today) continue;
    delete item.remind;
    if (!inToday(item.text)) dayOf(today).notes.push({ id: crypto.randomUUID(), text: item.text, done: false });
    moved = true;
  }
  if (!moved) return;
  saveNotes();
  renderNotes();
}

function changeCount(step) {
  const day = dayOf(viewDay);
  const next = Math.max(0, day.count + step);
  if (next === day.count) return;
  day.count = next;
  saveNotes();
  keep(NOTE_OPEN_KEY, "1");
  renderNotes();
}

makeSortable(dayStrip, ".day-item", true, (views) => {
  tabOrder = views;
  keep(TAB_ORDER_KEY, JSON.stringify(tabOrder));
  renderNotes();
});

makeSortable(noteList, ".point", false, (ids) => {
  const place = (list) => list.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  place(pinned);
  place(viewNotes(viewDay));
  saveNotes();
  renderNotes();
});

countUp.addEventListener("click", () => changeCount(1));
countDown.addEventListener("click", () => changeCount(-1));

dayStrip.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  dayStrip.scrollLeft += event.deltaY;
}, { passive: false });

setInterval(() => {
  const now = dayKey();
  if (now === today) return;
  if (viewDay === today) viewDay = now;
  today = now;
  if (document.querySelector(".point-edit")) return;
  renderNotes();
  deliverReminders();
}, 30 * 1000);

function beginEdit(item, textButton) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "point-edit";
  input.value = item.text;
  input.maxLength = 600;
  textButton.closest(".point").draggable = false;
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
  viewNotes(viewDay, true).push({ id: crypto.randomUUID(), text, done: false });
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

const studyToggle = document.getElementById("study-toggle");
const studyPick = document.getElementById("study-pick");
const studyCustom = document.getElementById("study-custom");

function syncStudy() {
  studyToggle.textContent = study ? "Stop" : "Study";
  studyToggle.setAttribute("aria-expanded", String(!studyPick.hidden));
}

function chime() {
  try {
    const audio = new AudioContext();
    [660, 880].forEach((pitch, index) => {
      const tone = audio.createOscillator();
      const gain = audio.createGain();
      const at = audio.currentTime + index * 0.35;
      tone.frequency.value = pitch;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.12, at + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
      tone.connect(gain).connect(audio.destination);
      tone.start(at);
      tone.stop(at + 1);
    });
  } catch (error) {
    /* sound is optional */
  }
}

function startStudy(minutes) {
  const start = Date.now();
  study = { start, end: start + minutes * 60 * 1000, minutes };
  keep(STUDY_KEY, JSON.stringify(study));
  studyNote = { text: "", until: 0 };
  studyPick.hidden = true;
  syncStudy();
  tick();
}

function finishStudy(completed) {
  const session = study;
  if (!session) return;
  study = null;
  keep(STUDY_KEY, "null");
  const end = Math.min(completed ? session.end : Date.now(), session.end);
  const minutes = Math.floor((end - session.start) / 60000);
  if (minutes > 0) {
    dayOf(dayKey(new Date(end))).sessions[session.start] = minutes;
    saveNotes();
  }
  const text = completed ? `Study done · ${formatMinutes(minutes)}` : minutes > 0 ? `Saved ${formatMinutes(minutes)} of study` : "";
  studyNote = { text, until: text ? Date.now() + 60 * 1000 : 0 };
  if (completed && !document.hidden) chime();
  syncStudy();
  renderNotes();
  tick();
}

studyToggle.addEventListener("click", () => {
  if (study) {
    const sofar = Math.floor((Date.now() - study.start) / 60000);
    if (window.confirm(sofar > 0 ? `Stop studying? ${formatMinutes(sofar)} will be saved.` : "Stop studying?")) finishStudy(false);
    return;
  }
  studyPick.hidden = !studyPick.hidden;
  syncStudy();
});

studyPick.addEventListener("click", (event) => {
  const choice = event.target.closest("button[data-minutes]");
  if (choice) startStudy(Number(choice.dataset.minutes));
});

studyCustom.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    studyPick.hidden = true;
    syncStudy();
    return;
  }
  if (event.key !== "Enter") return;
  event.preventDefault();
  const minutes = Math.round(Number(studyCustom.value));
  if (minutes >= 1 && minutes <= 240) {
    studyCustom.value = "";
    startStudy(minutes);
  }
});

notesReady = true;
syncStudy();
tick();

const NOTE_MIN_WIDTH = 260;
const NOTE_MIN_HEIGHT = 180;

function applyNoteSize() {
  const size = readJSON(NOTE_SIZE_KEY, null);
  noteWrap.style.width = Number(size?.width) > 0 ? `${size.width}px` : "";
  noteWrap.style.height = Number(size?.height) > 0 ? `${size.height}px` : "";
  noteWrap.classList.toggle("is-sized", Number(size?.height) > 0);
}

noteWrap.querySelectorAll(".card-size").forEach((handle) => {
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    const mode = handle.dataset.size;
    const rect = noteWrap.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    noteWrap.classList.add("is-sizing");
    const move = (next) => {
      if (mode.includes("e")) {
        const most = Math.max(NOTE_MIN_WIDTH, window.innerWidth - rect.left - 16);
        noteWrap.style.width = `${Math.min(most, Math.max(NOTE_MIN_WIDTH, rect.width + next.clientX - startX))}px`;
      }
      if (mode.includes("s")) {
        const most = Math.max(NOTE_MIN_HEIGHT, window.innerHeight - rect.top - 16);
        noteWrap.style.height = `${Math.min(most, Math.max(NOTE_MIN_HEIGHT, rect.height + next.clientY - startY))}px`;
        noteWrap.classList.add("is-sized");
      }
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      noteWrap.classList.remove("is-sizing");
      keep(NOTE_SIZE_KEY, JSON.stringify({
        width: parseFloat(noteWrap.style.width) || 0,
        height: parseFloat(noteWrap.style.height) || 0,
      }));
      clampPlaces();
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  });
  handle.addEventListener("dblclick", () => {
    drop(NOTE_SIZE_KEY);
    applyNoteSize();
    clampPlaces();
  });
});

applyNoteSize();
clampPlaces();

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
  ({ days, pinned, lists, order: tabOrder } = loadNoteStore());
  renderNotes();
  study = readStudy();
  syncStudy();
  tick();
  applyNoteSize();
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

const wallAuto = document.getElementById("wall-auto");
const AUTO_MODES = [
  ["off", "Auto off"],
  ["tab", "New each tab"],
  ["day", "New each day"],
  ["sun", "Light by day, dark at night"],
];
let autoStarted = false;

function autoMode() {
  const mode = stored(AUTO_KEY);
  return AUTO_MODES.some(([id]) => id === mode) ? mode : "off";
}

function syncAuto() {
  const label = AUTO_MODES.find(([id]) => id === autoMode())[1];
  wallAuto.textContent = label;
  wallAuto.setAttribute("aria-label", `Wallpaper change: ${label}. Click to switch.`);
}

function runAutoWall(fresh) {
  const mode = autoMode();
  const before = wallIndex;
  if (mode === "tab" && fresh) randomWall();
  if (mode === "day" && stored(WALL_DAY_KEY) !== dayKey()) {
    if (stored(WALL_DAY_KEY)) randomWall();
    keep(WALL_DAY_KEY, dayKey());
  }
  if (mode === "sun" && Boolean(wall.light) !== isDaytime()) randomWall();
  if (wallIndex !== before) drawSky(performance.now());
}

wallAuto.addEventListener("click", () => {
  const index = AUTO_MODES.findIndex(([id]) => id === autoMode());
  const next = AUTO_MODES[(index + 1) % AUTO_MODES.length][0];
  keep(AUTO_KEY, next);
  if (next === "day") keep(WALL_DAY_KEY, dayKey());
  syncAuto();
  runAutoWall(false);
});

syncAuto();
setInterval(() => runAutoWall(false), 60 * 1000);

pullChromeStore().catch(() => {}).finally(() => {
  syncAuto();
  if (!autoStarted) runAutoWall(true);
  autoStarted = true;
  deliverReminders();
});

chrome.storage?.onChanged?.addListener((changes, area) => {
  if (area !== "local") return;
  for (const key of [STUDY_KEY, NOTE_SIZE_KEY]) {
    if (!changes[key]) continue;
    const next = changes[key].newValue;
    if (typeof next === "string") memory[key] = next;
    else delete memory[key];
  }
  if (changes[STUDY_KEY]) {
    study = readStudy();
    syncStudy();
    tick();
  }
  if (changes[NOTE_SIZE_KEY]) {
    applyNoteSize();
    clampPlaces();
  }
});

chrome.storage?.onChanged?.addListener((changes, area) => {
  if (area !== "local" || document.querySelector(".point-edit")) return;
  const watched = [DAYS_KEY, PINNED_KEY, LISTS_KEY, TAB_ORDER_KEY, NOTE_OPEN_KEY];
  if (!watched.some((key) => changes[key])) return;
  for (const key of watched) {
    const next = changes[key]?.newValue;
    if (typeof next === "string" && next !== memory[key]) memory[key] = next;
  }
  ({ days, pinned, lists, order: tabOrder } = loadNoteStore());
  renderNotes();
});
