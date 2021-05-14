import React, {useState, useEffect} from 'react'
import AWS from 'aws-sdk'
import AWSIoTData from 'aws-iot-device-sdk';
import './App.css';

const mqttClient = AWSIoTData.device({
  region: process.env.REACT_APP_REGION,
  host: process.env.REACT_APP_MQTT_ENDPOINT,
  protocol: 'wss',
  maximumReconnectTimeMs: 8000,
  debug: false,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretKey: process.env.REACT_APP_SECRET_KEY
});

AWS.config.region = process.env.REACT_APP_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID
});

mqttClient.on('connect', () => {
  console.log('mqttClient connected')
  mqttClient.subscribe('ml/predictions')
});

mqttClient.on('error', (err) => {
  console.log('mqttClient error:', err)
});

function App() {
  const [currentDetection, setCurrentDetection] = useState()
  
  useEffect(()=>{
    mqttClient.on('message', (topic, payload) => {
      setCurrentDetection(JSON.parse(payload.toString().replace(/'/g, '"')))
    });
  }, [])
  

  return (
    <div className="App">
      <h1>Camera Predictions</h1>
      <ul>
        {currentDetection && currentDetection.Labels.length > 0 && currentDetection.Labels.map(item => {
          return (
           <li>
            {item.Name}: <b>{Math.round(item.Confidence)}%</b>
           </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
