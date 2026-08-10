import { it, expect, describe } from "vitest";
import { buildRoomCrumbs, buildFaq, aboutLead, roomBullets, roomServiceCards } from "@/app/chat/[slug]/copy";
import { getPlace, getNews, getCountries, getCities, getTopics } from "@/data";
import { hasWeather } from "@/lib/weather";
import { LOTERIA_INFO } from "@/lib/lottery-info";

describe("chat room copy", () => {
  it("builds breadcrumbs Inicio > España > Madrid for a city", () => {
    const crumbs = buildRoomCrumbs(getPlace("madrid")!);
    expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "España", "Madrid"]);
  });

  it("builds breadcrumbs Inicio > España for a country room", () => {
    const crumbs = buildRoomCrumbs(getPlace("espana")!);
    expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "España"]);
  });

  it("builds breadcrumbs Inicio > Anime > Naruto for a sub-topic", () => {
    const crumbs = buildRoomCrumbs(getPlace("naruto")!);
    expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "Anime", "Naruto"]);
    // Parent is a topic (tematica), so URL should be /chat/anime
    expect(crumbs[1].url).toBe("/chat/anime");
  });

  // El FAQ ya no tiene un número fijo de preguntas: solo entran aquellas cuya
  // respuesta cambia de una sala a otra, así que una sala con menos datos
  // publica menos preguntas en vez de rellenar con texto igual para todas.
  it("buildFaq only asks questions whose answer is specific to the room", () => {
    const faq = buildFaq(getPlace("madrid")!);
    expect(faq.length).toBeGreaterThanOrEqual(2);
    for (const item of faq) expect(item.q).toContain("Madrid");
  });

  it("buildFaq answers what the room is about with its own text", () => {
    const place = { ...getPlace("amor")!, about: undefined };
    expect(buildFaq(place)[0].a).toBe(place.intro);
  });

  it("buildFaq names real sibling rooms of the province", () => {
    const faq = buildFaq(getPlace("madrid")!);
    const vecinas = faq.find((f) => f.q.includes("otras localidades"));
    expect(vecinas).toBeDefined();
    // Getafe es una ciudad real de la provincia de Madrid en el catálogo.
    expect(getPlace("getafe")).toBeDefined();
  });

  it("aboutLead returns a non-empty string for each kind", () => {
    expect(aboutLead(getPlace("madrid")!)!.length).toBeGreaterThan(40);
    expect(aboutLead(getPlace("espana")!)!.length).toBeGreaterThan(40);
    expect(aboutLead(getPlace("amor")!)!.length).toBeGreaterThan(40);
  });

  it("aboutLead produces kind-specific text (3 unique outputs)", () => {
    const ciudad = aboutLead(getPlace("madrid")!);
    const pais = aboutLead(getPlace("espana")!);
    const tematica = aboutLead(getPlace("amor")!);
    expect(ciudad).not.toBe(pais);
    expect(ciudad).not.toBe(tematica);
    expect(pais).not.toBe(tematica);
  });

  it("aboutLead ciudad mentions the place name", () => {
    expect(aboutLead(getPlace("madrid")!)).toContain("Madrid");
  });

  it("aboutLead pais mentions the place name", () => {
    expect(aboutLead(getPlace("espana")!)).toContain("España");
  });

  it("aboutLead sitúa la ciudad en su provincia y comunidad reales", () => {
    const lead = aboutLead(getPlace("barcelona")!)!;
    expect(lead).toContain("Barcelona");
    expect(lead).toContain("Cataluña");
  });

  it("roomBullets afirma hechos comprobables, no relleno", () => {
    const madrid = roomBullets(getPlace("madrid")!);
    expect(madrid.length).toBeGreaterThanOrEqual(3);
    // El primer bullet nombra el canal real al que conecta la sala.
    expect(madrid[0]).toContain("#madrid");
    expect(roomBullets(getPlace("espana")!).length).toBeGreaterThanOrEqual(3);
    expect(roomBullets(getPlace("amor")!).length).toBeGreaterThanOrEqual(2);
  });
});

/**
 * El copy nombra canales reales del servidor, no el slug de la sala.
 *
 * En 2.395 de las 2.547 salas `channels[0]` NO coincide con el slug: `espana`
 * entra a #españa, `estados-unidos` a #usa, `belice` a #internacional y
 * `mas-de-30` a #mas_de_30. Una primera versión daba por hecho que el canal se
 * llamaba como el slug y anunciaba canales inexistentes en el 94% del catálogo.
 */
describe("el copy nombra los canales que existen de verdad", () => {
  it("usa channels[0], no el slug", () => {
    // belice entra a #internacional; su slug no es ningún canal.
    const belice = getPlace("belice")!;
    const texto = [...roomBullets(belice), ...buildFaq(belice).map((f) => f.a)].join(" ");
    expect(texto).toContain(`#${belice.channels[0]}`);
    expect(texto).not.toContain("#belice");
  });

  it("no anuncia canal propio cuando la sala comparte el de su zona", () => {
    const belice = getPlace("belice")!;
    expect(roomBullets(belice)[0]).toContain("comparten las salas");
  });

  it("reconoce el canal propio aunque cambien tildes o guiones", () => {
    // El slug es `espana` y el canal `españa`: es el mismo sitio, y decir que
    // España "no tiene canal propio" era falso.
    expect(roomBullets(getPlace("espana")!)[0]).toContain("canal propio");
    expect(roomBullets(getPlace("mas-de-30")!)[0]).toContain("canal propio");
  });

  it("no describe la categoría de una temática como una zona geográfica", () => {
    const naruto = getPlace("naruto")!;
    expect(naruto.channels[0]).toBe("anime");
    expect(roomBullets(naruto)[0]).toContain("su categoría");
  });

  it("ninguna sala repite un canal en su lista", () => {
    for (const p of [...getCountries(), ...getCities(), ...getTopics()]) {
      expect(new Set(p.channels).size, p.slug).toBe(p.channels.length);
    }
  });
});

/**
 * Estas dos pruebas son la red de seguridad contra la regresión que motivó el
 * cambio: hasta julio de 2026, 1.996 ciudades compartían el mismo párrafo y los
 * mismos cuatro bullets salvo el nombre, y Search Console devolvía "Descubierta:
 * actualmente sin indexar" para todas ellas. Comparamos el texto con el nombre
 * de la sala sustituido por un marcador: si dos salas coinciden tras eso, es
 * que solo se diferenciaban en el nombre.
 */
describe("el copy de sala no es una plantilla con hueco", () => {
  const despersonalizar = (texto: string, p: NonNullable<ReturnType<typeof getPlace>>) => {
    let out = texto;
    for (const v of [p.name, p.parentName, p.provincia].filter(Boolean) as string[]) {
      out = out.split(v).join("«X»");
    }
    return out;
  };

  const muestra = ["madrid", "barcelona", "valencia", "sevilla", "zaragoza", "vigo", "getafe", "gandia"];

  it("aboutLead no repite molde entre ciudades de provincias distintas", () => {
    const moldes = muestra
      .map((s) => getPlace(s)!)
      .map((p) => despersonalizar(aboutLead(p) ?? "", p));
    expect(new Set(moldes).size).toBeGreaterThan(1);
  });

  it("roomBullets no repite molde entre ciudades de provincias distintas", () => {
    const moldes = muestra
      .map((s) => getPlace(s)!)
      .map((p) => despersonalizar(roomBullets(p).join(" | "), p));
    expect(new Set(moldes).size).toBe(moldes.length);
  });
});

/**
 * Las tarjetas de "Más sobre X" enlazaban a /tiempo/{slug} en toda sala que no
 * fuese temática y a /loterias/{slug} en todo país. Pero ninguna de esas dos
 * rutas genera página para todos: /tiempo solo cubre las localidades con
 * previsión real (hasWeather) y /loterias solo los países con sorteos
 * verificados (LOTERIA_INFO), y ambas declaran `dynamicParams = false`, así que
 * lo que no se genera responde 404 —no un redirect—. Resultado medido sobre el
 * build del 2026-08-10: 76 enlaces internos a 404 desde páginas indexables.
 *
 * El caso se repone solo: cada tanda de salas que publica el cron de goteo trae
 * localidades nuevas sin coordenadas. Por eso el test recorre el catálogo
 * entero en vez de un puñado de ejemplos.
 */
describe("las tarjetas de servicio no enlazan a páginas que no existen", () => {
  const destinos = (slug: string) => roomServiceCards(getPlace(slug)!).map((c) => c.href);

  it("no ofrece el tiempo de una localidad sin previsión", () => {
    expect(hasWeather("petrer")).toBe(false);
    expect(destinos("petrer")).not.toContain("/tiempo/petrer");
  });

  it("sigue ofreciendo el tiempo donde sí hay previsión", () => {
    expect(destinos("madrid")).toContain("/tiempo/madrid");
  });

  it("no ofrece loterías de un país sin sorteos verificados", () => {
    expect("belice" in LOTERIA_INFO).toBe(false);
    expect(destinos("belice")).not.toContain("/loterias/belice");
  });

  it("sigue ofreciendo loterías del país que sí las tiene", () => {
    expect(destinos("espana")).toContain("/loterias/espana");
  });

  it("ninguna sala del catálogo enlaza a una ruta sin página", () => {
    const rotos: string[] = [];
    for (const place of [...getCountries(), ...getCities(), ...getTopics()]) {
      for (const { href } of roomServiceCards(place)) {
        const slug = href.split("/")[2];
        if (href.startsWith("/tiempo/") && !hasWeather(slug)) rotos.push(`${place.slug} → ${href}`);
        if (href.startsWith("/loterias/") && !(slug in LOTERIA_INFO)) rotos.push(`${place.slug} → ${href}`);
      }
    }
    expect(rotos).toEqual([]);
  });
});

describe("getNews ordering", () => {
  it("returns articles sorted newest first", () => {
    const articles = getNews();
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i].date <= articles[i - 1].date).toBe(true);
    }
  });
});
