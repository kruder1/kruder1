# Estandar para prompts del Photo Booth — Kruder1

---

## 1. Contexto

**Kruder1** es un software de photo booth con IA para Windows. El usuario sube una o mas fotos, elige un estilo por thumbnail, y el sistema genera una imagen transformada via **fal.ai** (modelo Seedream) en flujo image-to-image: imagen de referencia + prompt de texto = imagen resultante.

Este documento define como se construyen, organizan y categorizan los prompts.

---

## 2. Modelo del catalogo

| Aspecto | Valor |
|---------|-------|
| **Categorias** | 10 |
| **Prompts por categoria** | 21 (7 male + 7 female + 7 couple/group) |
| **Total de prompts** | 210 |
| **Idioma de los prompts** | Ingles |

Cada prompt es una **entrada completa e independiente**. No hay ensamblaje dinamico ni variantes. El usuario ve thumbnails y elige; el software envia el texto tal cual a fal.ai.

---

## 3. Las 10 categorias

| # | Categoria | Descripcion |
|---|-----------|-------------|
| 1 | **Superheroes** | Heroes y heroinas iconicos, trajes, escenas heroicas de alto impacto. |
| 2 | **High End Photography** | Retratos ultra-realistas de alta gama, editorial, lifestyle, moda. |
| 3 | **Cinema & TV** | Escenas y personajes inspirados en peliculas y series iconicas. |
| 4 | **3D Animation & Toon** | Avatares 3D, figuras coleccionables, mundos animados estilo Pixar/Disney. |
| 5 | **Sci-fi & Cyberpunk** | Estetica futurista, armaduras tech, neon, cyberpunk, robots. |
| 6 | **Fantasy & Mythology** | Dioses, criaturas miticas, mundos magicos, reinos de fantasia. |
| 7 | **Elite Sports & High Action** | Deportes extremos, motos, adrenalina, accion de alto impacto. |
| 8 | **Fine Art & Abstract** | Arte renacentista, conceptos abstractos, retratos artisticos, pintura. |
| 9 | **Gothic & Horror** | Terror, estetica gotica, Halloween, horror fashion, dark fantasy. |
| 10 | **Music & Pop Culture** | Rock stars, hip-hop royalty, pop icons, escenarios de concierto. |

---

## 4. Tipos de prompt por audiencia

Cada categoria tiene exactamente 3 tipos:

| Tipo | Codigo | Cantidad | Descripcion |
|------|--------|----------|-------------|
| **Individual masculino** | `male` | 7 por categoria | Prompt para 1 persona. Vestuario y estetica orientada a hombre. |
| **Individual femenino** | `female` | 7 por categoria | Prompt para 1 persona. Vestuario y estetica orientada a mujer. |
| **Pareja / Grupo** | `couple_group` | 7 por categoria | Prompt para 2 o mas personas. Incluye interaccion y preservacion de identidad multiple. |

**Nota importante:** Cualquier persona puede elegir cualquier prompt. Si un hombre elige un prompt femenino o viceversa, la IA se adaptara lo mejor posible. Si dos hombres eligen un prompt de pareja romantica, es su decision. El tipo es solo una guia para el thumbnail y la intencion del diseno.

---

## 5. Estructura estandar del texto del prompt

Cada prompt se construye con **secciones etiquetadas**. El orden puede variar pero estas son las secciones principales:

### 5.1 Secciones obligatorias

**Identity Preservation:**
- Siempre presente. Es la seccion mas importante.
- Inicia con `CRITICAL:` para enfatizar.
- Define que rasgos faciales, estructura osea y fisico deben mantenerse intactos.
- Para pareja/grupo: preservacion individual de CADA rostro.

**Theme & Action:** (o `Transformation & Theme:`)
- Describe el concepto general, la transformacion, la accion principal.
- Define la estetica, el mood, y lo que esta pasando en la escena.

**Wardrobe & Details:** (o `Wardrobe (Art Directed):`)
- Vestuario, accesorios, estilismo.
- Para prompts con transformacion completa: incluir `"Replace original clothing completely."`
- Ser especifico: colores, materiales, texturas, piezas exactas.

**Scene & Atmosphere:**
- Entorno, ubicacion, fondo, atmosfera.
- Define el espacio fisico y el mood ambiental.

**Lighting & Tech:**
- Especificaciones tecnicas de fotografia.
- Siempre incluir: resolucion, tipo de iluminacion, estilo de camara.

### 5.2 Secciones opcionales (segun el prompt)

| Seccion | Cuando usarla |
|---------|---------------|
| `Composition & Pose:` | Cuando la pose especifica es clave para el impacto. |
| `Props & Action:` | Objetos, armas, vehiculos, elementos interactivos. |
| `Special Effects:` | Fuego, rayos, magia, particulas, humo. |
| `Makeup & Details:` | Maquillaje detallado, tatuajes, detalles corporales. |
| `Companions / Co-Stars:` | Personajes secundarios, animales, celebridades. |
| `Background Elements:` | Elementos de fondo que requieren descripcion especifica. |

### 5.3 Formato de escritura

Usar secciones con **nombre en negrita markdown** seguido de dos puntos:

```
**Identity Preservation:** CRITICAL: The subject's facial features must remain...

**Theme & Action:** A powerful portrait of the subject as...

**Wardrobe & Details:** The subject wears...

**Scene & Atmosphere:** Set in...

**Lighting & Tech:** 8K resolution, cinematic lighting...
```

---

## 6. Reglas de construccion

### 6.1 Preservacion de identidad

- SIEMPRE incluir la seccion Identity Preservation con `CRITICAL:`.
- Para individual: `"The subject's facial features must remain 100% identical to the reference image."`
- Para pareja/grupo: `"Both subjects' facial features must remain 100% identical to the reference images."` o `"All subjects' facial features must remain..."`
- Nunca permitir: suavizado de piel artificial, modificaciones anatomicas, cambios de edad.
- Exigir: textura de piel natural, poros visibles, imperfecciones reales.

### 6.2 Contacto visual

- La mayoria de prompts deben pedir contacto visual con la camara: `"direct eye contact with the camera"` o `"intense eye contact"`.
- Excepciones validas: perfil artistico, mirada entre pareja, accion dinamica donde no aplica.

### 6.3 Vestuario

- Ser especifico en colores, materiales, y texturas.
- Incluir `"Replace original clothing completely."` cuando el concepto transforma al sujeto.
- Evitar descripciones vagas como "nice outfit" — siempre detallar piezas concretas.

### 6.4 Especificaciones tecnicas estandar

Incluir al menos estos elementos en Lighting & Tech:

| Elemento | Valores recomendados |
|----------|---------------------|
| Resolucion | `8K resolution` |
| Calidad | `ultra-realistic` / `hyperrealistic` / `DSLR quality` |
| Iluminacion | `cinematic lighting` + tipo especifico (Rembrandt, butterfly, rim light, etc.) |
| Lente | Especificar focal (85mm, 50mm, 35mm, etc.) y apertura (f/1.4, f/2.8, etc.) |
| Profundidad | `shallow depth of field` + `bokeh` cuando aplique |
| Texturas | `realistic skin textures`, `visible pores`, `fabric textures` |
| Restricciones | `No watermarks, no AI artifacts` |

### 6.5 Reglas para prompts de pareja/grupo

- Describir la **interaccion** entre las personas (abrazo, pose espalda con espalda, manos tomadas, etc.).
- Preservar identidad de **cada** persona individualmente.
- Usar `"The two people from the reference image"` o `"The subjects from the reference image"`.
- Definir vestuario para **cada** persona si es diferente.
- El encuadre debe ser mas amplio para acomodar multiples personas.

---

## 7. Conceptos que NO deben repetirse

Cada concepto dentro de una categoria debe ser **unico y diferente**. No se trata de hacer "el mismo personaje para hombre y para mujer". Se trata de **conceptos diferentes** que tengan estetica masculina, femenina, o de grupo.

Ejemplo correcto para Superheroes:
- Male: Spider-Man, Batman, Superman, Thor, Black Panther, Iron Man, Flash
- Female: Wonder Woman, Scarlet Witch, Storm, Catwoman, Supergirl, Black Widow, Captain Marvel
- Couple/Group: Avengers squad, Dynamic duo, Super-family, Justice League moment, etc.

Ejemplo INCORRECTO:
- Male: Spider-Man (version hombre)
- Female: Spider-Man (version mujer)
- Estos son el MISMO concepto con variante de genero. No queremos eso.

---

## 8. Objetivo final

Cada prompt debe lograr que el usuario quede **con la boca abierta** al ver su transformacion. Priorizar:

1. **Impacto visual inmediato** — que la imagen sea espectacular a primera vista.
2. **Reconocibilidad** — que el concepto sea identificable al instante.
3. **Preservacion de identidad** — que la persona se reconozca.
4. **Calidad fotografica** — que parezca real, no generado por IA.
5. **Shareability** — que la persona quiera compartirlo inmediatamente en redes sociales.

---

*Ultima actualizacion: febrero 2026.*
