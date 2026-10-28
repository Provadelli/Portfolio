/* Generates optimized WebP versions of the original images (npm run images).
   Originals (kept): assets/  ->  Generated for the site: src/assets/img/ and public/og-pedro.jpg */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const SRC = "assets", OUT = "src/assets/img";
const CARD_W = 1360; // 2x the 680px card width

const jobs = [
  ["pelenextgen.png", "pelenextgen.webp", CARD_W],
  ["pelenextgen2.png", "pelenextgen-2.webp", CARD_W],
  ["atelier.png", "atelier.webp", CARD_W],
  ["atelier2.png", "atelier-2.webp", CARD_W],
  ["shinatal.webp", "shinatal.webp", CARD_W],
  ["shinatal2.png", "shinatal-2.webp", CARD_W],
  ["npcode.png", "npcode.webp", CARD_W],
  ["npcode2.png", "npcode-2.webp", CARD_W],
  ["circuito.jpeg", "circuito.webp", CARD_W],
  ["pedro.png", "pedro.webp", 680]
];

const kb = async (f) => ((await stat(f)).size / 1024).toFixed(0) + " KB";

await mkdir(OUT, { recursive: true });
for (const [from, to, width] of jobs){
  const src = `${SRC}/${from}`, dst = `${OUT}/${to}`;
  const info = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(dst);
  console.log(`${from} (${await kb(src)}) -> ${to} ${info.width}x${info.height} (${await kb(dst)})`);
}

// Image for social sharing (og:image / twitter): 1200x630 JPEG, portrait centered on the brand background
const portrait = await sharp(`${SRC}/pedro.png`).resize({ height: 630 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#1A120C" } })
  .composite([{ input: portrait, gravity: "center" }])
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile("public/og-pedro.jpg");
console.log(`og-pedro.jpg 1200x630 (${await kb("public/og-pedro.jpg")})`);
