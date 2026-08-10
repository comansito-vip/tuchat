import { describe, it, expect, vi, beforeEach } from "vitest";
import { wmoIcon, fetchWeather, weatherMetaDescription } from "@/lib/weather";

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
    const result = await fetchWeather("madrid");
    expect(result).toBeNull();
  });
});
