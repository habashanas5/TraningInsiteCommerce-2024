import { Dictionary } from "@insite/client-framework/Common/Types";

export default interface ContentItemModel extends HasFields {
    /** Identifies the item. Between published versions this id will stay the same. */
    id: string;
    parentId: string;
    type: string;
    generalFields: Dictionary<any>;
    /** [fieldName][languageId]: value */
    translatableFields: TranslatableFields;
    /**
     * [fieldName][languageId|personaId|deviceType]: value
     * where languageId|personaId|deviceType means something like '00d1fdae-1e9c-4d25-9945-93901c1ab70b|93b47c1d-482c-4eb7-b995-a2c996838a19|Desktop'
     */
    contextualFields: ContextualFields;
}

interface TranslatableFields {
    [fieldName: string]: {
        [languageId: string]: any;
    };
}

interface ContextualFields {
    [fieldName: string]: {
        [contextId: string]: any;
    };
}

export interface HasFields {
    fields: Dictionary<any>;
}

export type DeviceType = "Desktop" | "Tablet" | "Phone";
