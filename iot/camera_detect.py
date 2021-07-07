import time
from picamera import PiCamera
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import matplotlib.image as mpimg
import boto3

myMQTTClient = AWSIoTMQTTClient("JoeClientID") #random key, if another connection using the same key is opened the previous one is auto closed by AWS IOT
myMQTTClient.configureEndpoint("art4t81snbtl1-ats.iot.ap-southeast-2.amazonaws.com", 8883)
myMQTTClient.configureCredentials("./root-ca.pem", "./private.pem.key", "./certificate.pem.crt")
myMQTTClient.configureOfflinePublishQueueing(-1) # Infinite offline Publish queueing
myMQTTClient.configureDrainingFrequency(2) # Draining: 2 Hz
myMQTTClient.configureConnectDisconnectTimeout(10) # 10 sec
myMQTTClient.configureMQTTOperationTimeout(5) # 5 sec

print("Initiating IoT Core Topic ...")
myMQTTClient.connect()

client = boto3.client('rekognition',aws_access_key_id='AKIAZPWAHHEP53P67REB',aws_secret_access_key='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',region_name='ap-southeast-2')
camera = PiCamera()
camera.rotation = 180

while True:
	with open('/home/pi/AWSIoT/image.jpg', mode='rb') as file:

		# Take photo
		camera.capture('/home/pi/AWSIoT/image.jpg')

		# Use Rekognition to detect objects
		response = client.detect_labels(
			Image = {'Bytes': file.read()}
		)

		# Publish to topic
		myMQTTClient.publish(
        		topic="ml/predictions",
        		QoS=1,
        		payload=str(response)
		)
		print("Captured image and sent to IoT Core")

	time.sleep(0.5)