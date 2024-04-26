import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import * as React from "react";

const MyAccountPage = ({ id }: PageProps) => {
    return (
        <Page data-test-selector="myAccount">
            <Zone contentId={id} zoneName="Content"></Zone>
            <Modals />
        </Page>
    );
};

const pageModule: PageModule = {
    component: MyAccountPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const MyAccountPageContext = "MyAccountPage";
