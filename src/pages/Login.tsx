import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { Button, FormControl, Link, TextField } from "@mui/material";

const schema = z.object({
    email: z.string().email("This is not a valid email."),
    password: z.string().min(6, { message: "Password should be at least 6 symbols" }),
});

type Schema = z.infer<typeof schema>;

const Login = () => {
    const [authError, setAuthError] = useState("");
    const [registeredEmail, setRegisteredEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (registeredEmail) {
            navigate("/", { state: { email: registeredEmail } });
        }
    }, [registeredEmail]);

    const { control, handleSubmit, clearErrors } = useForm<Schema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: Schema) => {
        const loginUser = async () => {
            try {
                const authUser = await signInWithEmailAndPassword(auth, data.email, data.password);
                if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                    setRegisteredEmail(authUser.user.email);
                }
            } catch (error: unknown) {
                console.log(error);
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl sx={{ width: "50ch" }}>
                    <Controller
                        name='email'
                        control={control}
                        defaultValue=''
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label='Email'
                                variant='outlined'
                                onChange={(event) => {
                                    onChange(event);
                                    clearErrors("email");
                                }}
                                value={value}
                                error={!!error}
                                helperText={error ? error.message : " "}
                                margin='dense'
                            />
                        )}
                    />
                    <Controller
                        name='password'
                        control={control}
                        defaultValue=''
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label='Password'
                                type='password'
                                variant='outlined'
                                onChange={(event) => {
                                    onChange(event);
                                    clearErrors("email");
                                }}
                                value={value}
                                error={!!error}
                                helperText={error ? error.message : " "}
                                margin='dense'
                            />
                        )}
                    />
                    <div className='form_message_container error'>
                        {authError ? <span>{authError}</span> : " "}
                    </div>
                    <Button type='submit' variant='contained' color='primary' size='large'>
                        Log In
                    </Button>
                </FormControl>
            </form>
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
        </div>
    );
};

export default Login;
