import { useCallback, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { ROUTES } from "../../../constants";
import { useNavigate } from "react-router-dom";

export default function useLogOutConfirmationDialog() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = useCallback(() => {
        setDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
    }, []);

    function handleLogout() {
        signOut(auth)
            .then(() => {
                toast.info("Logged out");
                navigate(ROUTES.LOGIN);
            })
            .catch(() => {
                toast.error("Something went wrong");
            });
        setDialogOpen(false);
    }

    return { dialogOpen, handleDialogOpen, handleDialogClose, handleLogout };
}
