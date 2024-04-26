import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import * as React from "react";

export default interface WidgetModule<T = FieldDefinition> {
    component: React.ComponentType<any>;
    definition: WidgetDefinition<T>;
}
