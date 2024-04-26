import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";

const RobotsTxtPage = ({ id }: PageProps) => (
    <Page>
        <Zone contentId={id} zoneName="Content" fixed />
    </Page>
);

const pageModule: PageModule = {
    component: RobotsTxtPage,
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: false,
        pageType: "System",
        fieldDefinitions: [],
    },
};

export default pageModule;

export const RobotsTxtPageContext = "RobotsTxtPage";
