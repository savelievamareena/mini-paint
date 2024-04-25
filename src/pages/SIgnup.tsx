import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.ts";
import { Controller, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button, FormControl, Link, TextField } from "@mui/material";
import { SignupFormValues } from "../../types.ts";

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

    const { control, handleSubmit, clearErrors } = useForm<SignupFormValues>({});

    const onSubmit = (data: SignupFormValues) => {
        if (data.pass !== data.passConfirm) {
            setPassError("Passwords should be equal");
            setTimeout(() => {
                setPassError("");
            }, 3000);
            return;
        }

        const registerUser = async () => {
            try {
                const authUser = await createUserWithEmailAndPassword(auth, data.email, data.pass);
                if (typeof authUser === "object" && authUser.user && authUser.user.email) {
                    setRegisteredEmail(authUser.user.email);
                }
            } catch (error: unknown) {
                if (
                    "code" in (error as { code?: string }) &&
                    (error as { code?: string }).code === "auth/email-already-in-use"
                ) {
                    setAuthError("Email is already in use");
                } else {
                    setAuthError("Something went wrong");
                }
            }
        };
        registerUser();
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
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label='Password'
                                type='password'
                                variant='outlined'
                                onChange={field.onChange}
                                value={field.value}
                                error={!!fieldState.error}
                                helperText={fieldState.error ? fieldState.error.message : " "}
                                margin='dense'
                            />
                        )}
                    />
                    <Controller
                        name='passConfirm'
                        control={control}
                        rules={{ required: "Password confirmation required" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label='Confirm Password'
                                type='password'
                                variant='outlined'
                                onChange={field.onChange}
                                value={field.value}
                                error={!!fieldState.error}
                                helperText={fieldState.error ? fieldState.error.message : " "}
                                margin='dense'
                            />
                        )}
                    />
                    <div>{passError ? passError : " "}</div>
                    <div>{authError ? <span>{authError}</span> : " "}</div>
                    <Button type='submit' variant='contained' color='primary' size='large'>
                        Sign Up
                    </Button>
                </FormControl>
            </form>
            <div>Already have an account?</div>
            <Link href='/login' underline='none'>
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
        </div>
    );
};

export default Signup;
