import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import get from "@insite/mobius/utilities/get";
import { RecursivePartial } from "@insite/shell/Components/Shell/StyleGuide/Types";
import set from "lodash/set";

export const createSetNewValueInDraft =
    (itemLocation: string) => (draft: Partial<BaseTheme>, newValue: string | undefined | boolean) => {
        set(draft, itemLocation, newValue);
    };

export const createSetParentIfUndefined =
    (itemLocation: string) => (draft: BaseTheme | RecursivePartial<BaseTheme>) => {
        let themeValueToModify = get(draft, itemLocation);
        if (!themeValueToModify) {
            set(draft, itemLocation, {});
            themeValueToModify = get(draft, itemLocation);
        }
        return themeValueToModify;
    };

export const undefinedIfFunction = (value: string | undefined | Function) =>
    typeof value === "function" ? undefined : value;
