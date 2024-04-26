import * as React from "react";

export interface LayoutGroupContextData {
    /** Order of appearance of this LayoutGroup within its parent LayoutTable. */
    groupIndex: number;
}

const LayoutGroupContext = React.createContext<LayoutGroupContextData>({
    groupIndex: 0,
});

export default LayoutGroupContext;
