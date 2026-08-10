import { describe, it, expect } from "vitest";
import { esDivisionAdministrativa } from "./salas-geo.mjs";
import {
  revisarFicha, shingles, fraseoCalcado, indiceDeShingles, parrafosDuplicados,
} from "../lib/calidad.mjs";
import { extraeJSON } from "../lib/llm.mjs";

describe("esDivisionAdministrativa", () => {
  // El cron coló Sinaloa —el estado— como si fuera una ciudad, y el primer
  // intento de arreglarlo daba por división administrativa a media Latinoamérica
  // porque las fichas de ciudad nombran su estado en la primera frase.
  it("no confunde una ciudad con su estado o provincia", () => {
    for (const t of [
      "Piedras Negras es una ciudad mexicana del estado de Coahuila, en la frontera.",
      "Apodaca es una ciudad del estado de Nuevo León, México.",
      "Los Mochis es una ciudad del noroeste de México, en el estado de Sinaloa.",
      "Puente Alto es una comuna de la Región Metropolitana de Santiago.",
      "Corrientes es la capital de la provincia homónima de Argentina.",
      "Catia La Mar es una de las once parroquias del municipio Vargas.",
    ]) {
      expect(esDivisionAdministrativa(t), t).toBe(false);
    }
  });

  it("detecta estados, provincias y departamentos", () => {
    for (const t of [
      "Sinaloa, oficialmente Estado Libre y Soberano de Sinaloa, es uno de los treinta y un estados de México.",
      "Canelones es un departamento de Uruguay situado al sur del país.",
      "Aragua es un estado de Venezuela.",
    ]) {
      expect(esDivisionAdministrativa(t), t).toBe(true);
    }
  });
});

describe("revisarFicha", () => {
  const buena = {
    intro: "Sala de chat de Corrientes, capital argentina junto al Paraná, con su costanera cardioprotegida y el certamen interbarrios del municipio.",
    about: "Corrientes, capital de la provincia argentina del mismo nombre, está junto al río Paraná. ".repeat(3)
      + "La ciudad instaló desfibriladores en su costanera junto al Rotary Club, y el municipio publica en línea los trámites y las infracciones. "
      + "En la sala entran vecinos que preguntan por gestiones, gente que comenta obras del barrio y visitantes que buscan referencias de la ciudad antes de viajar. "
      + "Las conversaciones giran alrededor del transporte urbano, de los centros para mayores y de lo que va pasando en el litoral correntino cada semana.",
    aboutTitle: "La costanera del Paraná y los trámites del municipio",
  };

  it("aprueba una ficha correcta", () => {
    expect(revisarFicha(buena)).toEqual([]);
  });

  /**
   * El aboutTitle pasó de opcional a obligatorio cuando el backfill del
   * 2026-08-11 dejó las 2.561 salas con H2 propio: `about-titles.test.ts` exige
   * ahora que ninguna sala se quede con el genérico "Sobre el chat de X". Si
   * una ficha sin título llegara a publicarse, ese test fallaría dentro del
   * `npm test` del cron nocturno, y con `set -e` el goteo se pararía entero.
   * Mejor descartar esa localidad aquí, que es lo que el generador ya sabe
   * hacer, y seguir con la siguiente.
   */
  it("rechaza una ficha sin aboutTitle", () => {
    expect(revisarFicha({ ...buena, aboutTitle: undefined }).join(" "))
      .toMatch(/aboutTitle/);
  });

  it("rechaza la intro fuera del rango de meta description", () => {
    expect(revisarFicha({ ...buena, intro: "Chat de Corrientes." }).join(" "))
      .toMatch(/intro\/meta de \d+ caracteres/);
  });

  it("rechaza las muletillas de IA", () => {
    const ficha = { ...buena, about: `${buena.about} Es el lugar perfecto para conocer gente.` };
    expect(revisarFicha(ficha).join(" ")).toMatch(/muletillas de IA/);
  });

  it("rechaza el markdown, que se imprimiría literal dentro del <p>", () => {
    expect(revisarFicha({ ...buena, about: `## Sobre la ciudad\n${buena.about}` }).join(" "))
      .toMatch(/encabezados markdown/);
  });
});

describe("detección de plantilla", () => {
  it("pilla el fraseo calcado aunque el párrafo no sea idéntico", () => {
    const plantilla = "forma parte de la zona metropolitana de la capital y en su sala se habla de tráfico, de obras y de lo que pasa cada semana en el municipio";
    const publicada = { slug: "apodaca", about: `Apodaca ${plantilla}` };
    const nueva = { slug: "escobedo", about: `Escobedo ${plantilla}` };
    const calco = fraseoCalcado(nueva, indiceDeShingles([publicada]));
    expect(calco?.slug).toBe("apodaca");
  });

  it("no marca dos textos que solo comparten palabras sueltas", () => {
    const publicada = { slug: "vigo", about: "Vigo es una ciudad portuaria de Galicia con una ría muy transitada." };
    const nueva = { slug: "gijon", about: "Gijón mira al Cantábrico y su puerto mueve carbón y acero desde hace un siglo." };
    expect(fraseoCalcado(nueva, indiceDeShingles([publicada]))).toBeNull();
  });

  // Saltaba con "habitantes es una de las ciudades mas", que es castellano
  // corriente: dos fichas legítimas pueden coincidir en una cadena así.
  it("tolera una única coincidencia de fraseo genérico", () => {
    const publicada = { slug: "san-rafael", about: "San Rafael, con 110.000 habitantes, es una de las ciudades más pobladas de Mendoza y vive del vino." };
    const nueva = { slug: "canelones", about: "Canelones, con 20.000 habitantes, es una de las ciudades más cercanas a Montevideo y crece con ella." };
    expect(fraseoCalcado(nueva, indiceDeShingles([publicada]))).toBeNull();
  });

  it("pilla el párrafo repetido entre dos localidades", () => {
    const parrafo = "Para entrar solo hace falta elegir un apodo, sin registro ni correo electrónico de por medio en ningún momento.";
    const choques = parrafosDuplicados([
      { slug: "a", cuerpo: parrafo },
      { slug: "b", cuerpo: parrafo },
    ]);
    expect(choques).toHaveLength(1);
    expect(choques[0]).toMatchObject({ a: "a", b: "b" });
  });

  it("shingles ignora acentos y puntuación", () => {
    expect(shingles("Está junto al río Paraná, en el litoral", 3))
      .toContain("esta junto al");
  });
});

describe("extraeJSON", () => {
  it("saca el objeto de una respuesta envuelta en markdown", () => {
    expect(extraeJSON('Aquí tienes:\n```json\n{"intro":"hola"}\n```\nEspero que sirva'))
      .toEqual({ intro: "hola" });
  });

  // La mitad larga de las respuestas traía el salto de párrafo del "about" como
  // un salto de línea de verdad, y JSON.parse lo rechazaba.
  it("tolera saltos de línea crudos dentro de una cadena", () => {
    expect(extraeJSON('{"about":"Primer párrafo.\n\nSegundo párrafo."}'))
      .toEqual({ about: "Primer párrafo.\n\nSegundo párrafo." });
  });

  it("no se lleva por delante texto que venga después del objeto", () => {
    expect(extraeJSON('{"a":{"b":1}} y esto sobra }')).toEqual({ a: { b: 1 } });
  });
});
