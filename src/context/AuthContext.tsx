import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null });

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        }); // Ensure to return the unsubscribe function
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>{!loading && children}</AuthContext.Provider>
    );
};

export { useAuth, AuthProvider };
