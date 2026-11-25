# ommit

Tienda de ommit: relojes Casio con despiece animado por scroll. Cada modelo es una página; se cambia entre ellos deslizando hacia el lado, con las flechas laterales o el teclado, y se agrupan en dos líneas: Clásico y G-Shock.

| Línea | Color | Página | Frames |
|---|---|---|---|
| Clásico | Azul hielo | `index.html` | `frames/`, `frames-m/` |
| Clásico | Azul | `azul.html` | `frames-azul/`, `frames-azul-m/` |
| Clásico | Verde | `verde.html` | `frames-verde/`, `frames-verde-m/` |
| Clásico | Azul noche | `azul-noche.html` | `frames-noche/`, `frames-noche-m/` |
| G-Shock | Verde lima | `gshock-lima.html` | `frames-gshock-lima/`, `frames-gshock-lima-m/` |

- `js/modelos.js`: lista de líneas y modelos, selector de línea y colores, deslizamiento y transición entre páginas.
- `css/modelos.css`: estilos del selector, flechas laterales y transición.
- `img/`: fotos de galería y muñeca de cada modelo (`img/azul/`, `img/verde/`, …).
- `fonts/`: Schibsted Grotesk (OFL).

Para sumar un modelo: agregar sus frames y fotos, copiar una página de la misma línea con sus colores y textos, y añadir una entrada en `MODELOS` dentro de `js/modelos.js`.
