import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebase";
import { ROUTES } from "src/constants";
import { Form } from "./components/Form";
import FormTextField from "./components/FormTextField/FormTextField";
import { Box, Button, CircularProgress, Container, Link } from "@mui/material";
import handleDbErrors from "../../helpers/handleDbError";

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
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setSubmitting(false);
        try {
            const authUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
            if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                toast.success("Success!");
                navigate(ROUTES.HOME);
            }
        } catch (error: unknown) {
            handleDbErrors(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container sx={{ mt: "200px", width: "450px" }}>
            <Form schema={schema} defaultValues={defaultValues} onSubmit={onSubmit}>
                <FormTextField name='email' label='Email' type='text' margin='normal' />
                <FormTextField name='password' label='Password' type='password' margin='normal' />
                <FormTextField
                    name='passwordConfirm'
                    label='Password Confirmation'
                    type='password'
                    margin='normal'
                />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    size='large'
                    sx={{ mt: "20px" }}
                    disabled={submitting}
                    fullWidth
                >
                    {submitting ? <CircularProgress size={26} /> : "Sign Up"}
                </Button>
            </Form>

            <Box sx={{ textAlign: "center", m: "20px auto 10px" }}>Already have an account?</Box>
            <Link to={ROUTES.LOGIN} underline='none' component={RouterLink}>
                <Button type='submit' variant='outlined' color='primary' size='large' fullWidth>
                    Log in
                </Button>
            </Link>
        </Container>
    );
};

export default Signup;
