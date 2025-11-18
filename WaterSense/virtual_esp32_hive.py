# virtual_esp32_hive.py
import paho.mqtt.client as mqtt
import random
import time

BROKER = "2abdfc2a249344dcaaf756c6f1be5ba5.s1.eu.hivemq.cloud"
PORT = 8883
USERNAME = "watersense"
PASSWORD = "Ani123@@"

client = mqtt.Client()
client.tls_set()                  # HiveMQ serverless requires TLS
client.username_pw_set(USERNAME, PASSWORD)
client.connect(BROKER, PORT, 60)

print("Connected to HiveMQ. Publishing to topics: watersense/ph, turb, temp, tds")

try:
    while True:
        ph = round(random.uniform(6.0, 9.0), 2)
        turb = random.randint(5, 40)
        temp = random.randint(20, 32)
        tds = random.randint(100, 450)

        client.publish("watersense/ph", ph)
        client.publish("watersense/turb", turb)
        client.publish("watersense/temp", temp)
        client.publish("watersense/tds", tds)

        print("Published →", ph, turb, temp, tds)
        time.sleep(1)   # 1 second cadence (MQTT allows this)
except KeyboardInterrupt:
    print("Stopping publisher")
    client.disconnect()
