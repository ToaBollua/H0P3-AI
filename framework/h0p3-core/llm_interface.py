import os
import socketio
import threading

class LLMInterface:
    def __init__(self):
        # This is now a client for the Node.js service
        self.engine = "SOCKETIO_CLIENT"
        self.socket_url = "http://localhost:3000"
        self.sio = socketio.Client()
        self.response_received = threading.Event()
        self.response_data = None

        self._setup_handlers()

    def _setup_handlers(self):
        @self.sio.event
        def connect():
            print("[LLM_Interface] Conectado al servidor de sockets.")

        @self.sio.event
        def disconnect():
            print("[LLM_Interface] Desconectado del servidor de sockets.")

        @self.sio.on('response')
        def on_response(data):
            self.response_data = data.get('response')
            self.response_received.set() # Signal that response is received

    def query(self, prompt):
        try:
            self.sio.connect(self.socket_url)
            self.response_received.clear()
            self.response_data = None
            
            self.sio.emit('prompt', {'query': prompt})
            
            # Wait for the response event to be set, with a timeout
            got_response = self.response_received.wait(timeout=60) # 60-second timeout
            
            if not got_response:
                print("[LLM_Interface] Error: No se recibió respuesta del servidor de sockets en el tiempo esperado.")
                return "Error: Timeout esperando respuesta del servidor."

            return self.response_data

        except socketio.exceptions.ConnectionError as e:
            print(f"[LLM_Interface] Error de conexión: No se pudo conectar a {self.socket_url}. Asegúrate de que el servidor Node.js esté en ejecución.")
            print(f"Detalle: {e}")
            return "Error: No se pudo conectar al servicio de LLM."
        finally:
            if self.sio.connected:
                self.sio.disconnect()