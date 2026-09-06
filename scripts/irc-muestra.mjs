#!/usr/bin/env node
/**
 * Muestra real de gente conectada a la red IRC, para que los contadores de la
 * web ("N hablando ahora", "usuarios conectados") sean una medida y no la suma
 * de un campo escrito a mano.
 *
 * Se conecta por TLS a la red, se identifica con un nick propio del portal,
 * pide LIST (usuarios por canal) y lee el LUSERS de bienvenida (usuarios
 * totales), guarda la foto en `data/irc-muestra.json` y se va. Portado del
 * cron de canales de estoeschat, que ya lidia con el antibot de la red (el
 * realname no puede llevar URL ni la palabra "bot").
 *
 * Lo lanza el cron de salas del VPS antes de commitear; en local:
 *   node scripts/irc-muestra.mjs [--seco]
 */
import tls from "node:tls";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SERVIDOR = process.env.IRC_HOST || "irc.chatzona.org";
const PUERTO = Number(process.env.IRC_PORT || 6697);
const NICK = process.env.IRC_NICK || `tuchat${Math.floor(Date.now() / 1000) % 10000}`;
const REALNAME = process.env.IRC_REALNAME || "TuChat stats";
const SECO = process.argv.includes("--seco");
const TIEMPO_MAX = 90_000;
const SALIDA = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "irc-muestra.json");

const log = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);

export function pideMuestra({ servidor = SERVIDOR, puerto = PUERTO, nick = NICK } = {}) {
  return new Promise((resolve, reject) => {
    const canales = {};
    let usuariosRed = null;
    let buffer = "";
    let terminado = false;
    let registrado = false;
    let nickActual = nick;

    const socket = tls.connect({ host: servidor, port: puerto, rejectUnauthorized: false, servername: servidor });
    const temporizador = setTimeout(() => fin(new Error(`sin respuesta en ${TIEMPO_MAX / 1000}s`)), TIEMPO_MAX);

    function fin(err) {
      if (terminado) return;
      terminado = true;
      clearTimeout(temporizador);
      try { socket.write("QUIT :hasta la próxima\r\n"); socket.end(); } catch { /* ya cerrado */ }
      if (!Object.keys(canales).length) {
        reject(err ?? new Error(registrado
          ? "el servidor aceptó la sesión pero no devolvió ningún canal"
          : "la conexión se cerró antes de completar el registro (¿filtro antibots?)"));
        return;
      }
      resolve({ canales, usuariosRed });
    }

    socket.on("error", (e) => fin(e));
    socket.on("close", () => fin(null));
    socket.on("secureConnect", () => {
      socket.write(`NICK ${nickActual}\r\n`);
      socket.write(`USER ${nickActual} 0 * :${REALNAME}\r\n`);
    });

    socket.on("data", (datos) => {
      buffer += datos.toString("utf8");
      const lineas = buffer.split("\r\n");
      buffer = lineas.pop() ?? "";
      for (const linea of lineas) {
        if (linea.startsWith("PING ")) { socket.write(`PONG ${linea.slice(5)}\r\n`); continue; }
        if (linea.startsWith("ERROR ")) { fin(new Error(`el servidor cierra la conexión: ${linea.slice(6, 200)}`)); return; }
        const partes = linea.split(" ");
        const codigo = partes[1];
        if (codigo === "001") { registrado = true; socket.write("LIST\r\n"); continue; }
        // 251 = RPL_LUSERCLIENT: ":There are N users and M invisible on K servers"
        if (codigo === "251") {
          const m = linea.match(/There are (\d+) users and (\d+) invisible/i);
          if (m) usuariosRed = Number(m[1]) + Number(m[2]);
          continue;
        }
        if (codigo === "433") {
          nickActual = `${nick}_${Math.floor(Math.random() * 999)}`;
          socket.write(`NICK ${nickActual}\r\n`);
          continue;
        }
        // 322 = RPL_LIST: <yo> <canal> <usuarios> :<tema>
        if (codigo === "322") {
          const canal = partes[3];
          const usuarios = Number(partes[4]);
          if (canal?.startsWith("#") && Number.isFinite(usuarios)) canales[canal.toLowerCase()] = usuarios;
          continue;
        }
        if (codigo === "323") { fin(null); return; }
      }
    });
  });
}

const esPrincipal = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (esPrincipal) {
  try {
    const { canales, usuariosRed } = await pideMuestra();
    const n = Object.keys(canales).length;
    const enCanales = Object.values(canales).reduce((s, u) => s + u, 0);
    const muestra = {
      tomada: new Date().toISOString(),
      servidor: SERVIDOR,
      usuariosRed: usuariosRed ?? null,
      canales,
    };
    log(`${n} canales · ${enCanales} presencias en canal · ${usuariosRed ?? "?"} usuarios en la red`);
    const top = Object.entries(canales).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([c, u]) => `${c}:${u}`).join("  ");
    log(`top: ${top}`);
    if (SECO) { log("--seco: no se escribe nada"); process.exit(0); }
    mkdirSync(dirname(SALIDA), { recursive: true });
    writeFileSync(SALIDA, JSON.stringify(muestra, null, 1) + "\n");
    log(`guardada en ${SALIDA}`);
  } catch (e) {
    // Sin muestra no se rompe nada: la web sigue con la última guardada.
    log(`ERROR: ${e.message}`);
    process.exit(1);
  }
}
