import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProps } from "./Form.types.ts";

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
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>{children}</form>
        </FormProvider>
    );
};

export default Form;
