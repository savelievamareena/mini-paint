import { TextFieldProps } from "@mui/material";

export interface FormInputProps extends Omit<TextFieldProps, "error" | "helperText" | "value"> {
    name: string;
}
