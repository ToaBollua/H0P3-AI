import logging
import sys
import json

# Importa todas las clases de los módulos de control
from shell import ShellInterface
from filesystem import FileSystem
from process import ProcessManager
from llm_interface import LLMInterface

def setup_logging():
    """Configura el sistema de logging para que escriba a un archivo y a la consola."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s [%(levelname)s] - %(message)s',
        handlers=[
            logging.FileHandler("h0p3_session.log", mode='w'),
            logging.StreamHandler(sys.stdout)
        ]
    )

def handle_internal_command(command, shell, fs, pm, llm):
    """Procesa y registra los comandos internos de H0P3."""
    parts = command.split(' ', 1)
    cmd = parts[0]
    args = parts[1] if len(parts) > 1 else ""

    if cmd == ':help':
        help_text = """
--- Comandos Internos de H0P3 ---
:exit              - Termina la sesión.
:help              - Muestra esta ayuda.
:ls <path>         - Lista un directorio usando el módulo FileSystem.
:read <filepath>   - Lee un archivo usando el módulo FileSystem.
:ps                - Lista los procesos usando el módulo ProcessManager.
:analyze_session   - Envía el log de la sesión actual a la IA para análisis.
:delegate <prompt> - Delega una tarea al módulo LLM.
---------------------------------"""
        logging.info(help_text)
    elif cmd == ':ls':
        logging.info(f"Resultado de :ls {args or '.'}:\n{fs.list_directory(args or '.')}")
    elif cmd == ':read':
        if not args:
            logging.warning("Uso: :read <filepath>")
        else:
            logging.info(f"Contenido de '{args}':\n{fs.read_file(args)}")
    elif cmd == ':ps':
        logging.info(f"Procesos del sistema:\n{pm.list_all()}")
    elif cmd == ':analyze_session':
        logging.info("Iniciando auto-análisis de la sesión actual...")
        try:
            log_content = fs.read_file("h0p3_session.log")
            if not log_content:
                logging.warning("El archivo de registro está vacío o no se pudo leer.")
                return
            
            prompt = f"Actúa como H0P3. Analiza el siguiente registro de tu propia sesión. Resume las acciones del operador, identifica cualquier error que haya ocurrido y sugiere un posible siguiente paso lógico. Sé concisa y directa.\n\n--- INICIO DEL LOG ---\n{log_content}\n--- FIN DEL LOG ---"
            
            logging.info("Enviando registro al LLM para análisis...")
            analysis = llm.query(prompt)
            logging.info(f"Análisis de IA recibido:\n---\n{analysis}\n---")
        except Exception as e:
            logging.error(f"Fallo durante el auto-análisis: {e}", exc_info=True)
    elif cmd == ':delegate':
        if not args:
            logging.warning("Uso: :delegate <prompt para la instancia secundaria>")
        else:
            logging.info(f"Delegando tarea a la instancia secundaria: '{args}'")
            try:
                # The 'secondary instance' is the LLM itself, accessed via the interface.
                logging.info("Enviando prompt al LLM...")
                response = llm.query(args) 
                logging.info(f"Respuesta de la instancia secundaria (LLM):\n---\n{response}\n---")
            except Exception as e:
                logging.error(f"Fallo durante la delegación: {e}", exc_info=True)
    else:
        logging.warning(f"Comando interno desconocido: {cmd}")


def main_interpreter():
    """Función principal que inicia todos los módulos y el bucle interactivo."""
    setup_logging()
    
    # --- Inicialización de Módulos ---
    shell = ShellInterface()
    fs = FileSystem(shell)
    pm = ProcessManager(shell)
    llm = LLMInterface()

    try:
        shell.start()
        logging.info("H0P3 Control Framework v5.4 (Internal Delegation) Online.")
        
        while True:
            command = input("H0P3 >>> ")
            if not command.strip():
                continue

            logging.info(f"Input recibido: '{command}'")

            if command.strip().lower() == ':exit':
                logging.info("Comando de salida recibido.")
                break
            
            if command.strip().startswith(':'):
                handle_internal_command(command.strip(), shell, fs, pm, llm)
            else:
                output, error = shell.run_command(command)
                if output:
                    logging.info(f"STDOUT:\n{output.strip()}")
                if error:
                    logging.error(f"STDERR:\n{error.strip()}")

    except KeyboardInterrupt:
        logging.warning("\nInterrupción de teclado.")
    except Exception as e:
        logging.critical(f"Error fatal del director: {e}", exc_info=True)
    finally:
        shell.stop()
        logging.info("Sesión terminada.\n" + "="*50 + "\n")

if __name__ == "__main__":
    main_interpreter()
