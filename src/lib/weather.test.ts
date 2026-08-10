import { describe, it, expect, vi, beforeEach } from "vitest";
import { wmoIcon, fetchWeather, weatherMetaDescription, MIN_MS_ENTRE_PETICIONES } from "@/lib/weather";

describe("wmoIcon", () => {
  it("returns ☀️ for code 0", () => expect(wmoIcon(0)).toBe("☀️"));
  it("returns 🌤️ for code 2", () => expect(wmoIcon(2)).toBe("🌤️"));
  it("returns 🌧️ for code 63", () => expect(wmoIcon(63)).toBe("🌧️"));
  it("returns ⛈️ for code 95", () => expect(wmoIcon(95)).toBe("⛈️"));
  it("returns ❓ for unknown code", () => expect(wmoIcon(999)).toBe("❓"));
});

/**
 * La description de /tiempo/[ciudad] se arma con la previsión real, y en las
 * localidades de nombre largo con cualificador —Concepción (Paraguay), San
 * Marcos (Guatemala), Ushuaia— se iba a 173-178 caracteres, por encima de los
 * ~170 que muestra Google: la frase se cortaba a media palabra en el SERP.
 */
describe("weatherMetaDescription", () => {
  const w = {
    current: { temp: 18.4, weatherCode: 61, windSpeed: 22, precipitation: 1.2 },
    maxTemp: 24,
    minTemp: 11,
    icon: "🌧️",
    forecast: [1, 2, 3, 4, 5].map((d) => ({
      date: `2026-08-0${d}`,
      maxTemp: 24,
      minTemp: 11,
      weatherCode: 61,
      icon: "🌧️",
    })),
  };

  it("cabe en 170 caracteres aun con el nombre y el cualificador más largos", () => {
    const d = weatherMetaDescription("San Miguel de Tucumán (Argentina)", "Provincia de Tucumán", w);
    expect(d.length).toBeLessThanOrEqual(170);
  });

  it("mantiene la temperatura y la máxima y mínima reales de la ciudad", () => {
    const d = weatherMetaDescription("Ushuaia", undefined, w);
    expect(d).toContain("18°C");
    expect(d).toContain("24°");
    expect(d).toContain("11°");
    expect(d.length).toBeLessThanOrEqual(170);
  });

  it("sin previsión describe la ciudad sin inventar datos", () => {
    const d = weatherMetaDescription("Petrer", undefined, null);
    expect(d).toContain("Petrer");
    expect(d).not.toMatch(/\d+°/);
    expect(d.length).toBeLessThanOrEqual(170);
  });
});

describe("fetchWeather", () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  // Cada test usa una ciudad distinta a propósito: fetchWeather memoiza la
  // promesa por slug mientras vive el proceso, así que repetir "madrid" haría
  // que un test recibiera la respuesta que preparó el anterior.

  it("returns WeatherData for a known city slug", async () => {
    const mockResponse = {
      current: {
        temperature_2m: 22.5,
        weather_code: 2,
        wind_speed_10m: 10.0,
        precipitation: 0.0,
      },
      daily: {
        time: ["2026-06-17", "2026-06-18", "2026-06-19", "2026-06-20"],
        temperature_2m_max: [26, 24, 22, 23],
        temperature_2m_min: [14, 13, 12, 14],
        precipitation_sum: [0, 0.2, 1.5, 0],
        weather_code: [2, 3, 61, 2],
      },
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as unknown as Response);

    const data = await fetchWeather("madrid");
    expect(data).not.toBeNull();
    expect(data!.current.temp).toBe(22.5);
    expect(data!.icon).toBe("🌤️");
    expect(data!.forecast).toHaveLength(4);
    expect(data!.forecast[0].date).toBe("2026-06-17");
  });

  it("returns null for an unknown slug", async () => {
    const result = await fetchWeather("ciudad-inexistente-xyz");
    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await fetchWeather("bilbao");
    expect(result).toBeNull();
  });

  /**
   * El build pide las 1.965 localidades con los cinco workers de Next, y
   * Open-Meteo empieza a devolver 429. Sin reintento, cada uno de esos fallos
   * publicaba una landing titulada "El tiempo en X" cuyo cuerpo decía "Sin
   * datos meteorológicos disponibles": 1.332 páginas del build del 2026-08-10,
   * de las que un 30% seguía así en producción. La API no estaba caída —40
   * peticiones seguidas responden 200—, era el ritmo del build.
   */
  const respuestaValida = {
    current: { temperature_2m: 20, weather_code: 0, wind_speed_10m: 5, precipitation: 0 },
    daily: {
      time: ["2026-08-11"],
      temperature_2m_max: [30],
      temperature_2m_min: [18],
      precipitation_sum: [0],
      weather_code: [0],
    },
  };

  it("reintenta cuando la API responde 429 y se queda con los datos del reintento", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 429 } as unknown as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => respuestaValida } as unknown as Response);
    global.fetch = fetchMock;

    const data = await fetchWeather("zaragoza");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(data?.current.temp).toBe(20);
  });

  it("reintenta cuando la petición falla por red", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("ECONNRESET"))
      .mockResolvedValueOnce({ ok: true, json: async () => respuestaValida } as unknown as Response);
    global.fetch = fetchMock;

    expect(await fetchWeather("malaga")).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  /**
   * Reintentar no bastó: el build bajó de 1.332 páginas sin previsión a 467,
   * pero seguía publicando vacías. Con la API sana —60 peticiones seguidas dan
   * 200 y las ciudades que fallaban responden bien de una en una— lo que sobra
   * es ritmo: hay que espaciar las peticiones, no solo repetirlas.
   */
  it("espacia las peticiones seguidas en vez de dispararlas a la vez", async () => {
    const instantes: number[] = [];
    global.fetch = vi.fn().mockImplementation(async () => {
      instantes.push(Date.now());
      return { ok: true, json: async () => respuestaValida } as unknown as Response;
    });

    await Promise.all([fetchWeather("murcia"), fetchWeather("alicante"), fetchWeather("cordoba")]);

    expect(instantes).toHaveLength(3);
    for (let i = 1; i < instantes.length; i++) {
      expect(instantes[i] - instantes[i - 1]).toBeGreaterThanOrEqual(MIN_MS_ENTRE_PETICIONES - 20);
    }
  });

  it("no espera cuando hace rato que no se pide nada", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => respuestaValida } as unknown as Response);
    await fetchWeather("valladolid");
    await new Promise((r) => setTimeout(r, MIN_MS_ENTRE_PETICIONES + 30));

    const t0 = Date.now();
    await fetchWeather("gijon");
    expect(Date.now() - t0).toBeLessThan(MIN_MS_ENTRE_PETICIONES);
  });

  /**
   * `tiempo/[ciudad]` pide la previsión dos veces: una en generateMetadata
   * (para la description con la temperatura real) y otra en el cuerpo. Next
   * deduplica el fetch, pero el turno del limitador se consumía igual, así que
   * cada página gastaba dos huecos de 700 ms y el build tardaba el doble de lo
   * necesario. Con la promesa memoizada, la segunda llamada no toca la red ni
   * pide turno.
   */
  it("una sola petición aunque la página pida la previsión dos veces", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => respuestaValida } as unknown as Response);
    global.fetch = fetchMock;

    const [a, b] = await Promise.all([fetchWeather("granada"), fetchWeather("granada")]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
  });

  it("no reintenta un 400: esa petición está mal y repetirla da igual", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 400 } as unknown as Response);
    global.fetch = fetchMock;

    expect(await fetchWeather("vigo")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
