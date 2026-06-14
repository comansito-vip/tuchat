// Arcanos Mayores del tarot con su significado breve. Contenido SEO long-tail
// ("significado de la carta X") y base de la "carta del día" de /tarot.
export interface Arcano {
  num: number;
  name: string;
  icon: string;
  meaning: string;
}

export const ARCANOS_MAYORES: Arcano[] = [
  { num: 0, name: "El Loco", icon: "🃏", meaning: "Comienzos, libertad y saltos al vacío. Invita a confiar en el camino aunque no veas el destino; el riesgo de hoy puede ser la aventura que necesitabas." },
  { num: 1, name: "El Mago", icon: "🪄", meaning: "Tienes las herramientas para lograr lo que te propones. Habla de iniciativa, talento y de convertir las ideas en acción concreta." },
  { num: 2, name: "La Sacerdotisa", icon: "🌙", meaning: "Intuición y conocimiento oculto. Pide escuchar tu voz interior antes de actuar y desconfiar de lo que se ve a simple vista." },
  { num: 3, name: "La Emperatriz", icon: "👑", meaning: "Abundancia, creatividad y cuidado. Anuncia proyectos que florecen y una etapa fértil en lo afectivo y lo material." },
  { num: 4, name: "El Emperador", icon: "🏛️", meaning: "Estructura, autoridad y disciplina. Es momento de poner orden, asumir el mando y construir sobre bases firmes." },
  { num: 5, name: "El Sumo Sacerdote", icon: "📜", meaning: "Tradición, aprendizaje y guía. Aparece un mentor o una institución; conviene escuchar el consejo experimentado." },
  { num: 6, name: "Los Enamorados", icon: "💞", meaning: "Decisiones del corazón y uniones. Habla de elegir desde los valores propios, no solo desde el deseo." },
  { num: 7, name: "El Carro", icon: "🛞", meaning: "Voluntad, control y victoria. Avanzas con determinación; el éxito llega si mantienes el rumbo y dominas tus impulsos." },
  { num: 8, name: "La Justicia", icon: "⚖️", meaning: "Equilibrio, verdad y consecuencias. Lo que siembres recogerás; pide honestidad y decisiones meditadas." },
  { num: 9, name: "El Ermitaño", icon: "🕯️", meaning: "Introspección y búsqueda interior. Un tiempo de retiro y reflexión que ilumina el siguiente paso." },
  { num: 10, name: "La Rueda de la Fortuna", icon: "🎡", meaning: "Ciclos, cambios y destino. Algo gira a tu favor; aprovecha el momento porque la suerte se mueve." },
  { num: 11, name: "La Fuerza", icon: "🦁", meaning: "Coraje sereno y dominio interior. La fuerza real es la paciencia y la dulzura, no la imposición." },
  { num: 12, name: "El Colgado", icon: "🙃", meaning: "Pausa, sacrificio y nueva perspectiva. A veces hay que soltar el control y mirar las cosas del revés." },
  { num: 13, name: "La Muerte", icon: "🦋", meaning: "Finales y transformación. No anuncia desgracias, sino el cierre de una etapa para que nazca otra." },
  { num: 14, name: "La Templanza", icon: "🍯", meaning: "Armonía, equilibrio y paciencia. Mezcla con mesura; la calma y el punto medio traen sanación." },
  { num: 15, name: "El Diablo", icon: "⛓️", meaning: "Ataduras, tentación y dependencia. Señala aquello que te encadena; reconocerlo es el primer paso para liberarte." },
  { num: 16, name: "La Torre", icon: "🗼", meaning: "Ruptura súbita y revelación. Lo que se derrumba estaba mal cimentado; tras el sacudón llega claridad." },
  { num: 17, name: "La Estrella", icon: "⭐", meaning: "Esperanza, inspiración y calma. Después de la tormenta, vuelve la fe y se abren posibilidades luminosas." },
  { num: 18, name: "La Luna", icon: "🌚", meaning: "Ilusiones, miedos y lo inconsciente. Cuidado con los engaños y las apariencias; no todo es lo que parece." },
  { num: 19, name: "El Sol", icon: "☀️", meaning: "Éxito, alegría y vitalidad. Una de las cartas más favorables: claridad, logros y energía para disfrutar." },
  { num: 20, name: "El Juicio", icon: "📯", meaning: "Despertar, balance y segundas oportunidades. Es momento de saldar cuentas con el pasado y renacer." },
  { num: 21, name: "El Mundo", icon: "🌍", meaning: "Plenitud, logro y cierre de ciclo. Culmina un proceso con éxito; el universo te da la enhorabuena." },
];

/** Carta del día: determinista por día del año (misma carta para todos hoy). */
export function cartaDelDia(date: Date): Arcano {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return ARCANOS_MAYORES[dayOfYear % ARCANOS_MAYORES.length];
}
