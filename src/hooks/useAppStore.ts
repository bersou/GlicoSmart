import { useState, useEffect } from 'react';

const STORAGE_KEY_USERS = 'glicosmart_users';

// Definindo as interfaces para os tipos de dados
interface UserProfile {
    name: string;
    age: string;
    weight: string;
    photo: string | null;
    email: string;
}

interface Reading {
    id: string;
    value: number;
    period: string;
    timestamp: string;
    notes?: string;
}

interface UserData {
    profile: UserProfile;
    password?: string; // Password is not used for local storage, but kept for structure
    readings: Reading[];
}

interface UsersState {
    [email: string]: UserData;
}

export const useAppStore = () => {
    const [activeUserEmail, setActiveUserEmail] = useState<string | null>(() => {
        const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
        if (storedUsers) {
            const parsed: UsersState = JSON.parse(storedUsers);
            const keys = Object.keys(parsed);
            if (keys.length > 0) return keys[0];
        }
        return null;
    });

    const [users, setUsers] = useState<UsersState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_USERS);
            const parsed: UsersState = stored ? JSON.parse(stored) : {};

            let changed = false;
            Object.keys(parsed).forEach(userKey => {
                const user = parsed[userKey];
                if (user.readings && Array.isArray(user.readings)) {
                    const ids = new Set<string>();
                    user.readings = user.readings.map(r => {
                        if (!r.id || ids.has(r.id)) {
                            changed = true;
                            const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                            return { ...r, id: newId };
                        }
                        ids.add(r.id);
                        return r;
                    });
                }
            });

            if (changed) {
                localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
            }

            return parsed;
        } catch (e) {
            console.error("Failed to load users", e);
            return {};
        }
    });

    const currentUserData = activeUserEmail ? users[activeUserEmail] : null;
    const userProfile: UserProfile | null = currentUserData?.profile || null;
    const readings: Reading[] = currentUserData?.readings || [];

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        } catch (e) {
            console.error("Failed to save users", e);
        }
    }, [users]);

    const createProfile = (profileData: Omit<UserProfile, 'email'>) => {
        const userId = 'default_user';

        const newUser: UserData = {
            profile: { ...profileData, email: userId },
            password: '',
            readings: []
        };

        setUsers(prev => ({ ...prev, [userId]: newUser }));
        setActiveUserEmail(userId);
    };

    const logout = () => {
        setActiveUserEmail(null);
    };

    const updateProfile = (profileData: Partial<UserProfile>) => {
        if (!activeUserEmail) return;
        setUsers(prev => ({
            ...prev,
            [activeUserEmail]: {
                ...prev[activeUserEmail],
                profile: { ...prev[activeUserEmail].profile, ...profileData }
            }
        }));
    };

    const addReading = (value: number, period: string = 'random', notes: string = '', timestamp: string | null = null) => {
        if (!activeUserEmail) return;

        const newReading: Reading = {
            id: Date.now().toString(),
            value: Number(value),
            period,
            timestamp: timestamp || new Date().toISOString(),
            notes
        };

        setUsers(prev => {
            const userReadings = prev[activeUserEmail].readings || [];
            const updatedReadings = [newReading, ...userReadings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            return {
                ...prev,
                [activeUserEmail]: {
                    ...prev[activeUserEmail],
                    readings: updatedReadings
                }
            };
        });
    };

    const updateReading = (id: string, newValues: Partial<Reading>) => {
        if (!activeUserEmail) return;

        setUsers(prev => {
            const userReadings = prev[activeUserEmail].readings || [];
            const updatedReadings = userReadings.map(reading =>
                reading.id === id ? { ...reading, ...newValues } : reading
            ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            return {
                ...prev,
                [activeUserEmail]: {
                    ...prev[activeUserEmail],
                    readings: updatedReadings
                }
            };
        });
    };

    const deleteReading = (id: string) => {
        if (!activeUserEmail) return;

        setUsers(prev => {
            const userReadings = prev[activeUserEmail].readings || [];
            const updatedReadings = userReadings.filter(item => item.id !== id);

            return {
                ...prev,
                [activeUserEmail]: {
                    ...prev[activeUserEmail],
                    readings: updatedReadings
                }
            };
        });
    };

    const resetData = () => {
        if (!activeUserEmail) return;

        setUsers(prev => ({
            ...prev,
            [activeUserEmail]: {
                ...prev[activeUserEmail],
                readings: [],
                profile: { ...prev[activeUserEmail].profile, photo: null }
            }
        }));
    };

    const clearAllData = () => {
        localStorage.removeItem(STORAGE_KEY_USERS);
        // localStorage.removeItem(STORAGE_KEY_ACTIVE_USER); // This key is no longer explicitly used
        setUsers({});
        setActiveUserEmail(null);
    };

    return {
        userProfile,
        readings,
        activeUserEmail,
        createProfile,
        register: createProfile,
        logout,
        updateProfile,
        addReading,
        updateReading,
        deleteReading,
        resetData,
        clearAllData
    };
};