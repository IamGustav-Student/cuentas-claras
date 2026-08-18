# CuentasClaras — App móvil (React Native + SQLite)

> Sistema de gestión de compras grupales a tiempo real, originalmente
> especificado como proyecto académico de Ingeniería de Software
> (Tecnicatura Superior en Desarrollo de Software) en formato web, y
> documentado aquí para implementarse como **app móvil con React Native y
> SQLite**.

Permite que un grupo de personas (ej. organizando un asado, una previa o un
viaje) reserve ítems de una lista de compras sin duplicarse, registre lo
que cada uno gastó y aportó, y calcule automáticamente quién le debe pagar
a quién al finalizar.

## Documentación completa

Toda la documentación del proyecto está en [`docs/`](./docs), en el orden
recomendado de lectura:

| # | Documento | Contenido |
|---|---|---|
| 1 | [Visión y alcance](./docs/01-vision-y-alcance.md) | Qué es el proyecto, qué problema resuelve, qué queda dentro y fuera de alcance. |
| 2 | [Actores y requisitos](./docs/02-actores-y-requisitos.md) | Usuario/Anfitrión/WhatsApp, los 16 requisitos funcionales (RF-01..RF-16) y los no funcionales, con su adaptación a mobile. |
| 3 | [Casos de uso](./docs/03-casos-de-uso.md) | CU-01 a CU-04(a), incluida la trazabilidad RF → CU → pantalla concreta del código. |
| 4 | [**Arquitectura técnica**](./docs/04-arquitectura.md) | La pieza clave: por qué SQLite sola en el celular no alcanza, y cómo se resuelve con cliente offline-first + backend con SQLite como fuente de verdad. |
| 5 | [Modelo de datos](./docs/05-modelo-de-datos.md) | Diccionario de datos completo: tablas, campos, tipos y a qué requisito responde cada uno. |
| 6 | [Estructura de carpetas](./docs/06-estructura-de-carpetas.md) | Recorrido guiado del árbol de `mobile/` y `server/`, y cómo instalarlo/correrlo. |
| 7 | [Guía de implementación por fases](./docs/07-guia-de-implementacion.md) | Roadmap de construcción en 5 fases, mapeado al EDT y cronograma originales. |
| 8 | [Plan de pruebas](./docs/08-plan-de-pruebas.md) | Unitarias, integración, prueba de estrés de concurrencia y checklist de aceptación. |
| 9 | [Despliegue](./docs/09-despliegue.md) | Cómo publicar el backend y generar el `.apk`/`.ipa` con EAS Build. |
| 10 | [Manuales de usuario](./docs/10-manuales-de-usuario.md) | Guía rápida para el Anfitrión y para Participantes, en lenguaje llano. |

## Resumen de la arquitectura

```
┌─────────────────────────┐        REST + WebSockets       ┌──────────────────────────┐
│   App móvil (cliente)    │ ───────────────────────────▶  │   Backend (Node.js)       │
│   React Native + Expo    │ ◀───────────────────────────  │   Express + Socket.IO     │
│   SQLite LOCAL            │                                │   SQLite del SERVIDOR     │
│   (cache offline-first)  │                                │   (fuente de verdad)      │
└─────────────────────────┘                                └──────────────────────────┘
```

SQLite se usa en **ambos lados**: en el dispositivo como cache offline
(la lista de compras se ve al instante, incluso sin señal) y en el
servidor como fuente de verdad compartida (necesaria para resolver en
tiempo real el requisito más importante del sistema: que dos personas no
reserven el mismo producto a la vez). El detalle completo, con el porqué
de esta decisión, está en [`docs/04-arquitectura.md`](./docs/04-arquitectura.md).

## Estructura del repositorio

```
cuentas-claras/
├── docs/       → toda la documentación (tabla de arriba)
├── mobile/     → app React Native (Expo + TypeScript)
└── server/     → backend Node.js + Express + Socket.IO + SQLite
```

## Puesta en marcha rápida

```bash
# 1) Backend
cd server
cp .env.example .env
npm install
npm run dev              # http://localhost:3000

# 2) App móvil (en otra terminal)
cd mobile
cp .env.example .env     # editar API_URL / SOCKET_URL con la IP de tu backend
npm install
npx expo start           # escanear el QR con la app Expo Go
```

Más detalle en [`docs/06-estructura-de-carpetas.md`](./docs/06-estructura-de-carpetas.md)
y en [`docs/07-guia-de-implementacion.md`](./docs/07-guia-de-implementacion.md).

## Estado del scaffold

Este repositorio incluye la **estructura completa de carpetas y archivos**
siguiendo buenas prácticas de React Native (navegación, pantallas,
componentes, capa de datos SQLite, servicios de red/tiempo real, estado
global, tema visual) con el código base de cada pieza ya escrito y
comentado con referencias a los requisitos (`RF-XX`) y casos de uso
(`CU-XX`) que implementa. Los `TODO` puntuales que quedan (ej. refrescar
listas tras una acción, reemplazar mocks por datos reales de sesión) están
señalados directamente en el código, y el orden sugerido para completarlos
está en la guía de implementación por fases.

## Origen del proyecto

Este trabajo parte de la especificación funcional definida por la cátedra
de Ingeniería de Software (EDT, actores, requisitos y casos de uso
originales, ver `docs/01` a `docs/03`), reinterpretada íntegramente para
una implementación **React Native + SQLite** en lugar de la aplicación web
originalmente planteada. Ninguna regla de negocio fue modificada: solo la
plataforma y las decisiones técnicas de implementación.
