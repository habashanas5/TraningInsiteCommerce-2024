import Zone from "@insite/client-framework/Components/Zone";
import {
    ExcludeFromNavigation,
    ExcludeFromSignInRequired,
    HideFooter,
    HideFromSearchEngines,
    HideFromSiteSearch,
    HideHeader,
    HorizontalRule,
    MetaDescription,
    MetaKeywords,
    OpenGraphImage,
    OpenGraphTitle,
    OpenGraphUrl,
} from "@insite/client-framework/Types/FieldDefinition";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import MobiusPage from "@insite/mobius/Page";
import * as React from "react";

const NewsPage: React.FunctionComponent<PageProps> = ({ id }) => (
    <MobiusPage>
        <Zone contentId={id} zoneName="Content" requireRows />
    </MobiusPage>
);

const pageModule: PageModule = {
    component: NewsPage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: true,
        pageType: "Content",
        allowedParents: ["NewsListPage"],
        fieldDefinitions: [
            MetaKeywords,
            MetaDescription,
            OpenGraphTitle,
            OpenGraphUrl,
            OpenGraphImage,
            {
                ...HorizontalRule,
                sortOrder: 199,
            },
            HideHeader,
            HideFooter,
            HideFromSearchEngines,
            HideFromSiteSearch,
            ExcludeFromNavigation,
            ExcludeFromSignInRequired,
            {
                ...HorizontalRule,
                sortOrder: 150,
            },
            {
                name: "publishDate",
                defaultValue: null,
                editorTemplate: "DateTimeField",
                fieldType: "General",
                isRequired: true,
                sortOrder: 151,
            },
            {
                name: "author",
                defaultValue: "",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                sortOrder: 152,
            },
            {
                name: "newsContent",
                defaultValue: "",
                editorTemplate: "RichTextField",
                fieldType: "Translatable",
                isRequired: true,
                sortOrder: 153,
            },
            {
                name: "newsSummary",
                defaultValue: "",
                editorTemplate: "RichTextField",
                fieldType: "Translatable",
                sortOrder: 154,
            },
        ],
    },
};

export default pageModule;

export const NewsPageContext = "NewsPage";
