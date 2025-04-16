import React, { useState, useEffect, createContext, useRef } from "react";
import {
    Autocomplete,
    useJsApiLoader,
    GoogleMap,
    LoadScript,
} from "@react-google-maps/api";
import {
    differenceInHours,
    differenceInDays,
    isAfter,
    isBefore,
    isEqual,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import CarList from "../components/CarList";
import ReviewComponent from "../components/ReviewComponent";
import Marquee from "react-fast-marquee";
import Navbar from "../components/Navbar";
import Feature from "../components/Feature";
import Steps from "../components/Steps";
import CarRentalAd from "../components/CarRentalAd";
import FaqComponent from "../components/FaqComponent";
import Contact from "../components/Contact";
import AboutUs from "../components/AboutUs";
import OfferCarousel from "../components/OfferCarousel";
import {
    faMountainSun,
    faEarthAmericas,
    faFeather,
    faKey,
    faCertificate,
    faFileCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
export const HourContext = createContext();

const Home = () => {
    const [pickUpLocation, setPickUpLocation] = useState("");
    const [pickUpDateTime, setPickUpDateTime] = useState("");
    const [dropOffLocation, setDropOffLocation] = useState("");
    const [dropOffDateTime, setDropOffDateTime] = useState("");
    const [hoursDifference, setHoursDifference] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const autocompleteRef1 = useRef(null); // Ref for pickup location
    const autocompleteRef2 = useRef(null); // Ref for drop-off location

    const handlePlaceChanged1 = () => {
        if (autocompleteRef1.current) {
            const place = autocompleteRef1.current.getPlace();
            setPickUpLocation(place.formatted_address || place.name);
        }
    };

    const handlePlaceChanged2 = () => {
        if (autocompleteRef2.current) {
            const place = autocompleteRef2.current.getPlace();
            setDropOffLocation(place.formatted_address || place.name);
        }
    };

    const navigate = useNavigate();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCi7wvXEC0r0td0KSSoeXzJNrUv5fYMNgw", // Replace with your actual API key
        libraries: ["places"],
    });

    const slides = [
        {
            icon: faMountainSun,
            title: "Traveller Badge",
            description:
                "Get Traveller Badge on making maximum number of bookings.Specifically 15 bookings every month.Regular Users: 25% discount on 2 bookings.Premium Users: 25% discount on 5 bookings.Minimum 15 bookings in a month.Valid for bookings made in all over India.No minimum booking amount.",
        },
        {
            icon: faFeather,
            title: " Early Bird Badge",
            description:
                "Get Early Bird Badge by booking your rentals at least 30 days in advance for three consecutive months.Regular Users: 15% discount on 2 bookings.Premium Users: 15% discount on 5 bookings.30 days advance booking for three consecutive months.No minimum booking amount.Not applicable on bookings where fuel is included.",
        },
        {
            icon: faEarthAmericas,
            title: "Long Tripper Badge",
            description:
                "Get Long Tripper Badge awarded to users who rent a car for a week or more at least 5 times in a year.Regular Users: 20% discount on 2 bookings.Premium Users: 20% discount on 5 bookings.Rent for a week or more at least 5 times in a year.No minimum booking amount.Not applicable on bookings where fuel is included.",
        },
        {
            icon: faCertificate,
            title: "Gold Badge",
            description:
                "Regular Users: 500rs off on every rentals.Premium Users:720rs off on every rentals. Earn 10pts/hr on every SUV booking.Earn 6-7pts/hr on every Hatchbacks booking.Earn 7-8pts/hr on every Sedan booking.Earn 15-20pts on writing a customer review.Earn 5-8pts on sharing about rentease.",
        },
        {
            icon: faCertificate,
            title: "Silver Badge",
            description:
                " Regular Users: 250rs off on every rentals.Premium Users:520rs off on every rentals.Earn 10pts/hr on every SUV booking.Earn 6-7pts/hr on every Hatchbacks booking.Earn 7-8pts/hr on every Sedan booking.Earn 15-20pts on writing a customer review.Earn 5-8pts on sharing about rentease.",
        },
        {
            icon: faCertificate,
            title: "Bronze Badge",
            description:
                " Earn 3000 points or more.Regular Users: 120rs off on every rentals.Premium Users:300rs off on every rentals.Earn 10pts/hr on every SUV booking.Earn 6-7pts/hr on every Hatchbacks booking.Earn 7-8pts/hr on every Sedan booking.Earn 15-20pts on writing a customer review.Earn 5-8pts on sharing about rentease.",
        },
    ];
    useEffect(() => {
        if (isLoaded) {
            console.log("Google Maps API loaded:", isLoaded);
        }
    }, [isLoaded]);

    useEffect(() => {
        const currentDateTime = new Date().toISOString().slice(0, 16);
        setPickUpDateTime(currentDateTime);
        setDropOffDateTime(currentDateTime);

        fetchUsersData();

        // Inject Botpress scripts
        const injectScript = document.createElement("script");
        injectScript.src = "https://cdn.botpress.cloud/webchat/v2/inject.js";
        injectScript.async = true;
        document.body.appendChild(injectScript);

        const configScript = document.createElement("script");
        configScript.src =
            "https://mediafiles.botpress.cloud/eb6f4087-e0f4-45d7-a7ae-765b02aaf7bb/webchat/v2/config.js";
        configScript.async = true;
        document.body.appendChild(configScript);

        return () => {
            document.body.removeChild(injectScript);
            document.body.removeChild(configScript);
        };
    }, [isLoaded]); // Add isLoaded as a dependency

    const fetchUsersData = async () => {
        try {
            const response = await fetch("http://localhost:3000/users");
            if (response.ok) {
                const users = await response.json();
                const loggedInUser = users.find(
                    (user) => user.isLoggedIn === true
                );
                if (loggedInUser) {
                    setCurrentUser(loggedInUser);
                    setIsLoggedIn(true);
                    // Fetch and update bookings for the logged-in user
                    fetchAndUpdateBookings(loggedInUser.id);
                } else {
                    setIsLoggedIn(false);
                }
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchAndUpdateBookings = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/booking?userId=${userId}`
            );
            if (response.ok) {
                const bookings = await response.json();
                const currentDate = new Date();

                for (const booking of bookings) {
                    const rentalStartDate = new Date(booking.rental_start_date);
                    const rentalEndDate = new Date(booking.rental_end_date);

                    if (booking.status === "scheduled") {
                        if (isAfter(currentDate, rentalEndDate)) {
                            // Update status to completed
                            await updateBookingStatus(booking.id, "completed");
                        } else if (
                            (isAfter(currentDate, rentalStartDate) ||
                                isEqual(currentDate, rentalStartDate)) &&
                            (isBefore(currentDate, rentalEndDate) ||
                                isEqual(currentDate, rentalEndDate))
                        ) {
                            // Update status to running
                            await updateBookingStatus(booking.id, "running");
                        }
                    } else if (booking.status === "running") {
                        if (isAfter(currentDate, rentalEndDate)) {
                            // Update status to completed
                            await updateBookingStatus(booking.id, "completed");
                        }
                    }
                }
            } else {
                console.error("Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            console.log(`Updating booking ${bookingId} to status: ${status}`);
            const response = await fetch(
                `http://localhost:3000/booking/${bookingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                console.error("Failed to update booking status");
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    };

    const calculateHoursDifference = () => {
        if (pickUpDateTime && dropOffDateTime) {
            const pickUpDate = new Date(pickUpDateTime);
            const dropOffDate = new Date(dropOffDateTime);
            const diffHours = differenceInHours(dropOffDate, pickUpDate);
            setHoursDifference(diffHours);
        } else {
            setHoursDifference(null);
        }
    };

    const handleFindVehicle = async () => {
        if (isLoggedIn && currentUser) {
            calculateHoursDifference();

            // Generate a random booking ID
            const generateBookingId = () => {
                return Math.random().toString(36).substring(2, 9); // Random 7-character string
            };

            // Calculate rental start and end dates
            const rentalStartDate = pickUpDateTime.split("T")[0]; // Date portion of pickUpDateTime
            const rentalEndDate = dropOffDateTime.split("T")[0]; // Date portion of dropOffDateTime

            // Calculate duration in days
            const pickUpDate = new Date(pickUpDateTime);
            const dropOffDate = new Date(dropOffDateTime);
            const duration = differenceInDays(dropOffDate, pickUpDate);

            if (duration >= 30 && currentUser.membership.plan === "freemium") {
                alert(
                    "You need to be a premium member to book for a month or more."
                );
                return; // Exit the function if the condition is met
            }
            const bookingData = {
                bookingId: generateBookingId(),
                pickUpLocation,
                dropOffLocation,
                pickUpDateTime,
                dropOffDateTime,
                rental_start_date: rentalStartDate,
                rental_end_date: rentalEndDate,
                duration,
                booking_date: "", // Set booking date to current date
                hoursDifference,
                status: "incomplete",
                carName: "", // Assuming carName is selected elsewhere
                userId: currentUser?.id,
                isBooked: false, // Add isBooked property and set to false
            };

            try {
                const response = await fetch("http://localhost:3000/booking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookingData),
                });
                if (response.ok) {
                    console.log("Booking created successfully");
                    navigate("/search");
                } else {
                    console.error("Failed to create booking");
                }
            } catch (error) {
                console.error("Error creating booking:", error);
            }
        } else {
            alert("Please register yourself with us :)");
            navigate("/register");
        }
    };

    return (
        <>
        <div className={styles.homemain}>
            {isLoaded ? ( // Check if Google Maps API is loaded
                <HourContext.Provider
                    value={{ hoursDifference, setHoursDifference }}
                >
                    <Navbar />
                    <div className={styles.home_head}>
                        <div className={styles.hero_section}>
                            <h1>
                                Looking for a{" "}
                                <span className={styles.highlight}>
                                    vehicle
                                </span>
                                ? You're at the right place.
                            </h1>
                            <div className={styles.home_container}>
                                <div className={styles.input_group}>
                                    <label>Pick Up Location:</label>
                                    <Autocomplete
                                        onLoad={(autocomplete) =>
                                            (autocompleteRef1.current =
                                                autocomplete)
                                        }
                                        onPlaceChanged={handlePlaceChanged1}
                                    >
                                        <input
                                            type="text"
                                            value={pickUpLocation}
                                            onChange={(e) =>
                                                setPickUpLocation(
                                                    e.target.value
                                                )
                                            }
                                            className={styles.input_field}
                                            placeholder="From: Address"
                                        />
                                    </Autocomplete>
                                </div>
                                <div className={styles.input_group2}>
                                    <label>Pick Up Date:</label>
                                    <input
                                        type="datetime-local"
                                        value={pickUpDateTime}
                                        onChange={(e) =>
                                            setPickUpDateTime(e.target.value)
                                        }
                                        className={styles.input_field}
                                    />
                                </div>
                                <div className={styles.input_group}>
                                    <label>Drop Off Location:</label>
                                    <Autocomplete
                                        onLoad={(autocomplete) =>
                                            (autocompleteRef2.current =
                                                autocomplete)
                                        }
                                        onPlaceChanged={handlePlaceChanged2}
                                    >
                                        <input
                                            type="text"
                                            value={dropOffLocation}
                                            onChange={(e) =>
                                                setDropOffLocation(
                                                    e.target.value
                                                )
                                            }
                                            className={styles.input_field}
                                            placeholder="To: Address"
                                        />
                                    </Autocomplete>
                                </div>
                                <div className={styles.input_group2}>
                                    <label>Drop Off Date:</label>
                                    <input
                                        type="datetime-local"
                                        value={dropOffDateTime}
                                        onChange={(e) =>
                                            setDropOffDateTime(e.target.value)
                                        }
                                        className={styles.input_field}
                                    />
                                </div>
                                <button
                                     onClick={handleFindVehicle}
                                     className={styles.calculate_button}
                                         >
                                     <i className="fas fa-car-side" style={{ fontSize: '24px', display: 'block' }}></i>
                                    <h4>Find a Vehicle</h4>
                                    </button>
                            </div>
                        </div>
                    </div>
                    <Marquee className={styles.mar}>
                        <h1 className={styles.marh}>Suv</h1>
                        <h1 className={styles.marh}>Sedan</h1>
                        <h1 className={styles.marh}>Hatchback</h1>
                    </Marquee>
                    <Feature />
                    <Steps />
                    <OfferCarousel slides={slides} />

                    <CarRentalAd />
                    <CarList />
                    <ReviewComponent />
                    <FaqComponent />
                    <Contact />
                    <AboutUs />
                </HourContext.Provider>
            ) : (
                <div>Loading...</div> // Render a loading message while API is loading
            )}
            </div>
        </>
    );
};

export default Home;
