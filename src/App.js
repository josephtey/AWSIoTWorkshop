import React, { useState, useEffect } from 'react'
import AWS from 'aws-sdk'
import './App.css';
import styled from 'styled-components'
import IoTCore from './pages/iotcore'
import GreenGrass from './pages/greengrass'

AWS.config.region = process.env.REACT_APP_REGION;

function App() {

  return (
    <Container>
      <NavBar>
        AWS IoT
      </NavBar>
      <Content>
        <GreenGrass />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  background: #f2f2f2s;
  width: 100%;
`

const Content = styled.div`
  width: 1000px;
  margin: 25px auto;
  display: flex;
  gap: 20px;
`

const NavBar = styled.div`
  background: black;
  color: white;
  height: 80px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`

export default App;
