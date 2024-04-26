import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";

export const showNeverPublishedModal =
    (fieldName: string, nodeId: string): ShellThunkAction =>
    dispatch => {
        dispatch({
            type: "NeverPublishedModal/ShowModal",
            fieldName,
            nodeId,
        });
    };
