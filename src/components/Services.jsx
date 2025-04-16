import React from "react";
import styles from "./Services.module.css";

const Services = () => {
    return (
        <div className={styles.carRentalAd}>
            <div className={styles.services}>
                <h1>Levels</h1>
                <div className={styles.serviceCards}>
                    <div className={styles.card}>
                        <h1>Silver</h1>
                        <h3>Earn 5000 points or more</h3>
                        <ul>
                            <li>Regular Users: 250rs off on every rentals.</li>
                            <li>Premium Users: 520rs off on every rentals.</li>
                        </ul>
                    </div>
                    <div className={`${styles.card} ${styles.middleCard}`}>
                        <h1>Gold</h1>
                        <h3>Earn 10,000 points or more</h3>
                        <ul>
                            <li> Regular Users: 500rs off on every rentals.</li>
                            <li>Premium Users: 720rs off on every rentals.</li>
                        </ul>
                    </div>
                    <div className={styles.card}>
                        <h1>Bronze</h1>
                        <h3> Earn 3000 points or more</h3>
                        <ul>
                            <li>Regular Users: 120rs off on every rentals.</li>
                            <li>Premium Users: 300rs off on every rentals.</li>
                            {/* <li>Earn 10pts/hr on every SUV booking.</li>
        <li>Earn 6-7pts/hr on every Hatchbacks booking.</li>
        <li>Earn 7-8pts/hr on every Sedan booking.</li>
        <li>Earn 15-20pts on writing a customer review.</li>
        <li>Earn 5-8pts on sharing about rentease.</li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
