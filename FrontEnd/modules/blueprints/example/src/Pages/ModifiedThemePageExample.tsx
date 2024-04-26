import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Button from "@insite/mobius/Button";
import Page from "@insite/mobius/Page";
import React from "react";

const ExamplePage = ({ id }: PageProps) => (
    <Page
        themeMod={{
            button: {
                primary: {
                    buttonType: "outline", // Don't forget! You can use Ctrl + Spacebar to have theme properties show up in a tooltip
                },
            },
        }}
    >
        <Button>I am the example button</Button>
        <Zone contentId={id} zoneName="Content"></Zone>
        <Modals />
    </Page>
);

const pageModule: PageModule = {
    component: ExamplePage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "Content",
    },
};

export default pageModule;
