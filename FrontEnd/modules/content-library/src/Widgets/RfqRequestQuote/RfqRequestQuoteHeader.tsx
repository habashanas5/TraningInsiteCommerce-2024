import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqRequestQuotePageContext } from "@insite/content-library/Pages/RfqRequestQuotePage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    pageTitle: getCurrentPage(state).fields.title,
    cart: getCurrentCartState(state).value,
});

type Props = ReturnType<typeof mapStateToProps> & WidgetProps;

export interface RfqRequestQuoteHeaderStyles {
    titleText?: TypographyPresentationProps;
}

export const rfqRequestQuoteHeaderStyles: RfqRequestQuoteHeaderStyles = {
    titleText: {
        variant: "h2",
    },
};

const styles = rfqRequestQuoteHeaderStyles;

const RfqRequestQuoteHeader: FC<Props> = ({ pageTitle, cart }) => {
    if (!cart) {
        return null;
    }

    const title = cart.isSalesperson ? pageTitle.replace("Request", "Create") : pageTitle;

    return (
        <Typography {...styles.titleText} as="h1" data-test-selector="requestQuoteHeader">
            {title}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqRequestQuoteHeader),
    definition: {
        group: "RFQ Request Quote",
        displayName: "Header",
        allowedContexts: [RfqRequestQuotePageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
