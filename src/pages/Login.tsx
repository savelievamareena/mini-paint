import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { Box, Button, Link } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormTextField from "../components/FormTextField.tsx";
import Form from "../components/Form.tsx";
import Container from "@mui/material/Container";

const schema = z.object({
    email: z.string().email("This is not a valid email"),
    password: z.string().min(6, { message: "Password should be at least 6 symbols" }),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
    email: "",
    password: "",
};

const Login = () => {
    const navigate = useNavigate();

    const onSubmit = async (data: FormValues) => {
        try {
            const authUser = await signInWithEmailAndPassword(auth, data.email, data.password);
            if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                navigate("/", { state: { email: authUser.user.email } });
            }
        } catch (error: unknown) {
            const authError = error as AuthError;
            if (authError && authError.code === "auth/invalid-credential") {
                toast.error("Invalid Credentials", { position: "bottom-left" });
            } else {
                toast.error("Something went wrong", { position: "bottom-left" });
            }
        }
    };

    return (
        <Container
            sx={{
                mt: "200px",
                width: "450px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <Form schema={schema} defaultValues={defaultValues} onSubmit={onSubmit}>
                <FormTextField name='email' label='Email' type='text' />
                <FormTextField name='password' label='Password' type='password' />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    size='large'
                    sx={{ mt: "20px" }}
                    fullWidth
                >
                    Log In
                </Button>
            </Form>

            <Box sx={{ textAlign: "center", m: "20px auto 10px" }}>Don't have an account?</Box>
            <Link to='/signup' underline='none' component={RouterLink}>
                <Button type='submit' variant='outlined' color='primary' size='large' fullWidth>
                    Sign up
                </Button>
            </Link>
        </Container>
    );
};

export default Login;
