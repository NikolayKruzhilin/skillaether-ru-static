import { promises as fs } from "node:fs";
import path from "node:path";

const sourceDir = "E:\\LLM Projects\\AI skills marketplace\\skillaether_ru - Copy\\src\\data\\skills";
const outputDir = "E:\\Codex\\skillaether-static";
const skillsDir = path.join(outputDir, "skills");
const dataDir = path.join(outputDir, "data");

const categories = {
  development: { name: "Разработка", emoji: "💻" },
  marketing: { name: "Маркетинг", emoji: "📢" },
  content: { name: "Контент", emoji: "✍️" },
  automation: { name: "Автоматизация", emoji: "⚡" },
  research: { name: "Исследования", emoji: "🔍" },
  business: { name: "Бизнес", emoji: "📊" },
  design: { name: "Дизайн", emoji: "🎨" },
  gamedev: { name: "Геймдев", emoji: "🎮" },
  "vibe-coding": { name: "Вайб-кодинг", emoji: "✨" },
  writing: { name: "Тексты", emoji: "📝" },
  "ai-tools": { name: "ИИ-инструменты", emoji: "🤖" },
  "no-code": { name: "No-Code", emoji: "🔌" },
  "product-management": { name: "Продакт-менеджмент", emoji: "🗺️" },
};

function normalizeTags(tags) {
  return Array.isArray(tags) ? tags.filter(Boolean) : [];
}

function seedDownloads(slug) {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (Math.imul(31, hash) + slug.charCodeAt(index)) | 0;
  }
  return 50 + (Math.abs(hash) % 51);
}

function normalizeSkill(skill) {
  const preview = typeof skill.preview === "string" && skill.preview.trim()
    ? skill.preview.trim()
    : `# ${skill.name}\n\n${skill.description || ""}`.trim();

  return {
    slug: skill.slug,
    name: skill.name,
    tagline: skill.tagline || "",
    description: skill.description || "",
    category: skill.category,
    categoryName: categories[skill.category]?.name || skill.category,
    categoryEmoji: categories[skill.category]?.emoji || "📦",
    tags: normalizeTags(skill.tags),
    outcome: skill.outcome || "",
    timeSaved: skill.timeSaved || "",
    downloads:
      typeof skill.downloads === "number" && skill.downloads > 0
        ? skill.downloads
        : seedDownloads(skill.slug),
    isHot: Boolean(skill.isHot),
    isFeatured: Boolean(skill.isFeatured),
    preview,
    downloadFile: `skills/${skill.slug}.md`,
  };
}

const files = (await fs.readdir(sourceDir))
  .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
  .sort((a, b) => a.localeCompare(b, "ru"));

const rawSkills = await Promise.all(
  files.map(async (file) => {
    const content = await fs.readFile(path.join(sourceDir, file), "utf8");
    return JSON.parse(content);
  }),
);

const skills = rawSkills
  .map(normalizeSkill)
  .sort((a, b) => {
    if (a.isHot !== b.isHot) {
      return a.isHot ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "ru");
  });

await fs.mkdir(skillsDir, { recursive: true });
await fs.mkdir(dataDir, { recursive: true });

await Promise.all(
  skills.map((skill) =>
    fs.writeFile(path.join(outputDir, skill.downloadFile), `${skill.preview}\n`, "utf8"),
  ),
);

const payload = {
  generatedAt: new Date().toISOString(),
  total: skills.length,
  categories: Object.entries(categories).map(([slug, value]) => ({
    slug,
    name: value.name,
    emoji: value.emoji,
  })),
  skills,
};

await fs.writeFile(
  path.join(dataDir, "skills.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
  "utf8",
);

await fs.writeFile(
  path.join(dataDir, "skills.js"),
  `window.__SKILLAETHER_DATA__ = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8",
);

console.log(`Generated ${skills.length} skills in ${outputDir}`);
