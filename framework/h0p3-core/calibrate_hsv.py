import cv2
import numpy as np
import subprocess
import os
import sys
import time

STATIC_CAPTURE_PATH = "/dev/shm/h0p3_static_capture.png"

def nothing(x):
    pass

# 1. CAPTURA ÚNICA
print("Iniciando captura de pantalla en 3 segundos...")
time.sleep(3) # Te da tiempo para preparar la pantalla
try:
    subprocess.run(["grim", STATIC_CAPTURE_PATH], check=True)
    print("Captura completada.")
except FileNotFoundError:
    print("Error fatal: 'grim' no está instalado. Ejecuta 'sudo pacman -S grim'.")
    sys.exit(1)

# 2. CARGAR LA IMAGEN CAPTURADA
frame = cv2.imread(STATIC_CAPTURE_PATH)
if frame is None:
    print("Error fatal: No se pudo leer la imagen capturada.")
    sys.exit(1)

hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

# 3. CONFIGURAR VENTANAS Y CONTROLES
cv2.namedWindow("HSV Controls")
cv2.imshow("Imagen Original", frame)

cv2.createTrackbar("H_min", "HSV Controls", 0, 179, nothing)
cv2.createTrackbar("S_min", "HSV Controls", 0, 255, nothing)
cv2.createTrackbar("V_min", "HSV Controls", 0, 255, nothing)
cv2.createTrackbar("H_max", "HSV Controls", 179, 179, nothing)
cv2.createTrackbar("S_max", "HSV Controls", 255, 255, nothing)
cv2.createTrackbar("V_max", "HSV Controls", 255, 255, nothing)

print("Herramienta de calibración iniciada.")
print("Ajusta los valores y presiona 'q' para salir.")

# 4. BUCLE DE CALIBRACIÓN (SOBRE LA IMAGEN ESTÁTICA)
while True:
    h_min = cv2.getTrackbarPos("H_min", "HSV Controls")
    s_min = cv2.getTrackbarPos("S_min", "HSV Controls")
    v_min = cv2.getTrackbarPos("V_min", "HSV Controls")
    h_max = cv2.getTrackbarPos("H_max", "HSV Controls")
    s_max = cv2.getTrackbarPos("S_max", "HSV Controls")
    v_max = cv2.getTrackbarPos("V_max", "HSV Controls")

    lower_bound = np.array([h_min, s_min, v_min])
    upper_bound = np.array([h_max, s_max, v_max])

    mask = cv2.inRange(hsv_frame, lower_bound, upper_bound)
    cv2.imshow("Mask - Calibración", mask)

    if cv2.waitKey(100) & 0xFF == ord('q'): # No necesitamos un refresco tan rápido
        break

# 5. LIMPIEZA
cv2.destroy
