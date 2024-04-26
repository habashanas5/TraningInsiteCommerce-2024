import { loadPage, UpdateFieldParameter } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { ItemProps } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { updatePageOnSite } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { push } from "connected-react-router";

export * from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";

export const updateField =
    (parameter: UpdateFieldParameter): ShellThunkAction =>
    (dispatch, getState) => {
        dispatch({
            type: "Data/Pages/UpdateField",
            ...parameter,
        });

        updatePageOnSite(getState());
    };

export const removeWidget =
    (id: string, pageId: string): ShellThunkAction =>
    (dispatch, getState) => {
        dispatch({
            type: "Data/Pages/RemoveWidget",
            id,
            pageId,
        });

        updatePageOnSite(getState());
    };

export const addWidget =
    (widget: WidgetProps, index: number, pageId: string): ShellThunkAction =>
    (dispatch, getState) => {
        dispatch({
            type: "Data/Pages/AddWidget",
            widget,
            index,
            pageId,
        });

        updatePageOnSite(getState());
    };

export const moveWidgetTo =
    (id: string, parentId: string, zoneName: string, index: number, pageId: string): ShellThunkAction =>
    (dispatch, getState) => {
        dispatch({
            type: "Data/Pages/MoveWidgetTo",
            id,
            parentId,
            zoneName,
            index,
            pageId,
        });

        updatePageOnSite(getState());
    };

export const replaceItem =
    (item: ItemProps): ShellThunkAction =>
    (dispatch, getState) => {
        dispatch({
            type: "Data/Pages/ReplaceItem",
            item,
        });

        updatePageOnSite(getState());
    };

export const loadPageIfNeeded =
    (pageId: string, finished: () => void): ShellThunkAction =>
    (dispatch, getState) => {
        if (getCurrentPage(getState()).id !== pageId) {
            dispatch(
                loadPage(
                    {
                        pathname: `/Content/Page/${pageId}`,
                        search: "",
                    },
                    undefined,
                    () => {
                        dispatch(push(`/ContentAdmin/Page/${pageId}`));
                        finished();
                    },
                ),
            );
        } else {
            finished();
        }
    };
