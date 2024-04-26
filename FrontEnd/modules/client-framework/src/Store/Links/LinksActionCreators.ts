import AppThunkAction from "@insite/client-framework/Common/AppThunkAction";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getPageLinks } from "@insite/client-framework/Services/ContentService";

export const loadPageLinks = (): AppThunkAction => dispatch => {
    addTask(
        (async function () {
            dispatch({
                type: "Links/BeginLoadPageLinks",
            });

            const result = await getPageLinks();

            if (result === null) {
                throw new Error(
                    `No pageLinks were returned from the api. This usually indicates that there was a problem generating the home page. 
Regenerate the site using ?generateIfNeeded=true and then check the logs for errors during generation.`,
                );
            }

            dispatch({
                pageLinks: result,
                type: "Links/CompleteLoadPageLinks",
            });
        })(),
    );
};
