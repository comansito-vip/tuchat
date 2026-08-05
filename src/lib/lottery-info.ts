/**
 * Sorteos verificados por país.
 *
 * Vivía dentro de `loterias/[pais]/page.tsx`. Se mueve aquí porque el índice
 * /loterias necesita la misma lista y duplicarla habría garantizado que las dos
 * copias se separasen. Solo entran países cuyo listado está comprobado: antes se
 * generaba página para los 30 y los que faltaban caían en un fallback genérico
 * ("Lotería Nacional, Quiniela, Raspadita") que la FAQ y el JSON-LD afirmaban
 * como hecho. Inventar los sorteos de un país es peor que no tener página.
 */
export const LOTERIA_INFO: Record<string, { nombre: string; loterías: string[] }> = {
  espana: {
    nombre: "España",
    loterías: [
      "Lotería Nacional",
      "Primitiva",
      "Bonoloto",
      "El Gordo de la Primitiva",
      "Euromillones",
      "EuroDreams",
      "ONCE",
    ],
  },
  mexico: {
    nombre: "México",
    loterías: ["Lotería Nacional de México", "Melate", "Melate Retro", "Tris", "Chispazo"],
  },
  argentina: {
    nombre: "Argentina",
    loterías: ["Quini 6", "Lotería de la Ciudad", "Telekino", "Raspadita", "Brinco"],
  },
  colombia: {
    nombre: "Colombia",
    loterías: ["Lotería de Bogotá", "Lotería de Medellín", "Baloto", "Kino", "Lotería del Valle"],
  },
  chile: {
    nombre: "Chile",
    loterías: ["Loto de Chile", "Clasico", "Kino", "Súper Kino", "Raspe Feliz"],
  },
  peru: {
    nombre: "Perú",
    loterías: ["Tinka", "Kabala", "La Tinka Plus", "Lotería de la ONN", "Raspadita"],
  },
  venezuela: {
    nombre: "Venezuela",
    loterías: ["Loterías del Táchira", "Triple Caracas", "Animalitos", "Chance", "Lotería de Margarita"],
  },
  ecuador: {
    nombre: "Ecuador",
    loterías: ["Lotería Nacional del Ecuador", "Loto de la Benéfica", "Quini Ecuador", "La Madrugada"],
  },
  bolivia: {
    nombre: "Bolivia",
    loterías: ["Lotería Nacional de Bolivia", "Raspadito Boliviano", "Bingo Bolivia", "Línea"],
  },
  uruguay: {
    nombre: "Uruguay",
    loterías: ["Quiniela del Uruguay", "Rasca", "Lotería del Uruguay", "Tómbola Matutina"],
  },
  paraguay: {
    nombre: "Paraguay",
    loterías: ["Tómbola Paraguaya", "Quiniela Paraguaya", "Raspa y Gana"],
  },
  cuba: { nombre: "Cuba", loterías: ["Lotería Nacional de Cuba", "Bolita"] },
  "republica-dominicana": {
    nombre: "República Dominicana",
    loterías: ["Lotería Nacional Dominicana", "Leidsa", "Anguila", "Quiniela Pale"],
  },
  "puerto-rico": {
    nombre: "Puerto Rico",
    loterías: ["Lotería de Puerto Rico", "Pega 4", "Pega 3", "Loto de Puerto Rico", "MatchPlay"],
  },
  guatemala: {
    nombre: "Guatemala",
    loterías: ["Lotería Santa Lucía", "Quiniela Tradicional", "Loto Quina", "Raspadita"],
  },
  "costa-rica": {
    nombre: "Costa Rica",
    loterías: ["Lotería Nacional de Costa Rica", "Chances", "Lucky", "Tiempos"],
  },
  honduras: {
    nombre: "Honduras",
    loterías: ["Lotería Nacional de Honduras", "Loto Honduras", "Números Plus"],
  },
  "el-salvador": {
    nombre: "El Salvador",
    loterías: ["Lotería Nacional de El Salvador", "Superloto", "Lucky Strike"],
  },
  nicaragua: {
    nombre: "Nicaragua",
    loterías: ["Lotería Nacional de Nicaragua", "Tómbola Nocturna", "Lotto"],
  },
  panama: {
    nombre: "Panamá",
    loterías: ["Lotería Nacional de Beneficencia de Panamá", "Mida", "La Diaria"],
  },
  "estados-unidos": {
    nombre: "Estados Unidos",
    loterías: ["Powerball", "Mega Millions", "Pick 3", "Pick 4", "Lucky for Life"],
  },
  portugal: {
    nombre: "Portugal",
    loterías: ["Lotaria Nacional", "Euromilhões", "Totoloto", "Joker", "Raspadinha"],
  },
  "reino-unido": {
    nombre: "Reino Unido",
    loterías: ["National Lottery", "EuroMillions", "Thunderball", "Lotto HotPicks", "Set For Life"],
  },
  italia: {
    nombre: "Italia",
    loterías: ["Lotto", "SuperEnalotto", "EuroJackpot", "Win for Life", "Gratta e Vinci"],
  },
  alemania: {
    nombre: "Alemania",
    loterías: ["Lotto 6aus49", "EuroJackpot", "Glücksspirale", "GoldCard", "Keno"],
  },
  francia: {
    nombre: "Francia",
    loterías: ["Loto de la FDJ", "EuroMillions", "Keno", "Amigo", "Astro"],
  },
  canada: {
    nombre: "Canadá",
    loterías: ["Lotto 6/49", "Lotto Max", "Daily Grand", "Encore", "Ontario 49"],
  },
  marruecos: {
    nombre: "Marruecos",
    loterías: ["Loterie Nationale du Maroc", "Quinte+", "Tiercé", "Multi"],
  },
  "guinea-ecuatorial": {
    nombre: "Guinea Ecuatorial",
    loterías: ["Lotería Nacional de Guinea Ecuatorial"],
  },
};
