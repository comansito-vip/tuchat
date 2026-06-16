/**
 * Acceso al estado del admin para uso en render (páginas/metadata).
 *
 * Lee el store directamente. Con el backend de fichero (por defecto) es una
 * lectura de disco que NO fuerza render dinámico: las páginas siguen siendo
 * estáticas y el route handler las reconstruye con revalidatePath tras cada
 * escritura. Con el backend Upstash (fetch no-store) el render pasa a dinámico.
 */
import { getAdminState } from "@/lib/admin-store";

/** Slug canónico al que redirige `slug`, o undefined si no hay redirección. */
export async function getRedirectTarget(slug: string): Promise<string | undefined> {
  const { redirects } = await getAdminState();
  return redirects[slug];
}

/** True si la sala está marcada noindex en el panel. */
export async function isNoindex(slug: string): Promise<boolean> {
  const { noindex } = await getAdminState();
  return noindex.includes(slug);
}
