import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { auth } from "../../firebase.ts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button, FormControl, Link, TextField } from "@mui/material";

const schema = z.object({
    email: z.string().email("This is not a valid email."),
    password: z.string().min(6, { message: "Password should be at least 6 symbols" }),
    passwordConfirm: z.string().min(6, { message: "Password should be at least 6 symbols" }),
});

type Schema = z.infer<typeof schema>;

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

    const { control, handleSubmit, clearErrors } = useForm<Schema>({
        resolver: zodResolver(schema),
    });

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
                                    console.log(value);
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
                        name='passwordConfirm'
                        control={control}
                        defaultValue=''
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
                    <div className='form_message_container error'>
                        {passError ? passError : authError ? authError : ""}
                    </div>
                    <Button type='submit' variant='contained' color='primary' size='large'>
                        Sign Up
                    </Button>
                </FormControl>
            </form>
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
        </div>
    );
};

export default Signup;
