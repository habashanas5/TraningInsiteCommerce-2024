import { BaseTheme } from "@insite/mobius/globals/baseTheme";

export interface StyleGuideState {
    theme?: Partial<BaseTheme>;
    saving?: true;
    history: Partial<BaseTheme>[];
    historyIndex: number;
}
