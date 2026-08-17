# Las diez marcas de chat: salas y canales, las diez con el suyo

**Fecha:** 17 de agosto de 2026
**Encargo:** «es importante que tengamos los canales creados de dalechat, ozu, terra,
latinchat, chatsfriends, canalchat, icq, hispano, chatealo, chueca».

## Punto de partida

Seis de las diez ya tenían sala. Cuatro no, y resultaron ser justo las de más demanda
medida en el corpus de la red (`/home/javier/red-seo`, 90 días, 18 propiedades):

| Marca | Impresiones (red, 90 d) | Sala antes | Canal IRC real |
|---|---:|---|---|
| hispano | **1.783.111** | ❌ no existía | ❌ no existe |
| dalechat | 882.616 | ✅ | ❌ no existe |
| terra | 860.249 | ✅ | ✅ `#terra` |
| chueca | 709.298 | ✅ | ✅ `#chueca` |
| latinchat | 362.363 | ✅ | ✅ `#latinchat` |
| canalchat | 123.758 | ✅ | ✅ `#canalchat` |
| chatealo | 105.731 | ❌ no existía | ❌ no existe |
| chatsfriends | 55.637 | ❌ no existía | ❌ no existe |
| ozu | 40.756 | ❌ no existía | ❌ no existe |
| icq | 7 | ✅ | ❌ no existe |

## Lo hecho: cuatro salas nuevas

`hispano`, `ozu`, `chatealo` y `chatsfriends`, en `src/data/topics-legacy.ts`, con el
mismo patrón que `terra`, `latinchat` y `canalchat`.

**Ninguna entra PRIMERO a un canal con su nombre.** La red no tenía `#hispano`, `#ozu`,
`#chatealo` ni `#chatsfriends`, y entrar el primero a un canal inexistente lo crea vacío:
el usuario aterriza solo. Cada una entra antes al canal real donde hay gente:

| Sala | Canal poblado de entrada | Gente |
|---|---|---:|
| `/chat/hispano` | `#españa` | 636 |
| `/chat/ozu` | `#andalucia` | 270 |
| `/chat/chatealo` | `#chile` | 189 |
| `/chat/chatsfriends` | `#amistad` | 868 |

(El canal de marca de cada una va justo detrás; la lista completa, en la tabla siguiente.)

El copy sigue la regla del repo —cada frase se apoya en un dato real o no se emite— y el
precedente honesto de la sala de Terra: se dice explícitamente que no somos la marca. De
Chatealo y Chatsfriends apenas hay historia documentada y el texto lo dice en vez de
inventarla, igual que ya hacía la ficha de Elchat.

## Los seis canales que faltaban: creados

El cliente repitió el encargo, así que se crean. **En IRC un canal nace en cuanto entra el
primero**, y quien manda a la gente a un canal es el webchat con lo que haya en `channels`:
crear `#hispano` es, literalmente, hacer que las visitas de `/chat/hispano` entren ahí.

La cautela que tenía el repo no era «no nombrar canales nuevos», sino otra, y se respeta
entera: **el canal de marca va siempre detrás de uno poblado, nunca el primero.** Si fuera
el primero, la red lo crearía vacío y el usuario aterrizaría solo — el fallo que costó las
306 salas saneadas en agosto.

| Sala | Canales (en orden) | Gente en el primero |
|---|---|---:|
| `/chat/hispano` | `#españa`, **`#hispano`**, `#amistad`, `#chatzona` | 636 |
| `/chat/ozu` | `#andalucia`, **`#ozu`**, `#amistad`, `#chatzona` | 270 |
| `/chat/chatealo` | `#chile`, **`#chatealo`**, `#latinoamerica`, `#chatzona` | 189 |
| `/chat/chatsfriends` | `#amistad`, **`#chatsfriends`**, `#amigos`, `#chatzona` | 868 |
| `/chat/dalechat` | `#amistad`, **`#dalechat`**, `#argentina`, `#chatzona` | 868 |
| `/chat/icq` | `#argentina`, **`#icq`**, `#latinoamerica`, `#chatzona` | — |

Se declaran en `SEEDED_CHANNELS` (`src/data/irc-real-channels.ts`), **aparte de los
medidos**, para no ensuciar la lista de canales reales con nombres que todavía no tienen a
nadie dentro. Cuando uno coja gente de verdad se mueve a `NETWORK_CHANNELS` y se borra de
ahí: la lista debería quedarse vacía algún día.

Lo fijan tres tests en `src/lib/channels.test.ts`: las diez salas entran a su canal, ningún
sembrado va en cabeza en todo el catálogo, y delante de un sembrado siempre hay un canal
que ya existía.

## Qué mirar dentro de unas semanas

Si los seis canales sembrados han cogido gente, se comprueba contra el listado en vivo del
proyecto hermano (`/home/javier/chatzonacom/sql/data/irc_channels_listing.json`) y el que
la tenga se mueve de `SEEDED_CHANNELS` a `NETWORK_CHANNELS`. A partir de ahí ya puede ir
el primero en su sala, como hacen hoy `#terra`, `#latinchat`, `#canalchat` y `#chueca`.
