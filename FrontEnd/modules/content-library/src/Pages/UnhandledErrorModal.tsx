import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import Typography from "@insite/mobius/Typography";
import * as React from "react";

const UnhandledErrorModal = ({
    id,
    fields,
    shellContext: { isCurrentPage, isInShell },
}: PageProps & HasShellContext) => (
    <Page>
        {isCurrentPage && isInShell && (
            // we can't use the PageTitle widget because it will always show the title of the current page. That would work in the shell, but not when the modal displays in the real world
            <Typography variant="h2" as="h1">
                {fields["modalTitle"]}
            </Typography>
        )}
        <Zone contentId={id} zoneName="Content" />
    </Page>
);

const pageModule: PageModule = {
    component: withIsInShell(UnhandledErrorModal),
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "System",
        fieldDefinitions: [
            {
                name: "modalTitle",
                displayName: "Modal Title",
                editorTemplate: "TextField",
                defaultValue: "Unhandled Error",
                fieldType: "Translatable",
                isRequired: true,
                sortOrder: 0,
            },
        ],
    },
};

export default pageModule;
