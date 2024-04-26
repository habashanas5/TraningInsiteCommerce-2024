import useAppSelector from "@insite/client-framework/Common/Hooks/useAppSelector";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { useToaster } from "@insite/mobius/Toast/ToasterContext";
import React, { useEffect } from "react";

const BypassedAuthorizationWarning = () => {
    const { id: pageId } = useAppSelector(state => getCurrentPage(state));
    const bypassedAuthorization = useAppSelector(state => state.data.pages.bypassedAuthorization[pageId]);
    const toaster = useToaster();

    useEffect(() => {
        if (bypassedAuthorization) {
            toaster.addToast({
                body: "The page you are viewing requires authorization and may not display correctly if you are not signed in.",
                messageType: "warning",
                timeoutLength: 6000,
            });
        }
    }, [pageId, bypassedAuthorization]);

    return null;
};

export default BypassedAuthorizationWarning;
