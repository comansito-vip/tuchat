import type { Place } from "./types";

export const COUNTRIES: Place[] = [
  {
    slug: "espana",
    name: "España",
    kind: "pais",
    icon: "🇪🇸",
    users: 1240,
    votes: 1980,
    tag: "Popular",
    activity: "Alta",
    channels: ["espana", "internacional", "amistad", "chatzona"],
    related: ["madrid", "barcelona", "valencia", "sevilla", "bilbao", "malaga", "amistad", "amor"],
    intro:
      "La sala más activa de la red: aquí coinciden madrileños que salen del trabajo, valencianos que ya han cenado y canarios que llevan una hora de ventaja. España entera en un solo chat.",
  },
  {
    slug: "mexico",
    name: "México",
    kind: "pais",
    icon: "🇲🇽",
    users: 890,
    votes: 1340,
    tag: "Popular",
    activity: "Alta",
    channels: ["mexico", "internacional", "amistad", "chatzona"],
    related: ["ciudad-de-mexico", "colombia", "argentina", "peru", "amistad", "amor", "musica"],
    intro:
      "De Tijuana a Mérida hay miles de kilómetros y cientos de acentos: la sala de México los reúne a todos. Rancheras, reggaeton y debates que no terminan nunca.",
  },
  {
    slug: "argentina",
    name: "Argentina",
    kind: "pais",
    icon: "🇦🇷",
    users: 720,
    votes: 1095,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["argentina", "internacional", "amistad", "chatzona"],
    related: ["buenos-aires", "montevideo", "chile", "colombia", "amistad", "amor", "deportes"],
    intro:
      "Donde el voseo reina, el asado es religión de los domingos y el fútbol divide familias. Los argentinos no necesitan mucho para arrancar una conversación que dure hasta las cuatro.",
  },
  {
    slug: "colombia",
    name: "Colombia",
    kind: "pais",
    icon: "🇨🇴",
    users: 610,
    votes: 925,
    activity: "Alta",
    channels: ["colombia", "internacional", "amistad", "chatzona"],
    related: ["bogota", "mexico", "argentina", "peru", "amistad", "amor", "musica"],
    intro:
      "Colombia tiene el don de la amabilidad en el trato y la pasión en la discusión: en esta sala se habla de fútbol, de vallenato, de la economía y de los planes del fin de semana.",
  },
];

export const CONTINENTS: { title: string; places: { name: string; slug: string }[] }[] = [
  { title: "España", places: [{ name: "España", slug: "espana" }] },
  {
    title: "Latinoamérica",
    places: [
      { name: "México", slug: "mexico" },
      { name: "Argentina", slug: "argentina" },
      { name: "Colombia", slug: "colombia" },
      { name: "Chile", slug: "chile" },
      { name: "Perú", slug: "peru" },
      { name: "Uruguay", slug: "uruguay" },
    ],
  },
  {
    title: "Centroamérica",
    places: [
      { name: "Guatemala", slug: "guatemala" },
      { name: "Costa Rica", slug: "costa-rica" },
      { name: "Panamá", slug: "panama" },
    ],
  },
  {
    title: "Norteamérica",
    places: [
      { name: "Estados Unidos", slug: "estados-unidos" },
      { name: "Canadá", slug: "canada" },
    ],
  },
  {
    title: "Europa",
    places: [
      { name: "Francia", slug: "francia" },
      { name: "Italia", slug: "italia" },
      { name: "Portugal", slug: "portugal" },
      { name: "Alemania", slug: "alemania" },
    ],
  },
  {
    title: "África",
    places: [
      { name: "Marruecos", slug: "marruecos" },
      { name: "Guinea Ecuatorial", slug: "guinea-ecuatorial" },
    ],
  },
  { title: "Mundo", places: [{ name: "Internacional", slug: "internacional" }] },
];
