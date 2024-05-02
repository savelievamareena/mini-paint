import { useFormContext } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

interface FormInputProps extends Omit<TextFieldProps, "error" | "helperText" | "value"> {
    name: string;
}

const FormTextField = ({ name, ...props }: FormInputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const errorMessage = errors[name]?.message;
    const helperText = typeof errorMessage === "string" ? errorMessage : "";

    return (
        <TextField
            {...register(name)}
            {...props}
            error={!!errors[name]}
            helperText={helperText}
            fullWidth
        />
    );
};

export default FormTextField;
