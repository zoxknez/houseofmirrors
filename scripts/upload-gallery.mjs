import { put } from "@vercel/blob";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const baseDir = "D:/ProjektiApp/housemirror/public/Galerija";

const folderMap = {
  "dnevna soba": { category: "living", label: "Dnevna soba" },
  "Spavaca soba": { category: "bedroom", label: "Spavaća soba" },
  "Kuhinja": { category: "kitchen", label: "Kuhinja" },
  "Kupatilo": { category: "bathroom", label: "Kupatilo" },
  "naslovna": { category: "hero", label: "Naslovna", keyPrefix: "gallery/naslovne" },
};

const contentTypeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function main() {
  const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
  const onlyFolders = onlyArg
    ? new Set(
        onlyArg
          .replace("--only=", "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      )
    : null;
  const entries = [];

  for (const folderName of Object.keys(folderMap)) {
    if (onlyFolders && !onlyFolders.has(folderName)) continue;
    const { category, label } = folderMap[folderName];
    const folderPath = path.join(baseDir, folderName);
    const files = (await readdir(folderPath)).filter((f) => !f.startsWith("."));

    let index = 1;
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const ext = path.extname(file).toLowerCase();
      const contentType = contentTypeByExt[ext] || "application/octet-stream";
      const buffer = await readFile(filePath);

      const keyPrefix = folderMap[folderName].keyPrefix || `gallery/${category}`;
      const key = `${keyPrefix}/${file}`;
      const { url } = await put(key, buffer, {
        access: "public",
        contentType,
        allowOverwrite: true,
      });

      entries.push({
        src: url,
        alt: `${label} ${index}`,
        category,
      });
      index += 1;
    }
  }

  console.log(JSON.stringify(entries, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
