import React, { useState, useEffect } from "react";
import styles from "./Weather.module.css";

const Weather = ({ city }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0559e4b1492eb6a62f490e2c6c3897e4&units=metric`
                );
                if (!response.ok) {
                    throw new Error("Error fetching weather data");
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [city]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    if (!weatherData) {
        return null;
    }

    const { name, main, weather, wind } = weatherData;
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const weatherDescription = weather[0].description;
    const icon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;

    return (
        <div className={styles.weatherCard}>
            <h2 className={styles.cityName}>{name}</h2>
            <img
                className={styles.weatherIcon}
                src={icon}
                alt={weatherDescription}
            />
            <div className={styles.weatherInfo}>
                <p className={styles.temperature}>
                    Temperature: {temperature}°C
                </p>
                <p className={styles.weatherDescription}>
                    {weatherDescription}
                </p>
                <p className={styles.humidity}>Humidity: {humidity}%</p>
                <p className={styles.windSpeed}>Wind Speed: {windSpeed} m/s</p>
            </div>
        </div>
    );
};

export default Weather;
