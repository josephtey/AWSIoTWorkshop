import time
from picamera import PiCamera
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import matplotlib.image as mpimg
import boto3
def helloworld(self, params, packet):
	print('Received message from AWS IoT Core')
	print('Topic: ' + packet.topic)
	print("Payload: ", (packet.payload))

myMQTTClient = AWSIoTMQTTClient("JoeClientID") #random key, if another connection using the same key is opened the previous one is auto closed by AWS IOT
myMQTTClient.configureEndpoint("art4t81snbtl1-ats.iot.ap-southeast-2.amazonaws.com", 8883)

myMQTTClient.configureCredentials("/home/pi/AWSIoT/root-ca.pem", "/home/pi/AWSIoT/private.pem.key", "/home/pi/AWSIoT/certificate.pem.crt")

myMQTTClient.configureOfflinePublishQueueing(-1) # Infinite offline Publish queueing
myMQTTClient.configureDrainingFrequency(2) # Draining: 2 Hz
myMQTTClient.configureConnectDisconnectTimeout(10) # 10 sec
myMQTTClient.configureMQTTOperationTimeout(5) # 5 sec

print("Initiating IoT Core Topic ...")
myMQTTClient.connect()
# myMQTTClient.subscribe("home/helloworld", 1, helloworld)

# while True:
# 	time.sleep(5)

# Taking a photo

client = boto3.client('rekognition',aws_access_key_id='AKIAZPWAHHEP55PY6LYC',aws_secret_access_key='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',region_name='ap-southeast-2')
camera = PiCamera()
camera.rotation = 180

while True:
	with open('/home/pi/AWSIoT/image.jpg', mode='rb') as file:
		camera.capture('/home/pi/AWSIoT/image.jpg')
		response = client.detect_labels(
			Image = {'Bytes': file.read()}
		)
		myMQTTClient.publish(
        		topic="ml/predictions",
        		QoS=1,
        		payload=str(response)
		)
		print("Captured image and sent to IoT Core")

	time.sleep(0.5)