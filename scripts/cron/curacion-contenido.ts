/**
 * Curación semanal del contenido del sitio.
 *
 *   npx tsx scripts/cron/curacion-contenido.ts             (informe, no toca nada)
 *   npx tsx scripts/cron/curacion-contenido.ts --aplicar    (repara lo automatizable y commitea)
 *
 * Existe porque el contenido de este sitio se degrada solo. Tres crons escriben
 * en él sin hablar entre ellos —el generador de noticias a diario, el redactor
 * de salas, los overrides del panel— y la degradación no se ve en ninguna
 * pantalla: no rompe el build, no falla ningún test, y para cuando aparece en
 * Search Console lleva semanas instalada. En julio de 2026 el resultado fue que
 * de las ~4.700 URLs del sitemap solo hubiese TRES indexadas, con el resto en
 * "Descubierta: actualmente sin indexar".
 *
 * Orden de las pasadas (importa: cada una deja el terreno a la siguiente):
 *
 *   1. Deduplicar noticias — retira las piezas que repiten a otra. Va primero
 *      para no perder tiempo curando muletillas de un artículo que se va a ir.
 *   2. Curar muletillas — reescritura por reglas de las fórmulas de IA.
 *   3. Auditar — mide el corpus entero y manda el código de salida. Va última
 *      para que el informe refleje el estado DESPUÉS de las reparaciones.
 *
 * Sale con 1 si la auditoría deja avisos. El cron no debe fallar por eso (los
 * avisos que quedan son los que necesitan criterio humano), pero el código de
 * salida sirve para que un `&&` no encadene un deploy sobre contenido roto.
 */
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const APLICAR = process.argv.includes("--aplicar");
const RAIZ = join(import.meta.dirname, "../..");

function correr(titulo: string, script: string, args: string[] = []): number {
  console.log(`\n${"─".repeat(70)}\n${titulo}\n${"─".repeat(70)}`);
  try {
    execFileSync("npx", ["tsx", join(RAIZ, script), ...args], {
      cwd: RAIZ,
      stdio: "inherit",
      encoding: "utf8",
    });
    return 0;
  } catch (err) {
    // Los scripts de contenido usan el código de salida para decir "encontré
    // algo", no "me he roto". Se distingue por si hubo señal o no.
    const e = err as { status?: number; signal?: string };
    if (e.signal) {
      console.error(`   ⚠ ${script} terminó por señal ${e.signal}`);
      return 1;
    }
    return e.status ?? 1;
  }
}

const sello = new Date().toISOString().slice(0, 16).replace("T", " ");
console.log(`[curacion-contenido] ${sello} · modo ${APLICAR ? "APLICAR" : "informe"}`);

const flags = APLICAR ? ["--write"] : [];

correr("1/3 · Noticias duplicadas", "scripts/content/deduplicar-noticias.ts", flags);
correr("2/3 · Muletillas de IA", "scripts/content/curar-muletillas.ts", flags);
const avisos = correr("3/3 · Auditoría del corpus", "scripts/content/auditar-contenido.ts");

if (APLICAR) {
  console.log(`\n${"─".repeat(70)}\nCambios\n${"─".repeat(70)}`);
  const sucio = execFileSync("git", ["status", "--porcelain", "src/data"], {
    cwd: RAIZ,
    encoding: "utf8",
  }).trim();

  if (!sucio) {
    console.log("Sin cambios que commitear: el contenido ya estaba limpio.");
  } else {
    console.log(sucio);
    // Se commitea solo src/data: si alguien está trabajando en el repo del VPS
    // (o el deploy dejó el sitemap regenerado sin commitear), no se arrastra.
    execFileSync("git", ["add", "src/data"], { cwd: RAIZ });
    execFileSync(
      "git",
      ["commit", "-m", `chore(contenido): curación semanal automática (${sello})`],
      { cwd: RAIZ, stdio: "inherit" },
    );
    console.log("\nCommit hecho. El deploy de las 05:30 lo recogerá y publicará.");
  }
}

console.log(`\n[curacion-contenido] fin · ${avisos === 0 ? "sin avisos" : "con avisos pendientes de revisar"}`);
process.exit(avisos === 0 ? 0 : 1);
