import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import RfqQuoteDetailsCustomerProductList from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsCustomerProductList";
import RfqQuoteDetailsSalesRepProductList from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsSalesRepProductList";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsProductListStyles {}

export const rfqQuoteDetailsProductListStyles: RfqQuoteDetailsProductListStyles = {};

const styles = rfqQuoteDetailsProductListStyles;

const RfqQuoteDetailsProductList = ({ quoteState }: Props) => {
    const quote = quoteState.value;
    if (!quote) {
        return null;
    }

    return quote.isSalesperson ? <RfqQuoteDetailsSalesRepProductList /> : <RfqQuoteDetailsCustomerProductList />;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqQuoteDetailsProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [RfqQuoteDetailsPageContext],
        group: "RFQ Quote Details",
    },
};

export default widgetModule;
