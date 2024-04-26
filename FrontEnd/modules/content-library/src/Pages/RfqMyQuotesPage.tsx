import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadQuotes from "@insite/client-framework/Store/Data/Quotes/Handlers/LoadQuotes";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import qs from "qs";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    quotesDataView: getQuotesDataView(state, state.pages.rfqMyQuotes.getQuotesParameter),
    getQuotesParameter: state.pages.rfqMyQuotes.getQuotesParameter,
    location: getLocation(state),
});

const mapDispatchToProps = {
    loadQuotes,
    updateSearchFields,
};

type Props = HasHistory &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasShellContext &
    PageProps;

const RfqMyQuotesPage = ({
    id,
    session,
    quotesDataView,
    getQuotesParameter,
    loadQuotes,
    updateSearchFields,
    history,
    location,
}: Props) => {
    let firstLoad = false;

    useEffect(() => {
        firstLoad = true;
        let parsedGetQuotesParameter: GetQuotesApiParameter = {};
        if (location.search) {
            parsedGetQuotesParameter = parseQueryString<GetQuotesApiParameter>(location.search);
            if (typeof parsedGetQuotesParameter.statuses === "string") {
                parsedGetQuotesParameter.statuses = [parsedGetQuotesParameter.statuses];
            }
        }

        updateSearchFields({
            ...getQuotesParameter,
            ...parsedGetQuotesParameter,
            expand: session.isSalesPerson ? ["salesList"] : undefined,
            type: "Replace",
        });
    }, []);

    useEffect(() => {
        if (!firstLoad) {
            const queryString = qs.stringify(getQuotesParameter);
            history.replace(`${location.pathname}${queryString !== "" ? `?${queryString}` : ""}`);
        }
    }, [getQuotesParameter]);

    useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!firstLoad && !quotesDataView.value && !quotesDataView.isLoading) {
            loadQuotes(getQuotesParameter);
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(withIsInShell(RfqMyQuotesPage))),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const RfqMyQuotesPageContext = "RfqMyQuotesPage";
