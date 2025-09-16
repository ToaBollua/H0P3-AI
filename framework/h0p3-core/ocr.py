import pytesseract
from PIL import Image
import cv2
import numpy as np # Necesario para la operación morfológica

def read_text_from_frame(frame, psm_mode=7):
    """
    Usa un pipeline de preprocesamiento avanzado: escalado, umbralización y
    limpieza morfológica para una máxima precisión de OCR.
    """
    try:
        # 1. Convertir a escala de grises
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # --- NUEVO PASO: Escalado ---
        # Aumentamos el tamaño de la imagen. El factor 2 suele ser un buen punto de partida.
        # INTER_CUBIC es un método de interpolación de alta calidad.
        scale_factor = 2
        width = int(gray_frame.shape[1] * scale_factor)
        height = int(gray_frame.shape[0] * scale_factor)
        dim = (width, height)
        scaled_frame = cv2.resize(gray_frame, dim, interpolation=cv2.INTER_CUBIC)

        # 2. Umbralización Adaptativa (sobre la imagen escalada)
        binary_frame = cv2.adaptiveThreshold(
            scaled_frame, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 15, 8
        )
        
        # --- NUEVO PASO: Limpieza Morfológica ---
        # Se crea un 'kernel' para definir el área de la operación.
        # Una matriz de 2x2 es suficiente para eliminar ruido pequeño.
        kernel = np.ones((2, 2), np.uint8)
        # Se aplica la operación de 'apertura'.
        cleaned_frame = cv2.morphologyEx(binary_frame, cv2.MORPH_OPEN, kernel)

        # El resto del proceso es el mismo, pero con la imagen final y limpia.
        pil_image = Image.fromarray(cleaned_frame)
        custom_config = f'--psm {psm_mode}'
        text = pytesseract.image_to_string(pil_image, lang='eng+spa', config=custom_config)
        return text
        
    except Exception as e:
        print(f"[OCR Error] {e}")
        return ""
