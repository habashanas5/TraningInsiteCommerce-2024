import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import { UploadError } from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import addCartLineCollectionFromProducts from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/AddCartLineCollectionFromProducts";
import translate from "@insite/client-framework/Translate";
import { ProductDto } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderUpload, { OrderUploadStyles } from "@insite/content-library/Components/OrderUpload";
import OrderUploadErrorsModal, {
    OrderUploadErrorsModalStyles,
} from "@insite/content-library/Components/OrderUploadErrorsModal";
import { OrderUploadPageContext } from "@insite/content-library/Pages/OrderUploadPage";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    addCartLineCollectionFromProducts: makeHandlerChainAwaitable(addCartLineCollectionFromProducts),
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderUploadFileUploadStyles {
    orderUploadStyles?: OrderUploadStyles;
    orderUploadErrorsModalStyles?: OrderUploadErrorsModalStyles;
}

export const orderUploadFileUploadStyles: OrderUploadFileUploadStyles = {};

const styles = orderUploadFileUploadStyles;

const OrderUploadFileUpload: FC<Props> = ({ addCartLineCollectionFromProducts }) => {
    const uploadProductsHandler = async (products: ProductDto[]) => {
        await addCartLineCollectionFromProducts({ products });
    };

    return (
        <>
            <OrderUpload
                descriptionText={siteMessage("OrderUpload_Instructions_UploadExcel")}
                checkInventory={true}
                templateUrl="/Excel/OrderUploadTemplate.xlsx"
                onUploadProducts={uploadProductsHandler}
                extendedStyles={styles.orderUploadStyles}
            />
            <OrderUploadErrorsModal
                descriptionText={siteMessage("QuickOrder_OrderUpload_AddToCartError")}
                uploadErrorText={siteMessage("OrderUpload_UploadError")}
                rowsLimitExceededText={siteMessage("OrderUpload_RowsLimitExceeded")}
                errorReasons={{
                    [UploadError.NotEnough]: siteMessage("QuickOrder_NotEnoughQuantity"),
                    [UploadError.ConfigurableProduct]: siteMessage("QuickOrder_CannotOrderConfigurable"),
                    [UploadError.StyledProduct]: siteMessage("QuickOrder_CannotOrderStyled"),
                    [UploadError.Unavailable]: siteMessage("QuickOrder_ProductIsUnavailable"),
                    [UploadError.NotFound]: siteMessage("Product_NotFound"),
                    [UploadError.InvalidUnit]: translate("Invalid U/M"),
                    [UploadError.OutOfStock]: translate("Out of stock"),
                }}
                extendedStyles={styles.orderUploadErrorsModalStyles}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(OrderUploadFileUpload),
    definition: {
        group: "Order Upload",
        allowedContexts: [OrderUploadPageContext],
    },
};

export default widgetModule;
