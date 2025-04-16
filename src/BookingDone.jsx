import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BookingDone.module.css";
import { parseISO, getMonth, getYear } from "date-fns";

const BookingDone = () => {
    const { id, userId } = useParams();
    const [booking, setBooking] = useState(null);
    const [assignedDriver, setAssignedDriver] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingAndUserDetails = async () => {
            try {
                const bookingResponse = await fetch(
                    `http://localhost:3000/booking/${id}`
                );
                if (!bookingResponse.ok) {
                    throw new Error("Failed to fetch booking details");
                }
                const bookingData = await bookingResponse.json();
                setBooking(bookingData);

                const userResponse = await fetch(
                    `http://localhost:3000/users/${userId}`
                );
                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user details");
                }
                const userData = await userResponse.json();
                setCurrentUser(userData);

                if (bookingData.isBooked && bookingData.driver) {
                    const driversResponse = await fetch(
                        `http://localhost:3000/drivers`
                    );
                    if (!driversResponse.ok) {
                        throw new Error("Failed to fetch drivers");
                    }
                    const driversData = await driversResponse.json();

                    // Filter drivers based on user plan
                    const ratingThreshold =
                        userData.membership.plan === "premium" ? 4 : 3;
                    const eligibleDrivers = driversData.filter(
                        (driver) => driver.feedback.rating >= ratingThreshold
                    );

                    // Check if there are eligible drivers
                    if (eligibleDrivers.length === 0) {
                        throw new Error("No eligible drivers available");
                    }

                    const randomDriver =
                        eligibleDrivers[
                            Math.floor(Math.random() * eligibleDrivers.length)
                        ];
                    setAssignedDriver(randomDriver);
                }
            } catch (error) {
                console.error(
                    "Error fetching booking or user details:",
                    error.message
                );
            }
        };

        fetchBookingAndUserDetails();
    }, [id, userId]);

    const handleDone = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/booking?userId=${userId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user bookings");
            }
            const userBookings = await response.json();

            const validBookings = userBookings.filter(
                (booking) => booking.isBooked && booking.status !== "cancelled"
            );

            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const currentMonthBookings = validBookings.filter((booking) => {
                const bookingDate = parseISO(booking.rental_start_date);
                return (
                    getMonth(bookingDate) === currentMonth &&
                    getYear(bookingDate) === currentYear
                );
            });
            console.log(currentMonthBookings);
            console.log(currentMonthBookings.length);
            if (currentMonthBookings.length >= 15) {
                const { membership } = currentUser;
                const { badge1 } = membership;
                const lastUpdatedMonth = badge1.lastUpdatedMonth ?? -1;
                const lastUpdatedYear = badge1.lastUpdatedYear ?? -1;

                let validityIncrement = 0;

                // Only increment if it's a new month and year for badge update
                if (
                    (currentMonth > lastUpdatedMonth ||
                        currentYear > lastUpdatedYear) &&
                    currentMonthBookings.length >= 15
                ) {
                    if (membership.plan === "freemium") {
                        validityIncrement = 2;
                    } else if (membership.plan === "premium") {
                        validityIncrement = 5;
                    }

                    const updatedBadge1 = {
                        ...badge1,
                        active: true,
                        validity: badge1.validity + validityIncrement,
                        lastUpdatedMonth: currentMonth,
                        lastUpdatedYear: currentYear,
                    };

                    // Update user's badge in the membership
                    membership.badge1 = updatedBadge1;
                }
            }

            // Determine the user's level based on points
            const userPoints = currentUser.membership.points;
            let { bronze, silver, gold } = currentUser.membership.levels;

            if (userPoints >= 3000 && userPoints < 5000) {
                bronze = { ...bronze, active: true };
                silver = { ...silver, active: false };
                gold = { ...gold, active: false };
            } else if (userPoints >= 5000 && userPoints < 10000) {
                bronze = { ...bronze, active: false };
                silver = { ...silver, active: true };
                gold = { ...gold, active: false };
            } else if (userPoints >= 10000) {
                bronze = { ...bronze, active: false };
                silver = { ...silver, active: false };
                gold = { ...gold, active: true };
            }

            // Update user levels in the membership
            const updatedLevels = {
                bronze,
                silver,
                gold,
            };

            // Update user membership plan in the database
            const userUpdateResponse = await fetch(
                `http://localhost:3000/users/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        membership: {
                            ...currentUser.membership,
                            levels: updatedLevels,
                        },
                    }),
                }
            );

            if (!userUpdateResponse.ok) {
                throw new Error("Failed to update user details");
            }

            const updatedDriver = assignedDriver
                ? assignedDriver.name
                : "No driver";
            const bookingUpdateResponse = await fetch(
                `http://localhost:3000/booking/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        driver: updatedDriver,
                        status: "scheduled",
                    }),
                }
            );

            if (!bookingUpdateResponse.ok) {
                throw new Error("Failed to update booking details");
            }

            navigate("/home");
        } catch (error) {
            console.error("Error updating booking details:", error.message);
        }
    };

    return (
        <>
            <div className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.successMessage}>
                        Booking Completed Successfully!
                    </h2>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWzRSF0Hl2KSwmr9NopxVmaks0mHqfHY6ag&s"
                        alt="Booking Successful"
                        className={styles.successImage}
                    />
                    <h2 className={styles.successMessage}>Driver</h2>
                    {assignedDriver && (
                        <div className={styles.driverCard}>
                            <img
                                src={assignedDriver.imageURL}
                                alt={assignedDriver.name}
                                className={styles.driverImage}
                            />
                            <div className={styles.driverDetails}>
                                <div className={styles.driverName}>
                                    {assignedDriver.name}
                                </div>
                                <div className={styles.driverState}>
                                    {assignedDriver.state}
                                </div>
                                <div className={styles.driverFeedback}>
                                    <p>{assignedDriver.feedback.comment}</p>
                                    <div className={styles.rating}>
                                        <span className={styles.ratingIcon}>
                                            {assignedDriver.feedback.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={handleDone} className={styles.doneButton}>
                        Done
                    </button>
                </div>
            </div>
        </>
    );
};

export default BookingDone;
