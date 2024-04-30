import { useNavigate, Link as RouterLink } from "react-router-dom";
import { auth } from "../../firebase.ts";
import { z } from "zod";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import Form from "../components/Form.tsx";
import FormTextField from "../components/FormTextField.tsx";
import { Button, Link } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "./styles/pages.css";

type FormValues = z.infer<typeof schema>;

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

const Signup = () => {
    const navigate = useNavigate();

    const onSubmit = async (data: FormValues) => {
        if (data.password !== data.passwordConfirm) {
            toast.error("Passwords should be equal", { position: "bottom-left" });
            return;
        }

        try {
            const authUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
            if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                toast.success("Success!", { position: "bottom-left" });
                navigate("/", { state: { email: authUser.user.email } });
            }
        } catch (error: unknown) {
            const authError = error as AuthError;
            if (authError && authError.code === "auth/email-already-in-use") {
                toast.error("This email is already in use", { position: "bottom-left" });
            } else {
                toast.error("Something went wrong", { position: "bottom-left" });
            }
        }
    };

    return (
        <div className='form_container'>
            <div className='form_wrapper'>
                <Form schema={schema} defaultValues={defaultValues} onSubmit={onSubmit}>
                    <FormTextField name='email' label='Email' type='text' />
                    <FormTextField name='password' label='Password' type='password' />
                    <FormTextField
                        name='passwordConfirm'
                        label='Password Confirmation'
                        type='password'
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        size='large'
                        sx={{ mt: "20px" }}
                        fullWidth
                    >
                        Sign Up
                    </Button>
                </Form>

                <div className='form_message_container'>Already have an account?</div>
                <Link to='/login' underline='none' component={RouterLink} sx={{ width: "100%" }}>
                    <Button type='submit' variant='outlined' color='primary' size='large' fullWidth>
                        Log in
                    </Button>
                </Link>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Signup;
