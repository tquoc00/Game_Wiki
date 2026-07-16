/**
 * Convert Vietnamese and special characters into URL-friendly SEO slugs
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD') // Decompose unicode accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric except spaces and dashes
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-+/, '') // Trim starting dashes
    .replace(/-+$/, ''); // Trim trailing dashes
}
