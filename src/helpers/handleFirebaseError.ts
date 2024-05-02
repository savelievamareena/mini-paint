import { FirebaseError } from "firebase/app";

const FIREBASE_ERRORS: Record<string, string> = {
    "auth/invalid-credential": "Invalid credentials",
    "auth/email-already-in-use": "This email is already in use",
};

export default function handleFirebaseError(error: FirebaseError): string {
    let errorMessage = "Something went wrong";
    if (error.code in FIREBASE_ERRORS) {
        errorMessage = FIREBASE_ERRORS[error.code];
    }

    return errorMessage;
}
