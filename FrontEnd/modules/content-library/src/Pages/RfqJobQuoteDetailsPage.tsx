import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getJobQuoteState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadJobQuoteIfNeeded from "@insite/client-framework/Store/Pages/RfqJobQuoteDetails/Handlers/LoadJobQuoteIfNeeded";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ jobQuoteId?: string }>(search);
    const jobQuoteId = parsedQuery.jobQuoteId;

    return {
        jobQuoteId,
        jobQuoteState: getJobQuoteState(state, jobQuoteId),
    };
};

const mapDispatchToProps = {
    loadJobQuoteIfNeeded,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RfqJobQuoteDetailsPage = ({ id, jobQuoteId, jobQuoteState, loadJobQuoteIfNeeded }: Props) => {
    useEffect(() => {
        if (jobQuoteId && !jobQuoteState.isLoading) {
            loadJobQuoteIfNeeded({ jobQuoteId });
        }
    }, [jobQuoteId, jobQuoteState.isLoading]);

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqJobQuoteDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const RfqJobQuoteDetailsPageContext = "RfqJobQuoteDetailsPage";
