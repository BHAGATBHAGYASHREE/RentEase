import React from "react";
import Navbarcomp from "./components/Navbarcomp";
import AboutUs from "./components/AboutUs";
import styles from "./Submain.module.css"; // Import your CSS module for styling
import CarouselComponent from "./components/CarouselComponent";
import {
    faPumpMedical,
    fa0,
    faPercent,
    faKey,
    faPersonBiking,
    faFileCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import RevvSubscription from "./components/RevvSubscription";
import ComparisonTable from "./components/ComparisonTable";
import Services from "./components/Services";
const Submain = () => {
    // const slides = [

    //     {
    //       icon: faPumpMedical,
    //       title: 'Safe and Sanitized cars',
    //       description: '',
    //     },
    //     {
    //         icon: fa0,
    //         title: 'Zero down Payment',
    //         description: '',
    //       },
    //     {
    //       icon: faPercent ,
    //       title: '50% extra as compared to normal booking drives',
    //       description: '',
    //     },
    //     {
    //       icon: faKey,
    //       title: 'Doorstep deliveryin just 3 days',
    //       description: '',
    //     },
    //     {
    //         icon: faPersonBiking,
    //         title: 'Choose your own Driver',
    //         description: '',
    //       },
    //       {
    //         icon: faFileCircleCheck,
    //         title: 'Insurance and maintenance included',
    //         description: '',
    //       },
    //   ];
    const slides = [
        {
            icon: faPumpMedical,
            title: "Safe and Sanitized cars",
            description: "",
        },
        {
            icon: fa0,
            title: "Zero down Payment",
            description: "",
        },
        {
            icon: faPercent,
            title: "50% extra as compared to normal booking drives",
            description: "",
        },
        {
            icon: faKey,
            title: "Doorstep deliveryin just 3 days",
            description: "",
        },
        {
            icon: faPersonBiking,
            title: "Get Top Drivers",
            description: "",
        },
        {
            icon: faFileCircleCheck,
            title: "Insurance and maintenance included",
            description:
                "Insurance and maintenance includedInsurance and maintenance includedInsurance and maintenance includedInsurance and maintenance included",
        },
    ];

    return (
        <>
            <Navbarcomp />
            <div className={styles.header_image}>
                <p>Subscribe & Offers</p>
            </div>
            <div className={styles.container}>
                <div className="styles.App">
                    <CarouselComponent slides={slides} />
                </div>
                <RevvSubscription />
            </div>

            <ComparisonTable />
            <div className={styles.container}>
                <Services></Services>
            </div>

            <AboutUs />
        </>
    );
};

export default Submain;
