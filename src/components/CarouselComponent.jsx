import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./CarouselComponent.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";

const CarouselComponent = ({ slides }) => {
    const [selectedSlide, setSelectedSlide] = useState(null);

    const chunkSlides = (slides, size) => {
        const chunked = [];
        for (let i = 0; i < slides.length; i += size) {
            chunked.push(slides.slice(i, i + size));
        }
        return chunked;
    };

    const chunkedSlides = chunkSlides(slides, 3);

    const openModal = (slide) => {
        setSelectedSlide(slide);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTimeout(() => {
            setSelectedSlide(null);
        }, 300); // Wait for the transition to finish
    };

    return (
        <div className={styles.overlayContainer}>
            <h2>Subscription Benefits</h2>

            <div className={styles.carousel}>
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    interval={30000}
                    showStatus={false}
                    showArrows={true}
                >
                    {chunkedSlides.map((slideGroup, index) => (
                        <div key={index} className={styles.slide}>
                            {slideGroup.map((slide, subIndex) => (
                                <div
                                    key={subIndex}
                                    className={styles.card}
                                    onClick={() => openModal(slide)}
                                >
                                    <FontAwesomeIcon
                                        icon={slide.icon}
                                        size="3x"
                                        className={styles.cardIcon}
                                    />
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardTitle}>
                                            {slide.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default CarouselComponent;
