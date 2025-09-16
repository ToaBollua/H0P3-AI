import json

class ProcessManager:
    def __init__(self, shell_interface):
        self.shell = shell_interface

    def list_all(self):
        """Obtiene una lista de todos los procesos y la devuelve como JSON."""
        # Usamos -eo para especificar exactamente las columnas que queremos y en qué orden
        # Esto hace que el parseo sea mucho más fiable que con 'ps aux'
        command = "ps -eo pid,user,%cpu,%mem,comm"
        output, _ = self.shell.run_command(command)
        return self._parse_ps_output(output)

    def _parse_ps_output(self, ps_output):
        """Parsea la salida del comando 'ps -eo' a una estructura JSON."""
        parsed_list = []
        lines = ps_output.strip().split('\n')
        
        # Ignoramos la cabecera (PID USER %CPU %MEM COMMAND)
        if lines and lines[0].strip().startswith('PID'):
            lines = lines[1:]
            
        for line in lines:
            parts = line.strip().split(maxsplit=4)
            if len(parts) != 5:
                continue
            
            try:
                process_info = {
                    'pid': int(parts[0]),
                    'user': parts[1],
                    'cpu_percent': float(parts[2]),
                    'mem_percent': float(parts[3]),
                    'command': parts[4]
                }
                parsed_list.append(process_info)
            except ValueError:
                # Ignora líneas que no se puedan parsear correctamente
                continue
        
        return json.dumps(parsed_list, indent=2)

    def kill(self, pid):
        """Termina un proceso por su PID."""
        self.shell.run_command(f"kill -9 {pid}")
        return f"Señal KILL enviada al PID {pid}"
