import * as React from "react";

export interface AccordionContextData {
    /** The level to set for all section titles, appropriate for the architecture of the page. */
    headingLevel: number;
}

const AccordionContext = React.createContext({ headingLevel: 1 });

export default AccordionContext;
