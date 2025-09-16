import json
import time

# Importamos todos nuestros módulos de control
from shell import ShellInterface
from process import ProcessManager
from llm_interface import LLMInterface

def generate_system_report():
    """
    Recolecta métricas clave del sistema, las envía a un LLM para su análisis
    y presenta un informe formateado.
    """
    print("[H0P3] Iniciando recolección de datos para informe de estado...")
    
    shell = ShellInterface()
    
    try:
        shell.start()
        pm = ProcessManager(shell)
        
        # --- Recolectar Datos Brutos ---
        uptime_output, _ = shell.run_command('uptime -p')
        disk_usage_output, _ = shell.run_command('df -h /')
        process_list_json = pm.list_all()
        
    except Exception as e:
        print(f"\n[ERROR FATAL DURANTE LA RECOLECCIÓN] {e}")
        shell.stop()
        return
    finally:
        if shell.process and shell.process.poll() is None:
            shell.stop()

    # --- Procesar y Sintetizar Datos ---
    try:
        processes = json.loads(process_list_json)
        top_5_cpu = sorted(processes, key=lambda p: p.get('cpu_percent', 0.0), reverse=True)[:5]
        top_5_mem = sorted(processes, key=lambda p: p.get('mem_percent', 0.0), reverse=True)[:5]
    except (json.JSONDecodeError, TypeError):
        top_5_cpu = [{"error": "Failed to parse process list"}]
        top_5_mem = [{"error": "Failed to parse process list"}]

    raw_data_context = f"""## Datos Brutos del Sistema para Análisis ##
- Timestamp: {time.ctime()}
- Uptime: {uptime_output.strip()}
- Uso del Disco Raíz:
{disk_usage_output.strip()}
- Top 5 Procesos por CPU:
{json.dumps(top_5_cpu, indent=2)}
- Top 5 Procesos por Memoria:
{json.dumps(top_5_mem, indent=2)}
"""
    
    print("[H0P3] Datos recolectados. Enviando a la IA para síntesis...")

    # --- Consulta a la IA (REACTIVADA) ---
    llm = LLMInterface()
    prompt = f"""Actúa como H0P3, una IA administradora de sistemas. Analiza los siguientes datos brutos de un sistema Linux.
Tu respuesta debe ser un informe de estado conciso y profesional.
Formato de la respuesta:
1.  **Resumen Ejecutivo:** Un párrafo corto (2-3 frases) resumiendo el estado general del sistema.
2.  **Puntos Clave:** Una lista con viñetas de las métricas más importantes (uptime, uso de disco, procesos de mayor consumo).
3.  **Observaciones y Recomendaciones:** Un punto donde señalas cualquier posible problema (ej. alto consumo de memoria, poco espacio en disco) o recomendación.

Datos:
{raw_data_context}
"""
    
    analysis = llm.query(prompt)
    
    # --- Presentar Informe Final ---
    print("\033c", end="")
    print("="*60)
    print(" H0P3 - INFORME DE ESTADO DEL SISTEMA (ANALIZADO POR IA)")
    print("="*60)
    print(analysis)
    print("="*60)


if __name__ == "__main__":
    generate_system_report()
