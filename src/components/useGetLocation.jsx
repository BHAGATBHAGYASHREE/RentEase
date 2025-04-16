// GetLocation.jsx
import { useEffect, useState } from "react";

const useGetLocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to get the user's current location
        const getUserLocation = () => {
            if (navigator.geolocation) {
                // Check if geolocation is supported
                console.log("Requesting location...");
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("Location hello:", {
                            latitude,
                            longitude,
                        });
                        setLocation({ latitude, longitude });
                    },
                    (error) => {
                        console.error("Error getting user location:", error);
                        setError(error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setError(new Error("Geolocation not supported"));
            }
        };

        // Call the function to get location on component mount
        getUserLocation();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return { location, error }; // Return the location and any error that occurred
};

export default useGetLocation;
