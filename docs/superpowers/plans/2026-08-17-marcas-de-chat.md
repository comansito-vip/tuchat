# Las diez marcas de chat: qué había, qué se ha creado y qué falta en el servidor

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

**Ninguna entra a un canal con su nombre.** La red no tiene `#hispano`, `#ozu`,
`#chatealo` ni `#chatsfriends`, y entrar el primero a un canal inexistente lo crea vacío:
el usuario aterriza solo. Cada una va al canal real donde hay gente:

| Sala | Canales | Gente en el primero |
|---|---|---:|
| `/chat/hispano` | `#españa`, `#amistad`, `#chatzona` | 636 |
| `/chat/ozu` | `#andalucia`, `#amistad`, `#chatzona` | 270 |
| `/chat/chatealo` | `#chile`, `#latinoamerica`, `#chatzona` | 189 |
| `/chat/chatsfriends` | `#amistad`, `#amigos`, `#chatzona` | 868 |

El copy sigue la regla del repo —cada frase se apoya en un dato real o no se emite— y el
precedente honesto de la sala de Terra: se dice explícitamente que no somos la marca. De
Chatealo y Chatsfriends apenas hay historia documentada y el texto lo dice en vez de
inventarla, igual que ya hacía la ficha de Elchat.

## Lo que este repo NO puede hacer

Crear canales en el servidor de IRC. **Seis marcas no tienen canal propio en la red**:

```
#hispano   #ozu   #chatealo   #chatsfriends   #dalechat   #icq
```

Si quieres que existan de verdad, hay que crearlos en el servidor (el proyecto hermano
`/home/javier/chatzonacom` es el que tiene el listado en vivo,
`sql/data/irc_channels_listing.json`). En cuanto existan, basta con añadirlos al principio
del `channels` de su sala y a `src/data/irc-real-channels.ts`; el test que exige que el
primer canal sea real ya vigila que no se haga antes de tiempo.

Mientras tanto, las salas funcionan y llevan a la gente a un canal poblado, que es lo
contrario de lo que pasaba cuando una sala nombraba un canal inventado.
