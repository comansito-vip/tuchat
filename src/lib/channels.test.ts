import { describe, it, expect } from "vitest";
import { resolveChannels, channelString } from "@/lib/channels";
import { getCities, getCountries, getTopics } from "@/data";
import { REAL_CHANNELS } from "@/data/irc-real-channels";

describe("resolveChannels", () => {
  // Barrera contra el bug de fondo: una sala geográfica NUNCA debe entrar a un
  // canal que la red no tiene. El canal inventado se crea vacío al entrar, así
  // que el usuario aterriza solo en vez de caer donde ya hay gente. Recorre las
  // 2.027 salas reales, no una lista fija (scripts/fix-irc-channels.ts).
  it("los canales vetados por el cliente no se pueden asignar a ninguna sala", () => {
    // Existen en la red, pero no se usan: explícitos residuales, bots/radios y
    // —sobre todo— #de_13_a_18, que es una sala de menores.
    for (const c of [
      "putitas", "putitasx", "tetonaslesbis", "morena_sexy", "sexoconsergi",
      "de_13_a_18", "eggdrop", "scripting", "bot_cita", "admin_explosion", "closed",
    ]) {
      expect(REAL_CHANNELS.has(c), c).toBe(false);
    }
  });

  it("ninguna sala de país o ciudad entra a un canal que no existe en la red", () => {
    const geo = [...getCountries(), ...getCities()];
    expect(geo.length).toBeGreaterThan(2000);
    const ghosts = geo.flatMap((p) =>
      p.channels.filter((c) => !REAL_CHANNELS.has(c)).map((c) => `${p.slug}: #${c}`),
    );
    expect(ghosts).toEqual([]);
  });

  it("ninguna sala aterriza sola: el primer canal siempre existe en la red", () => {
    // Los canales propios de cada sala (#cine, #salud, #real-madrid, #marruecos…)
    // no se borran: irán cogiendo gente poco a poco. Pero van DETRÁS del canal
    // real de su vertical, nunca delante. Si la sala entrase primero al suyo, la
    // red lo crearía vacío y el usuario se quedaría solo en una sala muerta.
    const salas = [...getTopics(), ...getCities(), ...getCountries()];
    expect(salas.length).toBeGreaterThan(2400);
    const huerfanas = salas
      .filter((p) => !REAL_CHANNELS.has(p.channels[0]))
      .map((p) => `${p.slug}: #${p.channels[0]}`);
    expect(huerfanas).toEqual([]);
  });

  it("ningún canal propio se cuela por delante de uno real", () => {
    const salas = [...getTopics(), ...getCities(), ...getCountries()];
    const desordenadas = salas
      .filter((p) => {
        const fantasma = p.channels.findIndex((c) => !REAL_CHANNELS.has(c));
        const real = p.channels.findIndex((c) => REAL_CHANNELS.has(c));
        return fantasma !== -1 && real !== -1 && fantasma < real;
      })
      .map((p) => `${p.slug}: ${p.channels.join(",")}`);
    expect(desordenadas).toEqual([]);
  });

  it("las variantes mal escritas de un canal real no sobreviven en ninguna sala", () => {
    // Mantener #cataluna junto a #cataluña, o #cybersexo junto a #cibersexo,
    // parte a la gente entre dos canales gemelos: justo lo contrario del arreglo.
    // #adolescentes va en la lista por lo mismo que #de_13_a_18: es de menores.
    // #mexico_vip NO está en esta lista: se dio por variante de #mexico en su
    // día, pero el cliente confirmó (2026-07-14) que es un canal real y propio,
    // y lo asignó a Latinchat México.
    const variantes = [
      "cataluna", "cybersexo", "real_madrid_c_f", "buenos-aires", "de_18_a_26",
      "mas_de_60", "rioja", "adolescentes", "onda_latina", "radio_corazon",
    ];
    const salas = [...getTopics(), ...getCities(), ...getCountries()];
    const sucias = salas
      .flatMap((p) => p.channels.filter((c) => variantes.includes(c)).map((c) => `${p.slug}: #${c}`));
    expect(sucias).toEqual([]);
  });

  it("todas las salas de /anime entran solo a #anime y #ocio", () => {
    // Las series (#naruto, #one-piece, #pokemon…) y #manga no existen en la red:
    // mandaba a cada fan a un canal vacío distinto en vez de juntarlos donde hay
    // gente. Decisión del cliente: por ahora la sección entera comparte #anime,
    // que es el canal real, más el genérico #ocio. Si algún día se abre un canal
    // por serie, entra DESPUÉS de #anime y antes de #ocio, nunca en lugar de él.
    const anime = getTopics().filter((p) => p.slug === "anime" || p.parentSlug === "anime");
    expect(anime.length).toBeGreaterThanOrEqual(8);
    for (const p of anime) {
      expect(p.channels, p.slug).toEqual(["anime", "ocio"]);
    }
  });

  it("uses the place's defined channels for Madrid", () => {
    // El canal real del IRC lleva tilde (#españa, no #espana) aunque el slug/URL no la lleve.
    // "amistad" (868 usuarios reales) es popular pero temático, no geográfico:
    // las salas de ciudad ya no lo arrastran de más (2026-07-13 noche).
    expect(resolveChannels("madrid")).toEqual(["madrid", "españa", "chatzona"]);
  });
  it("uses México's channels", () => {
    expect(resolveChannels("mexico")).toEqual(["mexico", "latinoamerica", "chatzona"]);
  });
  it("los países de habla hispana con canal propio no pasan por #internacional", () => {
    // Guinea Ecuatorial queda fuera a propósito: es hispanohablante, pero la red
    // no tiene canal para ella, así que va a #internacional + #ocio como el
    // resto de países sin canal (no a un #guinea-ecuatorial vacío).
    for (const slug of ["espana", "mexico", "argentina", "colombia", "cuba"]) {
      expect(resolveChannels(slug), slug).not.toContain("internacional");
    }
    expect(resolveChannels("guinea-ecuatorial")).toEqual(["internacional", "ocio", "chatzona"]);
  });
  it("mantiene #internacional en los países no hispanohablantes", () => {
    expect(resolveChannels("francia")).toContain("internacional");
  });
  it("todas las salas de Estados Unidos entran al canal real #usa", () => {
    for (const slug of ["estados-unidos", "miami", "nueva-york", "los-angeles", "houston"]) {
      const ch = resolveChannels(slug);
      expect(ch, slug).toContain("usa");
      // #estados-unidos no existe en la red: entrar ahí creaba un canal vacío en
      // vez de dejar al usuario con la gente de #usa.
      expect(ch, slug).not.toContain("estados-unidos");
    }
    // Miami sí tiene canal propio en la red, y entra a los dos. Nueva York no lo
    // tiene, así que solo va a #usa (nada de un #nueva-york inventado).
    expect(resolveChannels("miami")).toContain("miami");
    expect(resolveChannels("nueva-york")).not.toContain("nueva-york");
  });
  it("los países con canal de guion bajo entran al real, no al alias con guion", () => {
    expect(resolveChannels("el-salvador")).toContain("el_salvador");
    expect(resolveChannels("el-salvador")).not.toContain("el-salvador");
    expect(resolveChannels("costa-rica")).toContain("costa_rica");
    expect(resolveChannels("republica-dominicana")).toContain("republica_dominicana");
    expect(resolveChannels("puerto-rico")).toContain("puerto_rico");
  });
  it("Cataluña: el canal real lleva ñ y el alias sin ñ ya no se cuela", () => {
    const ch = resolveChannels("barcelona");
    expect(ch).toContain("cataluña");
    expect(ch).not.toContain("cataluna");
  });
  it("horóscopo y astrología entran a #tarot/#esoterismo, no a #horoscopo (no existe)", () => {
    for (const slug of ["horoscopo", "astrologia"]) {
      const ch = resolveChannels(slug);
      expect(ch, slug).not.toContain("horoscopo");
      expect(ch, slug).toContain("tarot");
      expect(ch, slug).toContain("esoterismo");
    }
  });
  it("el canal real de España lleva tilde en TODAS las salas españolas", () => {
    // Bug real 2026-07-13: el slug ("espana", para la URL) se había colado tal
    // cual dentro del array de channels también, así que el iframe pedía
    // #espana en vez de #españa (el canal real del IRC) — casi 900 salas
    // españolas conectaban al canal equivocado. Recorre las 893 ciudades
    // reales vía getCities(), no una lista fija, para que no vuelva a colarse.
    const esp = getCities().filter((c) => c.parentSlug === "espana");
    expect(esp.length).toBeGreaterThan(800);
    for (const c of esp) {
      expect(c.channels, c.slug).toContain("españa");
      expect(c.channels, c.slug).not.toContain("espana");
    }
  });
  it("A Coruña entra al canal real #coruña, no #a-coruna ni #coruna", () => {
    expect(resolveChannels("a-coruna")).toContain("coruña");
  });
  it("falls back for an unknown slug to itself + amistad + chatzona", () => {
    expect(resolveChannels("xyz")).toEqual(["xyz", "amistad", "chatzona"]);
  });
  it("formats as #-prefixed comma list", () => {
    expect(channelString(["madrid", "espana"])).toBe("#madrid,#espana");
  });
  it("uses first channel as room channel", () => {
    const ch = resolveChannels("madrid");
    expect(ch[0]).toBe("madrid");
  });
  it("fallback always adds amistad and chatzona at the end", () => {
    const ch = resolveChannels("unknown-slug-xyz");
    expect(ch).toContain("amistad");
    expect(ch).toContain("chatzona");
    expect(ch[ch.length - 1]).toBe("chatzona");
  });
});
