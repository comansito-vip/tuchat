import type { WeatherData } from "@/lib/weather";

function TempBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-bold text-ink">{value}°</p>
    </div>
  );
}

export function WeatherWidget({
  data,
  nombre,
}: {
  data: WeatherData | null;
  nombre: string;
}) {
  if (!data) {
    return (
      <div className="mt-6 rounded-2xl border border-line bg-card p-6">
        <p className="text-sm text-muted">
          Sin datos meteorológicos disponibles para {nombre}. Consulta{" "}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue hover:underline"
          >
            Open-Meteo
          </a>{" "}
          para más información.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-card p-4 sm:p-6">
      {/* Current conditions */}
      <div className="flex items-center gap-4">
        <span className="text-6xl" aria-hidden="true">{data.icon}</span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Ahora en {nombre}
          </p>
          <p className="text-5xl font-extrabold text-ink">{data.current.temp}°C</p>
          <div className="mt-1 flex gap-4">
            <TempBadge value={data.maxTemp} label="Máx" />
            <TempBadge value={data.minTemp} label="Mín" />
          </div>
        </div>
      </div>

      {/* Wind & precipitation */}
      <div className="mt-4 flex gap-6 text-sm text-muted">
        <span>💨 {data.current.windSpeed} km/h</span>
        {data.current.precipitation > 0 && (
          <span>🌧️ {data.current.precipitation} mm</span>
        )}
      </div>

      {/* 5-day forecast */}
      {data.forecast.length > 1 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Previsión 5 días
          </p>
          <div className="grid grid-cols-5 gap-1 text-center text-sm sm:gap-2">
            {data.forecast.map((day) => {
              const label = new Date(day.date).toLocaleDateString("es-ES", {
                weekday: "short",
              });
              return (
                <div key={day.date}>
                  <p className="text-xs text-muted capitalize">{label}</p>
                  <p className="text-lg">{day.icon}</p>
                  <p className="font-bold text-ink">{day.maxTemp}°</p>
                  <p className="text-xs text-muted">{day.minTemp}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
