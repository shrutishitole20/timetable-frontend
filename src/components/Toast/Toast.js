import React, { useState, useEffect } from 'react';
import './Toast.css';

let showToastFn = null;

export const showToast = (message, type = 'success') => {
    if (showToastFn) showToastFn(message, type);
};

const Toast = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        showToastFn = (message, type) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3500);
        };
    }, []);

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span className="toast-icon">
                        {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span className="toast-message">{t.message}</span>
                </div>
            ))}
        </div>
    );
};

export default Toast;
