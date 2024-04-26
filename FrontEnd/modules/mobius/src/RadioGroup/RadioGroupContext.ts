import { checkboxSizes } from "@insite/mobius/Checkbox";
import * as React from "react";

const RadioGroupContext = React.createContext<{
    name?: string;
    onChange?: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
    sizeVariant?: keyof typeof checkboxSizes;
    value?: string;
}>({});

export default RadioGroupContext;
