import React, { useState } from "react";
import Button from "../components/button";
import Modal from "../components/modal";

// Define the type for the props HomePage expects (reusing NavigablePageProps from App.tsx conceptual level)
interface HomePageProps {
    onNavigate?: (pageName: 'Home' | 'Quiz' | 'Settings') => void; // Be explicit or import PageName if available
}

function HomePage({ onNavigate }: HomePageProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleOpenModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
    };

    const handleContinueClick = () => {
        handleCloseModal(); // Close the modal
        if (onNavigate) {
            onNavigate('Quiz'); // Request navigation to the 'Quiz' page
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

                {/* 
                    Responsive Font Sizing for the main heading:
                    - `text-5xl`: This is the base size, applied on small (mobile) screens.
                    - `md:text-7xl`: On medium screens (768px and up), the font size increases.
                    - `lg:text-9xl`: On large screens (1024px and up), it uses the largest size.
                    This prevents the text from overflowing on smaller viewports by starting small
                    and scaling up.
                */}
                <h1 className="text-5xl font-bold text-center md:text-7xl lg:text-9xl
                bg-gradient-to-r from-pink-400 to-teal-400 
                text-transparent bg-clip-text animate-text">
                    Rainbow Quiz
                </h1>

                <p className="mt-4 text-lg text-center text-gray-600 md:text-2xl">
                    Test to see what flavour of rainbow you are!
                </p>

                <Button
                    className="mt-8"
                    onClick={handleOpenModal}
                >
                    Let's Start
                </Button>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
            >
                <div className="flex flex-col items-left">
                    <h1 className="text-3xl my-4">Please note:</h1>
                    <p className="mb-4">This is <strong>NOT</strong> a scientific test.</p>
                    <p className="mb-4">
                        This quiz is a fun way to visualise sexuality and share with friends and show
                        that everyone is unique and different. It is not a serious test and should not be taken as such.
                    </p>
                    <Button
                        className="max-w-40 self-center"
                        onClick={handleContinueClick}
                    >
                        Continue
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default HomePage;