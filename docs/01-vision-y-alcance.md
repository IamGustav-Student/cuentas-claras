# 1. Visión y alcance del proyecto

> Este documento resume y reorganiza el material fuente del proyecto académico
> **"Sistema de gestión de compras a tiempo real" / CuentasClaras**
> (Ingeniería de Software — Tecnicatura Superior en Desarrollo de Software),
> adaptado para implementarse como **app móvil con React Native + SQLite** en
> lugar de la aplicación web originalmente planteada en la cátedra.

## 1.1 Nombre del proyecto

**CuentasClaras** — Sistema de gestión de compras grupales a tiempo real.

## 1.2 Uso destinado

Pensado para grupos de personas que comparten un mismo gasto: la organización
de un asado, una previa, un viaje grupal o cualquier evento en el que varias
personas deban comprar cosas en conjunto y luego repartir los costos. Cada
integrante paga la parte que le corresponde, evitando que dos personas
compren accidentalmente el mismo producto.

## 1.3 Problema que resuelve

Cuando un grupo organiza una compra en conjunto suelen aparecer dos problemas:

- **Falta de coordinación**: dos o más personas compran el mismo producto sin
  saberlo, generando gasto duplicado.
- **Dificultad para dividir los gastos**: al finalizar, es complicado calcular
  cuánto debe pagar cada uno según lo que aportó y lo que efectivamente
  compró.

## 1.4 Alcance

### Dentro del alcance

- Registro ordenado, en tiempo real, de las acciones de los usuarios dentro
  de una sesión de compra.
- Almacenamiento de la información generada por los usuarios (reservas,
  compras, precios, presupuesto aportado, etc.).
- Cálculo del resultado de la división de gastos.
- Acceso de los usuarios invitados mediante un link enviado por WhatsApp.
- Mecanismo de reserva **obligatoria** de ítems, incluyendo el manejo de
  reservas simultáneas.
- Sección de presupuesto **opcional**.
- Sección de "gastos en reunión" para dividir una cuenta puntual (ej. un
  restaurante) entre los presentes.

### Fuera del alcance

- La app no controla ni garantiza que cada usuario efectivamente realice la
  compra que reservó.
- No emite documentación oficial de ningún tipo (facturas, recibos legales).
- No imprime informes en papel.
- No actúa como plataforma de pago.

## 1.5 Adaptación a app móvil: qué cambia y qué no

El material original de la cátedra especifica una aplicación **web, mobile
first**. Este documento la reinterpreta como una **app nativa React Native**,
manteniendo intactas las reglas de negocio, los actores y los casos de uso
originales. Los cambios son exclusivamente de plataforma/tecnología:

| Aspecto | Definición original (web) | Adaptación (React Native + SQLite) |
|---|---|---|
| Cliente | Navegador, mobile first | App nativa Android/iOS con React Native + Expo |
| Persistencia | Base de datos web (no especificada) | SQLite en el backend (fuente de verdad) + SQLite local en el dispositivo (cache offline-first) |
| Acceso | Link de WhatsApp abre una URL | Link de WhatsApp abre un *deep link* que lanza la app |
| Fotos de ticket | Subida de archivo desde el navegador | Cámara nativa del dispositivo (`expo-camera` / `expo-image-picker`) |
| Compartir resultado | Botón "compartir" web | *Share sheet* nativo del sistema operativo |

La justificación técnica completa de estas decisiones está en
[`04-arquitectura.md`](./04-arquitectura.md).

## 1.6 Características distintivas

- Mecanismo de reserva obligatoria de ítems, que evita compras duplicadas
  (incluye el manejo de "reservas simultáneas").
- Sección de presupuesto opcional.
- Sección de resultado con balance de gastos.
- Función de "gastos en reunión" para dividir rápidamente una cuenta.
- Acceso simplificado: sin registro tradicional, solo un link de WhatsApp y
  un nombre.

## 1.7 Fuentes

Este documento consolida el contenido de los siguientes archivos originales
del proyecto (carpeta *Borradores y bosquejos* y raíz del Drive del equipo):
`01_Descripcion_Global_Proyecto.pdf`, `01_PropuestaDeProyecto2026PabloCasi.pdf`,
`SIstema de lista de compras.docx`, `EDT.docx`, `Tabla_yDiccionario.xlsx`.
