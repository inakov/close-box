import React from 'react';

const Modal = ({show, message, onClose}) => {
    if(!show) return null;

    return (
        <div className="backdrop">
            <div className="modal">
                <span>{message}</span>

                <div className="footer button">
                    <button onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;