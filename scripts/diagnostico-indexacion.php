<?php
/**
 * Diagnóstico de indexación de tuchat.org contra la API de Search Console.
 *
 * Existe porque el problema de fondo del dominio no es de contenido: con ~4.600
 * URLs publicadas solo 6 imprimían en 90 días. Antes de escribir una página más
 * hay que saber si Google las ha descubierto, si las ha rastreado y por qué no
 * las indexa.
 *
 * La API NO expone el informe de Cobertura agregado, así que se inspecciona una
 * MUESTRA representativa (home, hubs, salas grandes, salas pequeñas, salas
 * recién publicadas por el cron) y se agrupa por `coverageState`. El cupo es de
 * 2.000 inspecciones al día por propiedad, de sobra para esto.
 *
 * Uso: php scripts/diagnostico-indexacion.php [muestra=40]
 */
define('CONFIG', '/home/javier/chatargentina/config');
define('CACHE_DIR', __DIR__ . '/../data/.gsc-cache');
@mkdir(CACHE_DIR, 0777, true);
require '/home/javier/chatargentina/includes/gsc.php';

const SITIO = 'sc-domain:tuchat.org';
const BASE  = 'https://www.tuchat.org';

$muestra = (int)($argv[1] ?? 40);

/** URLs a inspeccionar, por grupos, para poder comparar unos con otros. */
$grupos = [
    'home y hubs' => ['/', '/chat', '/noticias', '/deportes', '/anime', '/tarot', '/horoscopo'],
];

// Salas: se leen del propio catálogo para no inventarse rutas.
$salidaSalas = shell_exec('cd ' . escapeshellarg(dirname(__DIR__)) . ' && npx tsx -e '
    . escapeshellarg(<<<'JS'
import { getCountries, getCities, getTopics } from "./src/data/index.ts";
import { CITIES_GENERADAS } from "./src/data/cities-generadas.ts";
const nuevas = new Set(CITIES_GENERADAS.map((c) => c.slug));
const ciudades = getCities().filter((c) => !nuevas.has(c.slug));
const orden = [...ciudades].sort((a, b) => b.users - a.users);
const linea = (grupo, lista) => lista.forEach((p) => console.log(grupo + "\t" + p.slug));
linea("paises", getCountries().slice(0, 6));
linea("salas grandes", orden.slice(0, 10));
linea("salas pequenas", orden.slice(-10));
linea("tematicas", getTopics().slice(0, 6));
linea("recien publicadas", CITIES_GENERADAS);
JS
    ) . ' 2>/dev/null');

foreach (explode("\n", trim((string)$salidaSalas)) as $linea) {
    if (!str_contains($linea, "\t")) continue;
    [$grupo, $slug] = explode("\t", $linea);
    $grupos[$grupo][] = "/chat/$slug";
}

$resultados = [];
$porEstado  = [];
$inspeccionadas = 0;

foreach ($grupos as $grupo => $rutas) {
    echo "\n=== $grupo ===\n";
    foreach ($rutas as $ruta) {
        if ($inspeccionadas >= $muestra) break 2;
        $url = BASE . $ruta;
        $r = gsc_inspect_url(SITIO, $url);
        $inspeccionadas++;

        if (!$r['ok']) {
            printf("  %-42s ERROR %s\n", $ruta, substr((string)($r['error'] ?? '?'), 0, 60));
            continue;
        }
        $estado = $r['coverage'] ?? '(sin dato)';
        $porEstado[$estado] = ($porEstado[$estado] ?? 0) + 1;
        $resultados[] = ['grupo' => $grupo, 'ruta' => $ruta] + $r;

        printf("  %-42s %-9s %-40s %s\n",
            $ruta,
            $r['verdict'] ?? '—',
            substr($estado, 0, 40),
            $r['lastCrawl'] ? substr($r['lastCrawl'], 0, 10) : 'nunca rastreada');
        usleep(400000);   // no atropellar la API
    }
}

echo "\n\n========== RESUMEN ($inspeccionadas URLs) ==========\n";
arsort($porEstado);
foreach ($porEstado as $estado => $n) {
    printf("  %4d  %s\n", $n, $estado);
}

$sinRastrear = array_filter($resultados, fn($r) => empty($r['lastCrawl']));
// Solo cuenta como bloqueo lo que Google DICE que está bloqueado. En una URL que
// nunca ha rastreado, `robots` e `indexing` vienen como *_UNSPECIFIED porque no
// tiene el dato — contarlas como bloqueadas daba "36 de 40 bloqueadas por
// robots", que era falso y apuntaba a arreglar un robots.txt que está bien.
$bloqueadas  = array_filter($resultados, fn($r) => ($r['robots'] ?? '') === 'DISALLOWED'
    || in_array($r['indexing'] ?? '', ['BLOCKED_BY_META_TAG', 'BLOCKED_BY_HTTP_HEADER', 'BLOCKED_BY_ROBOTS_TXT'], true));
$canonRara   = array_filter($resultados, fn($r) => $r['canonical']
    && !str_contains((string)$r['canonical'], parse_url(BASE . $r['ruta'], PHP_URL_PATH)));

printf("\n  nunca rastreadas: %d de %d\n", count($sinRastrear), count($resultados));
printf("  bloqueadas por robots o meta: %d\n", count($bloqueadas));
printf("  con canónica distinta de la propia URL: %d\n", count($canonRara));

foreach ($canonRara as $r) {
    printf("    %s → %s\n", $r['ruta'], $r['canonical']);
}

file_put_contents(__DIR__ . '/../data/diagnostico-indexacion.json',
    json_encode(['fecha' => date('c'), 'resultados' => $resultados, 'porEstado' => $porEstado],
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
echo "\nguardado en data/diagnostico-indexacion.json\n";
