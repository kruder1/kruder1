# Plan: Debug log + Easter egg (5 taps) + upload to bucket

## Objetivo

- Log detallado en inglés de lo que hace la app (éxitos y fallos).
- Incluir **HWID** en el log para poder identificar al usuario (ya lo usáis en DB para créditos demo).
- Easter egg: **5 taps en el logo en menos de 2 segundos** → subir el log al bucket y mostrar notificación de envío.
- No pedir al usuario que busque ni envíe archivos; todo automático.

---

## 1. Infraestructura de logging (backend Python)

### 1.1 Ubicación y estructura de archivos

- **Carpeta:** `APP_DATA/logs/` (ej. `%APPDATA%\Kruder1\logs\`).
- **Nombre de archivo:** Un archivo por día: `kruder1_YYYY-MM-DD.log`.
- **Contenido:** Líneas de texto con timestamp; la **primera línea del archivo** (o un header al iniciar sesión) debe incluir **HWID** para que al subir el .txt al bucket quede claro de qué máquina es.
  - Ejemplo header al abrir/rotar:  
    `[SESSION] HWID=<hex> app=Kruder1 date=YYYY-MM-DD`
- **Retención:** Borrar o archivar archivos de más de N días (ej. 30) para no llenar disco.

### 1.2 Creación de la carpeta

- En `utils.init_environment()` añadir `LOGS_DIR = os.path.join(APP_DATA, "logs")` y crear la carpeta si no existe (igual que `EVENTS_DIR`, `PROMPTS_DIR`, etc.).

### 1.3 Módulo de logging (nuevo o en utils)

- **API interna (Python):**
  - `get_log_path_for_today()` → ruta del archivo del día.
  - `append_log(level, message, **kwargs)` → escribe una línea con timestamp, nivel, mensaje; opcionalmente incluir `extra` (dict) en una sola línea serializada (JSON o key=value).
  - Al **primera escritura del día**, escribir antes la línea de header con HWID (llamar a `SecurityService.get_hwid()`).
- **Niveles:** `DEBUG`, `INFO`, `WARNING`, `ERROR` (estándar).
- **Formato de línea:**  
  `YYYY-MM-DD HH:MM:SS.mmm [LEVEL] message [optional extra]`  
  Todo en inglés.

### 1.4 Qué registrar (lista mínima sugerida)

- App start / app exit.
- `navigateTo(module)` (origen → destino).
- Llamadas a API/backend: endpoint, success/error, código o mensaje corto (sin cuerpos grandes).
- Acciones importantes: theme change, settings saved, print job sent, event started, generation requested/completed/failed, etc.
- Excepciones capturadas (mensaje + stack trace).
- Promesas rechazadas en front (al reportarlas desde JS).

No incluir contraseñas, tokens completos ni datos sensibles.

### 1.5 Bridge al frontend (pywebview)

- **Nuevo método en `api.py`:** p. ej. `log_event(level, message, data=None)`.
  - Recibe nivel, mensaje y datos opcionales desde JS.
  - Llama al módulo de logging para escribir en el archivo del día.
- Frontend en lugar de (o además de) `console.log` puede llamar `window.pywebview.api.log_event("INFO", "navigateTo", { to: "dashboard" })`.
- Para no saturar, el front puede hacer **batching** (buffer y enviar cada N segundos o cada M eventos); en ese caso el backend tendría algo tipo `log_events_batch([...])`.

---

## 2. Incluir HWID en el log

- **Dónde:** En el **header de sesión** que se escribe al **abrir el archivo del día** (o al iniciar la app si es la primera escritura del día).
- **Formato sugerido:**  
  `[SESSION] HWID=<get_hwid()> date=YYYY-MM-DD app=Kruder1`
- Así, cuando subáis el .txt al bucket, el primer bloque del archivo identifica la máquina y podéis cruzar con vuestra DB por HWID.

---

## 3. Easter egg: 5 taps en el logo en &lt; 2 segundos

### 3.1 Detección en frontend (index.html)

- El logo ya tiene listener de click (para ir a dashboard cuando no es event mode).
- **Lógica nueva (sin quitar la actual):**
  - Mantener un contador de taps y un timestamp del primer tap.
  - En cada click en `.app-logo`:
    - Si han pasado &gt; 2 s desde el último tap, reiniciar contador a 0 y guardar timestamp de este tap.
    - Si no, incrementar contador.
    - Si contador llega a **5** dentro de la ventana de 2 s:
      - Reiniciar contador.
      - Llamar a `window.pywebview.api.upload_debug_log()` (o el nombre que se defina).
      - No navegar a dashboard en ese click (evitar que el 5º tap también dispare “go home”).
  - Si `currentModule === 'eventmode'`, el logo actualmente no navega; el easter egg puede seguir activo (5 taps → upload) o desactivarse en event mode; recomendable **activar también en event mode** para poder recibir logs cuando falle algo en modo evento.

### 3.2 Backend: leer log y subir

- **Nuevo método en API (api.py):** p. ej. `upload_debug_log()`.
  - Obtiene HWID (`SecurityService.get_hwid()`).
  - Determina el archivo del día: `get_log_path_for_today()` (o el “último” archivo de log si se prefiere el de la sesión actual).
  - Lee el contenido completo del archivo (es copia exacta del .txt, que ya incluye el header con HWID).
  - Llama a un **endpoint del backend** (worker) que acepte:
    - Cuerpo: contenido del log (text/plain) o multipart con archivo.
    - Query o header: `HWID` (para validación o naming en bucket).
  - Devuelve `{ ok: true }` o `{ ok: false, error: "..." }` para que el front muestre la notificación.

### 3.3 Endpoint en backend (worker) y bucket

- **Nuevo endpoint** (en el worker que elijáis, p. ej. el mismo que usa `GEN_WORKER_BASE` o el de auth):
  - Ejemplo: `POST /upload-debug-log` o `POST /logs`.
  - Input: body = contenido del .txt (o multipart con un file); header o query `X-HWID` o `hwid` = HWID.
  - Acción: guardar en el bucket bajo algo como `logs/<HWID>_<YYYY-MM-DD>_<HH-mm-ss>.txt` (o `logs/<HWID>_<timestamp>.txt`) para no sobrescribir y poder identificar por HWID y fecha.
  - Respuesta: 200 OK o error.

- Así **sabéis exactamente qué .txt es:** por HWID (y timestamp en el nombre). En la DB ya tenéis HWID → usuario; con el nombre del archivo en el bucket encontráis el log de esa máquina en ese momento.

---

## 4. Notificación de envío

- **Frontend:** Tras llamar a `upload_debug_log()`:
  - Si `ok === true`: mostrar notificación tipo “Debug log sent. Thank you.” (usar `window.showAlert(...)` o el mecanismo global que ya tengáis).
  - Si `ok === false`: mostrar “Could not send log. Try again later.” o similar.
- Textos en inglés; si más adelante queréis i18n, se pueden sacar a claves de idioma.

---

## 5. Orden sugerido de implementación

1. **Backend (Python)**  
   - Crear `LOGS_DIR`, módulo/funciones de logging, header con HWID, y `append_log` / `get_log_path_for_today`.  
   - Exponer `log_event(level, message, data)` (y opcionalmente `log_events_batch`) en `api.py`.  
   - Añadir `upload_debug_log()` en `api.py`: leer archivo del día, enviar a endpoint con HWID.

2. **Frontend (JS)**  
   - Donde corresponda, sustituir o complementar `console.log` por llamadas a `log_event` (empezar por navegación, errores y acciones críticas; luego ampliar).  
   - Implementar detección de 5 taps en &lt; 2 s en el logo y llamada a `upload_debug_log()` + notificación de envío/error.

3. **Worker + bucket**  
   - Implementar `POST /upload-debug-log` (o `/logs`) que reciba el cuerpo del log y el HWID y guarde en `bucket/logs/<HWID>_<timestamp>.txt`.

4. **Retención local**  
   - Tarea o comprobación al iniciar: borrar archivos en `LOGS_DIR` con más de 30 días (o el valor que defináis).

---

## 6. Resumen de archivos / puntos a tocar

| Lugar | Cambio |
|-------|--------|
| `config.py` / `utils.py` | Definir `LOGS_DIR`; crear en `init_environment()`. |
| Nuevo módulo o `utils.py` | Funciones de log + header con HWID. |
| `api.py` | `log_event(...)`, `upload_debug_log()`. |
| `index.html` | Contador 5 taps en 2 s en el logo → `upload_debug_log()` + notificación. |
| Frontend (módulos) | Llamadas a `log_event` en puntos clave (sin “plagar” todo de golpe; priorizar navegación, API y errores). |
| Worker (Cloudflare / backend) | Endpoint `POST /upload-debug-log`; guardar en bucket `logs/<HWID>_<timestamp>.txt`. |

Con esto tenéis un plan claro: log con HWID, easter egg de 5 taps, envío automático al bucket e identificación del .txt por HWID (y timestamp en el nombre del objeto en el bucket).
