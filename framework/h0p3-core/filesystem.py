import json

class FileSystem:
    def __init__(self, shell_interface):
        self.shell = shell_interface

    def list_directory(self, path="."):
        """
        Lista el contenido de un directorio y devuelve una representación estructurada.
        """
        # Usamos --time-style=long-iso para un formato de fecha consistente.
        output, _ = self.shell.run_command(f"ls -l --time-style=long-iso {path}")
        return self._parse_ls_output(output)

    def _parse_ls_output(self, ls_output):
        """
        Un parser para la salida de 'ls -l'.
        Convierte el texto en una cadena JSON de una lista de diccionarios.
        """
        parsed_list = []
        lines = ls_output.strip().split('\n')
        
        # Ignoramos la primera línea si es 'total X'
        if lines and lines[0].startswith('total'):
            lines = lines[1:]
        
        for line in lines:
            parts = line.split()
            if len(parts) < 8:
                continue  # Ignora líneas mal formadas o vacías
            
            file_info = {
                'permissions': parts[0],
                'links': int(parts[1]),
                'owner': parts[2],
                'group': parts[3],
                'size_bytes': int(parts[4]),
                'modified_date': f"{parts[5]} {parts[6]}",
                'name': " ".join(parts[7:])
            }
            parsed_list.append(file_info)
        
        # Devolvemos una cadena JSON formateada para una lectura clara.
        return json.dumps(parsed_list, indent=2)

    def read_file(self, filepath):
        """Lee el contenido de un archivo de texto."""
        output, _ = self.shell.run_command(f"cat {filepath}")
        return output

    def write_file(self, filepath, content):
        """Escribe contenido en un archivo (sobrescribe)."""
        # Escapamos comillas simples en el contenido para evitar errores en el shell
        safe_content = content.replace("'", "'\\''")
        command = f"echo '{safe_content}' > {filepath}"
        self.shell.run_command(command)
        return f"Contenido escrito en {filepath}"
