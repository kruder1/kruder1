# Kruder1 — Contexto de Marca, Decisión y Narrativa

## 1. Qué es Kruder1

**Kruder1** es la **marca madre y el nombre del software principal**.

No es el hardware.
No es el photo booth físico.
No es el evento.

Kruder1 es:
- el sistema
- el núcleo
- el cerebro
- la plataforma

Todo lo demás (hardware, flujos, experiencias, modos de evento) corre **sobre Kruder1**.

---

## 2. Qué hace el producto (resumen funcional)

Kruder1 es un software de photo booth con IA basado en créditos.

Arquitectura general:
- El software instalable (Windows) es gratuito.
- La lógica crítica vive en el servidor.
- El ejecutable solo consume la API.

Flujo:
1. El usuario se toma una foto en el software.
2. El software llama a una API en Cloudflare Workers.
3. El worker:
   - autentica al usuario
   - consulta créditos en Supabase
4. Si hay créditos:
   - descuenta 1 crédito
   - envía la imagen a una API externa de IA
5. Si no hay créditos:
   - no se procesa la imagen
   - se invita a comprar créditos
6. La compra se hace vía Stripe.
7. Stripe notifica al worker.
8. El worker asigna créditos en Supabase.

Todos los secretos (APIs, llaves, credenciales) viven **exclusivamente como variables secretas en Cloudflare**.

El software nunca expone secretos.

---

## 3. Por qué el nombre **Kruder1**

### Kruder
- Sonido fuerte, industrial, germánico.
- No describe el producto (esto es intencional).
- No es emocional ni “startup friendly”.
- Se siente como sistema, máquina, núcleo.

No intenta decir *qué hace*.
Dice *qué tan serio es*.

### El “1”
El número no es decorativo, es estructural.

Comunica:
- unidad
- origen
- núcleo
- versión base
- sistema principal

Funciona igual en:
- Español: “Kruder uno”
- Inglés: “Kruder one”

No depende de una pronunciación específica del idioma.

Visualmente:
- técnico
- limpio
- sistemático
- tipo aviación / automotriz / Kubrick

---

## 4. Ventajas frente a otros nombres evaluados

Comparado con nombres inventados sin número (ej. Dorvek):

**Kruder1**
- Más memorable
- Más identidad
- Escala mejor como sistema
- Funciona mejor como software + plataforma
- Genera fricción positiva (tensión, carácter)

**Dorvek**
- Correcto
- Registrable
- Neutral
- Fácil de olvidar
- No genera narrativa

Un nombre sin fricción rara vez construye marca fuerte.

---

## 5. Relación con hardware

El hardware NO necesita compartir el nombre.

Propuesta:
- Marca / software: **Kruder1**
- Hardware: **Monolith**

Ejemplos:
- Monolith
- Monolith Mk I
- Monolith Zero

Kruder1 es el sistema.
Monolith es el contenedor físico.

Esto crea una jerarquía clara y elegante.

---

## 6. Influencia estética y narrativa

Inspiraciones claras (no literales):
- 2001: A Space Odyssey
- Kubrick
- Monolito
- Quirófano
- Estética Swiss / International Style

Conceptos clave:
- limpieza
- monocromía
- precisión
- poder silencioso
- neutralidad emocional

Kruder1 no “vende diversión”.
Vende control, sistema, transformación.

---

## 7. Dominio y viabilidad digital

- Dominio: **kruder1.com**
- El número reduce conflictos y aumenta distintividad.
- Más viable que “kruder.com”.
- Funciona bien en:
  - branding
  - emails
  - subdominios
  - routing (Cloudflare)

Ejemplos:
- api.kruder1.com
- console.kruder1.com
- events.kruder1.com

---

## 8. Consideraciones legales (alto nivel)

Esto no sustituye asesoría legal, pero es criterio práctico.

A favor:
- Nombre distintivo
- No descriptivo
- No genérico
- No técnico común
- El “1” añade diferenciación

Riesgo:
- “Kruder” es un apellido conocido (Peter Kruder)
- No es marca famosa en México
- No está en la misma clase
- Kruder1 ≠ Kruder

Riesgo existente, pero **razonable y manejable**.

Clases probables:
- Clase 9: software, hardware, sistemas
- Clase 42: software como servicio, plataformas
- Clase 41 (opcional): experiencias, eventos

---

## 9. Decisión estratégica

Kruder1 no fue elegido por consenso.
Fue elegido por:
- coherencia
- narrativa
- memorabilidad
- proyección a largo plazo

Es un nombre que:
- puede crecer
- puede sostener una estética fuerte
- no depende de explicar su significado

El sistema se defiende solo.

---

## 10. Resumen corto

Kruder1 es:
- el núcleo
- el sistema
- la plataforma

Todo lo demás orbita alrededor.

No intenta gustar a todos.
Intenta ser sólido.

