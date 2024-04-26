import { BaseTheme } from "@insite/mobius/globals/baseTheme";

type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};

export let preStyleGuideTheme: RecursivePartial<BaseTheme> = {};
export let postStyleGuideTheme: RecursivePartial<BaseTheme> = {};

/**
 * Sets the theme layer to use after the Mobius base theme is applied but before the Style Guide.
 */
export const setPreStyleGuideTheme = (theme: RecursivePartial<BaseTheme>) => {
    preStyleGuideTheme = theme;
};

/**
 * Sets the theme layer to use after the Style Guide.
 * This is the last theme applied; styles defined here cannot be overridden via the Style Guide.
 */
export const setPostStyleGuideTheme = (theme: RecursivePartial<BaseTheme>) => {
    postStyleGuideTheme = theme;
};
