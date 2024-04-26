import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import RfqQuoteDetailsProposedDetailsGrid from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsProposedDetailsGrid";
import RfqQuoteDetailsRequestedDetailsGrid from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsRequestedDetailsGrid";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
});

type Props = ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsCustomerProductListStyles {}

export const rfqQuoteDetailsCustomerProductListStyles: RfqQuoteDetailsCustomerProductListStyles = {};

const styles = rfqQuoteDetailsCustomerProductListStyles;

const RfqQuoteDetailsCustomerProductList = ({ quoteState }: Props) => {
    const quote = quoteState.value;
    if (!quote) {
        return null;
    }

    return quote.status === "QuoteProposed" || quote.status === "AwaitingApproval" ? (
        <RfqQuoteDetailsProposedDetailsGrid />
    ) : (
        <RfqQuoteDetailsRequestedDetailsGrid />
    );
};

export default connect(mapStateToProps)(RfqQuoteDetailsCustomerProductList);
