import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getTheme } from "@insite/client-framework/Services/ContentService";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { Updater } from "@insite/shell/Components/Shell/StyleGuide/Types";
import { saveTheme as saveThemeApi } from "@insite/shell/Services/ContentAdminService";
import shellTheme from "@insite/shell/ShellTheme";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import produce from "immer";

export const resetTheme = (): AnyShellAction => ({
    type: "StyleGuide/SetTheme",
    theme: {},
});

export const setTheme = (theme: Partial<BaseTheme>, update: Updater): AnyShellAction => ({
    type: "StyleGuide/SetTheme",
    theme: produce(theme, update),
});

export const saveTheme =
    (theme: Partial<BaseTheme>): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                dispatch({ type: "StyleGuide/SaveStarted" });

                await saveThemeApi(theme);

                dispatch({ type: "StyleGuide/SaveCompleted" });
            })(),
        );
    };

export const loadTheme = (): ShellThunkAction => dispatch => {
    if (!IS_PRODUCTION && window.location.href.indexOf("shell=true") > 0) {
        dispatch({
            type: "StyleGuide/LoadCompleted",
            theme: shellTheme,
        });
    } else {
        getTheme().then(theme => {
            dispatch({
                type: "StyleGuide/LoadCompleted",
                theme: { ...theme },
            });
        });
    }
};

export const cancelSave = (): AnyShellAction => ({
    type: "StyleGuide/Cancel",
});

export const undo = (): AnyShellAction => ({
    type: "StyleGuide/Undo",
});

export const redo = (): AnyShellAction => ({
    type: "StyleGuide/Redo",
});
