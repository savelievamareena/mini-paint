import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormProps } from "../../types.ts";

const Form = <T extends FieldValues>({
    schema,
    onSubmit,
    children,
    defaultValues,
}: SignupFormProps<T>) => {
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
