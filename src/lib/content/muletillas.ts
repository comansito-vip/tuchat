/**
 * Huella dactilar del texto generado por un LLM.
 *
 * Fuente única para las tres cosas que la usan: el generador de noticias (que
 * descarta la pieza antes de escribirla), la auditoría de contenido y el cron
 * de curación. Tenerla en un solo sitio evita que el filtro del generador y el
 * de la auditoría se desincronicen y dejen pasar lo que el otro sí bloquea.
 *
 * La lista es deliberadamente conservadora: solo expresiones que en prosa
 * humana sobre un chat o una columna de divulgación no aparecen casi nunca, de
 * modo que un positivo signifique algo y no haya que revisar cien falsos.
 * El prompt del generador ya las prohíbe, pero los proveedores gratuitos de la
 * cadena de respaldo ignoran esa instrucción con frecuencia: la comprobación en
 * código es la que de verdad las para.
 */
export const MULETILLAS_IA = [
  // Arranques de relleno
  "sumergete",
  "sumergirte",
  "descubre un mundo",
  "en el mundo de hoy",
  "en la era digital",
  "en un mundo cada vez mas",
  "hoy en dia mas que nunca",
  // Fórmulas de encuadre huecas
  "el lugar perfecto para",
  "el sitio perfecto para",
  "punto de encuentro ideal",
  "ya seas",
  "no importa si eres",
  "todo un mundo de",
  "joya escondida",
  // "un abanico de posibilidades" (el artículo indeterminado) es la fórmula de
  // relleno; "ampliar el abanico de posibilidades" es castellano corriente y
  // marcarlo solo generaba un aviso que nadie iba a atender.
  "un abanico de posibilidades",
  "amplia variedad de",
  "gran variedad de",
  "una experiencia unica",
  "experiencia inolvidable",
  // Cierres motivacionales
  "no te lo puedes perder",
  "no dudes en",
  "que esperas para",
  "no esperes mas",
  "da el primer paso",
  "te esperamos",
  "unete a la conversacion",
  "atreverse a dar el paso",
] as const;

/**
 * Conectores de ensayo escolar. A diferencia de los anteriores, estos SOLO son
 * huella de IA cuando abren una frase, que es donde el modelo los usa para
 * anunciar el párrafo de cierre. Intercalados son español corriente y marcarlos
 * siempre llenaría la auditoría de falsos positivos que nadie va a revisar:
 *
 *   ✗ "En definitiva, cuidar el sueño no es un lujo…"     ← relleno
 *   ✓ "Es, en definitiva, un acto de autocuidado."        ← prosa normal
 *   ✓ "Una agrociudad, en resumen, situada entre Trujillo y Don Benito."
 */
export const CONECTORES_DE_RELLENO = [
  "en definitiva",
  "en resumen",
  "en conclusion",
  "cabe destacar",
  "cabe senalar",
  "sin lugar a dudas",
  "es importante recordar",
  "es importante destacar",
  "vale la pena mencionar",
] as const;

/** Minúsculas, sin tildes ni puntuación: para comparar texto de forma estable. */
export function normalizarTexto(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Muletillas presentes en el texto (vacío si está limpio).
 *
 * Los conectores solo cuentan si abren frase: se busca sobre el texto ORIGINAL
 * (con su puntuación) porque es el principio de oración lo que los delata, y esa
 * información se pierde al normalizar.
 */
export function detectarMuletillas(texto: string): string[] {
  const n = normalizarTexto(texto);
  const hits: string[] = MULETILLAS_IA.filter((m) => n.includes(m));

  // Principio de frase = principio del texto o tras punto / dos puntos / salto
  // de línea (incluido el "\n" escapado de los literales de src/data/*.ts).
  // Tiene que ser startsWith y no includes: "Una agrociudad, en resumen,
  // situada entre Trujillo y Don Benito" empieza frase pero el conector va
  // intercalado, y ahí es prosa correcta que no hay que tocar.
  const arranques = texto
    .split(/(?:\\n|[.:;!?\n])+/)
    .map((frase) => normalizarTexto(frase));
  for (const c of CONECTORES_DE_RELLENO) {
    if (arranques.some((a) => a.startsWith(c))) hits.push(c);
  }
  return hits;
}

/**
 * Apertura normalizada de un cuerpo, para deduplicar piezas que arrancan igual.
 *
 * Se comparan las 10 primeras PALABRAS normalizadas, no los 100 primeros
 * caracteres: dos columnas sobre el mismo tema abrían con "En los últimos años,
 * la inteligencia artificial ha dejado de…" y "…ha pasado de…", que difieren
 * dentro de los 100 caracteres y sin embargo son el mismo arranque.
 */
export function aperturaNormalizada(cuerpo: string, palabras = 10): string {
  return normalizarTexto(cuerpo).split(" ").slice(0, palabras).join(" ");
}
