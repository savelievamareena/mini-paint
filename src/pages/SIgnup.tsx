import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { auth } from "../../firebase.ts";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import SignupForm from "../modules/SignupForm.tsx";
import SignupFormField from "../components/SignupFormField.tsx";
import { Button, Link } from "@mui/material";
import { FormValues } from "../../types.ts";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
    email: z.string().email("This is not a valid email"),
    password: z.string().min(6, { message: "Password should be at least 6 symbols" }),
    passwordConfirm: z.string().min(6, { message: "Password should be at least 6 symbols" }),
});

const defaultValues: FormValues = {
    email: "",
    password: "",
    passwordConfirm: "",
};

export type Schema = z.infer<typeof schema>;

const Signup = () => {
    const [authError, setAuthError] = useState("");
    const [passError, setPassError] = useState("");
    const [registeredEmail, setRegisteredEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (registeredEmail) {
            navigate("/", { state: { email: registeredEmail } });
        }
    }, [registeredEmail]);

    const notifySuccess = () => toast.success("Success!", { position: "bottom-left" });
    const notifyError = () => toast.error("Error!", { position: "bottom-left" });

    const onSubmit = (data: Schema) => {
        if (data.password !== data.passwordConfirm) {
            setPassError("Passwords should be equal");
            setTimeout(() => {
                setPassError("");
            }, 3000);
            return;
        }

        const registerUser = async () => {
            try {
                const authUser = await createUserWithEmailAndPassword(
                    auth,
                    data.email,
                    data.password,
                );
                if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                    notifySuccess();
                    setRegisteredEmail(authUser.user.email);
                }
            } catch (error: unknown) {
                notifyError();
                if (
                    "code" in (error as { code?: string }) &&
                    (error as { code?: string }).code === "auth/email-already-in-use"
                ) {
                    setAuthError("Email is already in use");
                } else {
                    setAuthError("Something went wrong");
                }

                setTimeout(() => {
                    setAuthError("");
                }, 3000);
            }
        };
        registerUser();
    };

    return (
        <div className='signup_wrapper'>
            <SignupForm
                schema={schema}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                authError={authError}
                passError={passError}
                submitButtonText={"Sign Up"}
            >
                <SignupFormField name='email' label='Email' type='text' />
                <SignupFormField name='password' label='Password' type='password' />
                <SignupFormField
                    name='passwordConfirm'
                    label='Password Confirmation'
                    type='password'
                />
            </SignupForm>

            <div className='form_message_container'>Already have an account?</div>
            <Link to='/login' underline='none' component={RouterLink}>
                <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    size='large'
                    sx={{ width: "50ch" }}
                >
                    Log in
                </Button>
            </Link>
            <ToastContainer />
        </div>
    );
};

export default Signup;
