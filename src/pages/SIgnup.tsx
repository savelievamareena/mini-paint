import { auth } from "../../firebase.ts";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Inputs = {
    email: string;
    pass: string;
    passConfirmation: string;
};

const Signup = () => {
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    useEffect(() => {
        if (registeredEmail) {
            navigate("/home", { state: { email: registeredEmail } });
        }
    }, [registeredEmail]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        try {
            const registerUser = async () => {
                const authUser = await createUserWithEmailAndPassword(auth, data.email, data.pass);
                if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                    setRegisteredEmail(authUser.user.email);
                }
            };
            registerUser();
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
                const firebaseError = error as { message: string };
                console.error("Error creating user:", firebaseError.message);
                setError(firebaseError.message);
            } else {
                console.error("Unknown error", error);
                setError("Something went wrong");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email", { required: true })} />
            {errors.email && <span>This field is required</span>}

            <input {...register("pass", { required: true })} />
            {errors.pass && <span>This field is required</span>}

            {/*<input {...register("passConfirmation", { required: true })} />*/}
            {/*{errors.passConfirmation && <span>This field is required</span>}*/}

            <div>{error}</div>

            <input type='submit' />
        </form>
    );
};

export default Signup;
