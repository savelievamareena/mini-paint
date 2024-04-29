import { Button, FormControl } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormProps } from "../../types.ts";

const SignupForm = ({
    schema,
    onSubmit,
    children,
    authError,
    passError,
    defaultValues,
    submitButtonText,
}: SignupFormProps) => {
    const formMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
    });

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                <FormControl sx={{ width: "50ch" }}>
                    {children}

                    <div className='form_message_container error'>
                        {passError ? passError : authError ? authError : " "}
                    </div>
                    <Button type='submit' variant='contained' color='primary' size='large'>
                        {submitButtonText}
                    </Button>
                </FormControl>
            </form>
        </FormProvider>
    );
};

export default SignupForm;
