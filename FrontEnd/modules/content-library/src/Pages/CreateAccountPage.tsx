import addMaximumScaleToViewport from "@insite/client-framework/Common/Utilities/addMaximumScaleToViewport";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import isMobile from "ismobilejs";
import * as React from "react";
import { useEffect } from "react";

export const CreateAccountPage = ({ id }: PageProps) => {
    useEffect(() => {
        if (isMobile(window.navigator).apple.tablet || isMobile(window.navigator).apple.phone) {
            addMaximumScaleToViewport();
        }
    }, []);

    return (
        <Page>
            <Zone zoneName="Content" contentId={id} />
        </Page>
    );
};

const pageModule: PageModule = {
    component: CreateAccountPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const CreateAccountPageContext = "CreateAccountPage";
