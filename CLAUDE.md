# FRI APP — Contexto para Claude Code

## ¿Qué es esta app?
Plataforma de intercambio de ropa de mujer (28–40 años) en Chile.
Las prendas NO se compran con dinero real — se intercambian con un sistema de **puntos virtuales**.
El único dinero real que se maneja es el **costo de envío**, cobrado via MercadoPago.

## Stack técnico
- **Backend:** Java 21 + Spring Boot 3 (monolito modular)
- **Base de datos:** PostgreSQL 16 (Supabase en producción)
- **Migraciones:** Flyway
- **Auth:** JWT + Supabase Auth
- **Storage:** Cloudflare R2 (fotos de prendas)
- **Pagos:** MercadoPago (solo para costo de envío)
- **Logística:** Envia.com API (generación de etiquetas)
- **Emails:** Resend
- **Push notifications:** Expo Push

## Módulos del monolito
```
src/main/java/com/friapp/
├── auth/          # JWT, registro, login, validación RUT chileno
├── users/         # Perfil, direcciones, región/comuna Chile
├── garments/      # Catálogo, fotos (R2), tallas, estado
├── points/        # Wallet, point_ledger, saldo atómico
├── transactions/  # Flujo compra/venta, estados
├── shipments/     # Integración Envia.com, etiquetas, tracking
├── payments/      # Integración MercadoPago, webhooks
├── ratings/       # Sistema de calificaciones post-intercambio
└── notifications/ # Push (Expo) + email (Resend)
```

## Reglas de negocio importantes
1. El saldo de puntos (`users.points_balance`) se actualiza SIEMPRE en la misma transacción DB que el registro en `point_ledger`. Nunca uno sin el otro.
2. Al iniciar una compra, la prenda pasa a estado `reserved` con `SELECT FOR UPDATE` para evitar compras simultáneas.
3. Los puntos se liberan al vendedor SOLO cuando el tracking confirma entrega (`shipments.status = DELIVERED`) o el comprador confirma recepción.
4. El RUT chileno se guarda encriptado (AES via `@Convert`), nunca en texto plano.
5. El flujo de estados de `transactions`: `PENDING_PAYMENT` → `PENDING_SHIPMENT` → `IN_TRANSIT` → `DELIVERED` → `COMPLETED`.

## Contexto chileno
- Usuarios identificados por RUT (formato `12345678-9`), validar dígito verificador.
- Regiones de Chile: usar nombres oficiales (ej. `Región Metropolitana`, `Región de Valparaíso`).
- Moneda de puntos: no tiene nombre definitivo aún (placeholder: "puntos").
- Courier principal: Envia.com (agrega Starken, Chilexpress, Correos Chile).

## Convenciones de código
- Endpoints REST en español: `/api/v1/prendas`, `/api/v1/intercambios`, `/api/v1/puntos`
- Nombres de clases en inglés (Java convention): `GarmentService`, `PointLedgerRepository`
- DTOs separados de entidades: `GarmentRequest`, `GarmentResponse`
- Manejo de errores con `@ControllerAdvice` global
- Tests con JUnit 5 + Mockito; integración con `@SpringBootTest` + Testcontainers

## Para el MVP NO implementar
- Intercambio por dinero real
- Trueque directo 1 a 1
- Categorías de ropa de hombre o niños
- Sistema de pujas o subastas
- Versión web
