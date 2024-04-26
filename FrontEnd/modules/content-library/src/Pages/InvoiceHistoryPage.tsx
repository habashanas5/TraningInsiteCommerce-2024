import { getCookie } from "@insite/client-framework/Common/Cookies";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadInvoices from "@insite/client-framework/Store/Data/Invoices/Handlers/LoadInvoices";
import {
    getInvoicesDataView,
    InvoicesDataViewContext,
} from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import qs from "qs";
import * as React from "react";
import { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettingsCollection(state),
    getInvoicesParameter: state.pages.invoiceHistory.getInvoicesParameter,
    invoicesDataView: getInvoicesDataView(state, state.pages.invoiceHistory.getInvoicesParameter),
    location: getLocation(state),
});

const mapDispatchToProps = {
    loadInvoices,
    updateSearchFields,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

const InvoiceHistoryPage = ({
    settings,
    updateSearchFields,
    loadInvoices,
    id,
    invoicesDataView,
    history,
    location,
    getInvoicesParameter,
}: Props) => {
    let firstLoad = false;
    useEffect(() => {
        firstLoad = true;
        const pageSizeCookie = getCookie("InvoiceHistory-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (location.search) {
            const getInvoicesApiParameter = parseQueryString<GetInvoicesApiParameter>(location.search);
            if (pageSize) {
                getInvoicesApiParameter.pageSize = pageSize;
            }
            updateSearchFields({ ...getInvoicesApiParameter, type: "Replace" });
        } else if (settings.invoiceSettings.lookBackDays > 0) {
            const tzOffset = new Date().getTimezoneOffset() * 60000;
            const fromDate = new Date(
                Date.now() - settings.invoiceSettings.lookBackDays * 60 * 60 * 24 * 1000 - tzOffset,
            );
            updateSearchFields({ fromDate: fromDate.toISOString().split("T")[0], type: "Initialize", pageSize });
        }
    }, []);

    useEffect(() => {
        if (!firstLoad) {
            const queryString = qs.stringify(getInvoicesParameter);
            history.replace(`${location.pathname}${queryString !== "" ? `?${queryString}` : ""}`);
        }
    }, [getInvoicesParameter]);

    useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!invoicesDataView.value && !invoicesDataView.isLoading) {
            loadInvoices(getInvoicesParameter);
        }
    });

    return (
        <Page>
            <InvoicesDataViewContext.Provider value={invoicesDataView}>
                <Zone contentId={id} zoneName="Content" />
            </InvoicesDataViewContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(InvoiceHistoryPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const InvoiceHistoryPageContext = "InvoiceHistoryPage";
