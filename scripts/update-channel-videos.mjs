import { writeFile } from "node:fs/promises";

const FEEDS = {
  long: "https://www.youtube.com/feeds/videos.xml?playlist_id=UULFweU-8uXxe3Yyu1_JpJEZIg",
  short: "https://www.youtube.com/feeds/videos.xml?playlist_id=UUSHweU-8uXxe3Yyu1_JpJEZIg",
};

const TIME_ZONE = "Africa/Johannesburg";
const outputPath = new URL("../videos.json", import.meta.url);

const date = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const [longs, shorts] = await Promise.all([
  loadFeed(FEEDS.long),
  loadFeed(FEEDS.short),
]);

if (!longs.length || !shorts.length) {
  throw new Error("A channel feed returned no videos, so today's picks were left unchanged.");
}

const day = dayNumber(date);
const picks = {
  date,
  long: longs[day % longs.length],
  short: shorts[day % shorts.length],
};

await writeFile(outputPath, `${JSON.stringify(picks, null, 2)}\n`);

async function loadFeed(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Feed request failed (${response.status}) for ${url}`);
  const xml = await response.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  return entries.flatMap((entry) => {
    const id = entry.match(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/)?.[1];
    const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").trim();
    return id ? [{ id, title: title || "Fun Times Guys" }] : [];
  });
}

function dayNumber(dayKey) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
