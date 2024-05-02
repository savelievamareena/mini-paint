import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
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

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    const userValue = useMemo(() => ({ currentUser }), [currentUser]);

    return <AuthContext.Provider value={userValue}>{!loading && children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
