import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { StyleGuideState } from "@insite/shell/Store/StyleGuide/StyleGuideState";
import { Draft } from "immer";

type HasTheme = {
    theme: Partial<BaseTheme>;
};

const initialState: StyleGuideState = {
    history: [],
    historyIndex: 0,
};

const reducer = {
    "StyleGuide/SetTheme": (draft: Draft<StyleGuideState>, action: HasTheme) => {
        // the as any's are needed to avoid typescript getting confused by TS2589: Type instantiation is excessively deep and possibly infinite.
        const themeAsAny = action.theme as any;
        draft.history = (draft.history as Partial<BaseTheme>[]).slice(0, draft.historyIndex + 1) as any;
        draft.history.push(themeAsAny);
        draft.theme = themeAsAny;
        draft.historyIndex = draft.history.length - 1;
    },
    "StyleGuide/Undo": (draft: Draft<StyleGuideState>) => {
        if (draft.historyIndex === 0) {
            return;
        }

        draft.theme = draft.history[draft.historyIndex - 1];
        draft.historyIndex = draft.historyIndex - 1;
    },
    "StyleGuide/Redo": (draft: Draft<StyleGuideState>) => {
        if (draft.historyIndex === draft.history.length - 1) {
            return;
        }

        draft.theme = draft.history[draft.historyIndex + 1];
        draft.historyIndex = draft.historyIndex + 1;
    },
    "StyleGuide/Cancel": (draft: Draft<StyleGuideState>) => {
        draft.historyIndex = 0;
        draft.theme = draft.history[0];
        draft.history = [draft.theme];
    },
    "StyleGuide/SaveStarted": (draft: Draft<StyleGuideState>) => {
        draft.saving = true;
    },
    "StyleGuide/SaveCompleted": (draft: Draft<StyleGuideState>) => {
        if (!draft.theme) {
            return;
        }
        draft.historyIndex = 0;
        draft.history = [draft.theme];
        draft.saving = undefined;
    },
    "StyleGuide/LoadStarted": (draft: Draft<StyleGuideState>) => {
        draft.theme = undefined;
    },
    "StyleGuide/LoadCompleted": (draft: Draft<StyleGuideState>, action: HasTheme) => {
        draft.theme = action.theme as any;
        draft.history = [action.theme as any];
        draft.historyIndex = 0;
    },
    "StyleGuide/Unload": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
