import useAppSelector from "@insite/client-framework/Common/Hooks/useAppSelector";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    canAddToCart as canAddToCartSelector,
    hasEnoughInventory as hasEnoughInventorySelector,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import updateSubscription from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/UpdateSubscription";
import { ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductDeliveryScheduleButton from "@insite/content-library/Components/ProductDeliveryScheduleButton";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import * as React from "react";
import { useDispatch } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasProductContext;

export interface ProductDetailsDeliveryScheduleButtonStyles {
    button?: ButtonPresentationProps;
}

export const deliveryScheduleButtonStyles: ProductDetailsDeliveryScheduleButtonStyles = {
    button: {
        css: css`
            margin-top: 30px;
            width: 100%;
        `,
    },
};

const styles = deliveryScheduleButtonStyles;

const ProductDetailsDeliveryScheduleButton = (props: Props) => {
    const {
        productContext: { product, productInfo },
    } = props;

    const productSettings = useAppSelector(state => getSettingsCollection(state).productSettings);
    const canAddToCart = useAppSelector(state =>
        canAddToCartSelector(
            state,
            product,
            productInfo,
            state.pages.productDetails.configurationCompleted,
            state.pages.productDetails.variantSelectionCompleted,
        ),
    );
    const hasEnoughInventory = useAppSelector(state => hasEnoughInventorySelector(state, props.productContext));
    const subscription = useAppSelector(state => state.pages.productDetails.subscription);
    const dispatch = useDispatch();

    if (
        !product.detail?.isSubscription ||
        !product.detail?.subscription ||
        !productSettings.canAddToCart ||
        !hasEnoughInventory ||
        !canAddToCart
    ) {
        return null;
    }

    const saveScheduleHandler = (updatedSubscription: ProductSubscriptionDto) => {
        dispatch(updateSubscription({ subscription: updatedSubscription }));
    };

    return (
        <ProductDeliveryScheduleButton
            subscription={subscription || product.detail.subscription}
            disabled={productInfo.qtyOrdered <= 0}
            onSave={saveScheduleHandler}
            extendedStyles={styles.button}
        />
    );
};

const widgetModule: WidgetModule = {
    component: withProductContext(ProductDetailsDeliveryScheduleButton),
    definition: {
        displayName: "Delivery Schedule Button",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
