import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AWSIoTData from 'aws-iot-device-sdk';

const mqttClient = AWSIoTData.device({
  region: process.env.REACT_APP_REGION,
  host: process.env.REACT_APP_MQTT_ENDPOINT,
  protocol: 'wss',
  maximumReconnectTimeMs: 8000,
  debug: false,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretKey: process.env.REACT_APP_SECRET_KEY
});

function IoTCore() {
  mqttClient.on('connect', () => {
    console.log('mqttClient connected')
    mqttClient.subscribe('ml/iot')
  });

  mqttClient.on('error', (err) => {
    console.log('mqttClient error:', err)
  });

  const [detections, setDetections] = useState([])

  useEffect(() => {
    mqttClient.on('message', (topic, payload) => {
      const newPrediction = JSON.parse(payload.toString().replace(/'/g, '"'))
      setDetections([...detections, newPrediction])
    });
  }, [detections])

  return (
    <Card>
      <h2>IoT Core + Rekognition</h2>

      {detections.map((currentDetection, index) => {
        let currentdate = new Date();
        let datetime = "Time: " + currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + " @ "
          + currentdate.getHours() + ":"
          + currentdate.getMinutes() + ":"
          + currentdate.getSeconds();

        return (
          <Detection
            key={index}
          >
            <u>{datetime}</u><br />

            <b>Objects Detected: </b>
            <ul>
              {currentDetection.Labels.length > 0 && currentDetection.Labels.map(item => {
                return (
                  <li>
                    {item.Name}: <b>{Math.round(item.Confidence)}%</b>
                  </li>
                )
              })}
            </ul>
          </Detection>
        )
      })}

    </Card>
  );
}

const Detection = styled.div`
  background: rgba(0,0,0,0.05);
  border-radius: 5px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`
const Card = styled.div`
  border-radius: 10px;
  background: white;
  box-shadow: 0 0 20px 5px rgba(0,0,0,0.1);
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100vh;
`

export default IoTCore;
