import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { Button, Link } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupFormField from "../components/SignupFormField.tsx";
import SignupForm from "../modules/SignupForm.tsx";
import { FormValues } from "../../types.ts";

const schema = z.object({
    email: z.string().email("This is not a valid email"),
    password: z.string().min(6, { message: "Password should be at least 6 symbols" }),
});

const defaultValues: FormValues = {
    email: "",
    password: "",
};

export type Schema = z.infer<typeof schema>;

const Login = () => {
    const [authError, setAuthError] = useState("");
    const [registeredEmail, setRegisteredEmail] = useState("");
    const navigate = useNavigate();

    const notifySuccess = () => toast.success("Success!", { position: "bottom-left" });
    const notifyError = () => toast.error("Error!", { position: "bottom-left" });

    useEffect(() => {
        if (registeredEmail) {
            navigate("/", { state: { email: registeredEmail } });
        }
    }, [registeredEmail]);

    const onSubmit = (data: Schema) => {
        const loginUser = async () => {
            try {
                const authUser = await signInWithEmailAndPassword(auth, data.email, data.password);
                if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                    notifySuccess();
                    setRegisteredEmail(authUser.user.email);
                }
            } catch (error: unknown) {
                notifyError();
                if (
                    "code" in (error as { code?: string }) &&
                    (error as { code?: string }).code === "auth/invalid-credential"
                ) {
                    setAuthError("Invalid Credentials");
                } else {
                    setAuthError("Something went wrong");
                }
            }
        };
        loginUser();
    };

    return (
        <div className='signup_wrapper'>
            <SignupForm
                schema={schema}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                authError={authError}
                submitButtonText={"Log In"}
            >
                <SignupFormField name='email' label='Email' type='text' />
                <SignupFormField name='password' label='Password' type='password' />
            </SignupForm>

            <div className='form_message_container'>Don't have an account?</div>
            <Link to='/signup' underline='none' component={RouterLink}>
                <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    size='large'
                    sx={{ width: "50ch" }}
                >
                    Sign up
                </Button>
            </Link>
            <ToastContainer />
        </div>
    );
};

export default Login;
