const PREFIX = "quiet-stars-";
const status = document.getElementById("backup-status");
const picker = document.getElementById("backup-file");

function say(text) {
  status.textContent = text;
}

function ours(items) {
  const data = {};
  for (const [key, value] of Object.entries(items || {})) {
    if (key.startsWith(PREFIX) && typeof value === "string") data[key] = value;
  }
  return data;
}

async function readAll() {
  const data = chrome.storage?.local ? ours(await chrome.storage.local.get(null)) : {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX) && !(key in data)) data[key] = localStorage.getItem(key);
  }
  return data;
}

document.getElementById("backup-save").addEventListener("click", async () => {
  const data = await readAll();
  const stamp = new Date().toISOString().slice(0, 10);
  const file = new Blob([JSON.stringify({ app: "quiet-stars", version: 1, saved: new Date().toISOString(), data }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `new-tab-backup-${stamp}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  say(`Backup saved with ${Object.keys(data).length} items.`);
});

document.getElementById("backup-load").addEventListener("click", () => picker.click());

picker.addEventListener("change", async () => {
  const file = picker.files?.[0];
  picker.value = "";
  if (!file) return;
  let data;
  try {
    const parsed = JSON.parse(await file.text());
    if (parsed?.app !== "quiet-stars" || !parsed.data || typeof parsed.data !== "object") throw new Error("not ours");
    data = ours(parsed.data);
  } catch (error) {
    say("That file is not a New Tab backup.");
    return;
  }
  if (!Object.keys(data).length) {
    say("That backup is empty.");
    return;
  }
  if (!window.confirm("Replace the notes, lists, counts, study time, and settings on this computer with this backup?")) return;
  const old = await readAll();
  const gone = Object.keys(old).filter((key) => !(key in data));
  if (chrome.storage?.local) {
    if (gone.length) await chrome.storage.local.remove(gone);
    await chrome.storage.local.set(data);
  }
  for (const key of gone) localStorage.removeItem(key);
  for (const [key, value] of Object.entries(data)) localStorage.setItem(key, value);
  say(`Restored ${Object.keys(data).length} items. Open a new tab to see them.`);
});
