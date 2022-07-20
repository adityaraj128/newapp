import hotBg from "./images/hot.jpg";
import stormyBg from "./images/stormy.jpg";
import vhotBg from "./images/vhot.jpg";
import normalBg from "./images/normal.jpg";
import coldBg from "./images/cold.jpg";
import coolBg from "./images/cool.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Pune");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      // dynamic background
      //const strongwinds = units === "metric" ? 25 : 30;
      const cold = units === "metric" ? 10: 50;
      const cool = units === "metric" ? 11: 52
      const normal = units === "metric" ? 20: 68;
      const hot = units === "metric" ? 35: 95;
      const veryhot= units==="metric" ? 45: 113;
      if (data.temp <= cold) setBg(coldBg);
      if (data.temp<= cool) setBg(coolBg);
      else if (data.temp<normal) setBg(coolBg);
      else if (data.temp<hot) setBg(normalBg);
      else if (data.temp<veryhot) setBg(hotBg);
      else if (data.temp>=veryhot) setBg(vhotBg);
      else setBg(stormyBg);
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
