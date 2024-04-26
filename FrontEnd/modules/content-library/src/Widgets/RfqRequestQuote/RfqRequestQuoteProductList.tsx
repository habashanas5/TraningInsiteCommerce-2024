import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { CartLineContext } from "@insite/client-framework/Components/CartLineContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import removeCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/RemoveCartLine";
import updateCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/UpdateCartLine";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqRequestQuotePageContext } from "@insite/content-library/Pages/RfqRequestQuotePage";
import CartLineCardExpanded, {
    CartLineCardExpandedStyles,
} from "@insite/content-library/Widgets/Cart/CartLineCardExpanded";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state).value,
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    updateCartLine,
    removeCartLine,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps;

export interface RfqRequestQuoteProductListStyles {
    lineCountWrapper?: InjectableCss;
    lineCountStyles?: TypographyPresentationProps;
    cartLineStyles?: CartLineCardExpandedStyles;
}

export const rfqRequestQuoteProductListStyles: RfqRequestQuoteProductListStyles = {
    lineCountWrapper: {
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding-bottom: 20px;
        `,
    },
    lineCountStyles: { weight: 600 },
};

const styles = rfqRequestQuoteProductListStyles;

const RfqRequestQuoteProductList: FC<Props> = ({ cart, productSettings, updateCartLine, removeCartLine }) => {
    if (!cart || !cart.cartLines) {
        return null;
    }

    const cartLines = cart.cartLines;

    return (
        <>
            <StyledWrapper {...styles.lineCountWrapper}>
                <Typography {...styles.lineCountStyles}>
                    {cartLines.length} {translate("Products")}
                </Typography>
            </StyledWrapper>
            {cartLines.map(cartLine => {
                const showRemoveAction = !cartLine.isPromotionItem && cart.canModifyOrder;
                return (
                    <CartLineContext.Provider value={cartLine} key={cartLine.id}>
                        <CartLineCardExpanded
                            cart={cart}
                            promotions={[]}
                            productSettings={productSettings}
                            showInventoryAvailability={true}
                            showLineNotes={true}
                            extendedStyles={styles.cartLineStyles}
                            updateCartLine={updateCartLine}
                            removeCartLine={removeCartLine}
                            showRemoveAction={showRemoveAction}
                            hideAddToList={true}
                        />
                    </CartLineContext.Provider>
                );
            })}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqRequestQuoteProductList),
    definition: {
        group: "RFQ Request Quote",
        displayName: "Product List",
        allowedContexts: [RfqRequestQuotePageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
