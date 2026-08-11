import "@testing-library/jest-dom/vitest";

// La previsión del tiempo se cachea en disco entre builds (.data/weather), y en
// los tests eso hacía que `fetchWeather` devolviera lo que hubiera dejado ahí el
// último build en vez de llamar al fetch simulado. Un test no debe depender de
// lo que haya en el disco de quien lo ejecuta.
process.env.WEATHER_CACHE_TTL_MIN = "0";
