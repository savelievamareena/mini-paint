import { DefaultValues, FieldValues, SubmitHandler } from "react-hook-form";
import { ZodSchema } from "zod";
import React from "react";

export interface FormProps<T extends FieldValues> {
    schema: ZodSchema<T>;
    onSubmit: SubmitHandler<T>;
    children: React.ReactNode;
    defaultValues: DefaultValues<T>;
}
