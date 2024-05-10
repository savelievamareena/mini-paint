import { useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormInputProps } from "./FormTextField.types.ts";

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
