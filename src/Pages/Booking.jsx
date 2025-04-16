import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Booking.module.css";
// import { Modal } from "react-modal";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

const Booking = ({ carId, carPrice }) => {
    const [pickupDateTime, setPickupDateTime] = useState("");
    const [dropoffDateTime, setDropoffDateTime] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [hireDriver, setHireDriver] = useState(false);
    const [homeDelivery, setHomeDelivery] = useState(false);
    const [carName, setCarName] = useState("");
    const [bookingId, setBookingId] = useState(null);
    const [hoursDifference, setHoursDifference] = useState(0);
    const [carPricePerHour, setCarPricePerHour] = useState(0);
    const [getDiscount, setGetDiscount] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [badgeName, setBadgeName] = useState("");
    const [currentUser, setCurrentUser] = useState({});
    const [discountRate, setDiscountRate] = useState(0);
    const [initialPrice, setInitialPrice] = useState(0);
    const [carType, setCarType] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch logged-in user
                const usersResponse = await fetch(
                    `http://localhost:3000/users?isLoggedIn=true`
                );
                if (!usersResponse.ok) {
                    throw new Error("Failed to fetch users data");
                }
                const usersData = await usersResponse.json();
                if (usersData.length === 0) {
                    throw new Error("No logged-in user found");
                }
                const loggedInUser = usersData.find(
                    (user) => user.isLoggedIn === true
                );

                setCurrentUser(loggedInUser);

                // Fetch bookings for the logged-in user
                const bookingsResponse = await fetch(
                    `http://localhost:3000/booking?userId=${loggedInUser.id}`
                );
                if (!bookingsResponse.ok) {
                    throw new Error("Failed to fetch booking data");
                }
                const bookings = await bookingsResponse.json();

                // Find the latest "scheduled" booking
                const incompleteBookings = bookings
                    .filter((booking) => booking.status === "incomplete")
                    .sort(
                        (a, b) =>
                            new Date(b.pickUpDateTime) -
                            new Date(a.pickUpDateTime)
                    );
                const latestBooking =
                    incompleteBookings.length > 0
                        ? incompleteBookings[0]
                        : null;

                if (latestBooking) {
                    setBookingId(latestBooking.id);

                    const pickupDateTime = new Date(
                        latestBooking.pickUpDateTime
                    );
                    const dropoffDateTime = new Date(
                        latestBooking.dropOffDateTime
                    );

                    setPickupDateTime(
                        pickupDateTime.toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                            hour12: true,
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    );
                    setDropoffDateTime(
                        dropoffDateTime.toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                            hour12: true,
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    );

                    setPickupLocation(latestBooking.pickUpLocation);
                    setDropoffLocation(latestBooking.dropOffLocation);

                    // Fetch car data
                    const carResponse = await fetch(
                        `http://localhost:3000/cars/${carId}`
                    );
                    if (!carResponse.ok) {
                        throw new Error("Failed to fetch car data");
                    }
                    const carData = await carResponse.json();
                    setCarName(carData.name);
                    setCarType(carData.type);

                    const hoursDiff = calculateHoursDifference(
                        latestBooking.pickUpDateTime,
                        latestBooking.dropOffDateTime
                    );
                    setHoursDifference(hoursDiff);

                    const pricePerHour = parseFloat(
                        carPrice.replace(/\D/g, "")
                    );
                    setCarPricePerHour(pricePerHour);
                    console.log("hello");
                    const initialTotalPrice = calculateTotalPrice(
                        pricePerHour,
                        hoursDiff,
                        latestBooking.driver || false,
                        homeDelivery
                    );
                    setInitialPrice(initialTotalPrice);
                    setTotalPrice(initialTotalPrice);

                    setHireDriver(latestBooking.driver || false);
                }
            } catch (error) {
                console.error("Error:", error.message);
            }
        };

        fetchData();
    }, [carId, carPrice]);

    const calculateHoursDifference = (pickup, dropoff) => {
        const pickupDate = new Date(pickup);
        const dropoffDate = new Date(dropoff);
        const difference = Math.abs(dropoffDate - pickupDate);
        return Math.ceil(difference / (1000 * 60 * 60));
    };

    const calculateTotalPrice = (
        pricePerHour,
        hoursDifference,
        driver,
        delivery,
        discount // Add a discount parameter with a default value of 0
    ) => {
        console.log(discount);
        console.log(discountRate);
        let total = pricePerHour * hoursDifference;
        if (discount) {
            const { badge1, badge2, badge3, levels } = currentUser.membership;
            if (badge1.active && badge1.validity > 0) {
                total = total * (1 - 0.25).toFixed(2);
            } else if (badge2.active && badge2.validity > 0) {
                total = total * (1 - 0.15).toFixed(2);
            } else if (badge3.active && badge3.validity > 0) {
                total = total * (1 - 0.2).toFixed(2);
            }
            if (currentUser.membership.levels.bronze.active) {
                if (currentUser.membership.plan === "freemium") {
                    total -= 120;
                } else {
                    total -= 300;
                }
            } else if (currentUser.membership.levels.silver.active) {
                if (currentUser.membership.plan === "freemium") {
                    total -= 250;
                } else {
                    total -= 520;
                }
            } else if (currentUser.membership.levels.gold.active) {
                if (currentUser.membership.plan === "freemium") {
                    total -= 500;
                } else {
                    total -= 720;
                }
            }
        }
        if (driver) {
            total += hoursDifference * 100; // Add 100 times the number of hours
        }
        if (delivery && currentUser.membership.plan !== "premium") {
            total += 150; // Adding 150 for home delivery
        }

        return total.toFixed(2);
    };

    const handleHireDriver = async () => {
        const newHireDriver = !hireDriver; // Toggle the hireDriver state

        try {
            const response = await fetch(
                `http://localhost:3000/booking/${bookingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        driver: newHireDriver,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update booking with driver");
            }

            // Update the hireDriver state
            setHireDriver(newHireDriver);

            // Update the total price based on the new hireDriver state
            const updatedPrice = calculateTotalPrice(
                carPricePerHour,
                hoursDifference,
                newHireDriver,
                homeDelivery,
                getDiscount
            );

            setTotalPrice(updatedPrice); // Update total price state
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleHomeDelivery = () => {
        const newHomeDelivery = !homeDelivery;
        setHomeDelivery(newHomeDelivery);
        if (newHomeDelivery && currentUser.membership.plan === "premium") {
            alert("Premium membership: Free home delivery");
        }

        const updatedPrice = calculateTotalPrice(
            carPricePerHour,
            hoursDifference,
            hireDriver,
            newHomeDelivery,
            getDiscount
        );
        setTotalPrice(updatedPrice);
    };

    const handleBooking = async () => {
        try {
            console.log(hireDriver);
            // Update the booking details
            const response = await fetch(
                `http://localhost:3000/booking/${bookingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pickUpDateTime: pickupDateTime,
                        dropOffDateTime: dropoffDateTime,
                        pickUpLocation: pickupLocation,
                        dropOffLocation: dropoffLocation,
                        totalPrice,
                        carName,
                        status: "completed",
                        driver: hireDriver,
                        booking_date: new Date().toISOString(), // Set booking date to current date
                        isBooked: true,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update booking");
            }

            // Update the badge validity if discount is applied and badgeName is not empty
            if (getDiscount && badgeName) {
                const { membership } = currentUser;

                // Increment validity of the badge by 1
                for (let i = 1; i <= 3; i++) {
                    const badgeKey = `badge${i}`;
                    if (
                        membership[badgeKey] &&
                        membership[badgeKey].name === badgeName
                    ) {
                        // Decrement the validity of the badge
                        membership[badgeKey].validity -= 1;

                        // Check if the validity is now 0
                        if (membership[badgeKey].validity <= 0) {
                            membership[badgeKey].active = false;
                        }

                        break; // Exit the loop once the badge is found and updated
                    }
                }
                console.log(membership);

                // Send a PATCH request to update the user's badge validity
                const userResponse = await fetch(
                    `http://localhost:3000/users/${currentUser.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            membership: {
                                ...membership,
                            },
                        }),
                    }
                );

                if (!userResponse.ok) {
                    throw new Error("Failed to update user badges");
                }
            }

            // Calculate and update user points based on car type and hours difference
            // Calculate hours difference
            let pointsToAdd = 0;
            if (carType === "Sedan") {
                pointsToAdd = hoursDifference * 7;
            } else if (carType === "SUV") {
                pointsToAdd = hoursDifference * 10;
            } else if (carType === "Hatchback") {
                pointsToAdd = hoursDifference * 6;
            }

            const updatedPoints =
                (currentUser.membership.points || 0) + pointsToAdd;
            console.log(updatedPoints);
            const pointsResponse = await fetch(
                `http://localhost:3000/users/${currentUser.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        membership: {
                            ...currentUser.membership,
                            points: updatedPoints,
                        },
                    }),
                }
            );

            if (!pointsResponse.ok) {
                throw new Error("Failed to update user points");
            }

            alert("Booking Updated!");
            navigate(`/success/${bookingId}/${currentUser.id}`);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleCancelBooking = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/booking/${bookingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: "cancelled",
                        pickUpDateTime: pickupDateTime,
                        dropOffDateTime: dropoffDateTime,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update booking status");
            }
            alert("Booking Status Updated to Cancelled!");
            navigate("/");
        } catch (error) {
            console.error("Error:", error.message);
        }
    };
    const [tier, setTierName] = useState("");
    const handleGetDiscount = async () => {
        // Toggle the getDiscount state
        const newGetDiscount = !getDiscount;

        try {
            let discountBadgeName = "";
            let tierName = "";

            if (newGetDiscount) {
                // Extract the membership badges
                const { badge1, badge2, badge3, levels, plan } =
                    currentUser.membership;

                // Check each badge and apply the discount for the first active badge found
                if (badge1.active && badge1.validity > 0) {
                    discountBadgeName = badge1.name;
                } else if (badge2.active && badge2.validity > 0) {
                    discountBadgeName = badge2.name;
                } else if (badge3.active && badge3.validity > 0) {
                    discountBadgeName = badge3.name;
                } else {
                    console.log("No active badge with validity found.");
                    discountBadgeName = "No";
                }

                // Check each tier level for activity
                if (levels.bronze.active) {
                    if (plan === "freemium") {
                        tierName = "Bronze freemium";
                    } else {
                        tierName = "Bronze premium";
                    }
                } else if (levels.silver.active) {
                    if (plan === "freemium") {
                        tierName = "Sliver freemium";
                    } else {
                        tierName = "Silver premium";
                    }
                } else if (levels.gold.active) {
                    if (plan === "freemium") {
                        tierName = "Gold freemium";
                    } else {
                        tierName = "Gold premium";
                    }
                } else {
                    tierName = "No";
                }
            }
            // Update the badge name and tier name based on the new state
            setTierName(tierName);
            setBadgeName(discountBadgeName);

            // Update the getDiscount state
            setGetDiscount(newGetDiscount);

            // Recalculate total price with or without discount
            const updatedPrice = calculateTotalPrice(
                carPricePerHour,
                hoursDifference,
                hireDriver,
                homeDelivery,
                newGetDiscount
            );

            setTotalPrice(updatedPrice);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };
    return (
        <div className={styles["sidebar"]}>
            <h3>Booking Details</h3>
            <p className={styles["car-name"]}>Car: {carName}</p>

            <div className={styles["detail-item"]}>
                <label>Pickup Date:</label>
                <p className={styles["detail-value"]}>{pickupDateTime}</p>
            </div>

            <div className={styles["detail-item"]}>
                <label>Dropoff Date:</label>
                <p className={styles["detail-value"]}>{dropoffDateTime}</p>
            </div>

            <div className={styles["detail-item"]}>
                <label>Pickup Location:</label>
                <p className={styles["detail-value"]}>{pickupLocation}</p>
            </div>

            <div className={styles["detail-item"]}>
                <label>Dropoff Location:</label>
                <p className={styles["detail-value"]}>{dropoffLocation}</p>
            </div>

            <div className={styles["detail-item"]}>
                <label>Number of Hours:</label>
                <p className={styles["detail-value"]}>{hoursDifference}</p>
            </div>

            <div className={styles["detail-item"]}>
                <label>Price Per Hour:</label>
                <p className={styles["detail-value"]}>
                    &#8377;{carPricePerHour}
                </p>
            </div>
            <div className={styles["detail-item"]}>
                <label>Discounts Applied:</label>
                {getDiscount && (tier !== "" || badgeName !== "") && (
                    <p className={styles["detail-value"]}>
                        <p className={styles["detail-value"]}>
                            Level Discount: {tier !== "" ? tier : ":("}
                        </p>
                        <p className={styles["detail-value"]}>
                            Badge: {badgeName !== "" ? badgeName : ":("}
                        </p>
                    </p>
                )}
            </div>

            <div className={styles["option-buttons"]}>
                <button
                    className={hireDriver ? styles["selected"] : ""}
                    onClick={handleHireDriver}
                >
                    {hireDriver ? "Unhire Driver" : "Hire a Driver"}
                </button>
                <button
                    className={homeDelivery ? styles["selected"] : ""}
                    onClick={handleHomeDelivery}
                >
                    Home Delivery
                </button>
                <button
                    className={getDiscount ? styles["selected"] : ""}
                    onClick={handleGetDiscount}
                >
                    Get Discount
                </button>
            </div>

            <div className={styles["total-price"]}>
                Total Price: &#8377;{totalPrice}
            </div>

            <button className={styles["book-button"]} onClick={handleBooking}>
                Complete Booking
            </button>
            <button
                className={styles["cancel-button"]}
                onClick={handleCancelBooking}
            >
                Cancel Booking
            </button>
        </div>
    );
};

export default Booking;
