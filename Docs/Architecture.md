# KRUDER1 — Architecture

> Documento generado en febrero de 2026 (actualizado)

---

## 1. ¿Qué es Kruder1?

**Kruder1** es un software de photo booth con IA para Windows, diseñado para dueños de negocios de photo booth que buscan diferenciarse de la competencia. El modelo de negocio se basa en **venta de créditos** (no suscripciones) donde 1 crédito = 1 imagen generada con IA.

### Propuesta de Valor

- **Diferenciación real** para salir de guerras de precios
- **Simplicidad radical** - software fácil de usar
- **Software gratuito** - solo se pagan los créditos
- **Créditos sin expiración** - compra una vez, usa cuando quieras
- **Sin suscripciones** - modelo prepago transparente

### Cliente Objetivo

| Característica | Descripción |
|----------------|-------------|
| Perfil | Dueño de photo booth (no empleado) |
| Tipo | Comercial/vendedor (no técnico) |
| Problema | Cansado de competir en precio |
| Motivación | Busca ROI claro y diferenciación |
| Actitud | Early adopter, dispuesto a invertir |

### Posicionamiento de Marca

- **Enemigo ideológico**: guerras de precios, experiencias genéricas, software sobrecomplicado
- **Promesa**: diferenciación real, simplicidad, herramienta que cambia la conversación con el cliente
- **Personalidad**: confiada, calmada, directa, elegante, funcional
- **Estética**: técnica, limpia, sistemática (inspiración Kubrick/aviación)

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     SOFTWARE (Windows)                       │
│  Python + PyWebview + HTML/CSS/JS                           │
│  Puerto local: 8765                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────────────┐
│               CLOUDFLARE WORKERS                             │
│  ├─ kruder1-auth.js   → Autenticación, pagos, créditos      │
│  ├─ kruder1-gen.js    → Generación de imágenes con IA       │
│  └─ kruder1-landing.js → Sitio web, páginas de fotos        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬────────────────┐
        ▼               ▼               ▼                ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐      ┌─────────┐
   │ Supabase│    │ Stripe  │    │ Segmind │      │  Brevo  │
   │ (BD)    │    │ (Pagos) │    │ (IA)    │      │ (Email) │
   └─────────┘    └─────────┘    └─────────┘      └─────────┘
```

### Stack Tecnológico

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Software desktop | Python + PyWebview | Aplicación Windows nativa |
| Frontend | HTML5/CSS3/JS vanilla | Interfaz de usuario |
| Backend API | Cloudflare Workers | Lógica de negocio serverless |
| Base de datos | Supabase (PostgreSQL) | Almacenamiento de datos |
| Pagos | Stripe | Procesamiento de pagos |
| Generación IA | Segmind (Seedream 4.5) | Transformación de imágenes |
| Emails/SMS | Brevo | Comunicaciones transaccionales |
| Almacenamiento | Cloudflare R2 | Imágenes temporales y resultados |

---

## 3. El Software (Windows)

### Estructura de Archivos

```
Software/
├── main.py                 # Entry point: PyWebview + servidor HTTP
├── router.py               # Router HTTP (despacho de endpoints)
├── api.py                  # NativeApi (puente JS↔Python, lazy-load de módulos)
├── config.py               # Configuración (carga config.json opcional)
├── utils.py                # DataService, SecurityService, NetworkService
├── log_service.py          # Logging con rotación diaria (30 días)
├── index.html              # Interfaz principal (SPA)
├── requirements.txt        # Dependencias Python
├── modules/
│   ├── __init__.py
│   ├── auth.py             # Lógica de autenticación
│   ├── auth.html           # UI de autenticación
│   ├── dashboard.py        # Lógica del dashboard
│   ├── dashboard.html      # UI del dashboard
│   ├── events.py           # Gestión de eventos
│   ├── events.html         # UI de eventos
│   ├── eventmode.py        # Modo evento (captura + generación)
│   ├── eventmode.html      # UI del modo evento
│   ├── promptlab.py        # Gestión de prompts
│   ├── promptlab.html      # UI de Prompt Lab
│   ├── frames.py           # Marcos/overlays para fotos
│   ├── frames.html         # UI de marcos
│   ├── settings.py         # Configuración general
│   └── settings.html       # UI de configuración
└── static/
    ├── css/
    │   ├── app.css          # Hoja de estilos principal (estética CRT/scanline)
    │   ├── fonts.css        # Definición de fuentes
    │   └── all.min.css      # Font Awesome (iconos)
    ├── fonts/
    │   ├── InterTight-Black.ttf
    │   └── InterTight-Bold.ttf
    ├── img/
    │   ├── icon.ico         # Icono de la aplicación
    │   ├── icon.png         # Icono PNG
    │   ├── logo.png         # Logo de Kruder1
    │   ├── print_test.jpg   # Imagen de prueba para impresión
    │   ├── Kruder 1 Black Frame.png
    │   └── Kruder 1 White Frame.png
    ├── js/
    │   ├── i18n.js          # Sistema de internacionalización
    │   └── particles.min.js # Efectos de partículas
    ├── locales/
    │   ├── ar.json           # Árabe
    │   ├── de.json           # Alemán
    │   ├── en.json           # Inglés
    │   ├── es.json           # Español
    │   ├── fr.json           # Francés
    │   ├── it.json           # Italiano
    │   ├── ja.json           # Japonés
    │   ├── pt.json           # Portugués
    │   ├── ru.json           # Ruso
    │   └── zh.json           # Chino
    ├── sounds/
    │   ├── back.mp3          # Sonido de retroceso
    │   ├── button.mp3        # Sonido de botón
    │   ├── keyboard.mp3      # Sonido de teclado virtual
    │   ├── lock.mp3          # Sonido de bloquear
    │   ├── loop.mp3          # Música de fondo
    │   ├── loop chill.mp3    # Música de fondo alternativa
    │   ├── pinpad.mp3        # Sonido de PIN
    │   ├── toggle.mp3        # Sonido de toggle
    │   ├── unlock.mp3        # Sonido de desbloquear
    │   └── warning.mp3       # Sonido de advertencia
    └── webfonts/
        ├── InterTight-Black.ttf
        ├── InterTight-Bold.ttf
        ├── fa-brands-400.woff2
        ├── fa-regular-400.woff2
        ├── fa-solid-900.woff2
        └── fa-v4compatibility.woff2
```

### Dependencias Python

```
pywebview>=4.0      # GUI nativa con webview
requests>=2.28      # HTTP requests
Pillow>=9.0         # Procesamiento de imágenes
pywin32>=306        # Impresión en Windows
qrcode>=7.0         # Generación de códigos QR
```

### Funcionalidades Principales

#### 1. Gestión de Eventos
- Crear eventos con nombre personalizado
- Renombrar y eliminar eventos
- Estadísticas por evento (intentos, éxitos, impresiones, emails)
- Galería de fotos por evento
- Exportar emails como CSV

#### 2. Captura de Fotos
- Acceso a cámara web
- Countdown visual (3, 2, 1)
- Efecto de flash
- Confirmación antes de procesar

#### 3. Generación con IA
- Selección de categorías de prompts
- Selección de estilo/prompt específico
- Procesamiento con indicador de progreso
- Tiempo estimado: ~35-40 segundos

#### 4. Prompt Lab
- Crear categorías de prompts
- Crear prompts con nombre, texto e imagen
- Generar thumbnails con IA
- Habilitar/deshabilitar prompts

#### 5. Sistema de Impresión
- Detección de impresoras Windows
- Configuración de impresora predeterminada
- Impresión automática opcional
- Múltiples copias
- Imagen de prueba

#### 6. Entrega al Invitado
- Código QR para descarga
- Envío por email
- Detección automática email vs teléfono (MX)

#### 7. Seguridad
- PIN de seguridad por evento
- Bloqueo de pantalla
- Mensaje personalizable en pantalla bloqueada

### Pantallas de la Interfaz

| Pantalla | Propósito |
|----------|-----------|
| `screen-overview` | Dashboard con módulos expandibles |
| `screen-buy-credits` | Compra de créditos |
| `screen-purchase-history` | Historial de compras |
| `screen-statistics` | Estadísticas globales/por evento |
| `screen-create-event` | Crear evento |
| `screen-start-event` | Seleccionar evento activo |
| `screen-event-gallery` | Galería de fotos |
| `screen-look-camera` | Captura de foto |
| `screen-confirm-photo` | Confirmar foto |
| `screen-select-style` | Seleccionar prompt |
| `screen-processing` | Procesando generación |
| `screen-process-complete` | Resultado con QR |
| `screen-prompts-view` | Vista de prompts |
| `screen-edit-prompts` | Editor de prompts |
| `screen-printing-settings` | Configuración de impresión |
| `screen-settings` | Configuración general |

### Almacenamiento Local

```
%APPDATA%/Kruder1/
├── session.json           # Sesión del usuario (JWT)
├── settings.json          # Configuración de la app
├── events/
│   └── {event_id}/
│       ├── event.json     # Metadatos del evento
│       └── images/
│           ├── {id}.jpg   # Imágenes generadas
│           ├── {id}.json  # Metadata por imagen
│           └── {id}_qr.png # Códigos QR
└── prompts/
    ├── prompts.json       # Categorías y prompts
    └── images/            # Thumbnails de prompts
```

### API Local (Endpoints)

#### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login` | Login (proxy al worker) |
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/session` | Obtener sesión |
| GET | `/api/me` | Datos del usuario |
| GET | `/api/hwid` | Hardware ID único |

#### Eventos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/events` | Listar eventos |
| POST | `/api/events` | Crear evento |
| PATCH | `/api/events/:id` | Renombrar evento |
| DELETE | `/api/events/:id` | Eliminar evento |
| GET | `/api/events/:id/images` | Imágenes del evento |
| GET | `/api/events/:id/stats` | Estadísticas |
| GET | `/api/events/:id/emails` | Emails recolectados |

#### Prompts
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/prompts` | Listar prompts |
| POST | `/api/prompts` | Crear prompt |
| PATCH | `/api/prompts/:id` | Actualizar prompt |
| DELETE | `/api/prompts/:id` | Eliminar prompt |
| POST | `/api/prompts/categories` | Crear categoría |

#### Generación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/generate` | Generar imagen |
| POST | `/api/generate-prompt` | Generar thumbnail |
| POST | `/api/send-email-notification` | Enviar email |

#### Impresión
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/printers` | Listar impresoras |
| POST | `/api/printer/print` | Imprimir imagen |
| POST | `/api/printer/test` | Imprimir prueba |

---

## 4. El Website (kruder1.com)

### Estructura de Archivos

```
Website/
├── kruder1-landing/
│   ├── index.html         # Landing page
│   ├── pricing.html       # Planes y precios
│   ├── faqs.html          # Preguntas frecuentes
│   ├── contact.html       # Contacto
│   ├── privacy.html       # Política de privacidad
│   ├── terms.html         # Términos y condiciones
│   ├── login.html         # Login/Registro
│   ├── dashboard.html     # Panel de usuario
│   ├── verify-email.html  # Verificación de email
│   ├── reset-password.html # Reset de contraseña
│   └── img/
│       ├── icon.png
│       └── logo.png
└── workers/
    ├── kruder1-auth.js    # Worker de autenticación
    ├── kruder1-gen.js     # Worker de generación
    └── kruder1-landing.js # Worker del sitio
```

### Páginas del Sitio

#### Páginas Públicas
| Página | Descripción |
|--------|-------------|
| `index.html` | Landing con hero, propuesta de valor, CTA |
| `pricing.html` | 3 planes de créditos con checkout |
| `faqs.html` | 6 preguntas frecuentes con acordeón |
| `contact.html` | Información de contacto |
| `privacy.html` | Política de privacidad (EN/ES) |
| `terms.html` | Términos y condiciones (EN/ES) |

#### Páginas de Autenticación
| Página | Descripción |
|--------|-------------|
| `login.html` | Login, registro y recuperar contraseña |
| `verify-email.html` | Verificación de email con token |
| `reset-password.html` | Cambiar contraseña con token |

#### Páginas Protegidas
| Página | Descripción |
|--------|-------------|
| `dashboard.html` | Créditos, compras, descarga de software |

### Planes de Precios

| Plan | Créditos | Precio | Price ID (Stripe) |
|------|----------|--------|-------------------|
| Basic | 150 | $40 USD | `price_1SwcrIC1FI34uKMLaGO8Fxsh` |
| Plus | 300 | $60 USD | `price_1SwcqbC1FI34uKMLDWbAblgV` |
| Pro | 600 | $90 USD | `price_1SwcqCC1FI34uKMLiUN0eOD6` |

### Características del Frontend

- **Idiomas**: Inglés (default) y Español con toggle
- **Temas**: Light y Dark con persistencia
- **Responsive**: Diseño mobile-first
- **Efectos**: Particles.js, scanlines overlay
- **Tipografía**: Barlow (headings/buttons), Inter (inputs)

---

## 5. Workers de Cloudflare

### kruder1-auth.js (Autenticación y Pagos)

#### Rutas

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/register` | Registro de usuario |
| POST | `/login` | Login con JWT |
| GET | `/verify-email` | Verificar email |
| POST | `/forgot-password` | Solicitar reset |
| POST | `/reset-password` | Cambiar contraseña |
| POST | `/claim-demo` | Reclamar 10 créditos demo |
| GET | `/me` | Datos del usuario |
| POST | `/create-checkout-session` | Crear sesión Stripe |
| POST | `/stripe-webhook` | Webhook de pagos |
| GET | `/purchases` | Historial de compras |

#### Características de Seguridad
- Contraseñas con PBKDF2-SHA256 (100k iteraciones)
- JWT HS256 con expiración (7 días web, persistente desktop)
- Validación de HWID para tokens desktop
- Verificación de firma de webhook Stripe

### kruder1-gen.js (Generación de Imágenes)

#### Rutas

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/generate` | Generar imagen completa (2:3) |
| POST | `/generate-prompt` | Generar thumbnail (1:1) |
| POST | `/send-email` | Reenviar email con foto |

#### Características
- API keys de Segmind (1-2 keys, 30+ concurrent por key)
- Modelo: Seedream v4.5 (ByteDance)
- Aspect ratio 2:3 (2048x3072) para fotos
- Aspect ratio 1:1 (2048x2048) para thumbnails
- Tiempo estimado: ~35-40 segundos

#### Flujo de Generación
1. Recibe foto en base64
2. Sube a R2 (bucket temporal)
3. Llama a Segmind con prompt
4. Descarga resultado
5. Sube a R2 (bucket permanente)
6. Descuenta 1 crédito
7. Elimina foto temporal
8. Envía email con enlace

### kruder1-landing.js (Sitio Web)

#### Rutas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/photo/:id` | Página de foto (share/download) |
| GET | `/photo/:id/download` | Descarga directa |
| * | `*` | Pass-through a Cloudflare Pages |

---

## 6. Base de Datos (Supabase)

### Tablas

#### accounts
```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL
credits         INTEGER DEFAULT 0
email_verified  BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP DEFAULT NOW()
```

#### verification_tokens
```sql
id              UUID PRIMARY KEY
account_id      UUID REFERENCES accounts(id)
token           TEXT UNIQUE NOT NULL
expires_at      TIMESTAMP NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

#### password_reset_tokens
```sql
id              UUID PRIMARY KEY
account_id      UUID REFERENCES accounts(id)
token_hash      TEXT UNIQUE NOT NULL
expires_at      TIMESTAMP NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

#### account_devices
```sql
id              UUID PRIMARY KEY
account_id      UUID REFERENCES accounts(id)
hwid            TEXT NOT NULL
last_seen_at    TIMESTAMP DEFAULT NOW()
created_at      TIMESTAMP DEFAULT NOW()
```

#### purchases
```sql
id              UUID PRIMARY KEY
account_id      UUID REFERENCES accounts(id)
credits_added   INTEGER NOT NULL
amount_paid     DECIMAL NOT NULL
currency        TEXT DEFAULT 'USD'
stripe_payment_id TEXT
created_at      TIMESTAMP DEFAULT NOW()
```

#### hwid_demo_claimed
```sql
id              UUID PRIMARY KEY
hwid            TEXT UNIQUE NOT NULL
account_id      UUID REFERENCES accounts(id)
created_at      TIMESTAMP DEFAULT NOW()
```

### Políticas RLS

- RLS habilitado por defecto en todas las tablas
- Workers usan `service_role` (bypass de RLS)
- Usuarios solo pueden ver sus propios datos

---

## 7. Integraciones Externas

### Stripe (Pagos)

- **Modo**: Checkout Sessions
- **Webhook**: `checkout.session.completed`
- **URL**: `https://kruder1-auth.kruder1-master.workers.dev/stripe-webhook`
- **Flujo**:
  1. Usuario selecciona plan
  2. Se crea Checkout Session
  3. Redirección a Stripe
  4. Webhook procesa pago
  5. Se añaden créditos

### Segmind (Generación IA)

- **Modelo**: Seedream v4.5 (ByteDance)
- **Endpoint**: `https://api.segmind.com/v1/seedream-4.5`
- **Auth**: `x-api-key` header
- **Capacidad**: 30+ generaciones concurrentes por key (1-2 keys suficientes)

### Brevo (Comunicaciones)

- **Servicios**: Email y SMS
- **Emails**:
  - Verificación de cuenta
  - Reset de contraseña
  - Confirmación de compra
  - Foto lista para descargar
- **SMS**: Solo para teléfonos de México

### Cloudflare R2 (Almacenamiento)

- **Buckets**:
  - `temp/` - Fotos temporales (se borran después de procesar)
  - `results/` - Imágenes generadas (máximo 48 horas)
- **URL pública**: `https://media.kruder1.com/`

---

## 8. Seguridad

### Autenticación
- Contraseñas hasheadas con PBKDF2-SHA256 (100,000 iteraciones)
- Salt aleatorio por usuario
- JWT con expiración configurable
- Validación de HWID para dispositivos desktop

### Tokens
- Verificación de email: expira en 24 horas
- Reset de contraseña: expira en 1 hora
- JWT web: expira en 7 días
- JWT desktop: persistente (validado con HWID)

### Privacidad
- No se almacenan fotos originales de caras
- Fotos temporales se borran después de procesar
- Resultados máximo 48 horas en bucket
- Limpieza automática

### Webhook Stripe
- Verificación de firma HMAC
- Solo procesa eventos válidos

---

## 9. Sistema de Demo

- **Créditos gratis**: 10 créditos por cuenta verificada
- **Restricción**: Solo 1 demo por HWID
- **Requisitos**:
  1. Email verificado
  2. HWID no registrado previamente
- **Propósito**: Permitir prueba sin compromiso, evitar abuso

---

## 10. Flujos Principales

### Flujo de Registro
```
1. Usuario ingresa email y contraseña
2. Se crea cuenta (email_verified: false)
3. Se envía email de verificación
4. Usuario hace clic en enlace
5. Se verifica email (email_verified: true)
6. Si HWID es nuevo → se otorgan 10 créditos demo
```

### Flujo de Compra
```
1. Usuario selecciona plan en pricing.html o en la app
2. Se crea Stripe Checkout Session
3. Usuario completa pago en Stripe
4. Stripe envía webhook
5. Worker verifica firma y procesa
6. Se añaden créditos a la cuenta
7. Se registra compra en historial
8. Se envía email de confirmación
```

### Flujo de Generación
```
1. Usuario captura foto en la app
2. Selecciona categoría y prompt
3. App envía foto + prompt al worker
4. Worker verifica créditos disponibles
5. Si hay créditos:
   a. Sube foto temporal a R2
   b. Llama a Segmind
   c. Descarga resultado
   d. Sube resultado a R2
   e. Descuenta 1 crédito
   f. Borra foto temporal
   g. Genera QR
   h. Envía email (opcional)
6. App muestra resultado con QR
```

---

## 11. Estado del Proyecto

### Fases Completadas

| Fase | Nombre | Estado |
|------|--------|--------|
| 0 | Decisiones cerradas | Completa |
| 1 | Cuentas y esqueleto | Completa |
| 2 | Auth completo | Completa |
| 3 | Créditos y Stripe | Completa |
| 4 | Generación de imágenes | Completa |
| 5 | Entrega al invitado | Completa |
| 6 | Sitio web | Completa |
| 6.5 | Build & Distribution (PyInstaller + Inno Setup + R2 updates) | Completa |

### Fases Pendientes

| Fase | Nombre | Estado |
|------|--------|--------|
| 7 | Panel admin | Pendiente |
| 8 | Afinar y proteger | Pendiente |

### Panel Admin (Fase 7) - Por implementar
- Lista de usuarios registrados
- Compradores y montos
- Demos otorgados
- Correos recolectados
- Historial de compras
- Créditos disponibles por usuario

---

## 12. Áreas de Mejora Potencial

### Software
- [ ] Panel de administración
- [ ] Más efectos y filtros
- [ ] Mejoras de UX
- [ ] Optimización de rendimiento
- [ ] Soporte para múltiples cámaras
- [ ] Modo offline parcial

### Website
- [ ] Blog con contenido
- [ ] Testimoniales de clientes
- [ ] Galería de ejemplos
- [ ] Optimización SEO
- [ ] Página de documentación
- [ ] Sistema de tickets/soporte

### Backend
- [ ] Analytics y métricas
- [ ] Rate limiting
- [ ] Logs y monitoreo avanzado
- [ ] Más opciones de pago
- [ ] API pública documentada

### General
- [ ] Tests automatizados
- [ ] CI/CD pipeline
- [ ] Documentación técnica
- [ ] Internacionalización completa

---

## 13. Variables de Entorno

### Cloudflare Workers

```env
# kruder1-auth
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BREVO_API_KEY=

# kruder1-gen
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SEGMIND_API_KEY=
BREVO_API_KEY=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

---

## 14. URLs Importantes

| Servicio | URL |
|----------|-----|
| Sitio web | https://kruder1.com |
| Worker Auth | https://kruder1-auth.kruder1-master.workers.dev |
| Worker Gen | https://kruder1-gen.kruder1-master.workers.dev |
| Media (R2) | https://media.kruder1.com |
| Supabase | (ver docs/sensitive/) |
| Stripe Dashboard | https://dashboard.stripe.com |

---

## 15. Contacto y Soporte

- **Email**: hola@kruder1.com
- **País**: México
- **Idiomas**: Español, Inglés

---

*Este documento sirve como referencia completa del proyecto Kruder1. Para información sensible (API keys, secrets), consultar la carpeta `docs/sensitive/`.*
