import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ComparisonTable.module.css";

const ComparisonTable = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users data from the endpoint when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/users"); // Adjust the endpoint if necessary
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSubscribe = () => {
        // Find the logged-in user
        const loggedInUser = users.find((user) => user.isLoggedIn);

        if (loggedInUser) {
            // Update the user's plan to premium
            updateUserPlan(loggedInUser.id);
        } else {
            // Alert and navigate to the login page
            alert("Register with us to become a premium member :)");
            navigate("/login");
        }
    };

    const updateUserPlan = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/users/${userId}`,
                {
                    method: "PATCH", // Or "PUT" depending on your API
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        membership: {
                            ...users.find((user) => user.id === userId)
                                .membership,
                            plan: "premium",
                        },
                    }),
                }
            );

            if (response.ok) {
                // Navigate to home page
                alert("Whoohoo You are a Premium now!!");
                navigate("/");
            } else {
                console.error("Failed to update user plan");
            }
        } catch (error) {
            console.error("Error updating user plan:", error);
        }
    };

    const features = [
        { name: "Basic booking features", freemium: true, premium: true },
        { name: "Annual insurance included", freemium: true, premium: false },
        { name: "Safe and Sanitized cars", freemium: true, premium: false },
        { name: "Free Delivery", freemium: true, premium: false },
        { name: "Monthly Rent", freemium: true, premium: false },
        { name: "Get Top Drivers", freemium: true, premium: false },
        {
            name: "50% extra as compared to normal booking drives",
            freemium: true,
            premium: false,
        },
    ];

    return (
        <div className={styles.Container}>
            <div className={styles.tableContainer}>
                <h1 className={styles.highlight}>
                    Compare <span className={styles.highlight}>Freemium</span>{" "}
                    vs Premium
                </h1>
                <table className={styles.comparisonTable}>
                    <thead>
                        <tr className={styles.subscriptionHeader}>
                            <th></th>
                            <th className={styles.subscribeHeader}>Premium</th>
                            <th>Freemium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, index) => (
                            <tr key={index}>
                                <td>{feature.name}</td>
                                <td className={styles.subscribeColumn}>
                                    {feature.freemium ? (
                                        <i
                                            className={`fas fa-check ${styles.icon} ${styles.correct}`}
                                        ></i>
                                    ) : (
                                        <i
                                            className={`fas fa-times ${styles.icon} ${styles.wrong}`}
                                        ></i>
                                    )}
                                </td>
                                <td className={styles.premiumColumn}>
                                    {feature.premium ? (
                                        <i
                                            className={`fas fa-check ${styles.icon} ${styles.correct}`}
                                        ></i>
                                    ) : (
                                        <i
                                            className={`fas fa-times ${styles.icon} ${styles.wrong}`}
                                        ></i>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className={styles.btn} onClick={handleSubscribe}>
                    Subscribe
                </button>
            </div>
            <div className={styles.sub}>
                <h3>Subscription Plan: 2999 per/month</h3>
                <h3>Subscription Plan: 6999 3 months</h3>
            </div>
        </div>
    );
};

export default ComparisonTable;
