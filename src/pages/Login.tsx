import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { Button, FormControl, Link, TextField } from "@mui/material";
import { SignupFormValues } from "../../types.ts";

type LoginFormValues = Omit<SignupFormValues, "passConfirm">;

const Login = () => {
    const [authError, setAuthError] = useState("");
    const [registeredEmail, setRegisteredEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (registeredEmail) {
            navigate("/", { state: { email: registeredEmail } });
        }
    }, [registeredEmail]);

    const { control, handleSubmit, clearErrors } = useForm<LoginFormValues>({});

    const onSubmit = (data: LoginFormValues) => {
        const loginUser = async () => {
            try {
                const authUser = await signInWithEmailAndPassword(auth, data.email, data.pass);
                if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                    setRegisteredEmail(authUser.user.email);
                }
            } catch (error: unknown) {
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
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl sx={{ width: "50ch" }}>
                    <Controller
                        name='email'
                        control={control}
                        rules={{ required: "Email required" }}
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
                        name='pass'
                        control={control}
                        rules={{ required: "Password required" }}
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
                    <div>{authError ? <span>{authError}</span> : " "}</div>
                    <Button type='submit' variant='contained' color='primary' size='large'>
                        Log In
                    </Button>
                </FormControl>
            </form>
            <div>Don't have an account?</div>
            <Link href='/signup' underline='none'>
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
