import { FirebaseError } from "firebase/app";
import { FIREBASE_ERRORS } from "../constants/firebaseErrors.ts";

export default function handleFirebaseError(error: FirebaseError): string {
    let errorMessage = "Something went wrong";
    if (error.code in FIREBASE_ERRORS) {
        errorMessage = FIREBASE_ERRORS[error.code];
    }

    return errorMessage;
}
