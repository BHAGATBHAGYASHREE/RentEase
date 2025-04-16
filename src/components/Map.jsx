import React, { useState, useEffect, useCallback } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from "@react-google-maps/api";
import styles from "./Map.module.css"; // Import the CSS module
import useGetLocation from "./useGetLocation";
import CarMatch from "./CarMatch";

// Define the libraries outside of the component
const MAP_LIBRARIES = ["places"];

function Map(props) {
    const { location } = useGetLocation();

    // Provide default coordinates in case location is not yet available
    const defaultCenter = {
        lat: location?.latitude || 0,
        lng: location?.longitude || 0,
    };

    const [center, setCenter] = useState(defaultCenter);
    const [map, setMap] = useState(null);
    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [zoom, setZoom] = useState(16);
    const [time, setTime] = useState("");

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCi7wvXEC0r0td0KSSoeXzJNrUv5fYMNgw", // Replace with your actual API key
        libraries: MAP_LIBRARIES,
    });

    useEffect(() => {
        if (location) {
            setCenter({
                lat: location.latitude,
                lng: location.longitude,
            });
        }
    }, [location]);

    useEffect(() => {
        if (props.origin && isLoaded && !props.chat) {
            const directionsService = new google.maps.DirectionsService();
            directionsService
                .route({
                    origin: props.origin,
                    destination: props.destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((results) => {
                    setDirectionResponse(results);
                    setTime(results.routes[0].legs[0].duration.text);
                    setDistance(results.routes[0].legs[0].distance.text);
                    setDuration(results.routes[0].legs[0].duration.value);
                    setTime(results.routes[0].legs[0].duration.text);
                })
                .catch((error) => {
                    console.error("Error fetching directions:", error);
                });
        }
    }, [isLoaded, props.origin, props.destination, props.chat]);

    // Effect to clear the route data when props.chat changes to true
    useEffect(() => {
        if (props.chat) {
            clearRoute();
        }
    }, [props.chat]);

    const clearRoute = useCallback(() => {
        setDistance("");
        setDuration("");
        setDirectionResponse(null);
        setTime("");
    }, []);

    const centerPosition = useCallback(() => {
        if (map && center.lat && center.lng) {
            map.panTo(center);
            setZoom(16);
        }
    }, [map, center]);

    if (!isLoaded || !location) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={styles.frame}>
                <GoogleMap
                    center={center}
                    zoom={zoom}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    <Marker position={center} />
                    {directionResponse && !props.chat && (
                        <DirectionsRenderer directions={directionResponse} />
                    )}
                </GoogleMap>
            </div>
            <div className={styles.btns}>
                <div className={styles.dis}>
                    <p>Duration: {time}</p>
                    <p>Distance: {distance}</p>
                </div>
                <div className={styles.btns1}>
                    <button onClick={clearRoute}>Clear</button>
                    <button onClick={centerPosition}>Center</button>
                </div>
            </div>
            <div className={styles.carData}>
                {distance !== "" && duration !== "" && !props.chat && (
                    <CarMatch
                        distance={distance}
                        duration={duration}
                        people={props.people}
                        budget={props.budget}
                        newChat={props.chat}
                    />
                )}
            </div>
        </>
    );
}

export default Map;
