import React, { useState } from "react";
import styles from "./Car.module.css";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage } from "@react-three/drei";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEye, faGasPump, faCar } from "@fortawesome/free-solid-svg-icons";
import Model from "../Pages/Model"; // Adjust the path to your Model component

const Car = (props) => {
  const navigate = useNavigate();
  const [show3DModel, setShow3DModel] = useState(false);

  const handleToggle3DModel = () => {
    setShow3DModel(!show3DModel);
  };

  const handleCloseModal = () => {
    setShow3DModel(false);
  };

  const handleRent = (id) => {
    navigate(`/booking/${id}`);
  };

  return (
    <>
      <div className={styles.carCard}>
        <div className={styles.imageContainer}>
          <img src={props.imageUrl} alt="Car" className={styles.carImage} />
          <div className={styles.viewIcon} onClick={handleToggle3DModel}>
            <FontAwesomeIcon icon={faEye} />
          </div>
        </div>
        <div className={styles.carDetails}>
          <div className={styles.carInfo}>
            <h3>{props.name}</h3>
          </div>
          <div className={styles.carSpecs}>
            <div className={styles.carSpecItem}>
              <FontAwesomeIcon icon={faUser} className={styles.iconUser} />
              <p>{props.seater}</p>
            </div>
            <div className={styles.carSpecItem}>
              <FontAwesomeIcon icon={faGasPump} className={styles.iconFuel} />
              <p>{props.fuelType}</p>
            </div>
            <div className={styles.carSpecItem}>
              <FontAwesomeIcon icon={faCar} className={styles.iconType} />
              <p>{props.type}</p>
            </div>
          </div>
          <div className={styles.carPricing}>
            <p className={styles.pricePerHour}>&#8377;{props.pricePerHour}</p>
            <button
              className={styles.rentButton}
              onClick={() => handleRent(props.carId)}
            >
              Book
            </button>
          </div>
        </div>
      </div>
      {show3DModel && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={handleCloseModal}>
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
                <Stage environment="sunset">
                  <Model scale={0.01} />
                </Stage>
              </PresentationControls>
            </Canvas>
          </div>
        </div>
      )}
    </>
  );
};

export default Car;
