import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    HasProduct,
    HasProductContext,
    withProduct,
    withProductContext,
} from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, {
    ProductQuantityBreakPricingStyles,
} from "@insite/content-library/Components/ProductQuantityBreakPricing";
import { ProductCardSelections } from "@insite/content-library/Widgets/ProductList/ProductCardSelections";
import ProductListActions from "@insite/content-library/Widgets/ProductList/ProductListActions";
import ProductListProductImage from "@insite/content-library/Widgets/ProductList/ProductListProductImage";
import ProductListProductInformation from "@insite/content-library/Widgets/ProductList/ProductListProductInformation";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

type Props = ReturnType<typeof mapStateToProps> & ProductCardSelections & HasProductContext;

export interface ProductListProductTableRowStyles {
    descriptionCell?: DataTableCellProps;
    gridContainer?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
    availabilityCell?: DataTableCellProps;
    availabilityStyles?: ProductAvailabilityStyles;
    priceCell?: DataTableCellProps;
    productPrice?: ProductPriceStyles;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    unitOfMeasureCell?: DataTableCellProps;
    unitOfMeasureText?: TypographyPresentationProps;
    actionsCell?: DataTableCellProps;
}

export const productGridCardStyles: ProductListProductTableRowStyles = {
    gridContainer: {
        gap: 0,
        css: css`
            padding: 30px 0;
            min-width: 320px; /* prevent overlap with second column */
        `,
    },
    leftColumnGridItem: {
        width: [4, 4, 4, 3, 3],
        css: css`
            padding-right: 20px;
        `,
    },
    rightColumnGridItem: {
        width: [8, 8, 8, 9, 9],
    },
};

const styles = productGridCardStyles;

const ProductListProductTableRow: FC<Props> = ({
    productSettings,
    productContext,
    showImage,
    showCompare,
    showAttributes,
    showAvailability,
    showBrand,
    showPartNumbers,
    showTitle,
    showAddToList,
    showPrice,
}) => {
    const unitOfMeasure = productContext.product.unitOfMeasures?.find(
        o => o.unitOfMeasure === productContext.productInfo.unitOfMeasure,
    );

    return (
        <DataTableRow key={productContext.product.id}>
            <DataTableCell {...styles.descriptionCell}>
                <GridContainer {...styles.gridContainer}>
                    <GridItem {...styles.leftColumnGridItem}>
                        <ProductListProductImage showImage={true} showCompare={false} />
                    </GridItem>
                    <GridItem {...styles.rightColumnGridItem}>
                        <ProductListProductInformation
                            showAttributes={showAttributes}
                            showAvailability={false}
                            showBrand={showBrand}
                            showPartNumbers={showPartNumbers}
                            showTitle={showTitle}
                        />
                    </GridItem>
                </GridContainer>
            </DataTableCell>
            <DataTableCell {...styles.availabilityCell}>
                {productSettings.showInventoryAvailability && showAvailability && (
                    <ProductContextAvailability extendedStyles={styles.availabilityStyles} />
                )}
            </DataTableCell>
            <DataTableCell {...styles.priceCell}>
                <ProductPrice
                    product={productContext}
                    showLabel={false}
                    showUnitOfMeasure={false}
                    showPack={false}
                    showSavingsAmount={productSettings.showSavingsAmount}
                    showSavingsPercent={productSettings.showSavingsPercent}
                    extendedStyles={styles.productPrice}
                />
                <ProductQuantityBreakPricing extendedStyles={styles.quantityBreakPricing} />
            </DataTableCell>
            <DataTableCell {...styles.unitOfMeasureCell}>
                <Typography {...styles.unitOfMeasureText}>
                    {unitOfMeasure?.description || unitOfMeasure?.unitOfMeasureDisplay}
                </Typography>
            </DataTableCell>
            <DataTableCell {...styles.actionsCell}>
                <ProductListActions showAddToList={showAddToList} showPrice={false} />
            </DataTableCell>
        </DataTableRow>
    );
};

export default connect(mapStateToProps)(withProductContext(ProductListProductTableRow));
