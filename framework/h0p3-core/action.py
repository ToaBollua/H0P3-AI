from pynput.mouse import Button, Controller as MouseController

mouse = MouseController()

def move_mouse_to(x, y):
    """Mueve el cursor a las coordenadas absolutas (x, y)."""
    mouse.position = (int(x), int(y))

def click_left():
    """Ejecuta un click izquierdo en la posición actual del cursor."""
    mouse.click(Button.left, 1)
