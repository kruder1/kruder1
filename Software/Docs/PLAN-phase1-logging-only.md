# Plan Phase 1: Logging to .txt file only

Solo crear el archivo .txt con todo el log. Sin easter egg ni subida al bucket.

---

## 1. Objetivo

- Que el software escriba un archivo de log (`.txt`) con todo lo relevante que pase en la app (en inglés).
- El archivo debe crearse en una carpeta fija (AppData) y rotar por día.
- Incluir HWID en el log para poder identificar la máquina más adelante.
- No implementar aún: envío al bucket ni easter egg.

---

## 2. Dónde se guarda el log

- **Carpeta:** `APP_DATA/logs/`
  - En Windows: `%APPDATA%\Kruder1\logs\`
  - Misma base que el resto de datos de la app (settings, events, etc.).
- **Nombre del archivo:** Un archivo por día:  
  `kruder1_YYYY-MM-DD.txt`  
  (o `.log` si preferís; el plan usa `.txt` como comentaste.)
- **Creación de la carpeta:** Al arrancar la app, si `APP_DATA/logs` no existe, crearla (igual que ya se hace con `EVENTS_DIR`, `PROMPTS_DIR`, etc. en `init_environment()`).

---

## 3. Formato del archivo .txt

### 3.1 Primera escritura del día: línea de cabecera (con HWID)

En la **primera** vez que se escribe en el archivo de ese día, escribir primero una línea de “sesión” que incluya HWID y fecha. Ejemplo:

```
[SESSION] HWID=abc123...def date=2025-02-26 app=Kruder1
```

- `HWID`: resultado de `SecurityService.get_hwid()` (ya existe en `utils.py`).
- Así en el .txt queda identificada la máquina sin tocar el formato del resto de líneas.

### 3.2 Resto de líneas: una línea por evento

Formato por línea:

```
YYYY-MM-DD HH:MM:SS.mmm [LEVEL] message
```

Opcional: si hace falta más contexto, añadir al final datos extra en una sola línea (por ejemplo JSON compacto o `key=value`), evitando saltos de línea dentro del mensaje para que cada evento sea una línea.

- **Niveles:** `DEBUG`, `INFO`, `WARNING`, `ERROR` (estándar).
- **Idioma:** mensajes en inglés.
- **Ejemplos:**
  - `2025-02-26 14:32:01.123 [INFO] app_start`
  - `2025-02-26 14:32:02.456 [INFO] navigate_to from=auth to=dashboard`
  - `2025-02-26 14:33:00.789 [ERROR] api_failed endpoint=refresh_account error=timeout`

---

## 4. Cómo se escribe el log (backend Python)

### 4.1 Definir la ruta de logs en utils

- Añadir en `utils.py` (junto al resto de rutas):
  - `LOGS_DIR = os.path.join(APP_DATA, "logs")`
- En `init_environment()`:
  - Incluir `LOGS_DIR` en la lista de carpetas a crear si no existen.

### 4.2 Funciones de logging

Implementar en un módulo (nuevo, p. ej. `log_service.py`, o dentro de `utils.py` si preferís mantener todo junto):

1. **`get_log_path_for_today()`**  
   - Devuelve la ruta absoluta del archivo del día:  
     `os.path.join(LOGS_DIR, "kruder1_YYYY-MM-DD.txt")`  
   - Fecha = “hoy” en hora local.

2. **`append_log(level, message, extra=None)`**  
   - `level`: string, uno de `DEBUG`, `INFO`, `WARNING`, `ERROR`.  
   - `message`: string (en inglés).  
   - `extra`: opcional, dict; se serializa a una sola línea (ej. JSON o key=value) y se añade al final de la línea si se usa.  
   - Comportamiento:
     - Obtener ruta con `get_log_path_for_today()`.
     - Si el archivo **no existe**, escribir primero la línea de cabecera `[SESSION] HWID=... date=... app=Kruder1`.
     - Escribir la línea del evento con timestamp y nivel.  
   - Abrir el archivo en modo append (`"a"`, encoding utf-8), escribir la línea y cerrar (o usar with).  
   - Si falla (permisos, disco, etc.), no romper la app: capturar excepción y, si acaso, usar `logging` estándar o silenciar.

3. **Opcional: retención**  
   - Al iniciar la app (o en un punto único), listar archivos en `LOGS_DIR` y borrar los que tengan más de N días (ej. 30). Así el disco no se llena.

No hace falta usar el módulo `logging` de Python para el archivo de texto; puede ser escritura directa a fichero para tener control total del formato.

---

## 5. Cómo el frontend envía eventos al log

- El frontend (JS) no escribe directamente en disco; solo notifica al backend.
- En `api.py` (NativeApi) exponer un método, por ejemplo:
  - **`log_event(level, message, data=None)`**
  - Parámetros: `level` (string), `message` (string), `data` (opcional, objeto/dict).
  - Implementación: llamar a `append_log(level, message, extra=data)` (o equivalente) del módulo de logging.
- En el frontend, donde interese registrar algo:
  - `window.pywebview.api.log_event("INFO", "navigate_to", { to: "dashboard", from: "settings" });`
  - Para errores: `window.pywebview.api.log_event("ERROR", "api_failed", { endpoint: "...", error: "..." });`
- Si en el futuro hay muchos eventos, se puede añadir un `log_events_batch([...])` y hacer batching en JS; para esta fase puede ser una llamada por evento.

---

## 6. Qué registrar (lista para ir rellenando el .txt)

Criterio: cosas que ayuden a depurar “qué pasó” sin datos sensibles.

- **App:** inicio de app, cierre de app (si se puede capturar).
- **Navegación:** cada `navigateTo(module)` (origen y destino).
- **API / backend:** cada llamada al backend (login, get_settings, start_event_generation, etc.): al menos nombre/resumen y success vs error (y mensaje corto en error).
- **Acciones importantes:** cambio de tema, guardado de settings, envío de impresión, inicio de evento, solicitud de generación, resultado (éxito/fallo), etc.
- **Errores:** excepciones capturadas en Python (mensaje + stack trace en el log); promesas rechazadas en JS que se reporten vía `log_event("ERROR", ...)`.

No incluir: contraseñas, tokens completos, cuerpos grandes de peticiones/respuestas.

Se puede empezar con pocos puntos (app start, navigateTo, errores) y luego ir añadiendo más llamadas a `log_event` en los módulos.

---

## 7. Orden sugerido de implementación (solo logging)

1. **utils.py**  
   - Añadir `LOGS_DIR`.  
   - Incluir `LOGS_DIR` en `init_environment()`.

2. **Módulo de log (log_service.py o en utils)**  
   - Implementar `get_log_path_for_today()` y `append_log(level, message, extra=None)`.  
   - Escribir cabecera con HWID al crear el archivo del día.

3. **api.py**  
   - Añadir método `log_event(level, message, data=None)` que llame a `append_log`.

4. **main.py (o punto de arranque)**  
   - Tras `init_environment()`, llamar una vez a `append_log("INFO", "app_start")` para que se cree el archivo del día y quede la primera línea de sesión + primer evento.

5. **Frontend (index.html y módulos)**  
   - Donde se llama a `navigateTo`, añadir `log_event("INFO", "navigate_to", { to, from })`.  
   - En `catch` de promesas importantes, añadir `log_event("ERROR", ...)` con contexto.  
   - Ir ampliando según la lista anterior.

6. **Opcional**  
   - Retención: borrar archivos en `LOGS_DIR` con antigüedad > N días al iniciar.

---

## 8. Resumen

| Qué | Dónde |
|-----|--------|
| Carpeta de logs | `APP_DATA/logs/` |
| Archivo del día | `kruder1_YYYY-MM-DD.txt` |
| Cabecera (con HWID) | Primera línea del archivo del día |
| Formato de línea | `YYYY-MM-DD HH:MM:SS.mmm [LEVEL] message [extra]` |
| Escritura | Backend Python: `append_log(level, message, extra)` |
| Entrada desde JS | `window.pywebview.api.log_event(level, message, data)` |
| Contenido | App start/exit, navegación, API, acciones importantes, errores; todo en inglés; sin datos sensibles |

Con esto el software ya crea y mantiene el .txt con todo el log. La subida al bucket y el easter egg quedan para una fase siguiente.
