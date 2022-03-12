import logo from './logo.svg';
import hotSun from './sun-hot.gif'
import snowflakes from './snow-flakes.gif'
import './App.css';
import { React, useState, useEffect } from 'react'

//Components -------------------------------------------
function LocationDisplay(props) {
  return(
    <div className='LocationDisplay'>
        <p>Your latitude: {props.latitude}</p>
        <p>Your longitude: {props.longitude}</p>
    </div>
  )
}

function WeatherDisplay(props) {
  if(props.temp === 'ø') {
    return <p>Loading temp...</p>
  } else if(props.tempUnits === 'C') {
    return <p>Temperature: {props.temp}ºC</p>
  } else {
    return <p>Temperature: {props.temp}ºF</p>
  }
}

function ImageDisplay(props) {
  if(props.temp !== "ø") {
    return props.temp >= 20 ? (
      <img src={hotSun} className="Hot-Sun-Gif" alt= "Hot-Sun-Gif" />
    ) : (
      <img src={snowflakes} className="Snowflake-Gif" alt= "Snowflake-Gif" />
    )
  } else {
    return <img src={logo} className="App-logo" alt="logo" />
  }
}


// App -------------------------------------------------
function App() {
  const [latitude, setLatitude] = useState("Loading Latitude...")
  const [longitude, setLongitude] = useState("Loading Longitude...")
  const [temperature, setTemperature] = useState("ø")
  const [units, setUnits] = useState('C')

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = Math.floor(position.coords.latitude)
      const long = Math.floor(position.coords.longitude)
      // console.log(lat, long)
      setLatitude(lat)
      setLongitude(long)
    })
  }

  if (temperature === 'ø' && !(latitude === "Loading Latitude...") && !(longitude === "Loading Longitude...")) {
      fetch(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setTemperature(data.main.temp)
      })
      .catch(error => console.log(error))
  } else {
    // console.log('Not entering conditional yet')
  }

  return (
    <div className="App">
      <header className='App-header'>
        <h1>Sweet Mike's Weather App</h1>
      </header>
      <body className="App-body">
        <ImageDisplay temp={temperature} />
        <LocationDisplay latitude={latitude} longitude={longitude} />
        <WeatherDisplay temp={temperature} tempUnits={units}/>
        {!(temperature === 'ø') ? (
          <button type='submit' onClick={() => {
            if (units === 'C') {
              setUnits('F')
              setTemperature(prevTemperature => (prevTemperature*9/5)+32)
              // console.log(temperature)
            } else {
              setUnits('C')
              setTemperature(prevTemperature => (prevTemperature-32)*5/9)
              // console.log(temperature)
            }
          }}>Change temperature to º{units === 'C' ? 'F' : 'C'}</button>
        ) : <></>}
      </body>
    </div>
  );
}

export default App;
