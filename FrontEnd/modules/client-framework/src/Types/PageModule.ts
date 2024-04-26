import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import * as React from "react";

export default interface PageModule {
    component: React.ComponentType<any>;
    definition: PageDefinition;
}
