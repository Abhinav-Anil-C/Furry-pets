from fastapi import FastAPI
from pydantic import BaseModel
import base64
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

model = tf.keras.models.load_model("dog_emotion_model.keras")

class ImageData(BaseModel):
    image: str

class SaveData(BaseModel):
    image: str
    behavior: str
    confidence: float
    description: str


@app.post("/api/behavior/analyze")
def analyze_behavior(data: ImageData):

    base64_data = data.image.split(",")[1]
    img_bytes = base64.b64decode(base64_data)

    img = Image.open(BytesIO(img_bytes)).resize((224, 224))
    img = np.expand_dims(np.array(img) / 255.0, axis=0)

    prediction = model.predict(img)[0]
    label_index = np.argmax(prediction)
    confidence = round(float(prediction[label_index] * 100), 2)

    labels = [ "Angry", "Happy", "Relaxed", "Sad"]
    behavior = labels[label_index]

    return {
        "result": {
            "behavior": behavior,
            "confidence": confidence,
            "emoji": "🐶",
            "description": f"The dog appears {behavior.lower()}."
        }
    }


##@app.get("/api/behavior/history")
#def history():
 #   return {"detections": []}   # For now empty


#@app.post("/api/behavior/save")
#def save_behavior(data: SaveData):
#    return {
#        "message": "Saved",
#        "detection": data
 #   }