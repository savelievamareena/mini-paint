import React from "react";
import { FieldValues, FormProvider, useForm, DefaultValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";

interface FormProps<T extends FieldValues> {
    schema: ZodSchema<T>;
    onSubmit: SubmitHandler<T>;
    children: React.ReactNode;
    defaultValues: DefaultValues<T>;
}

const Form = <T extends FieldValues>({
    schema,
    onSubmit,
    children,
    defaultValues,
}: FormProps<T>) => {
    const formMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
    });

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className={"form_component"}>
                {children}
            </form>
        </FormProvider>
    );
};

export default Form;
