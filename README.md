# PANCREAS DELTA 2026 · Estado de Excepción

Web del viaje de PANCREAS a L'Ampolla (Tarragona), del jueves 5 al lunes 9 de noviembre de 2026.
Revista de viajes, expediente confidencial de un gobierno ficticio, festival privado y guía práctica para el móvil.

## Arrancar

```bash
npm install
npm run dev
```

Build de producción y vista previa:

```bash
npm run build
npm run preview
```

Pruebas (Playwright, móvil y escritorio):

```bash
npx playwright install chromium
npm test
```

## Estructura

```text
fotos/                      originales (no se publican, están en .gitignore)
scripts/optimize-images.mjs genera los WebP sin metadatos
scripts/crops.json          encuadre de cada foto (centro y altura del recorte)
public/images/              fotos optimizadas que sí se publican
src/data/                   todo el contenido editable
  people.ts                 los nueve integrantes, relaciones y alianzas
  itinerary.ts              los cinco episodios
  reservations.ts           reservas, teléfonos y datos verificados
  games.ts                  Constitución, bingo, Edu, sofá, derroche, calzado, porras, premios, misiones
  practical.ts              equipaje, plan B, sin gluten y seguridad
  media.ts                  qué foto va en cada sitio (y huecos pendientes)
  site.ts                   fechas, lema y secciones
src/components/sections/    secciones de la página
src/components/games/       los juegos
supabase/migrations/        tabla y funciones para votaciones compartidas (opcional)
tests/                      pruebas Playwright
```

El texto está separado del código: para cambiar una broma, una hora o un teléfono basta con editar `src/data`.

## Fotografías

Los originales están en `fotos/` y no se modifican. `npm run images` genera versiones WebP a 480 y 900 px (retratos 4:5) y a 720/1200 px (casa), sin EXIF ni geolocalización (sharp no copia metadatos), más `public/og.jpg` para la vista previa de WhatsApp.

Asignación por nombre de archivo, sin reconocimiento facial:

| Archivo | Uso |
|---|---|
| `patri.jpeg`, `froiz.jpeg`, `milla.jpeg`, `david.jpeg`, `angela.jpeg`, `edu.jpeg`, `ana.jpeg`, `luz.jpeg`, `jorge.jpeg` | Retrato de cada integrante |
| `vistas_casa.jpeg` | Portada, Palacio, Ceremonia y vista previa de WhatsApp |

Varias fotos eran capturas de pantalla con la barra de estado del móvil: el recorte la elimina. En `milla.jpeg` aparece otra persona al borde; el recorte se centra en el sujeto principal.

Para ajustar un encuadre, cambia `cx`, `cy` (centro, de 0 a 1) o `h` (altura del recorte) en `scripts/crops.json` y ejecuta `npm run images`.

### Añadir fotos nuevas (terraza, salón, foto oficial del viernes)

1. Copia el original a `fotos/` (por ejemplo `foto-oficial.jpeg`).
2. Añade una entrada en `scripts/crops.json`, por ejemplo:
   `{ "id": "foto-oficial", "source": "foto-oficial.jpeg", "folder": "group", "ratio": 1.5, "widths": [800, 1600], "crop": { "cx": 0.5, "cy": 0.5, "h": 1 } }`
3. `npm run images`.
4. En `src/data/media.ts`, cambia `src: null` de `officialPhoto` (o del hueco de la galería) por la ruta generada, por ejemplo `` `${base}images/group/foto-oficial-1600.webp` ``.

Mientras `src` sea `null`, la web muestra un hueco de «Archivo pendiente» en lugar de una imagen inventada.

### Privacidad

- No se publica la dirección de la casa: solo «L'Ampolla» y «unos 30 metros del mar». Tampoco se dice qué negocio hay debajo.
- Las imágenes publicadas no llevan metadatos.
- La carpeta `fotos/` está en `.gitignore`.
- `<meta name="robots" content="noindex">` evita que los buscadores la indexen. Aun así, quien tenga el enlace puede verla.

## Qué se guarda y dónde

Todo funciona sin servidor. Cada móvil guarda su propio estado en `localStorage` (prefijo `pd26:`):

credencial, bingo, firmas de la Constitución, misiones, contador del BMW, simulador de Edu, Tribunal del Sofá, panel del derroche y apuestas (puntos ficticios), predicciones, estado de reservas, equipaje, votos y secretos encontrados.

Nada de eso se sincroniza entre móviles. La web lo dice en cada sitio donde podría confundirse (reservas, votaciones, porras).

### Votaciones compartidas (opcional, Supabase)

Sin configurar, los Premios Delta funcionan en modo local y lo indican. Para un recuento común:

1. Crea un proyecto en Supabase y ejecuta `supabase/migrations/20261102000000_delta_votes.sql` en el editor SQL.
2. Define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (en `.env.local` para desarrollo, o como *Variables* del repositorio en GitHub para el despliegue).

La tabla tiene RLS activado y ningún acceso directo para `anon`: solo puede llamar a `cast_delta_vote` (un voto por categoría y dispositivo, modificable) y a `delta_vote_totals` (recuentos agregados, sin identificadores). El identificador del votante es un UUID aleatorio del dispositivo: quien vote desde varios móviles contará varias veces. No hay protección absoluta contra votos repetidos.

La clave `anon` es pública por diseño. No uses nunca la `service_role`.

## Despliegue en GitHub Pages

1. Crea un repositorio y sube el proyecto (sin `fotos/`, ya excluida).
2. En *Settings → Pages*, elige *Source: GitHub Actions*.
3. Cada push a `main` ejecuta `.github/workflows/deploy.yml`: build y publicación.

`base: './'` en `vite.config.ts` hace que funcione con cualquier nombre de repositorio. El workflow pasa la URL pública como `SITE_URL` para que la vista previa de WhatsApp tenga la imagen con URL absoluta.

## Información práctica verificada

Consultada en las webs oficiales el 2 de noviembre de 2026. Lo que no se pudo verificar aparece marcado con «?» en el Anexo.

| Sitio | Verificado | Pendiente |
|---|---|---|
| Kenshô | Visita «Descubrimiento» 29 €/persona, 1 h 30 min, reserva online, en L'Ampolla | Visita privada para nueve, opciones sin gluten |
| Lo Típic | 977 46 82 92, cierra martes, reservas online | Mesa para nueve |
| MónNatura | Ctra. del Poblenou a les Salines s/n, Amposta | Horario de noviembre y precio |
| Casa Nuri | 977 48 01 28, reservas solo por teléfono | Dirección, mesa para nueve |
| Masia Fontscaldes | C. Josep Busquets s/n, Fontscaldes; 977 612 836 / 651 360 112; abre vie–dom en noviembre; 44 € + 10 % IVA de referencia | Que haya calçots el día 8 |
| Can Piñana | 977 46 00 33, reservas por teléfono | Mesa para nueve |
| L'Embutada | 7 y 8 de noviembre de 2026, Plaça del Rei | Horario |
| Festast | 6–8 de noviembre de 2026, pabellón ferial de Tortosa, gratis | Horario del viernes |
| Pollastres Eva | — | Todo |

Todas las reservas empiezan como «Pendiente de confirmar» y solo cambian si alguien las marca en el Anexo.

## Secretos

Hay nueve easter eggs; el índice y el pie de página cuentan cuántos lleva encontrados cada dispositivo. Pistas: el BMW de Jorge, la reclamación del sofá, el expediente de Froiz, la auditoría de David, Vallecas en el mapa, el botón de Edu, los dos modos de Luz, los dos uniformes de Ángela y lo que pasa tras auditar dos veces a Jorge.
