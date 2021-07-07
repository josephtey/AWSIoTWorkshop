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

function GreenGrass() {
  mqttClient.on('connect', () => {
    console.log('mqttClient connected')
    mqttClient.subscribe('ml/dlr/object-detection')
  });

  mqttClient.on('error', (err) => {
    console.log('mqttClient error:', err)
  });

  const [detections, setDetections] = useState([])

  useEffect(() => {
    mqttClient.on('message', (topic, payload) => {
      console.log(JSON.parse(payload.toString()))

      setDetections([...detections, JSON.parse(payload.toString())])
    });
  }, [detections])


  return (
    <Card>
      <h2>IoT Core + Greengrass</h2>

      {detections.map(currentDetection => {
        return (
          <Detection>
            <b>Objects Detected: </b>
            <ul>
              {currentDetection['inference-results'].map((detection, i) => {
                return (
                  <li key={i}>
                    {detection.Label}: <b>{detection.Score}</b>
                  </li>
                )
              })}
            </ul>
          </Detection>
        )
      })}

    </Card>

  )
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

export default GreenGrass;
