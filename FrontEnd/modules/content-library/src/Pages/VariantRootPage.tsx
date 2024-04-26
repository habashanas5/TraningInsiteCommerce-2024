import {
    ExcludeFromNavigation,
    ExcludeFromSignInRequired,
    HideFromSearchEngines,
    HideFromSiteSearch,
    MetaDescription,
    MetaKeywords,
} from "@insite/client-framework/Types/FieldDefinition";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import styled from "styled-components";

const VariantRootPage = ({ id }: PageProps) => (
    <Page>
        <MessageWrapper>This page has multiple variants.</MessageWrapper>
    </Page>
);

const pageModule: PageModule = {
    component: VariantRootPage,
    definition: {
        displayName: "Shared Fields",
        hasEditableUrlSegment: false,
        hasEditableTitle: false,
        pageType: "System",
        fieldDefinitions: [
            MetaKeywords,
            MetaDescription,
            HideFromSearchEngines,
            HideFromSiteSearch,
            ExcludeFromNavigation,
            ExcludeFromSignInRequired,
        ],
    },
};

const MessageWrapper = styled.div`
    margin-top: 300px;
    text-align: center;
    color: #999;
    font-weight: bold;
    font-size: 22px;
`;

export default pageModule;
