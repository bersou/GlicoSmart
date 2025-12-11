import { useState, useEffect } from 'react';

interface Reading {
    id: string;
    value: number;
    timestamp: string;
}

const STORAGE_KEY = 'glucose_readings';

export const useGlucoseData = () => {
    const [readings, setReadings] = useState<Reading[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load readings", e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
        } catch (e) {
            console.error("Failed to save readings", e);
        }
    }, [readings]);

    const addReading = (value: number) => {
        const newReading: Reading = {
            id: Date.now().toString(),
            value: Number(value),
            timestamp: new Date().toISOString()
        };
        setReadings(prev => [newReading, ...prev]);
    };

    const deleteReading = (id: string) => {
        setReadings(prev => prev.filter(item => item.id !== id));
    };

    return { readings, addReading, deleteReading };
};