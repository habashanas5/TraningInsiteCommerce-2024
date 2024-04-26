import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadJobQuotes from "@insite/client-framework/Store/Data/JobQuotes/Handlers/LoadJobQuotes";
import { getJobQuotesDataView } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuotesDataView: getJobQuotesDataView(state, state.pages.rfqJobQuotes.getJobQuotesParameter),
    getJobQuotesParameter: state.pages.rfqJobQuotes.getJobQuotesParameter,
});

const mapDispatchToProps = {
    loadJobQuotes,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RfqJobQuotesPage = ({ id, jobQuotesDataView, getJobQuotesParameter, loadJobQuotes }: Props) => {
    useEffect(() => {
        if (!jobQuotesDataView.value && !jobQuotesDataView.isLoading) {
            loadJobQuotes(getJobQuotesParameter);
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqJobQuotesPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const RfqJobQuotesPageContext = "RfqJobQuotesPage";
