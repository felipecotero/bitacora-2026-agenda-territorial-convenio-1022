# Bitácora · Agenda Territorial — Convenio 1022 de 2025

Espacio de coordinación del equipo nuclear del Despacho de la Ministra
(Ministerio de las Culturas, las Artes y los Saberes) para el Convenio 1022 de 2025.

> seguimos tejiendo

## Cómo abrirla

**Opción 1 — local rápido (sin servidor):** se abre `index.html` en el navegador.
El navegador puede bloquear `fetch('data.json')` por CORS al abrir desde `file://`. En ese caso usa la opción 2.

**Opción 2 — local con servidor (recomendado):** desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Y entrar a <http://localhost:8000>.

**Opción 3 — GitHub Pages:** subir esta carpeta a un repositorio y activar Pages
en `Settings → Pages → Branch: main / root`. La página queda en
`https://<usuario>.github.io/<repo>/`.

## Estructura

```
.
├── index.html                  ← entrada del sitio
├── data.js                     ← equipo, alertas, hilo del correo, marco PUENTE
├── data.json                   ← FUENTE ÚNICA del calendario (editable desde la vista Telar)
├── styles.css
├── comp-shared.jsx             ← Avatar, helpers, primitivos
├── comp-nav.jsx                ← Sidebar + Topbar
├── view-tablero.jsx            ← Vista Tablero
├── view-cronograma.jsx
├── view-tareas.jsx
├── view-bitacora.jsx           (incluido en view-docs.jsx)
├── view-equipo.jsx
├── view-procesos.jsx           ← Ciclo + Encuentro
├── view-telar.jsx              ← El Telar (calendario editable)
├── view-docs.jsx               ← Documentos + Bitácora
├── image-slot.js
├── img/                        ← texturas de fondo + logo PUENTE
│   ├── bg-puente.jpg
│   ├── bg-contraventeo.jpg
│   ├── bg-mapa.jpg
│   ├── bg-circulo.jpg
│   ├── bg-onda.jpg
│   ├── bg-conectar.jpg
│   ├── bg-cajas.jpg
│   └── puente-logo-blanco.svg
└── README.md
```

## Cómo editar el calendario · para Mercy y Jeimmy

Todo el calendario (Ciclo, sesiones técnicas, hitos del Encuentro) vive en
**`data.json`**. La vista **El Telar** lo edita en pantalla, pero cualquier
cambio queda solo en tu navegador hasta que descargues el archivo y lo subas
al repositorio.

### Edición rápida (modo navegador)

1. Abrir la bitácora · entrar a la vista **El Telar** (sidebar → Procesos).
2. **Clic en cualquier sesión** para editar título, fecha, hora, lugar,
   orientadora, notas y estado.
3. **Botón +** que aparece al pasar el cursor sobre cada día → para crear una
   sesión nueva.
4. Cuando termines, clic en **↓ Guardar data.json** (esquina superior derecha
   del Telar) para descargar el archivo actualizado.
5. Subir el `data.json` descargado a GitHub (reemplazar el archivo del repo).

### Edición directa desde GitHub (para Mercy y Jeimmy)

1. En el repositorio, abrir **`data.json`**.
2. Botón ✏️ (editar) → cambiar la sesión que necesiten.
3. **Commit changes** abajo. La página se actualiza automáticamente en
   pocos minutos.

> Cualquier duda, Felipe acompaña en la primera edición.

## Carriles del Telar

| Sigla | Línea                | Conducen                                |
| :--:  | -----                | --------                                |
| C1    | Formación Puente     | Mercy · Jeimmy · Felipe (2 sesiones)    |
| C2    | Autonomía Digital    | Felipe                                  |
| C3    | Identidad Mujeres    | Felipe con el comité                    |
| HITO  | Hitos del semestre   | Reuniones, encuentros, transferencias   |

## Identidad visual

Paleta inspirada en el manual de la Red de Mujeres + texturas de cuaderno
de campo del Ciclo. Tipografías: **Bricolage Grotesque** (display),
**DM Sans** (texto), **Caveat** (acento manuscrito).

— Felipe Camacho · 2026
