const CATEGORY_IMAGES: Record<string, string[]> = {
  actualidad:      ["photo-1504711434969-e33886168f5c", "photo-1585829365295-ab7cd400c167"],
  deportes:        ["photo-1518091043644-c1d4457512c6", "photo-1540747913346-19e32dc3e97e"],
  tecnologia:      ["photo-1518770660439-4636190af475", "photo-1461749280684-dccba630e2f6"],
  ia:              ["photo-1677442135703-1787eea5ce01", "photo-1620712943543-bcc4688e7485"],
  cultura:         ["photo-1513364776144-60967b0f800f", "photo-1507842217343-583bb7270b66"],
  viajes:          ["photo-1488085061387-422e29b40080", "photo-1476514525535-07fb3b4ae5f1"],
  salud:           ["photo-1576091160550-2173dba999ef", "photo-1505751172876-fa1923c5c528"],
  economia:        ["photo-1611974789855-9c2a0a7236a3", "photo-1579621970588-a35d0e7ab9b6"],
  entretenimiento: ["photo-1478720568477-152d9b164e26", "photo-1522869635100-9f4c5e86aa37"],
  anime:           ["photo-1578632767115-351597cf2477", "photo-1608889175250-c9b4ce5a803d"],
  esoterismo:      ["photo-1518709268805-4e9042af9f23", "photo-1532105956626-9569c03602f6"],
  psicologia:      ["photo-1554224155-6726b3ff858f", "photo-1493894473891-10fc1e5dbd22"],
};

function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
}

export function getNewsImage(category: string, slug: string): string {
  const key = slugifyCategory(category);
  const pool = CATEGORY_IMAGES[key] ?? CATEGORY_IMAGES.actualidad;
  const id = pool[hashSlug(slug) % pool.length];
  return `https://images.unsplash.com/${id}?w=800&q=75&auto=format&fit=crop`;
}
