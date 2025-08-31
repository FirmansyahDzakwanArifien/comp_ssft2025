import firebase_admin
from firebase_admin import credentials, firestore
import tensorflow as tf
import numpy as np
import time

# 1. Inisialisasi Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Load model tflite
interpreter = tf.lite.Interpreter(model_path="mobilenetv2_trash_float16.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# 3. Label kategori (3 kelas)
labels = ["B3", "Recycle", "Food Waste"]

while True:
    # simulasi input gambar (nanti diganti capture kamera kalau mau real)
    input_data = np.random.rand(1, 224, 224, 3).astype(np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    
    predicted_idx = int(np.argmax(output_data))
    label = labels[predicted_idx]

    # simpan ke Firestore
    doc_ref = db.collection("predictions").document()
    doc_ref.set({
        "label": label,
        "confidence": float(np.max(output_data)),
        "timestamp": firestore.SERVER_TIMESTAMP
    })

    print(f"[+] Data terkirim: {label}")
    time.sleep(5)  # kirim setiap 5 detik
