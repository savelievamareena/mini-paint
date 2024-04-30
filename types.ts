import { ZodSchema } from "zod";
import React from "react";
import { DefaultValues, FieldValues, SubmitHandler } from "react-hook-form";

interface SignupFormProps<T extends FieldValues> {
    schema: ZodSchema<T>;
    onSubmit: SubmitHandler<T>;
    children: React.ReactNode;
    authError?: string;
    passError?: string;
    defaultValues: DefaultValues<T>;
}

export type { SignupFormProps };
