# 3. Casos de uso

## 3.1 Diagrama (descripción textual)

Actores: **Usuario** (primario), **Anfitrión** (primario, generaliza a
Usuario), **Sistema de WhatsApp** (secundario/externo).

```
Usuario
 ├── Identificarse vía link de WhatsApp ──(asociado a)── Sistema de WhatsApp
 ├── Consultar sesiones anteriores
 ├── Reservar ítem de la lista ──«include»──> Resolver conflicto de reserva simultánea
 ├── Quitar reserva de un ítem
 ├── Marcar ítem como comprado ──«include»──> Registrar precio pagado
 │        └──«extend»── Subir ticket de compra
 ├── Gestionar presupuesto
 ├── Consultar resultado de la división ──«include»──> Calcular balance de gastos
 │        └──«extend»── Compartir pantalla de resultado
 └── Calcular gastos en reunión

Anfitrión (hereda todo lo anterior)
 ├── Crear sesión de compra
 └── Cargar lista de compras sugerida
```

Convenciones: línea continua = asociación actor–caso de uso · flecha hueca =
generalización · `«include»` = comportamiento siempre incorporado ·
`«extend»` = comportamiento opcional.

## 3.2 CU-01 — Identificarse vía link de WhatsApp

| Campo | Detalle |
|---|---|
| Actores | Usuario (primario), Sistema de WhatsApp (secundario) |
| RF relacionados | RF-01, RF-02 |
| Precondición | El Anfitrión ya generó y compartió el link/deep link de la sesión. |
| Flujo principal | 1) El usuario abre el link recibido por WhatsApp. 2) El sistema reconoce la sesión asociada al link. 3) Solicita el nombre. 4) El usuario lo ingresa. 5) El sistema lo registra en la sesión. 6) Muestra la pantalla principal de la sesión. |
| A1 — Link inválido | El link no corresponde a ninguna sesión activa → mensaje de error, fin del caso de uso. |
| A2 — Nombre vacío | El sistema vuelve a pedir el campo antes de continuar. |
| Postcondición | El usuario queda identificado y puede operar como Usuario. |
| Adaptación móvil | El "link" es un *deep link* (`cuentasclaras://join?token=...`) resuelto por `expo-linking`; ver `screens/access/JoinSessionScreen.tsx`. |

## 3.3 CU-02 — Reservar ítem de la lista (+ CU-02a, incluido)

Es el caso de uso más distintivo: resuelve el problema original del
proyecto (evitar compras duplicadas).

| Campo | Detalle |
|---|---|
| Actor | Usuario |
| RF relacionados | RF-05, RF-07, RF-08 |
| Precondición | Usuario identificado; lista ya cargada por el Anfitrión. |
| Flujo principal | 1) Ve la lista de pendientes. 2) Selecciona un ítem. 3) El sistema verifica que nadie más lo esté reservando en simultáneo (CU-02a). 4) Se marca como reservado, con el nombre del usuario en observaciones. |
| A1 | El usuario quita una reserva propia → el ítem vuelve a estar disponible. |
| Incluye | **CU-02a — Resolver conflicto de reserva simultánea**, siempre que dos o más usuarios compitan por el mismo ítem. |

### CU-02a — Resolver conflicto de reserva simultánea

| Campo | Detalle |
|---|---|
| Precondición | Dos o más usuarios intentaron reservar el mismo ítem en un intervalo muy cercano. |
| Flujo principal | 1) El sistema determina, por orden de llegada al servidor, quién fue primero. 2) Le avisa a ese usuario que hay competencia y le pregunta si desea insistir. 3) Confirma. 4) Se le otorga la reserva. |
| A1 | Si el primero no insiste, se le ofrece al siguiente en la fila; si no queda nadie, el ítem queda libre. |
| Postcondición | Un único usuario queda con la reserva, o el ítem queda libre. |
| Adaptación móvil | Arbitrado por el backend (`server/src/services/reservationQueue.service.ts`) vía Socket.IO, porque ninguna SQLite local por sí sola puede saber lo que hace un usuario en otro teléfono (ver `04-arquitectura.md`). |

## 3.4 CU-03 — Marcar ítem como comprado

| Campo | Detalle |
|---|---|
| Actor | Usuario |
| RF relacionados | RF-09, RF-11 |
| Precondición | El ítem fue reservado previamente por este usuario (CU-02). |
| Flujo principal | 1) Selecciona el ítem ya comprado entre sus reservas. 2) Lo marca "comprado". 3) El sistema pide el precio. 4) Lo ingresa. 5) Se actualiza el estado y se guarda el precio. |
| A1 | El usuario adjunta el ticket de compra (ver CU relacionado "Subir ticket de compra", que **extiende** opcionalmente este caso de uso). |
| A2 | Precio inválido → se vuelve a pedir. |
| Postcondición | El ítem queda "comprado" y su precio impacta en el balance. |

## 3.5 CU-04 — Consultar resultado de la división (+ CU-04a, incluido)

| Campo | Detalle |
|---|---|
| Actor | Usuario |
| RF relacionados | RF-14, RF-16 |
| Precondición | La sesión tiene al menos un ítem marcado como comprado. |
| Flujo principal | 1) El usuario accede a "Resultado". 2) El sistema calcula el balance (CU-04a). 3) Muestra cuánto aportó, gastó y debe recibir/pagar cada usuario. |
| A1 | El usuario comparte la pantalla de resultado (extiende con "Compartir pantalla de resultado"). |
| A2 | Nadie completó "Presupuesto" → el sistema reparte el total gastado en partes iguales. |
| Incluye | **CU-04a — Calcular balance de gastos**, siempre como parte de este caso de uso. |
| Postcondición | Los usuarios saben cuánto pagar/recibir para cerrar la sesión de forma equitativa. |
| Adaptación móvil | Algoritmo implementado en `mobile/src/domain/balanceCalculator.ts` (cliente, cálculo optimista) y espejado en `server/src/services/balance.service.ts` (fuente de verdad). |

## 3.6 Casos de uso exclusivos del Anfitrión

- **Crear sesión de compra**: inicia una nueva sesión desde el Home (RF-04).
- **Cargar lista de compras sugerida**: define los ítems iniciales (RF-03).

## 3.7 Trazabilidad Requisito → Caso de uso → Pantalla

| RF | CU | Pantalla / módulo (mobile) |
|---|---|---|
| RF-01, RF-02 | CU-01 | `screens/access/JoinSessionScreen.tsx`, `screens/access/EnterNameScreen.tsx` |
| RF-03 | Crear sesión (Anfitrión) | `screens/session/NewSessionScreen.tsx` |
| RF-04 | — | `screens/home/HomeScreen.tsx`, `screens/history/SessionHistoryScreen.tsx` |
| RF-05..RF-08 | CU-02, CU-02a | `screens/session/ShoppingListScreen.tsx`, `screens/session/ItemDetailScreen.tsx`, `components/list/ReservationConflictModal.tsx` |
| RF-09, RF-10 | — | `components/list/ItemRow.tsx`, `components/list/ItemStatusBadge.tsx` |
| RF-11, RF-12 | CU-03 | `screens/session/ItemDetailScreen.tsx`, `services/media/ticketUpload.ts` |
| RF-13 | Gestionar presupuesto | `screens/budget/BudgetScreen.tsx` |
| RF-14, RF-16 | CU-04, CU-04a | `screens/result/ResultScreen.tsx`, `domain/balanceCalculator.ts` |
| RF-15 | Calcular gastos en reunión | `screens/meeting/MeetingExpensesScreen.tsx` |
