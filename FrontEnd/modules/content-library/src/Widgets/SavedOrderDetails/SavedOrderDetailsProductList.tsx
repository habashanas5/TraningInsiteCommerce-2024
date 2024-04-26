import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import { CartLineContext } from "@insite/client-framework/Components/CartLineContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import { SavedOrderDetailsPageContext } from "@insite/content-library/Pages/SavedOrderDetailsPage";
import SavedOrderDetailsCartLine from "@insite/content-library/Widgets/SavedOrderDetails/SavedOrderDetailsCartLine";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasCartContext;

export interface SavedOrderDetailsProductListStyles {
    wrapper?: InjectableCss;
    cartLineCardContainer?: CardContainerStyles;
}

export const savedOrderDetailsProductListStyles: SavedOrderDetailsProductListStyles = {
    wrapper: {
        css: css`
            border-top: 1px solid ${getColor("common.border")};
        `,
    },
};

const styles = savedOrderDetailsProductListStyles;

const SavedOrderDetailsProductList: React.FunctionComponent<Props> = ({ cart }) => {
    if (!cart || !cart.cartLines) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper} data-test-selector={`savedOrderDetails_cartLinesList_${cart.id}`}>
            {cart.cartLines.map(cartLine => (
                <CartLineContext.Provider value={cartLine} key={cartLine.id}>
                    <SavedOrderDetailsCartLine cart={cart} />
                </CartLineContext.Provider>
            ))}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withCart(SavedOrderDetailsProductList),
    definition: {
        allowedContexts: [SavedOrderDetailsPageContext],
        group: "Saved Order Details",
    },
};

export default widgetModule;
