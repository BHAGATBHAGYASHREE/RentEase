import React from "react";
import styles from "./RevvSubscription.module.css";

const RevvSubscription = () => {
    return (
        <div className={styles.revvSubscription}>
            <div className={styles.textContent}>
                <h1>What is RentEase Subscription?</h1>
                <p>
                    <b>Rentease</b> offers a premium car rental experience with
                    sanitized cars, insurance included, flexible booking and
                    extensions, free delivery, and the option to choose your own
                    drivers. Enjoy 50% more value compared to standard rentals
                    with flexible monthly plans.
                </p>
            </div>
            <div className={styles.videoContent}>
                <iframe
                    width="100%"
                    height="100%"
                    src="public/carrental.mp4"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default RevvSubscription;
