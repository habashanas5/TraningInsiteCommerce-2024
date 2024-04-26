import * as React from "react";

export interface CheckboxGroupContextData {
    /** Size variants.
     * @themable */
    sizeVariant?: "default" | "small";
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextData>({});

export default CheckboxGroupContext;
