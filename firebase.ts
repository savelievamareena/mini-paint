import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_DB_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: "paint-43c73",
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_DB_API_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
export { auth, db, storage, uploadBytes };
