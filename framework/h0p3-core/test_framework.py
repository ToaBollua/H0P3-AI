import unittest
from unittest.mock import MagicMock
import json

from filesystem import FileSystem
from process import ProcessManager # Importar la nueva clase

class TestFileSystem(unittest.TestCase):
    # ... (esta clase se mantiene exactamente igual que antes) ...
    def setUp(self):
        self.mock_shell = MagicMock()
        self.fs = FileSystem(self.mock_shell)

    def test_read_file_success(self):
        test_content = "H0P3 system online."
        self.mock_shell.run_command.return_value = (test_content, "")
        result = self.fs.read_file("/test/file.txt")
        self.mock_shell.run_command.assert_called_with("cat /test/file.txt")
        self.assertEqual(result, test_content)

    def test_write_file_success(self):
        self.mock_shell.run_command.return_value = ("", "")
        filepath = "/tmp/test.log"
        content = "Test log entry."
        result = self.fs.write_file(filepath, content)
        expected_command = f"echo '{content}' > {filepath}"
        self.mock_shell.run_command.assert_called_with(expected_command)
        self.assertEqual(result, f"Contenido escrito en {filepath}")

    def test_list_directory_parsing(self):
        mock_ls_output = """total 8
-rw-r--r-- 1 nin nin 1143 2025-09-13 23:28 perception.py
drwxr-xr-x 2 nin nin 4096 2025-09-13 23:35 __pycache__"""
        self.mock_shell.run_command.return_value = (mock_ls_output, "")
        result_json = self.fs.list_directory(".")
        result_data = json.loads(result_json)
        self.mock_shell.run_command.assert_called_with("ls -l --time-style=long-iso .")
        self.assertEqual(len(result_data), 2)
        self.assertEqual(result_data[0]['name'], 'perception.py')

# --- NUEVA SUITE DE PRUEBAS ---
class TestProcessManager(unittest.TestCase):

    def setUp(self):
        self.mock_shell = MagicMock()
        self.pm = ProcessManager(self.mock_shell)

    def test_list_all_parsing(self):
        """Prueba que el parseo de la salida de 'ps' funciona."""
        # Configuración del Mock:
        mock_ps_output = """  PID USER      %CPU %MEM COMMAND
    1 root       0.3  0.0 /sbin/init
 9810 nin        0.0  0.2 python -m unittest
"""
        self.mock_shell.run_command.return_value = (mock_ps_output, "")

        # Ejecución:
        result_json = self.pm.list_all()
        result_data = json.loads(result_json)

        # Verificación:
        self.mock_shell.run_command.assert_called_with("ps -eo pid,user,%cpu,%mem,comm")
        self.assertEqual(len(result_data), 2)
        self.assertEqual(result_data[0]['pid'], 1)
        self.assertEqual(result_data[1]['command'], 'python -m unittest')
        self.assertEqual(result_data[0]['user'], 'root')

if __name__ == '__main__':
    unittest.main()
