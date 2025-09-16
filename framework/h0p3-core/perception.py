import numpy as np
import cv2
import subprocess
import os

TMP_CAPTURE_PATH = "/dev/shm/h0p3_capture.png"

def get_roi_geometry():
    """Ejecuta 'slurp' para permitir al usuario seleccionar una región y devuelve la geometría."""
    try:
        # slurp devuelve la geometría en formato 'x,y widthxheight'
        result = subprocess.run(['slurp'], capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except Exception as e:
        print(f"[Slurp Error] No se pudo obtener la geometría de la región: {e}")
        return None

def get_frame_from_roi(geometry):
    """Captura un frame de una región específica usando la geometría de slurp."""
    if not geometry:
        return None
    try:
        # grim puede tomar la geometría directamente con el flag -g
        subprocess.run(["grim", "-g", geometry, TMP_CAPTURE_PATH], check=True, capture_output=True)
        frame = cv2.imread(TMP_CAPTURE_PATH)
        if os.path.exists(TMP_CAPTURE_PATH):
            os.remove(TMP_CAPTURE_PATH)
        return frame
    except Exception as e:
        print(f"[Perception Error] {e}")
        return None
