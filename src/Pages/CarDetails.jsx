import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./CarDetails.module.css"; // Import CSS module
import Review from "./Review";
import Booking from "./Booking"; // Import Booking component
import Navbarcomp from "../components/Navbarcomp";
import AboutUs from "../components/AboutUs";
import { Canvas } from "@react-three/fiber";
import { Stage, PresentationControls } from "@react-three/drei";
import Model from "./Model";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faLeaf,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
const CarDetails = () => {
    const { id } = useParams(); // Get car ID from URL params
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [show3DModel, setShow3DModel] = useState(false); // State to toggle 3D model visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch car details
                const carResponse = await fetch(
                    `http://localhost:3000/cars/${id}`
                );
                if (!carResponse.ok) {
                    throw new Error("Failed to fetch car data");
                }
                const carData = await carResponse.json();
                setCarData(carData);
                setMainImage(carData.images.image1); // Set initial main image
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    const handleToggle3DModel = () => {
        setShow3DModel(!show3DModel);
    };

    const handleCloseModal = () => {
        setShow3DModel(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!carData) {
        return <div>No car data found</div>;
    }

    return (
        <>

            <Navbarcomp />
            <div className={styles["car-details-container"]}>
                <div className={styles["header-image"]}>
                    <p>Car Details</p>
                </div>
                <div className={styles["car-details-card"]}>
                <div className={styles["carmain"]}>

                    <div className={styles["carousel"]}>
                        <div>
                            <img
                                className={styles["large-image"]}
                                src={mainImage}
                                alt="Main"
                            />
                        </div>
                        <div className={styles["thumbnails"]}>
                            <img
                                className={styles["small-image"]}
                                src={carData.images.image1}
                                alt="Car 1"
                                onClick={() =>
                                    handleThumbnailClick(carData.images.image1)
                                }
                            />
                            <img
                                className={styles["small-image"]}
                                src={carData.images.image2}
                                alt="Car 2"
                                onClick={() =>
                                    handleThumbnailClick(carData.images.image2)
                                }
                            />
                            <img
                                className={styles["small-image"]}
                                src={carData.images.image3}
                                alt="Car 3"
                                onClick={() =>
                                    handleThumbnailClick(carData.images.image3)
                                }
                            />
                            <img
                                className={styles["small-image"]}
                                src={carData.images.image4}
                                alt="Car 4"
                                onClick={() =>
                                    handleThumbnailClick(carData.images.image4)
                                }
                            />
                           </div>
                        </div>
                       <div className={styles["specifications"]}>
                       <h3 id={styles["b"]}>{carData.name}</h3>
                        </div>
  <div className={styles["input_group2"]}>
  <label className={styles["i2"]}>Guest's Favorite</label>

        <label className={styles["i3"]} >One of the Most Loved Car of the RentEase</label>

        <div className="rating-card-rating">
          <h1>4.90</h1>
          <FontAwesomeIcon icon={faStar} className={styles["star-icon"]} />
          <FontAwesomeIcon icon={faStar} className={styles["star-icon"]} />
          <FontAwesomeIcon icon={faStar} className={styles["star-icon"]} />
          <FontAwesomeIcon icon={faStar} className={styles["star-icon"]} />
          <FontAwesomeIcon icon={faStar} className={styles["staricon"]} />

        </div>
    </div>
    <div className={styles["input_group3"]}>{
       <span>{carData.carPrice}</span>

    }
    </div>

<div className={styles["car-details"]}>
    <div className={styles["specifications"]}>
    <div className={styles["spec-item"]}>
        <span className={styles["icon"]}><i className="fas fa-car"></i></span>
        <span>{carData.model}</span>
    </div>
    <div className={styles["spec-item"]}>
        <span className={styles["icon"]}><i className="fas fa-calendar-alt"></i></span>
        <span>{carData.year}</span>
    </div>
    <div className={styles["spec-item"]}>
        <span className={styles["icon"]}><i className="fas fa-users"></i></span>
        <span>{carData.seater}</span>
    </div>
    <div className={styles["spec-item"]}>
        <span className={styles["icon"]}><i className="fas fa-gas-pump"></i></span>
        <span>{carData.fuelType}</span>
    </div>
    <div className={styles["spec-item"]}>
        <span className={styles["icon"]}><i className="fas fa-cogs"></i></span>
        <span>{carData.transmission}</span>
    </div>
    <div className={styles["spec-item"]}>
        <span className={styles["icon"]}><i className="fas fa-map-marker-alt"></i></span>
        <span>{carData.location.carLocation}</span>
    </div>
 </div>
</div>
<hr/>
<div className={styles.features}>
    <h3>Features</h3>
    <div className={styles["features-grid"]}>
      <ul className={styles["feature-list"]}>
        <li className={styles["feature-item"]}>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} /> {carData.features.feature1}
        </li>
        <li className={styles["feature-item"]}>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} /> {carData.features.feature3}
        </li>
        <li className={styles["feature-item"]}>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} /> {carData.features.feature5}
        </li>
      </ul>
      <ul className={styles["feature-list"]}>
        <li className={styles["feature-item"]}>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} /> {carData.features.feature2}
        </li>
        <li className={styles["feature-item"]}>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.icon} /> {carData.features.feature4}
        </li>
      </ul>
    </div>
  </div>
</div>

<div className={styles["reviewdiv"]}>
<Review/>
</div>




                    <div className={styles["booking-detail"]}>
                        <Booking carId={id} carPrice={carData.pricing} />
                    </div>
                </div>
            </div>

            {/* {show3DModel && (
                <div className={styles["modal"]} onClick={handleCloseModal}>
                    <div
                        className={styles["modal-content"]}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles["close-modal"]}
                            onClick={handleCloseModal}
                        >
                            ×
                        </button>
                        <Canvas
                            dpr={[1, 2]}
                            shadows
                            camera={{ fov: 45 }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <color attach="background" args={["#101010"]} />
                            <PresentationControls
                                speed={1.5}
                                global
                                zoom={0.5}
                                polar={[-0.1, Math.PI / 4]}
                            >
                                <Stage environment={"sunset"}>
                                    <Model scale={0.01} />
                                </Stage>
                            </PresentationControls>
                        </Canvas>
                    </div> */}

                {/* </div> */}
            {/* )} */}

            <AboutUs />
            
        </>
    );
};

export default CarDetails;
