import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ConfigurationType } from "@insite/client-framework/Services/ProductServiceV2";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import * as React from "react";
import { connect } from "react-redux";

type Props = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    configurationCompleted: state.pages.productDetails.configurationCompleted,
});

export interface ProductDetailsAvailabilityStyles {
    availability?: ProductAvailabilityStyles;
}

export const availabilityStyles: ProductDetailsAvailabilityStyles = {};

const styles = availabilityStyles;

const ProductDetailsAvailability = ({ product, configurationCompleted }: Props) => {
    if (!product) {
        return null;
    }

    return (
        <ProductContextAvailability
            isProductDetailsPage={true}
            configurationCompleted={configurationCompleted}
            extendedStyles={styles.availability}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsAvailability)),
    definition: {
        displayName: "Availability",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
