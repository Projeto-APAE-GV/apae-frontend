import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR');
    };

    return (
        <div className="dashboard-apae">
            <div className="welcome-container">
                <h1 className="welcome-message">Seja bem-vindo ao sistema APAE</h1>
                <div className="datetime-container">
                    <div className="date-display">
                        <i className="far fa-calendar"></i>
                        {formatDate(currentDateTime)}
                    </div>
                    <div className="time-display">
                        <i className="far fa-clock"></i>
                        {formatTime(currentDateTime)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;