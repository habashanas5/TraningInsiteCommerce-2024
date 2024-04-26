import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import { SavedOrderDetailsPageContext } from "@insite/content-library/Pages/SavedOrderDetailsPage";
import React from "react";

type Props = WidgetProps & HasCartContext;

export interface SavedOrderDetailsTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
}

export const savedOrderDetailsTotalStyles: SavedOrderDetailsTotalStyles = {};

const styles = savedOrderDetailsTotalStyles;

const SavedOrderDetailsTotal = ({ cart }: Props) => {
    if (!cart) {
        return null;
    }

    return <CartTotalDisplay cart={cart} showTaxAndShipping={false} extendedStyles={styles.cartTotal} />;
};

const widgetModule: WidgetModule = {
    component: withCart(SavedOrderDetailsTotal),
    definition: {
        group: "Saved Order Details",
        allowedContexts: [SavedOrderDetailsPageContext],
        displayName: "Saved Order Total",
    },
};

export default widgetModule;
