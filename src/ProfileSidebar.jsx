import React, { useState, useEffect } from "react";
import styles from "./ProfileSidebar.module.css";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = ({ userId, isProfilePage }) => {
    let navigate = useNavigate();
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        profileImagePath: "",
        isLoggedIn: false,
        membership: {
            badge1: null,
            badge2: null,
            badge3: null,
            levels: {},
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/users/${userId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                console.log(data);
                if (!data.isLoggedIn) {
                    throw new Error("No logged-in user found");
                }
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };

        fetchUserData();
    }, [userId]);

    // Handle sign-out logic
    const handleSignOut = async () => {
        try {
            // Update user's isLoggedIn status to false on the server
            const response = await fetch(
                `http://localhost:3000/users/${userId}`,
                {
                    method: "PATCH", // or "PUT", depending on your API
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isLoggedIn: false }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update user status");
            }

            // Navigate to the home page after successful sign-out
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    // Render badges
    const renderBadges = () => {
        const badges = [
            userData.membership.badge1,
            userData.membership.badge2,
            userData.membership.badge3,
        ];
        return badges
            .filter((badge) => badge && badge.active)
            .map((badge, index) => (
                <div key={index} className={styles.badgeItem}>
                    <img
                        src={badge.img || "default-badge.png"}
                        alt={badge.name}
                        className={styles.badgeImage}
                    />
                    <p className={styles.badgeName}>{badge.name}</p>
                </div>
            ));
    };

    // Render levels
    const renderLevels = () => {
        const levels = userData.membership.levels;
        return Object.keys(levels)
            .filter((level) => levels[level].active)
            .map((level, index) => (
                <div key={index} className={styles.levelItem}>
                    <img
                        src={levels[level].img || "default-level.png"}
                        alt={level}
                        className={styles.levelImage}
                    />
                    <p className={styles.levelName}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </p>
                </div>
            ));
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.profile}>
                <img
                    src={userData.profileImagePath || "default-profile.png"}
                    alt="Profile"
                    className={styles.profileImage}
                />
            </div>
            <div className={styles.options}>
                <p className={styles.username}>{userData.name}</p>
                <div className={styles.badgesAndLevels}>
                    {renderBadges().length > 0 && (
                        <div className={styles.badgesSection}>
                            <h4 className={styles.badgesTitle}>Badges</h4>
                            <div className={styles.badgesContainer}>
                                {renderBadges()}
                            </div>
                        </div>
                    )}
                    {renderLevels().length > 0 && (
                        <div className={styles.levelsSection}>
                            <h4 className={styles.levelsTitle}>Levels</h4>
                            <div className={styles.levelsContainer}>
                                {renderLevels()}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.pointsContainer}>
                    <h4 className={styles.pointsTitle}>Points</h4>

                    <div className={styles.pointsSection}>
                        <img
                            src={"src/assets/Coins.jpeg"}
                            className={styles.pointsImage}
                        />
                        <h4 className={styles.pointstitle}>
                            {userData.membership.points}
                        </h4>
                    </div>
                </div>
                <ul className={styles.nav}>
                    <li className={styles.navItem}>
                        {isProfilePage ? (
                            <a
                                onClick={() =>
                                    navigate(`/orders/${userData.id}`)
                                }
                                className={styles.navLink}
                            >
                                My Orders
                            </a>
                        ) : (
                            <span className={styles.disabledNavLink}>
                                My Orders
                            </span>
                        )}
                    </li>
                    <li className={styles.navItem}>
                        {isProfilePage ? (
                            <button
                                className={styles.signOutButton}
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                                className={styles.disabledSignOutButton}
                                disabled
                            >
                                Sign Out
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileSidebar;
