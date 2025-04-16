import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./MyOrders.module.css"; // Ensure this path is correct
import Navbarcomp from "../components/Navbarcomp";
import AboutUs from "../components/AboutUs";

const MyOrders = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState({
        completed: [],
        cancelled: [],
        running: [],
        scheduled: [],
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/booking?userId=${id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const bookingsData = await response.json();
                categorizeBookings(bookingsData);
            } catch (error) {
                console.error("Error fetching bookings:", error.message);
            }
        };

        fetchBookings();
    }, [id]);

    const categorizeBookings = (bookingsData) => {
        const completed = [];
        const cancelled = [];
        const running = [];
        const scheduled = [];

        bookingsData.forEach((booking) => {
            if (booking.status === "completed") {
                completed.push(booking);
            } else if (booking.status === "cancelled") {
                cancelled.push(booking);
            } else if (booking.status === "running") {
                running.push(booking);
            } else if (booking.status === "scheduled") {
                scheduled.push(booking);
            }
        });

        setBookings({
            completed,
            cancelled,
            running,
            scheduled,
        });
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";

        // Check if the dateTime is in ISO format (e.g., 2024-07-31T01:35)
        const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (!isoFormat.test(dateTime)) {
            // If it's not in ISO format, assume it's already formatted correctly
            return dateTime;
        }

        const date = new Date(dateTime);
        const options = {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleDateString("en-US", options).replace(",", " at");
    };

    return (
        <>
            <Navbarcomp />
            <div className={styles.header_image}>
                <p>My Orders</p>
            </div>
            <div className={styles.container}>
                <h2 className={styles.heading}>My Orders</h2>
                <div className={styles.orders}>
                    {bookings.completed.length > 0 && (
                        <div className={styles.category}>
                            <h3 className={styles.categoryHeading}>
                                Completed Orders
                            </h3>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Car Name</th>
                                        <th>Pick Up Location</th>
                                        <th>Drop Off Location</th>
                                        <th>Pick Up Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.completed.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.carName}</td>
                                            <td>{booking.pickUpLocation}</td>
                                            <td>{booking.dropOffLocation}</td>
                                            <td>
                                                {formatDateTime(
                                                    booking.pickUpDateTime
                                                )}
                                            </td>
                                            <td>
                                                {formatDateTime(
                                                    booking.dropOffDateTime
                                                )}
                                            </td>
                                            <td
                                                className={
                                                    styles.statusCompleted
                                                }
                                            >
                                                Completed
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {bookings.running.length > 0 && (
                        <div className={styles.category}>
                            <h3 className={styles.categoryHeading}>
                                Running Orders
                            </h3>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Car Name</th>
                                        <th>Pick Up Location</th>
                                        <th>Drop Off Location</th>
                                        <th>Pick Up Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.running.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.carName}</td>
                                            <td>{booking.pickUpLocation}</td>
                                            <td>{booking.dropOffLocation}</td>
                                            <td>
                                                {formatDateTime(
                                                    booking.pickUpDateTime
                                                )}
                                            </td>
                                            <td>
                                                {formatDateTime(
                                                    booking.dropOffDateTime
                                                )}
                                            </td>
                                            <td
                                                className={styles.statusRunning}
                                            >
                                                Running
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {bookings.scheduled.length > 0 && (
                        <div className={styles.category}>
                            <h3 className={styles.categoryHeading}>
                                Scheduled Orders
                            </h3>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Car Name</th>
                                        <th>Pick Up Location</th>
                                        <th>Drop Off Location</th>
                                        <th>Pick Up Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.scheduled.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.carName}</td>
                                            <td>{booking.pickUpLocation}</td>
                                            <td>{booking.dropOffLocation}</td>
                                            <td>
                                                {formatDateTime(
                                                    booking.pickUpDateTime
                                                )}
                                            </td>
                                            <td>
                                                {formatDateTime(
                                                    booking.dropOffDateTime
                                                )}
                                            </td>
                                            <td
                                                className={
                                                    styles.statusScheduled
                                                }
                                            >
                                                Scheduled
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {bookings.cancelled.length > 0 && (
                        <div className={styles.category}>
                            <h3 className={styles.categoryHeading}>
                                Cancelled Orders
                            </h3>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Car Name</th>
                                        <th>Pick Up Location</th>
                                        <th>Drop Off Location</th>
                                        <th>Pick Up Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.cancelled.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.carName}</td>
                                            <td>{booking.pickUpLocation}</td>
                                            <td>{booking.dropOffLocation}</td>
                                            <td>
                                                {formatDateTime(
                                                    booking.pickUpDateTime
                                                )}
                                            </td>
                                            <td>
                                                {formatDateTime(
                                                    booking.dropOffDateTime
                                                )}
                                            </td>
                                            <td
                                                className={
                                                    styles.statusCancelled
                                                }
                                            >
                                                Cancelled
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <AboutUs />
        </>
    );
};

export default MyOrders;
