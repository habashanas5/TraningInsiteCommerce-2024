/* eslint-disable spire/export-styles */
import { ProductContext, ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import changeQtyOrdered from "@insite/client-framework/Store/Pages/ProductList/Handlers/ChangeQtyOrdered";
import changeUnitOfMeasure from "@insite/client-framework/Store/Pages/ProductList/Handlers/ChangeUnitOfMeasure";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    product: ProductModel;
    idx?: number;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    productInfo: state.pages.productList.productInfosByProductId[ownProps.product.id],
});

const mapDispatchToProps = {
    changeUnitOfMeasure,
    changeQtyOrdered,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const ProductListProductContext: FC<Props> = ({
    product,
    productInfo,
    children,
    changeUnitOfMeasure,
    changeQtyOrdered,
    idx,
}) => {
    if (!productInfo) {
        return null;
    }

    const productContext: ProductContextModel = {
        product,
        productInfo,
        idx,
        onQtyOrderedChanged: qtyOrdered => changeQtyOrdered({ productId: product.id, qtyOrdered }),
        onUnitOfMeasureChanged: unitOfMeasure => changeUnitOfMeasure({ productId: product.id, unitOfMeasure }),
    };

    return <ProductContext.Provider value={productContext}>{children}</ProductContext.Provider>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListProductContext);
