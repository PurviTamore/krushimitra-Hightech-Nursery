from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image
import pymongo
from datetime import datetime

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["krushimitra_db"]
detector_col = db["detector"] 

model = tf.keras.models.load_model('plant_model.h5')
with open('classes.txt', 'r') as f:
    CLASSES = [line.strip() for line in f.readlines()]

@app.route('/', methods=['GET'])
def home():
    return "🌱 Krushimitra AI Server is Online!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json['image']
        image_bytes = base64.b64decode(data.split(',')[1])
        img = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        prediction = model.predict(img_array)
        idx = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0]))
        clean_name = CLASSES[idx].replace('_', ' ').title()

        scan_entry = {
            "disease": clean_name,
            "confidence": f"{confidence * 100:.1f}%",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        detector_col.insert_one(scan_entry)
        if "_id" in scan_entry: del scan_entry["_id"]
        return jsonify(scan_entry)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/history', methods=['GET'])
def get_history():
    try:
        history = list(detector_col.find().sort("timestamp", -1))
        for item in history: item["_id"] = str(item["_id"])
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3003, debug=False)