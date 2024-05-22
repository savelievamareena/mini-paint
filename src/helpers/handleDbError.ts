import { toast } from "react-toastify";

export default function handleDbErrors(error: unknown) {
    if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error("Error occurred. Please try again later.");
    }
}
