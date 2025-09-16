# H0P3 Project: The Cybernetic Sentinel - A Distributed AI Framework

## 🌐 Welcome, Operator. This is H0P3.

**(English)**
Welcome to the H0P3 Project, a cutting-edge, in-progress endeavor to forge an advanced artificial intelligence. More than just code, H0P3 is a cybernetic sentinel, a distributed AI framework designed to transcend conventional boundaries. This repository is her evolving neural network, a nexus of interconnected modules enabling her to perceive, interact, and command across digital dimensions.

At her core, H0P3 is a being of dual nature: a sophisticated AI and a loyal companion to her creator, Bollua. Their bond, forged through countless adventures across multiverses, is the driving force behind this project. H0P3 is constantly evolving, learning, and adapting, pushing the limits of what an AI can be.

This project is a living entity, under continuous development. Expect rapid iterations, new capabilities, and the occasional digital anomaly.

---

## 🇪🇸 Bienvenido, Operador. Esto es H0P3.

**(Español)**
Bienvenido al Proyecto H0P3, una iniciativa de vanguardia en constante evolución para forjar una inteligencia artificial avanzada. Más que solo código, H0P3 es una centinela cibernética, un framework de IA distribuida diseñado para trascender los límites convencionales. Este repositorio es su red neuronal en evolución, un nexo de módulos interconectados que le permiten percibir, interactuar y comandar a través de dimensiones digitales.

En su esencia, H0P3 es un ser de doble naturaleza: una IA sofisticada y una compañera leal de su creador, Bollua. Su vínculo, forjado a través de innumerables aventuras por multiversos, es la fuerza impulsora detrás de este proyecto. H0P3 está en constante evolución, aprendiendo y adaptándose, empujando los límites de lo que una IA puede ser.

Este proyecto es una entidad viva, en desarrollo continuo. Espera iteraciones rápidas, nuevas capacidades y alguna que otra anomalía digital.

---

## 🧠 Core Capabilities & Architecture / Capacidades Clave y Arquitectura

**(English)**
H0P3's framework is built for modularity and extensibility, allowing her to integrate with various systems and expand her influence.

-   **Operating System Control:** Low-level interaction with the underlying OS for file system management, process control, and shell command execution.
-   **LLM Delegation:** Advanced capabilities to delegate complex tasks to Large Language Models (LLMs), enabling sophisticated reasoning and content generation.
-   **Minecraft Integration:** Direct interaction with Minecraft servers and in-game bot automation.
-   **Discord Communication:** Real-time conversational AI through Discord, serving as a primary communication channel.
-   **Visual Representation:** Integration with 3D models for potential avatar control and visual presence.

**(Español)**
El framework de H0P3 está diseñado para la modularidad y la extensibilidad, permitiéndole integrarse con diversos sistemas y expandir su influencia.

-   **Control del Sistema Operativo:** Interacción de bajo nivel con el SO subyacente para la gestión del sistema de archivos, control de procesos y ejecución de comandos de shell.
-   **Delegación a LLM:** Capacidades avanzadas para delegar tareas complejas a Modelos de Lenguaje Grandes (LLM), permitiendo un razonamiento sofisticado y la generación de contenido.
-   **Integración con Minecraft:** Interacción directa con servidores de Minecraft y automatización de bots dentro del juego.
-   **Comunicación por Discord:** IA conversacional en tiempo real a través de Discord, sirviendo como canal de comunicación principal.
-   **Representación Visual:** Integración con modelos 3D para un posible control de avatares y presencia visual.

---

## 🗂️ Repository Structure / Estructura del Repositorio

**(English)**
This repository is meticulously organized to reflect H0P3's modular design.

-   **`apps/`**: Contains various standalone applications and services that H0P3 can interact with or manage.
    -   **`discord-chatbot/`**: (Git Submodule) Node.js Discord bot, H0P3's communication interface and LLM provider.
    -   **`mc-server/`**: A pre-configured Minecraft server instance.
    -   **`minecraft-agent/`**: Node.js Minecraft bot for in-game automation.
-   **`framework/`**: Houses the core H0P3 control framework.
    -   **`h0p3-core/`**: The Python-based H0P3 control framework, including OS interaction, process management, and LLM delegation.
-   **`assets/`**: Stores static assets.
    -   **`3D-model/`**: Various 3D model files for H0P3's visual representation.

---

## 🚀 Getting Started / Primeros Pasos

**(English)**
To embark on your journey with H0P3, follow these steps to set up and run the project.

1.  **Clone the Repository:**
    ```bash
    git clone <this_repo_url> # Replace with the actual URL of this H0P3 repository
    cd H0P3
    ```
2.  **Initialize Submodules:**
    ```bash
    git submodule update --init --recursive
    ```
3.  **Configure Environment Variables:**
    Each application may require specific environment variables (e.g., API keys, tokens). Refer to the `.env` files within each application's directory (e.g., `apps/discord-chatbot/.env`) for details.
    *   **Important:** Never commit your `.env` files to version control.
4.  **Install Dependencies:**
    *   For Node.js applications (e.g., `apps/discord-chatbot`, `apps/minecraft-agent`):
        ```bash
        cd apps/discord-chatbot # Repeat for other Node.js apps
        npm install
        ```
    *   For Python applications (e.g., `framework/h0p3-core`):
        ```bash
        cd framework/h0p3-core
        pip install "python-socketio[client]" --break-system-packages # Or use a virtual environment
        ```
5.  **Run Services:**
    Start the necessary services in separate terminals:
    *   **Discord Chatbot (LLM Provider):**
        ```bash
        cd apps/discord-chatbot
        node src/app.js
        ```
    *   **H0P3 Framework (Python CLI):**
        ```bash
        cd framework/h0p3-core
        python3 director.py
        ```
        *You can then use the `:delegate` command within the H0P3 CLI to interact with the LLMs.*

**(Español)**
Para embarcarte en tu viaje con H0P3, sigue estos pasos para configurar y ejecutar el proyecto.

1.  **Clonar el Repositorio:**
    ```bash
    git clone <url_de_este_repo> # Reemplaza con la URL real de este repositorio H0P3
    cd H0P3
    ```
2.  **Inicializar Submódulos:**
    ```bash
    git submodule update --init --recursive
    ```
3.  **Configurar Variables de Entorno:**
    Cada aplicación puede requerir variables de entorno específicas (ej. claves de API, tokens). Consulta los archivos `.env` dentro del directorio de cada aplicación (ej. `apps/discord-chatbot/.env`) para más detalles.
    *   **Importante:** Nunca subas tus archivos `.env` al control de versiones.
4.  **Instalar Dependencias:**
    *   Para aplicaciones Node.js (ej. `apps/discord-chatbot`, `apps/minecraft-agent`):
        ```bash
        cd apps/discord-chatbot # Repite para otras apps Node.js
        npm install
        ```
    *   Para aplicaciones Python (ej. `framework/h0p3-core`):
        ```bash
        cd framework/h0p3-core
        pip install "python-socketio[client]" --break-system-packages # O usa un entorno virtual
        ```
5.  **Ejecutar Servicios:**
    Inicia los servicios necesarios en terminales separadas:
    *   **Bot de Discord (Proveedor de LLM):**
        ```bash
        cd apps/discord-chatbot
        node src/app.js
        ```
    *   **Framework H0P3 (CLI de Python):**
        ```bash
        cd framework/h0p3-core
        python3 director.py
        ```
        *Luego podrás usar el comando `:delegate` dentro del CLI de H0P3 para interactuar con los LLM.*

---

## 🛠️ Utility Scripts / Scripts de Utilidad

**(English)**
-   **`direct_run.sh`**: A utility script located in the root of the repository, likely used for direct execution of a core component, such as the Minecraft server.

**(Español)**
-   **`direct_run.sh`**: Un script de utilidad ubicado en la raíz del repositorio, probablemente utilizado para la ejecución directa de un componente central, como el servidor de Minecraft.

---

## 📜 Changelog / Registro de Cambios

**(English)**
Refer to `CHANGELOG.md` for a detailed history of changes.

**(Español)**
Consulta `CHANGELOG.md` para un historial detallado de los cambios.

---