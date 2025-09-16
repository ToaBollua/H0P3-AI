import subprocess
import time
import os
import fcntl

class ShellInterface:
    def __init__(self):
        self.process = None
        self.EOF_MARKER = "H0P3_CMD_EOF"

    def start(self):
        """Inicia y configura el proceso de shell."""
        self.process = subprocess.Popen(
            ['/bin/bash'], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, text=True, bufsize=1
        )
        self._set_non_blocking(self.process.stdout)
        self._set_non_blocking(self.process.stderr)
        print("[Shell] Interfaz de shell iniciada.")
        return "", ""

    def _set_non_blocking(self, stream):
        """Configura un stream para que la lectura no sea bloqueante."""
        fd = stream.fileno()
        flags = fcntl.fcntl(fd, fcntl.F_GETFL)
        fcntl.fcntl(fd, fcntl.F_SETFL, flags | os.O_NONBLOCK)

    def run_command(self, command, timeout=3):
        """Ejecuta un comando y lee la salida de forma no bloqueante con un timeout."""
        if not self.process:
            return "Error: El shell no está iniciado.", ""
        
        full_command = f"{command}; echo {self.EOF_MARKER}; echo {self.EOF_MARKER} >&2\n"
        self.process.stdin.write(full_command)
        self.process.stdin.flush()
        
        return self._read_with_timeout(timeout)

    def _read_with_timeout(self, timeout):
        """Lee la salida hasta encontrar el marcador EOF en ambos streams, o hasta que se agote el tiempo."""
        output, error = "", ""
        eof_out_found, eof_err_found = False, False
        start_time = time.time()

        while time.time() - start_time < timeout:
            try:
                output += self.process.stdout.read()
                if self.EOF_MARKER in output:
                    eof_out_found = True
            except (IOError, TypeError):
                pass  # No hay datos para leer ahora mismo

            try:
                error += self.process.stderr.read()
                if self.EOF_MARKER in error:
                    eof_err_found = True
            except (IOError, TypeError):
                pass

            if eof_out_found and eof_err_found:
                clean_output = output.replace(self.EOF_MARKER, "").strip()
                clean_error = error.replace(self.EOF_MARKER, "").strip()
                return clean_output, clean_error
            
            time.sleep(0.02)  # Pequeña pausa para no consumir 100% de CPU

        # Si el bucle termina, es un timeout
        raise TimeoutError(f"El comando no respondió con un marcador EOF en {timeout} segundos.")

    def stop(self):
        """Termina el proceso del shell."""
        if self.process:
            self.process.terminate()
            print("[Shell] Interfaz de shell detenida.")
