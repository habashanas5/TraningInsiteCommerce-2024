import { theme as defaultTheme } from "@insite/client-framework/Theme";
import { postStyleGuideTheme, preStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import merge from "lodash/merge";
import { ColorResult } from "react-color";

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};

export type Updater = (draft: BaseTheme) => void;

export type PresetHelpers = {
    update: (update: Updater) => void;
    tryMatchColorStringToPresetValue: (color: string | undefined) => string | undefined;
    tryMatchColorResultToPresetName: (color: ColorResult) => string | undefined;
    presetColors: string[];
    postStyleGuideTheme: RecursivePartial<BaseTheme>;
    theme: BaseTheme;
};

export function createMergedTheme(theme: Partial<BaseTheme>): BaseTheme {
    // While the theme will originate with the Mobius theme, it immediately diverges, and therefore should be layered
    // atop the Mobius theme when rendering in the preview. We may at some point want this to reference the code themes.
    return merge({}, defaultTheme, preStyleGuideTheme, theme, postStyleGuideTheme);
}
