import { ZodSchema } from "zod";
import React from "react";

interface FormValues {
    email: string;
    password: string;
    passwordConfirm?: string;
}

interface SignupFormProps {
    schema: ZodSchema<any>;
    onSubmit: (data: any) => void;
    children: React.ReactNode;
    authError?: string;
    passError?: string;
    defaultValues: FormValues;
    submitButtonText: string;
}

export type { FormValues, SignupFormProps };
