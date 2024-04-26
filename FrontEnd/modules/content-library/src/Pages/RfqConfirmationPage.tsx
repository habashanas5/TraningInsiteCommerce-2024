import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadQuoteIfNeeded from "@insite/client-framework/Store/Pages/RfqConfirmation/Handlers/LoadQuoteIfNeeded";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ quoteId?: string }>(search);
    const quoteId = parsedQuery.quoteId;
    return {
        quoteId,
    };
};

const mapDispatchToProps = {
    loadQuoteIfNeeded,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RfqConfirmationPage = ({ id, quoteId, loadQuoteIfNeeded }: Props) => {
    useEffect(() => {
        if (quoteId) {
            loadQuoteIfNeeded({ quoteId });
        }
    }, []);

    return (
        <Page data-test-selector="rfqConfirmation">
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqConfirmationPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "System",
    },
};

export default pageModule;

export const RfqConfirmationPageContext = "RfqConfirmationPage";
