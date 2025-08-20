import axios from "axios";
import { useEffect, useState } from "react";

const Weather = () => {
    const [weather, setWeather] = useState({ i: "", w: "", t: "", h: "" });
    const [weatherTblCss, setWeatherTblCss] = useState({
        position: "fixed",
        width: 350,
        fontFamily: "americano",
        fontWeight: 900,
        color: "white",
        transition: "all 0.1s ease",
        top: -1000,
        left: -1000,
    });

    const getWeather = () => {
        axios
            .get(
                "https://api.openweathermap.org/data/2.5/weather?q=seoul&appid=baff8f3c6cbc28a4024e336599de28c4&units=metric&lang=kr"
            )
            .then((res) => {
                setWeather({
                    i: res.data.weather[0].icon,
                    w: res.data.weather[0].description,
                    t: res.data.main.temp,
                    h: res.data.main.humidity,
                });
                window._aqiFeed({
                    display:
                        "<span style='%style;font-size:12px;padding:5px;'>공기:%aqiv(%impact)</span>",
                    container: "city-aqi-container",
                    city: "seoul",
                    lang: "kr",
                });
            });
    };

    const moveWeather = (e) => {
        setWeatherTblCss({
            ...weatherTblCss,
            top: e.clientY + 10,
            left: e.clientX + 10,
        });
    };

    const preventPopup = (e) => {
        e.preventDefault();
        getWeather();
    };

    useEffect(() => {
        getWeather();
        document.addEventListener("contextmenu", preventPopup);
        document.addEventListener("mousemove", moveWeather);

        return () => {
            document.removeEventListener("contextmenu", preventPopup);
            document.removeEventListener("mousemove", moveWeather);
        };
    }, []);

    return (
        <table style={weatherTblCss}>
            <tr>
                <td align="center" style={{width:55}} rowSpan={3}>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.i}.png`}
                        alt=""
                    />
                </td>
                <td>{weather.w}</td>
            </tr>
            <tr>
                <td>
                    {weather.t}℃({weather.h}%)
                </td>
            </tr>
            <tr>
                <td>
                    <span id="city-aqi-container" />
                </td>
            </tr>
        </table>
    );
};

export default Weather;
