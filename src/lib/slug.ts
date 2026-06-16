/** Lowercase and strip diacritics — for accent-insensitive search comparison */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Lowercase, remove accents, replace spaces with hyphens */
export function slugify(s: string): string {
  return normalize(s).replace(/\s+/g, "-");
}

/** Capitalize first letter, replace hyphens with spaces */
export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}
