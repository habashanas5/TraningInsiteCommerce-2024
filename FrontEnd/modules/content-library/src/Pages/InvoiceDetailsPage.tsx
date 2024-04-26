import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getInvoiceState, InvoiceStateContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import displayInvoice from "@insite/client-framework/Store/Pages/InvoiceDetails/Handlers/DisplayInvoice";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);

    let invoiceNumber;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ invoiceNumber: string }>(location.search);
        invoiceNumber = parsedQuery.invoiceNumber;
    }

    const isInvoiceNumberStoredInState = state.pages.invoiceDetails.invoiceNumber === invoiceNumber;

    return {
        invoiceNumber,
        invoiceState: getInvoiceState(state, invoiceNumber),
        shouldDisplayInvoice: !isInvoiceNumberStoredInState,
        shouldLoadOrderStatusMappings: !getOrderStatusMappingDataView(state).value,
    };
};

const mapDispatchToProps = {
    displayInvoice,
};

export interface InvoiceDetailsPageStyles {
    loadFailedWrapper?: InjectableCss;
    loadFailedText?: TypographyPresentationProps;
}

export const invoiceDetailsPageStyles: InvoiceDetailsPageStyles = {
    loadFailedWrapper: {
        css: css`
            display: flex;
            height: 200px;
            justify-content: center;
            align-items: center;
            background-color: ${getColor("common.accent")};
        `,
    },
    loadFailedText: { weight: "bold" },
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class InvoiceDetailsPage extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        // The share entity (for orders) functionality can use this page
        // to render HTML for PDF generation, so we need to leave this SSR
        // ability so that functionality works.
        if (this.props.invoiceNumber && this.props.shouldDisplayInvoice) {
            this.props.displayInvoice({ invoiceNumber: this.props.invoiceNumber });
        }
    }

    render() {
        const styles = invoiceDetailsPageStyles;
        return (
            <Page>
                {this.props.invoiceState.errorStatusCode === 404 ? (
                    <StyledWrapper {...styles.loadFailedWrapper}>
                        <Typography {...styles.loadFailedText}>{siteMessage("InvoiceHistory_Not_Found")}</Typography>
                    </StyledWrapper>
                ) : (
                    <InvoiceStateContext.Provider value={this.props.invoiceState}>
                        <Zone contentId={this.props.id} zoneName="Content" />
                    </InvoiceStateContext.Provider>
                )}
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const InvoiceDetailsPageContext = "InvoiceDetailsPage";
