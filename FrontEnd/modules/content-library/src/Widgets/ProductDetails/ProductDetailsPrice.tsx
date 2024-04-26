import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import * as React from "react";
import { connect } from "react-redux";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

export interface ProductDetailsPriceStyles {
    productPrice?: ProductPriceStyles;
}

export const priceStyles: ProductDetailsPriceStyles = {
    productPrice: {
        price: {
            priceText: { size: 26 },
            unitOfMeasureText: { size: 26 },
        },
    },
};

const styles = priceStyles;

const ProductDetailsPrice: React.FC<OwnProps> = ({ productContext, productSettings }) => {
    return (
        <ProductPrice
            product={productContext}
            showLabel={false}
            showSavings={true}
            showSavingsAmount={productSettings.showSavingsAmount}
            showSavingsPercent={productSettings.showSavingsPercent}
            extendedStyles={styles.productPrice}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProductContext(ProductDetailsPrice)),
    definition: {
        displayName: "Price",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
