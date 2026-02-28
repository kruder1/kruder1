# Plan Maestro — Kruder1

**Objetivo:** Ordenar todo lo que hay que hacer, tener las decisiones cerradas y definir por dónde avanzar. Se actualiza según avancemos.

---

## 1. Decisiones cerradas (respuestas a las preguntas)

### 1.1 Cliente y uso del producto

**1. Cliente principal**  
Dueños de photo booths que buscan un software distinto para generación de imágenes con IA.

**2. Flujo en el evento (invitado recibe la imagen)**  
- Un **solo campo**: el invitado escribe **email** o **teléfono (MX)**.
- El sistema **detecta** si es email o teléfono:
  - Si es **email** → se envía el enlace por **email** (Brevo).
  - Si es **teléfono** → se envía **SMS** con la URL de la imagen (Brevo).
- El email del invitado sirve para: **(a)** base de datos valiosa para el dueño del booth, **(b)** “llenar” el tiempo mientras se genera la imagen.
- **QR siempre se genera y se muestra.** Es la vía principal: la mayoría lleva el celular en la mano y lo más fácil es escanear el QR. Además, quien no ponga email ni teléfono igual puede descargar escaneando. Email/SMS son complemento para quien quiera el enlace en su bandeja o por mensaje.
- Caso “señora sin cel, sin correo”: si pone **solo teléfono**, recibe SMS con el enlace y cuando tenga el celular hace clic. Con eso se cubren casi todos los escenarios.

**3. Créditos y quién los usa**  
- Los créditos son **solo para generación de imágenes**. Ej.: 150 créditos = 150 imágenes.
- Son del **dueño del negocio** (ej. pepe@mail.com). El dueño puede usar la misma cuenta en varias PCs.
- **Usuario final (invitado del evento)**: no tiene cuenta ni sabe de créditos. Solo se toma la foto y se va con foto impresa y/o digital. El sistema está pensado para que casi siempre haya un **operador** (el dueño o un colaborador).
- **Demo — regalo de 10 créditos**:
  - Solo a **cuentas verificadas**.
  - Flujo: usuario descarga la app → se registra → recibe correo → **verifica el correo** → en el backend (Python) se envía **HWID** a la base de datos → cuando hay **HWID + correo verificado**, se otorgan 10 créditos.
  - Si el mismo equipo (mismo HWID) intenta abusar con otro correo (ej. pepe+1@mail.com): el sistema le dice, en lenguaje claro, que **ese equipo ya recibió los 10 créditos demo**. No se permiten más demo para ese HWID.
  - Objetivo: evitar abuso sin complejidad para el usuario legítimo.

**4. Planes de créditos**  
Los que existen en la interfaz: **150 (mínimo)**, **300**, **600 (máximo)**. Sin más planes por ahora.

---

### 1.2 Pagos y dinero

**5. Stripe**  
- Crear cuenta **desde cero**, lista para producción pero usando entorno de **desarrollo** para pruebas.
- Cobro **siempre en USD** (evitar fluctuaciones peso/dólar; te protege el tipo de cambio).

**6. Dónde se compra y cómo**  
- **En la app**: el apartado de “comprar créditos” **pide contraseña** antes de nada. Solo quien conoce la contraseña de la cuenta (normalmente el dueño, pepe) puede autorizar. La compra **no** se hace dentro de la app: tras validar contraseña, se **abre el navegador** y el pago se hace en **Stripe** (evita que un colaborador gaste sin permiso).
- **En la web (kruder1.com)**: hace falta un **portal de login + dashboard mínimo** para que el dueño pueda **comprar créditos desde el celular** (o cualquier dispositivo). Caso de uso: muchos eventos el mismo día, mismos créditos en varias PCs, un colaborador avisa que se acaban; el dueño entra desde el celular, hace login y compra de forma muy sencilla.

**7. Reembolsos**  
- Créditos **no reembolsables** y **no expiran**.
- No conviene destacar esto en el copy; hacerlo podría invitar a disputas. Se deja como regla interna y, si hace falta, una línea breve en términos.

---

### 1.3 Tu panel (admin) y métricas

**8. Lo que quieres ver el primer día**  
- Cuántos **usuarios registrados** hay.
- Cuántos **ya compraron** (vs solo demo).
- Cuántos **recibieron demo** (los 10 créditos).
- **Correos** de usuarios.
- **Historial de compras** por usuario.
- **Créditos disponibles** por usuario.
- **No** te interesa (de entrada) el total de imágenes generadas.

**9. Demo**  
Ya cubierto en punto 3: 10 créditos a cuentas verificadas, un solo “regalo” por HWID.

**10. Alertas**  
De momento solo **tablas e información**. Más adelante se pueden añadir alertas si hace falta.

---

### 1.4 Web y mensaje

**11. “Quiénes somos”**  
Kruder1 es la marca; detrás estás tú, sin nombrar equipo. Mensaje: **14 años en eventos y photo booths**. Sin mencionar que sea un equipo.

**12. Idioma y preferencias**  
- Web **en inglés por defecto**.
- **Toggle** en esquina superior derecha para cambiar a **español**.
- Ideal: **mobile friendly**, detectar idioma del sistema y guardar **preferencia** (ej. cookie) para mantener el mismo idioma en todas las páginas.

**13. Objetivo de la web**  
- Dejar claro **qué es Kruder1**, **de qué trata** y **cómo se usa** de forma sencilla.
- Mostrar **precios** de los paquetes.
- Ser el **mismo lugar** donde pepe hace login y compra créditos (portal + compra integrados).

**14. Tono**  
Serio y **muy persuasivo**. Estilo: “The Photo Booth has evolved. Has yours?” — crear **escasez**, **exclusividad**, “solo para profesionales”, despertar curiosidad. **Más conciso** que párrafos largos. Narrativa: no cualquiera lo tiene.

---

### 1.5 Operación, privacidad e imágenes

**15. Imágenes: bucket, API, QR y privacidad**  
- La API de generación (**fal.ai**) suele pedir una **URL pública** del archivo. Flujo previsto: **subir la foto a un bucket** → obtener URL pública → empaquetar JSON (texto del prompt + URL) → llamada a fal.ai → **polling** hasta tener resultado (según doc, suele devolver **URL pública**).
- Con esa URL se puede **generar el QR** directamente, o (si hace falta) subir el resultado a tu propio bucket; esto se confirma con la **documentación de fal.ai** (y si conviene QR “predictivo” o no).
- **Privacidad estricta**: **prohibido guardar imágenes originales de las caras**. No se almacenan en ningún lado. Si se suben al bucket para la API, **borrarlas en cuanto se tenga el resultado**.
- **Imágenes resultantes** (las generadas):
  - En el bucket: **máximo 48 horas**; después se borran con una regla de limpieza del bucket.
  - En el **software** (PC del photo booth): se descargan y se **guardan en disco local**. Si el anfitrión o el cliente del evento quiere las fotos, es cosa del operador (USB, Drive, etc.).

**16. SMS y mercado inicial**  
Mercado inicial **México**. Brevo permite comprar SMS en bulk y resulta el más económico para tu caso. Más adelante se puede ampliar a USA.

**17. API de generación de imágenes**  
- Proveedor: **fal.ai** (ya probado; para tu uso es el más robusto).
- **Pico de carga**: soportar muchas peticiones simultáneas (ej. ~20 en el mismo instante). Para eso:
  - Usar **5 API keys** (5 cuentas/tarjetas/usuarios tuyos).
  - Implementar un **“semáforo”** y **dispersar** las solicitudes de forma **ordenada** entre esas keys (no aleatorio). Luego se pueden hacer más pruebas de estrés si hace falta.

---

### 1.6 Orden y primer hito

**18. Primer hito **  
**Auth completo**: registro, login y **recuperación de contraseña** (“si se le olvidó, que pueda pedir que se la manden”). Eso es el primer bloque a tener listo.

**19. Fechas**  
No hay fecha concreta, pero quieres avanzar **rápido**; ya llevas meses y es sobre todo tema de lógica de negocio.

**20. Hardware más adelante**  
- Se vende el photo booth con PC en la que ya viene el software instalado **sin cuenta**.
- El comprador **se registra** y crea su cuenta; tú **regalas créditos** por la compra del hardware.
- Es **aparte e independiente** del software actual; se maneja cuando exista el hardware y no complica el plan actual.

---

## 2. Resumen ejecutivo (para tener todo en un sitio)

### Producto
- **Kruder1** = software instalable en Windows. No es SaaS, no es para móviles.
- Uso del software **gratis**. Ingresos = **venta de créditos** (1 imagen = 1 crédito).
- Créditos **no expiran**, **no reembolsables**. Sin mensualidades ni costos ocultos.
- **Cliente**: dueño del photo booth. **Invitado del evento**: solo pone email o teléfono para recibir la foto; no tiene cuenta.
- **Demo**: 10 créditos gratis a cuentas **verificadas**, **una sola vez por HWID** (evitar abuso).

### Flujo invitado (en el evento)
1. Invitado escribe **email** o **teléfono (MX)** en un solo campo.
2. **QR siempre se genera y se muestra** — es la vía principal (celular en mano, escanear es lo más sencillo). Quien no pone contacto igual descarga con el QR.
3. Si puso email o teléfono: sistema detecta tipo → envía **email** o **SMS** con URL (Brevo). Complemento al QR.
4. El email/teléfono del invitado alimenta la base de datos del dueño y ocupa el tiempo de generación.

### Compra de créditos
- **App**: flujo “comprar créditos” **pide contraseña** (solo el dueño autoriza) → abre **navegador** → pago en **Stripe**.
- **Web**: **login + dashboard mínimo** para que el dueño compre créditos desde el celular cuando haga falta.

### Tecnología elegida
- **Stripe**: pagos en USD (cuenta por crear, lista para prod, pruebas en dev).
- **Supabase**: base de datos (separada de Cloudflare para poder migrar lógica a AWS si un día hace falta).
- **Cloudflare**: sitio web + Workers (auth/créditos, admin, generación de imágenes).
- **fal.ai**: generación de imágenes; 5 API keys + semáforo para dispersar peticiones.
- **Brevo**: email + SMS (México, bulk).
- **Bucket**: subida temporal para la API; **no** guardar caras; resultados máximo 48 h en bucket; en PC del booth sí se guardan en disco local.

### Web (kruder1.com)
- **Cloudflare** (cuenta gratuita). Minimalista, alineado con la app.
- Inglés por defecto, toggle a español, preferencia guardada, mobile friendly.
- Contenido: qué es, cómo funciona, precios, **login + compra de créditos**.
- Tono: serio, persuasivo, escasez/exclusividad, “solo para profesionales”. 14 años en photo booths.

### Lo que ya tienes
- Dominio **kruder1.com**, cuenta **Cloudflare**, correo con routing.
- Interfaz de la app (maqueta) definida y auditada.

### Estructura del proyecto
- **backend/** — API en Python. Punto de entrada: **main.py** (no app.py). Rutas en `api/`, config en `core/`, lógica en `services/`, modelos en `models/`.
- **software/** — App Windows: `app.html` en la raíz de `software/`, estáticos en `software/static/images/` y `software/static/sounds/`.
- **website/** — kruder1.com.
- **docs/** — Plan maestro, contexto, auditoría, y **STRUCTURE.md** (árbol de carpetas, por qué main.py, dónde va cada cosa, mapa de migración).
- **brand/** — Logos y assets de marca (origen).

Detalle completo, migración de archivos actuales y motivos de cada decisión: **STRUCTURE.md** (en esta misma carpeta docs/).

---

## 3. Orden de trabajo (fases)

### Fase 0 — Cerrada
- Cliente, flujo invitado, demo/HWID, planes, pagos, admin, web, tono, privacidad, fal.ai, primer hito = **auth completo**.

### Fase 1 — Cuentas y esqueleto
- Crear cuenta **Stripe** (prod + dev), producto y precios para 150 / 300 / 600 créditos.
- Crear cuenta **Brevo**, revisar límites gratuitos de email y SMS (MX).
- Definir **tablas en Supabase** (usuarios, HWID, créditos, compras, verificación de correo, etc.).
- Definir **qué hace cada Worker** (auth, admin, generación) y dónde encaja la lógica en **Python** (ej. HWID, verificación, regalo de 10 créditos).

### Fase 2 — Auth completo (primer hito)
- **Registro** (email, contraseña).
- **Verificación de correo** (enlace por Brevo o similar).
- **Login**.
- **Recuperar contraseña** (“olvidé mi contraseña” → correo con enlace).
- En backend: recibir **HWID** del software, guardarlo, regalar **10 créditos** solo cuando: correo verificado + HWID nuevo (primera vez para ese HWID).
- Bloquear demo para el mismo HWID con mensaje claro si intenta de nuevo.

### Fase 3 — Créditos y Stripe
- Consultar **saldo de créditos** desde la app.
- Flujo “comprar créditos” en la app: validar contraseña → abrir Stripe en el navegador (Checkout o similar).
- **Webhook** de Stripe → sumar créditos en Supabase según plan comprado.
- **Portal web**: login + dashboard mínimo para comprar créditos desde el celular.

### Fase 4 — Generación de imágenes
- Worker que recibe **foto + prompt** desde la app.
- Subir foto a **bucket** (temporal), obtener URL, empaquetar con fal.ai según su doc.
- **Semáforo + 5 API keys** para dispersar solicitudes.
- Descontar **1 crédito** por imagen; si no hay créditos, no procesar.
- Al tener resultado: **borrar** foto original del bucket; dejar resultado según reglas (48 h en bucket, QR, etc.).

### Fase 5 — Entrega al invitado (email / SMS / QR)
- Detección **email vs teléfono (MX)** en el campo del invitado.
- **Brevo**: envío por email o SMS con URL de la imagen.
- **QR** para descarga (según si la URL es de fal.ai o de tu bucket).
- Regla de limpieza del bucket a **48 horas** para resultados.

### Fase 6 — Sitio web (kruder1.com)
- Hero, qué es, cómo funciona, precios, FAQs, quiénes somos (14 años, sin mencionar equipo).
- Diseño minimalista y persuasivo.
- Inglés por defecto, toggle español, preferencia guardada, mobile friendly.
- Integrar **login + compra** como parte del mismo sitio (portal del dueño).

### Fase 7 — Panel admin
- Usuarios registrados, cuántos compraron, cuántos recibieron demo, correos, historial de compras, créditos disponibles.
- Solo tablas e información por ahora.
- Acceso restringido (solo tú o quienes definas).

### Fase 8 — Afinar y proteger
- Revisar mensajes de error, límites de Brevo, qué pasa si Stripe o fal.ai fallan.
- Si hace falta, una línea breve sobre “créditos no reembolsables” en términos; sin dar más protagonismo a reembolsos en el copy.

---

## 4. Próximo paso concreto

**Siguiente avance recomendado:** **Fase 1 — Cuentas y esqueleto**.

En orden sugerido:

1. **Crear cuenta Stripe** (modo desarrollo para pruebas), definir **producto “Créditos Kruder1”** y **tres precios**: 150, 300 y 600 créditos (con los montos en USD que ya tengas pensados). Anotar en el plan: IDs de producto y precios, y que el pago en la app será vía “abrir Stripe en navegador”.

2. **Crear cuenta Brevo**, activar envío de email (y SMS cuando vayas a usarlo). Revisar límites del plan gratuito y anotarlos en el plan.

3. **Definir y escribir en el plan** el “esqueleto” de **Supabase**:
   - Tablas: usuarios (email, contraseña hash, verificado sí/no, HWID asociado), HWIDs (para control de “ya recibió demo”), créditos por usuario, historial de compras, y lo que haga falta para verificación y demo.

4. **Dejar escrito** en el plan:
   - Qué hace el **Worker de auth** (registro, login, recuperar contraseña, verificación, HWID, 10 créditos demo).
   - Qué hace el **Worker de generación** (recibir foto+prompt, bucket, fal.ai, semáforo, 1 crédito).
   - Qué hace el **Worker o zona admin** (métricas que definimos).
   - Dónde vivirá la lógica en **Python** (si es solo HWID + regalo de créditos, o algo más).

Cuando termines los puntos 1–4, el plan tendrá “Fase 1 cerrada” y el siguiente paso será **Fase 2 — Implementar auth completo** (registro, verificación, login, recuperar contraseña, HWID y 10 créditos demo).

Si quieres, puedo proponerte un esquema de tablas de Supabase y una lista de comprobación para Stripe y Brevo para que no se te pase nada al crear las cuentas.
