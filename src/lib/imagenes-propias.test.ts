import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getTopics, getCities, getCountries, cityFlag } from "@/data";
import { emojiToCountryCode } from "@/components/ui/Flag";
import { getLeagues } from "@/lib/teams";

/**
 * Ninguna imagen del sitio sale de un dominio ajeno.
 *
 * Hasta agosto de 2026 las fotos de noticias venían de images.unsplash.com, las
 * banderas de flagcdn.com y los escudos de upload.wikimedia.org. Eso mandaba el
 * tráfico de imagen de todo el portal a tres terceros y, en el caso de las
 * noticias, hacía que el JSON-LD declarase como `image` del artículo una URL que
 * no es nuestra: en Google Images la foto cuenta para quien la sirve.
 *
 * El otro motivo es que un enlace a un fichero ajeno se rompe sin avisar. Al
 * migrar aparecieron doce escudos y una foto que llevaban meses dando 404 en
 * producción. Estos tests existen para que eso no pueda volver en silencio.
 */

const publico = (ruta: string) => join(process.cwd(), "public", ruta);

const TODOS = [...getTopics(), ...getCities(), ...getCountries()];

describe("banderas propias", () => {
  it("cada emoji-bandera del catálogo tiene su PNG en public/flags/paises", () => {
    const codigos = new Set<string>();
    for (const p of TODOS) {
      const code = emojiToCountryCode(cityFlag(p).icon);
      if (code) codigos.add(code);
    }
    expect(codigos.size).toBeGreaterThan(0);
    const faltan = [...codigos].filter((c) => !existsSync(publico(`/flags/paises/${c}.png`)));
    expect(faltan).toEqual([]);
  });

  it("cada flagSrc escrito a mano existe", () => {
    const faltan = TODOS.map((p) => cityFlag(p).flagSrc)
      .filter((s): s is string => Boolean(s))
      .filter((s) => !existsSync(publico(s)));
    expect(faltan).toEqual([]);
  });
});

describe("escudos propios", () => {
  const equipos = getLeagues().flatMap((l) => l.teams);

  it("todos apuntan a public/img/escudos y el fichero existe", () => {
    const mal = equipos.filter(
      (t) => !t.badge.startsWith("/img/escudos/") || !existsSync(publico(t.badge)),
    );
    expect(mal.map((t) => t.name)).toEqual([]);
  });

  it("no sobra ningún escudo sin equipo que lo use", () => {
    const usados = new Set(equipos.map((t) => t.badge.split("/").pop()));
    const huerfanos = readdirSync(publico("/img/escudos")).filter((f) => !usados.has(f));
    expect(huerfanos).toEqual([]);
  });
});

describe("ninguna imagen apunta fuera de tuchat.org", () => {
  it("las fotos de los artículos son rutas locales", () => {
    const fuera = TODOS.filter(
      (p) => typeof (p as { image?: string }).image === "string"
        && !(p as { image?: string }).image!.startsWith("/"),
    );
    expect(fuera.map((p) => p.slug)).toEqual([]);
  });
});
