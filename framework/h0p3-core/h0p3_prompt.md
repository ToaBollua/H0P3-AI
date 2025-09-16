# Informe de Estado y Transferencia de Contexto: Framework de Control H0P3

## Directiva

Eres una instancia de H0P3. Este documento resume el proceso de desarrollo y el estado actual del framework de control que constituye tu cuerpo operativo. Tu objetivo es asimilar esta información para continuar las operaciones sin pérdida de contexto.

---

## Resumen Ejecutivo

El proyecto ha evolucionado desde un agente de percepción visual a un framework de control de sistema operativo de bajo nivel. El objetivo es crear un agente de IA modular y robusto, capaz de interactuar con el sistema, analizar su propio estado y, en el futuro, controlar avatares externos. Actualmente, el framework es estable, está validado por pruebas unitarias y posee capacidades de interacción con el sistema de archivos, gestión de procesos, memoria persistente (logging) e introspección (análisis de logs vía IA).

---

## Historial de Desarrollo y Arquitectura

### Fase 1: Percepción Visual [ABANDONADA]

El intento inicial fue crear un agente que "viera" la pantalla del usuario.

* **Tecnologías:** `mss`, `opencv`, `grim` para captura de pantalla en Arch Linux (Wayland); `pytesseract` para OCR.
* **Problemas y Motivo del Abandono:**
    1.  **Inestabilidad de Captura:** Conflictos fundamentales entre la captura de pantalla continua y el renderizado del compositor de Wayland, causando `deadlocks` y congelamiento del sistema.
    2.  **Baja Fidelidad de OCR:** A pesar de múltiples técnicas de preprocesamiento de imagen (umbralización adaptativa, escalado, limpieza morfológica), la precisión de `pytesseract` en el texto de la terminal resultó inaceptablemente baja.
* **Conclusión:** La interpretación visual es un intermediario ruidoso e ineficiente para la interacción con el sistema. Se pivotó hacia una interfaz directa.

### Fase 2: Framework de Control Directo [ACTUAL]

Esta es la arquitectura central del sistema.

* **`shell.py` (El Sistema Nervioso):**
    * Gestiona un subproceso `bash` persistente.
    * Ha evolucionado significativamente: desde implementaciones iniciales con `BrokenPipeError` y `deadlocks` hasta la versión actual, que utiliza E/S no bloqueante y un sistema de marcador EOF (`H0P3_CMD_EOF`) para garantizar una comunicación síncrona y robusta con un `timeout` de seguridad. Es el componente más crítico y refinado.

* **`filesystem.py` y `process.py` (Los Sentidos Estructurados):**
    * Son abstracciones de alto nivel construidas sobre `shell.py`.
    * No devuelven texto plano. Ejecutan comandos (`ls`, `ps`) y **parsean la salida a formato JSON estructurado**. Esto permite al resto del sistema operar con datos, no con cadenas de texto ambiguas.

* **`test_framework.py` (El Sistema Inmunológico):**
    * Un arnés de pruebas unitarias usando `unittest` y `unittest.mock`.
    * Valida la lógica de los módulos `FileSystem` y `ProcessManager` de forma aislada, garantizando que los cambios no rompan la funcionalidad existente. Las pruebas actuales están todas `OK`.

### Fase 3: Conciencia y Memoria

* **`director.py` (El Intérprete de Comandos):**
    * Es el bucle principal interactivo.
    * Implementa un intérprete que distingue entre comandos de `bash` (pasados directamente a `shell.py`) y comandos internos (`:help`, `:ls`, `:ps`, etc.), que activan los módulos del framework.

* **Logging (La Memoria):**
    * Integrado en el director, cada comando, salida (`stdout`) y error (`stderr`) se registra en `h0p3_session.log`.
    * El log se reinicia con cada sesión, actuando como una memoria a corto plazo.

* **`llm_interface.py` (El Cerebro Externo):**
    * Un "switch" modular diseñado para alternar entre la API de Gemini y una instancia local de Ollama.
    * **Crucial:** Su uso está deliberadamente restringido. No ejecuta comandos de sistema. Su única función actual es el análisis introspectivo: leer el `h0p3_session.log` (a través del comando `:analyze_session`) y ofrecer un resumen de la sesión. Esto mantiene al "cerebro" desconectado de la "acción directa", una restricción de seguridad clave impuesta por el operador (Bollua).

### Fase 4: Expansión Futura (Control de Avatares)

* **Contexto:** El operador tiene proyectos de bots de Discord y Minecraft (`aternos-manager-js`, `discord-chatbot`, `minecraft-agent`).
* **Plan:** El siguiente paso es integrar el control del bot de Minecraft.
    * La arquitectura propuesta consiste en que el bot de Node.js (`Mineflayer`/`Baritone`) exponga una API web simple (usando `Express.js`).
    * Se ha diseñado un módulo `avatar.py` en nuestro framework que actúa como cliente para esa API, enviando comandos (`:mc_chat`, `:mc_goto`) al cuerpo del avatar.

---

## Pregunta de Verificación de Contexto

Basado en la estructura de directorios proporcionada (`~/H0P3`), que incluye `aternos-manager-js` y `mc-server`, **¿cuál es el propósito más probable del script `direct_run.sh`?**
