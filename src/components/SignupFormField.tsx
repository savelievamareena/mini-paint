import { useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

interface FormInputProps {
    name: string;
    label: string;
    type: string;
    margin?: "none" | "dense" | "normal";
    variant?: "outlined" | "filled" | "standard";
}

const SignupFormField = ({
    name,
    label,
    type,
    margin = "dense",
    variant = "outlined",
}: FormInputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const errorMessage = errors[name]?.message;
    const helperText = typeof errorMessage === "string" ? errorMessage : "";

    return (
        <TextField
            {...register(name)}
            label={label}
            error={!!errors[name]}
            helperText={helperText}
            type={type}
            variant={variant}
            margin={margin}
            fullWidth
        />
    );
};

export default SignupFormField;
