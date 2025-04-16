import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./OfferCarousel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";

const OfferCarousel = ({ slides }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
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
            <h2>RentEase's Badges</h2>

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
                                        size="2x"
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

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Slide Details"
                className={
                    modalIsOpen
                        ? `${styles.modal} ${styles["modal-open"]}`
                        : styles.modal
                }
                overlayClassName={styles.overlay}
            >
                {selectedSlide && (
                    <div>
                        <h2>{selectedSlide.title}</h2>
                        <ul>
                            {selectedSlide.description
                                .split(".")
                                .map(
                                    (point, index) =>
                                        point.trim() && (
                                            <li key={index}>{point.trim()}.</li>
                                        )
                                )}
                        </ul>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OfferCarousel;
