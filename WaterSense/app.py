# app.py
from flask import Flask, jsonify, render_template
import paho.mqtt.client as mqtt

app = Flask(__name__, template_folder="templates", static_folder="static")

latest_data = {"ph": None, "turbidity": None, "temperature": None, "tds": None}

BROKER = "2abdfc2a249344dcaaf756c6f1be5ba5.s1.eu.hivemq.cloud"
PORT = 8883
USERNAME = "watersense"
PASSWORD = "Ani123@@"

def on_connect(client, userdata, flags, rc):
    print("MQTT connected with rc:", rc)
    client.subscribe("watersense/#")

def on_message(client, userdata, msg):
    topic = msg.topic
    payload = msg.payload.decode()
    # Map topics to latest_data keys
    if topic.endswith("/ph"):
        latest_data["ph"] = float(payload)
    elif topic.endswith("/turb"):
        latest_data["turbidity"] = float(payload)
    elif topic.endswith("/temp"):
        latest_data["temperature"] = float(payload)
    elif topic.endswith("/tds"):
        latest_data["tds"] = float(payload)

client = mqtt.Client()
client.tls_set()
client.username_pw_set(USERNAME, PASSWORD)
client.on_connect = on_connect
client.on_message = on_message
client.connect(BROKER, PORT, 60)
client.loop_start()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    return jsonify(latest_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

