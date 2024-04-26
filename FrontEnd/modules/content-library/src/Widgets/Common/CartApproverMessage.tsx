import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state).value,
});

export interface CartApproverMessageStyles {
    approvingText?: TypographyPresentationProps;
    approvingWrapper?: InjectableCss;
}

export const cartApproverMessageStyles: CartApproverMessageStyles = {
    approvingWrapper: {
        css: css`
            text-align: center;
            padding: 10px;
            background-color: ${getColor("info.main")};
        `,
    },
    approvingText: {
        css: css`
            width: 100%;
        `,
    },
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

const styles = cartApproverMessageStyles;
const CartApproverMessage = ({ cart }: Props) => {
    if (!cart || !cart.isAwaitingApproval || cart.cartLines?.length === 0) {
        return null;
    }

    return (
        <StyledWrapper {...styles.approvingWrapper}>
            <Typography {...styles.approvingText} data-test-selector="tst_cart_approvingOrderMessage">
                {translate("Approving Order for {0}", cart.initiatedByUserName?.toUpperCase())}
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CartApproverMessage),
    definition: {
        displayName: "Cart Approver Message",
        group: "Common",
    },
};

export default widgetModule;
