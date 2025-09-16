import requests
import json

class AvatarInterface:
    def __init__(self, host="http://127.0.0.1:3000"):
        self.base_url = f"{host}/command"

    def send_command(self, action, params={}):
        """Envía un comando JSON al servidor del bot de Minecraft."""
        try:
            payload = {"action": action, "params": params}
            response = requests.post(self.base_url, json=payload, timeout=5)
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": str(e)}
