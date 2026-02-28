# Reporte: Decisión de IA para Photo Booth

## Resumen ejecutivo

| Decisión | Opción elegida |
|----------|----------------|
| **Proveedor** | fal.ai |
| **Modelo** | Seedream 4.5 (ByteDance) |
| **Arquitectura** | Backend con cola + 5 API keys (round-robin) |
| **Capacidad** | 50 generaciones simultáneas |
| **Tiempo esperado por imagen** | ~35–40 s |

---

## 1. Proveedores evaluados

| Proveedor | Modelo | Precio/img | Prueba realizada |
|-----------|--------|------------|------------------|
| Replicate | Seedream 4.5 | ~$0.04 | 30 requests simultáneas |
| fal.ai | Seedream 4.5 | ~$0.03–0.04 | 30 requests simultáneas |
| kie.ai | Seedream 4.5 | $0.032 | 30 requests simultáneas |

---

## 2. Resultados de pruebas de estrés

### Aceptación (30 requests enviadas)

| Proveedor | Aceptadas | Rechazadas (429) |
|-----------|-----------|------------------|
| Replicate | 5 | 25 |
| fal.ai | 10 | 20 |
| kie.ai | 20 | 10 |

### Tiempo promedio por imagen

| Proveedor | Promedio | Rango |
|-----------|----------|-------|
| Replicate | ~28 s | 17–43 s |
| fal.ai | ~32 s | 25–45 s |
| kie.ai | ~36 s | 24–83 s |

### Comportamiento ante saturación

| Proveedor | Qué pasa al superar el límite |
|-----------|------------------------------|
| Replicate | 429 inmediato |
| fal.ai | 429 inmediato ("Reached concurrent requests limit of 10") |
| kie.ai | Acepta la tarea y la encola internamente; el usuario puede esperar hasta 80 s |

---

## 3. Capacidad con 5 API keys

| Proveedor | Concurrentes por key | Total (5 keys) |
|-----------|----------------------|----------------|
| Replicate | ~5 | 25 |
| fal.ai | 10 (documentado) | 50 |
| kie.ai | ~20 | 100 |

---

## 4. Por qué se descartó Replicate

- Solo 5 solicitudes aceptadas de 30.
- Capacidad total: 25 con 5 keys.
- Throughput insuficiente para el volumen objetivo.
- Límites poco claros (no documentados).

---

## 5. fal.ai vs kie.ai

| Criterio | fal.ai | kie.ai |
|----------|--------|--------|
| Límite documentado | Sí (10 por key) | No |
| Comportamiento | Rechaza con 429 si excedes | Acepta y encola internamente |
| Tiempos | Predecibles (~32 s) | Variables (24–83 s) |
| Control del flujo | Alto | Menor (cola interna oculta) |

**Decisión:** fal.ai, por límites claros, tiempos predecibles y mejor control para la cola propia.

---

## 6. Por qué Seedream 4.5 (y no Gemini 2.5 / Nano Banana)

| Criterio | Seedream 4.5 | Gemini 2.5 / Nano Banana |
|----------|--------------|---------------------------|
| Grupos (3+ personas) | Consistente | A menudo falla |
| Rostros | Más estables | Riesgo de cambios |
| Resolución | Mayor (2K mínimo) | Variable |
| Tiempo | ~30–35 s | ~15–20 s |

**Decisión:** Seedream 4.5. La consistencia de rostros y grupos pesa más que los ~15 s de diferencia. En un booth, el usuario espera hasta recibir la imagen; mejor una espera algo mayor con resultado fiable.

### Validación con Prompt Comparison Tool (2025)

Pruebas directas comparando Seedream 4.5 vs Nano Banana (misma imagen, mismos prompts) confirmaron:

- **Seedream es más accurate:** rostros y consistencia claramente superiores. La resolución 2K y el modelo explican que tarde más (~35–40 s), pero el resultado es fiable.
- **Nano Banana (Nano Flash):** no es viable para 2 personas ni para grupos; incluso en pareja la consistencia de rostros falla. Para una sola persona podría funcionar según el prompt, pero es muy dependiente del crafting. No es aceptable usar algo que no funciona bien con dos personas.
- **Conclusión:** Se sacrifica tiempo por consistencia. Preferible esperar más y que el resultado esté bien hecho que esperar poco y que no se parezca o falle con grupos. La decisión original (Seedream) se reafirma con datos propios.

---

## 7. Consideración kie.ai (análisis posterior)

Se analizó kie.ai como alternativa al proveedor (mismo modelo Seedream o Nano Banana, 4–5 llaves en ambos):

| Aspecto | fal.ai (4 keys) | kie.ai (4 keys) |
|---------|-----------------|-----------------|
| Límite | 40 concurrentes (10/key) | 80 inicios cada 10 s (20/key) |
| Precio Nano Banana | ~$0.039/img | ~$0.02/img (−49 %) |
| Tiempos | Predecibles (~32 s) | Variables (24–83 s en pruebas Seedream) |

- **kie.ai:** límite por *rate* (cuántas solicitudes inicias cada 10 s), no por concurrencia; teóricamente mayor throughput si se maneja la cola respetando 80 inicios/10 s.
- **Seedream en kie.ai descartado:** En pruebas propias (2 generaciones), Seedream en kie.ai tardó ~50 s en una y ~100 s en la otra. Muy por encima de fal.ai (~35–40 s). Ese modelo en ese proveedor queda descartado por latencia; no olvidar si en el futuro se revalúa kie.ai con otro modelo.
- **Decisión de proveedor:** Se mantiene **fal.ai** por límites documentados, tiempos predecibles y control explícito de la cola (reintentos en worker). La diferencia de precio no compensa el riesgo de tiempos variables y cola interna opaca hasta tener pruebas de estrés propias contra kie.ai. El modelo elegido sigue siendo **Seedream 4.5** por consistencia (ver sección 6), siempre en fal.ai.

---

## 8. Arquitectura recomendada: cola central

```
Booths → Backend (cola) → Worker (max 50 simultáneos) → fal.ai (5 keys, round-robin)
```

- **Cola:** almacena todas las solicitudes.
- **Worker:** saca tareas y las envía a fal.ai sin superar 50 simultáneas.
- **5 keys:** round-robin para repartir la carga.
- **429:** reintento o reencolado; el usuario no ve errores crudos.

---

## 9. UX sugerida

- Diseñar la UI asumiendo **~40 s** de procesamiento.
- Mensajes claros: "Tu imagen estará lista en aproximadamente 40 segundos".
- Flujo controlado: el usuario (ej. Bety) permanece en el booth hasta recibir su imagen.

---

## 10. Especificaciones finales

| Parámetro | Valor |
|-----------|-------|
| Proveedor | fal.ai |
| Modelo | fal-ai/bytedance/seedream/v4.5/edit |
| API keys | 4–5 cuentas |
| Concurrentes máximos | 50 |
| Tiempo por imagen | ~35–40 s |
| Throughput aproximado | ~90 imágenes/min |

---

## 11. Decisión final reafirmada (pre-Segmind)

- **Proveedor:** fal.ai (límites claros, control de cola, reintentos en worker).
- **Modelo:** Seedream 4.5 (consistencia de rostros, grupos, resolución 2K).
- **No se adopta** Nano Banana / Gemini 2.5 Flash: menor tiempo pero resultados no fiables con 2+ personas; validado con pruebas propias en Prompt Comparison Tool.
- **No se cambia a kie.ai** por ahora: posible ahorro y mayor throughput teórico, pero tiempos variables y cola interna opaca; se mantiene fal.ai hasta contar con pruebas de estrés propias si en el futuro se reabre la evaluación.

---

## 12. Pruebas de estrés Segmind (Seedream 4.5) — febrero 2026

Se realizó una evaluación de estrés específica del proveedor **Segmind**, que ofrece el mismo modelo **Seedream 4.5** (ByteDance) vía API REST, con el objetivo de contrastar límites y comportamiento frente a fal.ai y valorar si puede ser un proveedor principal o complementario para el negocio.

### 12.1 Objetivo de las pruebas

- **Aclarar límites reales:** La documentación de Segmind mencionaba 50 RPM (requests por minuto) en plan Flexible; se quería verificar si el límite se aplicaba en la práctica y cómo.
- **Comparar con fal.ai:** fal.ai tiene 10 solicitudes **concurrentes** por API key (429 al superar). Segmind podía tener límite por **rate** (RPM) y/o concurrencia; había que medir ambos.
- **Criterio de éxito:** Que las solicitudes fueran **aceptadas** (no 429 por throttling). Fallos por contenido (p. ej. moderación) se consideran aparte del límite de tasa.

### 12.2 Configuración de la prueba

| Elemento | Valor |
|----------|--------|
| **Proveedor** | Segmind |
| **Endpoint** | `https://api.segmind.com/v1/seedream-4.5` |
| **Autenticación** | Header `x-api-key: <API_KEY>` (no `Authorization: Bearer`; con Bearer la API devolvía 401) |
| **Imagen de referencia** | URL pública fija: `https://i.ibb.co/ns85znQV/pareja.jpg` (misma para todas las requests) |
| **Prompts** | Archivo `prompts_segmind_parejas.json` (extraídos del catálogo de prompts del producto; 70 prompts disponibles; cada request usa un prompt distinto) |
| **Timeout por request** | 120 s |
| **API key** | Una sola llave para todas las pruebas (sin rotación) |
| **Logs** | Cada script escribe un log exhaustivo (timestamp, índice, status, tiempo, tamaño de cuerpo, errores completos) en `docs/stress tests/` |

Los scripts utilizados son: `stress_test_segmind_burst.py` (burst) y `stress_test_segmind_rpm.py` (RPM). Ambos usan `urllib.request` (HTTP síncrono) y, en el caso RPM, `ThreadPoolExecutor` para enviar una request cada N segundos **sin esperar** la respuesta de la anterior, de modo que las solicitudes se disparan en el tiempo programado y las respuestas llegan en paralelo.

### 12.3 Prueba 1: Burst (concurrencia)

**Qué se mide:** Cuántas solicitudes **simultáneas** acepta la API con una sola llave antes de devolver 429.

**Metodología:**

- Se envían **30 requests en paralelo** (todas disparadas en un intervalo de ~1 s).
- Cada request es independiente: misma imagen, prompt distinto del JSON.
- No hay espaciado entre envíos; es el caso de pico máximo de concurrencia.
- Las respuestas llegan cuando el backend termina cada generación (~25–40 s); se registran status, tiempo de respuesta y tamaño del cuerpo.

**Resultados (log: `log_burst_segmind.txt`, 2026-02-26):**

| Métrica | Valor |
|---------|--------|
| Requests enviadas | 30 |
| Respuestas 200 OK | 30 |
| Respuestas 429 (throttling) | 0 |
| Otras fallidas | 0 |
| Tiempo total (wall clock) | 39,31 s |
| Tiempo por imagen (elapsed) | min 23,99 s — avg 29,64 s — max 37,68 s |

**Interpretación:** Con **una sola API key**, Segmind aceptó las 30 solicitudes concurrentes y respondió todas con 200. No hubo 429. En fal.ai, con una key el límite es 10 concurrentes y el resto reciben 429; aquí, con 1 key de Segmind se observó al menos 30 concurrentes aceptados.

### 12.4 Prueba 2: RPM (requests por minuto)

**Qué se mide:** Si la API aplica un límite por **cantidad de solicitudes iniciadas por minuto** (p. ej. 50 RPM documentados). Si el límite fuera estricto, al enviar más de 50 requests en 60 s se esperaría ver 429 a partir de cierto punto.

**Metodología:**

- Se envían **60 requests** en 60 segundos: **1 request cada 1 segundo** (envíos en t = 0, 1, 2, …, 59 s).
- Implementación: un pool de threads donde la request `i` espera `i` segundos y luego dispara la llamada HTTP; así los **envíos** están espaciados 1 s y no se espera a que termine la anterior (varias requests quedan en vuelo a la vez).
- Misma imagen, prompts distintos; timeout 120 s; una sola API key.
- Se registra para cada request: momento de envío, status de respuesta, tiempo hasta respuesta, cuerpo en caso de error.

**Resultados (log: `log_rpm_segmind.txt`, 2026-02-26):**

| Métrica | Valor |
|---------|--------|
| Requests enviadas | 60 (en ventana de 60 s) |
| Respuestas 200 OK | 59 |
| Respuestas 429 (throttling) | 0 |
| Otras fallidas | 1 (request #58) |
| Tiempo total (wall clock) | 98,10 s |
| Tiempo por imagen (elapsed, OK) | min 23,04 s — avg 30,42 s — max 77,00 s |

**Detalle del único fallo (request #58):**

- **Status:** 400 Bad Request (no 429).
- **Cuerpo de error:** `"ByteDance image API error: The request failed because the output image may contain sensitive information."`
- **Causa:** Moderación de contenido (el prompt asociado contenía escena “Dirty, blood-s…”). No es límite de tasa ni de concurrencia.
- **Conclusión para la prueba:** La prueba de **60 RPM con 1 llave** no recibió ningún 429; el límite documentado (50 RPM) no se manifestó como rechazo por throttling en este caso. El único fallo es atribuible a política de contenido del modelo, no al proveedor Segmind como rate limit.

### 12.5 Dependencias y limitaciones del experimento

- **Una sola API key:** Los resultados caracterizan el comportamiento con 1 llave. Si el límite es por cuenta/llave, 2–3 llaves podrían multiplicar capacidad (p. ej. 120–180 RPM teóricos).
- **Un solo endpoint y modelo:** Seedream 4.5 en `api.segmind.com`; no se probaron otros modelos ni regiones.
- **Carga sintética:** Misma URL de imagen y prompts de catálogo; no se simularon múltiples usuarios ni patrones reales de evento (p. ej. varios booths en paralelo), aunque el burst y el RPM cubren escenarios de pico.
- **Fecha de las pruebas:** Febrero 2026; límites y comportamiento pueden cambiar con el tiempo; conviene re-evaluar si el negocio depende críticamente del proveedor.

### 12.6 Resumen de resultados Segmind

| Prueba | Requests | 200 OK | 429 | Otros fallos | Conclusión |
|--------|----------|--------|-----|--------------|------------|
| Burst (30 en paralelo) | 30 | 30 | 0 | 0 | Acepta al menos 30 concurrentes con 1 key. |
| RPM (60 en 60 s) | 60 | 59 | 0 | 1 (400 contenido) | 60 RPM con 1 key sin throttling; fallo único por moderación. |

Con **una sola API key**, Segmind (Seedream 4.5) mostró mayor capacidad efectiva que **una key de fal.ai** (10 concurrentes, 429 al superar): aquí se observaron 30 concurrentes y 60 solicitudes en 1 minuto sin 429. Esto implica que, para el mismo nivel de estrés, Segmind puede requerir **menor número de llaves** que fal.ai para alcanzar o superar la capacidad objetivo (p. ej. 50 concurrentes).

---

## 13. Conclusión general: mejor proveedor para el negocio

El documento recorre la decisión de IA para el photo booth (modelo Seedream 4.5), la evaluación de proveedores (Replicate, fal.ai, kie.ai), la arquitectura con cola y rotación de API keys, y las pruebas de estrés recientes de **Segmind** con el mismo modelo. A continuación se sintetiza qué implica todo ello para la decisión de negocio.

### Criterios que han guiado la decisión

1. **Límites claros y predecibles:** Poder diseñar cola y workers sin sorpresas (429 o colas internas opacas).
2. **Capacidad por API key:** Cuantas menos llaves se necesiten para el throughput objetivo, menor operación y menor riesgo de rotación/gestión.
3. **Tiempos de respuesta estables:** ~30–40 s por imagen es aceptable si es consistente; variaciones muy altas (p. ej. 24–100 s) complican la UX.
4. **Control del flujo:** Reintentos y cola en nuestro lado (no depender de una cola interna no documentada del proveedor).
5. **Calidad del modelo:** Seedream 4.5 se mantiene como estándar por consistencia de rostros y grupos (sección 6); la comparación de proveedores es sobre **quién sirve ese modelo** mejor para el negocio.

### Resumen por proveedor (según este documento)

- **Replicate:** Descartado; pocas solicitudes aceptadas (5 de 30), capacidad total limitada con 5 keys (~25), límites poco claros.
- **kie.ai:** No adoptado por ahora; límites por rate no tan claros, tiempos variables en Seedream (hasta ~100 s en pruebas), cola interna opaca; posible ahorro no compensa sin pruebas de estrés propias.
- **fal.ai:** Elegido en el reporte original. Límite documentado (10 concurrentes por key), 429 al superar, tiempos ~32 s. Con 5 keys se alcanzan 50 concurrentes; requiere rotación de varias llaves y control estricto de concurrencia en el worker.
- **Segmind:** Evaluado en sección 12 con el mismo modelo (Seedream 4.5). Con **1 API key**: 30 concurrentes aceptados (burst) y 60 requests en 1 minuto (RPM) sin 429; único fallo en las pruebas fue 400 por moderación de contenido, no por rate limit. Mayor capacidad efectiva por llave que fal.ai en las pruebas realizadas.

### Conclusión: mejor proveedor para el negocio

- **Modelo:** **Seedream 4.5** sigue siendo la opción correcta para el producto (rostros, grupos, resolución); no se recomienda cambiar a Nano Banana/Gemini 2.5 Flash para el caso de uso actual.
- **Proveedor recomendado para capacidad y simplicidad operativa:** **Segmind** resulta, con los datos de este documento, la opción más favorable cuando se prioriza **capacidad por llave** y **menor dependencia de rotar muchas API keys**. Una sola llave mostró 30 concurrentes y 60 RPM sin 429; con 2–3 llaves se tendría margen amplio (equivalente o superior a 5 keys de fal.ai en concurrencia/RPM), con menos gestión de cuentas.
- **fal.ai** sigue siendo **válido y predecible** si ya está integrado: límites documentados, 429 claro, tiempos estables. La decisión de migrar o no a Segmind depende de: (1) comparativa de precios y condiciones comerciales Segmind vs fal.ai, (2) requisitos de SLA y soporte, (3) preferencia por reducir el número de llaves (Segmind) frente a mantener la arquitectura actual con fal.ai.
- **Recomendación práctica:** Si el negocio quiere **maximizar capacidad con menos llaves** y acepta evaluar precios y términos de Segmind, **Segmind es el mejor proveedor en base a las pruebas aquí documentadas**. Si se prefiere no cambiar de proveedor, **fal.ai con 5 keys y cola propia** sigue siendo una arquitectura sólida y ya decidida en este reporte. En ambos casos, el modelo a usar es **Seedream 4.5**.

---