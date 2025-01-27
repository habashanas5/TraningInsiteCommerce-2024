import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import React from "react";

const QuickOrderPage = ({ id }: PageProps) => (
    <Page>
        <Zone contentId={id} zoneName="Content"></Zone>
        <Modals />
    </Page>
);

const pageModule: PageModule = {
    component: QuickOrderPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const QuickOrderPageContext = "QuickOrderPage";
