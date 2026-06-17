import { describe, it, expect, vi, beforeEach } from "vitest";
import { wmoIcon, fetchWeather } from "@/lib/weather";

describe("wmoIcon", () => {
  it("returns ☀️ for code 0", () => expect(wmoIcon(0)).toBe("☀️"));
  it("returns 🌤️ for code 2", () => expect(wmoIcon(2)).toBe("🌤️"));
  it("returns 🌧️ for code 63", () => expect(wmoIcon(63)).toBe("🌧️"));
  it("returns ⛈️ for code 95", () => expect(wmoIcon(95)).toBe("⛈️"));
  it("returns ❓ for unknown code", () => expect(wmoIcon(999)).toBe("❓"));
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
