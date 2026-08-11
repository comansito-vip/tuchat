# El siguiente hueco medido: «chat gay de {ciudad}»

**Fecha:** 2026-08-11
**Estado:** medido, no ejecutado. Queda como el trabajo de contenido con más demanda
identificada del catálogo.

---

## El número

El plan del 7 de agosto lo estimaba en ~138.000 impresiones. Cruzando el corpus de la
red (`/home/javier/red-seo/`) con el catálogo, la cifra real es bastante mayor:

| | |
|---|---:|
| Consultas gay/LGTBI en el corpus | 5.984 |
| Impresiones que suman | **2.672.079** |
| Lugares con demanda medida y **sin sala propia** | 51 |
| Impresiones de esos 51 | **730.821** |

Ya existen 39 salas gay/LGTBI, diez de ellas por ciudad (`gay-madrid`, `gaybarcelona`,
`gay-sevilla`, `gaygranada`, `gay-valencia`, `gay-bilbao`, `gay-sitges`,
`gay-maspalomas`, `gay-ibiza`, `gaybogota`), así que el patrón está establecido y lo que
falta es extenderlo.

## Los 20 primeros huecos

Slug libre, demanda medida en formas exactas (`chat gay X`, `chat de gays X`…):

| Lugar | Impresiones | Clics | ¿Existe la sala de ciudad? |
|---|---:|---:|---|
| Málaga | 59.787 | 664 | sí |
| Tenerife | 45.267 | 763 | sí |
| Medellín | 39.423 | 16.298 | sí |
| Puebla | 37.050 | 368 | sí |
| Rosario | 31.886 | 203 | sí |
| Cádiz | 31.010 | 391 | sí |
| Asturias | 29.552 | 248 | sí |
| Córdoba | 20.393 | 728 | sí |
| Vigo | 17.074 | 1.448 | sí |
| Euskadi | 17.070 | 100 | sí |
| Murcia | 16.235 | 309 | sí |
| Monterrey | 15.434 | 6.887 | sí |
| Baleares | 14.743 | 598 | sí |
| Canarias | 12.523 | 105 | sí |
| Lima | 11.723 | 4.627 | sí |
| Cali | 11.507 | 4.920 | sí |
| Cantabria | 9.576 | 55 | sí |
| Navarra | 6.667 | 159 | sí |
| Zaragoza | 6.327 | 859 | sí |
| Guadalajara | 5.544 | 1.886 | sí |

Fíjate en los clics: Medellín (16.298), Monterrey (6.887), Cali (4.920) y Lima (4.627)
convierten mucho mejor que las españolas, que tienen más impresiones pero apenas clics.
Si hay que priorizar por retorno y no por volumen, las latinoamericanas van primero.

## El canal, que es la parte que hay que hacer bien

**No existe ningún `#gay{ciudad}` en la red.** Comprobado contra
`irc-real-channels.ts`: los canales LGTBI son exactamente diez —`#gay`, `#lesbianas`,
`#bisexuales`, `#de_ambiente`, `#travestis`, `#personas_trans`, `#chueca`,
`#chueca_madrid`, `#chueca_barcelona`, `#el_rincon_les`— y ninguno es por ciudad.

El patrón correcto ya lo tenía `gay-madrid` desde siempre: `["gay", "chueca", "madrid",
"chatzona"]`, es decir, **el canal temático + el canal real de la ciudad**. Las otras
diez salas gay nombraban un canal inventado (`#gay-sevilla`) y se corrigió el 11 de
agosto (ver `canales-saneado.ts`), así que ahora todas siguen ese patrón.

Para una sala nueva de Málaga: `["gay", "malaga", "amistad", "chatzona"]`, con `#malaga`
comprobado en `ES_CHANNELS`. Nunca inventar `#gaymalaga`.

## Lo que NO hay que repetir del trabajo de las regiones

Las tres trampas que costaron tiempo el 11 de agosto y que aquí aplican igual:

1. **El `parentSlug` mete la sala en el listado de su padre.** Las salas gay cuelgan de
   `lgtbi` o de `gaylatino`, no de un país, así que este caso concreto no se da — pero
   comprobar el listado del padre antes de dar el trabajo por bueno.
2. **`aboutTitle` es obligatorio** en toda sala con `about`, entre 25 y 70 caracteres,
   sin empezar por «sobre/acerca/qué/información/bienvenid», único, y sin repetir molde
   más de 10 veces. Lo fija `about-titles.test.ts`.
3. **El `about` no puede compartir frases largas con otra sala.** El test de
   `topics-regiones-am.test.ts` marca cualquier frase de 40+ caracteres repetida entre
   salas del mismo fichero: conviene copiar ese test al fichero nuevo.

## Cómo reproducir la medición

```bash
php /home/javier/red-seo/scripts/buscar.php "chat gay malaga"
```

Y el cruce completo, contra el catálogo y los canales reales, está en el historial de la
sesión del 11 de agosto: consultas de la forma `chat (de )?gays? (de |en )?X`, agregadas
por lugar, descartando los slugs que ya existen como sala.

## Lo que sigue fuera de alcance

- **`chachipen`** (172.567 impresiones, 75.826 clics en la red, `#chachipen` existe y
  está lleno). Sigue esperando a alguien que conozca el caló de verdad: un LLM con una
  definición de diccionario produciría exactamente el tipo de texto que este sitio no
  publica.
- **Enlazar a tuchat.org desde el resto de la red.** Sigue siendo la acción de mayor
  retorno del dominio —26 de 30 URLs inspeccionadas el 11 de agosto no han sido
  rastreadas nunca— y sigue viviendo fuera de este repositorio.
