import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const sourcePath = join(projectRoot, "public", "hyfy-logo-2026-Light.png");
const appDir = join(projectRoot, "src", "app");

// Brand cream matches the site background — legible on light and dark tabs.
const bg = { r: 0xfd, g: 0xfb, b: 0xf5, alpha: 1 };
const PAD = 0.12;

async function render(size, outPath) {
  const inner = Math.round(size * (1 - PAD * 2));
  const src = await sharp(sourcePath)
    .trim()
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
  const buf = await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: src, gravity: "center" }])
    .png()
    .toBuffer();
  if (outPath) writeFileSync(outPath, buf);
  return buf;
}

console.log("Reading logo:", sourcePath);
console.log("Writing to:", appDir);

const icoSizes = [16, 32, 48, 64, 128, 256];
const pngs = await Promise.all(icoSizes.map((s) => render(s)));
const icoBuffer = await pngToIco(pngs);
writeFileSync(join(appDir, "favicon.ico"), icoBuffer);
console.log(
  `favicon.ico written (${icoSizes.length} sizes, ${icoBuffer.length} bytes)`,
);

await render(180, join(appDir, "apple-icon.png"));
console.log("apple-icon.png written");

await render(32, join(appDir, "icon.png"));
console.log("icon.png written");

console.log("Done.");
