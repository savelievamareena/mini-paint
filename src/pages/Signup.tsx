import { useNavigate, Link as RouterLink } from "react-router-dom";
import { z } from "zod";
import { auth } from "../../firebase.ts";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { toast } from "react-toastify";
import Form from "../components/Form.tsx";
import FormTextField from "../components/FormTextField.tsx";
import Container from "@mui/material/Container";
import { Box, Button, Link } from "@mui/material";

type FormValues = z.infer<typeof schema>;

const schema = z
    .object({
        email: z.string().email("This is not a valid email"),
        password: z.string().min(6, { message: "Password should be at least 6 symbols" }),
        passwordConfirm: z.string().min(6, { message: "Password should be at least 6 symbols" }),
    })
    .superRefine(({ passwordConfirm, password }, ctx) => {
        if (passwordConfirm !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords should be equal",
                path: ["passwordConfirm"],
            });
        }
    });

const defaultValues: FormValues = {
    email: "",
    password: "",
    passwordConfirm: "",
};

const Signup = () => {
    const navigate = useNavigate();

    const onSubmit = async (data: FormValues) => {
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
        <Container sx={{ mt: "200px", width: "450px" }}>
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

            <Box sx={{ textAlign: "center", m: "20px auto 10px" }}>Already have an account?</Box>
            <Link to='/login' underline='none' component={RouterLink}>
                <Button type='submit' variant='outlined' color='primary' size='large' fullWidth>
                    Log in
                </Button>
            </Link>
        </Container>
    );
};

export default Signup;
