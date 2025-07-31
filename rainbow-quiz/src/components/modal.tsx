// src/components/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean; // Controls whether the modal is visible
    onClose: () => void; // Function to call when the modal should close
    children: React.ReactNode; // Content to display inside the modal
    title?: string; // Optional title for the modal
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Effect to handle closing on Escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Optional: Focus the modal for accessibility
            modalRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby={title ? "modal-title" : undefined}
            onClick={(e) => {
                // Close modal when clicking on the backdrop
                if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                    onClose();
                }
            }}
        >
            <div
                ref={modalRef}
                className="relative bg-white text-on-base rounded-boxes shadow-xl max-w-lg w-full p-6 mx-auto"
                tabIndex={-1} // Make div focusable
            >
                <div className="absolute top-4 right-4 justify-end mb-4">
                    {title && <h3 id="modal-title" className="text-2xl font-bold">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body // Portals render the modal directly into the document.body
    );
};

export default Modal;