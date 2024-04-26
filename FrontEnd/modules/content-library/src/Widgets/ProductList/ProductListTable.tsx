import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setTableColumns from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetTableColumns";
import setVisibleColumnNames from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetVisibleColumnNames";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import { AttributeTypeFacetModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, {
    ProductQuantityBreakPricingStyles,
} from "@insite/content-library/Components/ProductQuantityBreakPricing";
import { ProductCardSelections } from "@insite/content-library/Widgets/ProductList/ProductCardSelections";
import ProductListActions from "@insite/content-library/Widgets/ProductList/ProductListActions";
import ProductListProductContext from "@insite/content-library/Widgets/ProductList/ProductListProductContext";
import ProductListProductImage, {
    ProductListProductImageStyles,
} from "@insite/content-library/Widgets/ProductList/ProductListProductImage";
import ProductListProductInformation from "@insite/content-library/Widgets/ProductList/ProductListProductInformation";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import sortBy from "lodash/sortBy";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    products: ProductModel[];
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
    productInfosByProductId: state.pages.productList.productInfosByProductId,
    attributeTypeFacets: getProductListDataViewProperty(state, "attributeTypeFacets"),
    brandFacets: getProductListDataViewProperty(state, "brandFacets"),
    productLineFacets: getProductListDataViewProperty(state, "productLineFacets"),
    visibleColumnNames: state.pages.productList.visibleColumnNames,
    tableColumns: state.pages.productList.tableColumns,
    pageCategoryId: state.pages.productList.productFilters.pageCategoryId,
});

const mapDispatchToProps = {
    setTableColumns,
    setVisibleColumnNames,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    ProductCardSelections &
    OwnProps;

export interface ProductListTableStyles {
    wrapper?: InjectableCss;
    dataTable?: DataTableProps;
    descriptionHeader?: DataTableHeaderProps;
    attributesHeader?: DataTableHeaderProps;
    availabilityHeader?: DataTableHeaderProps;
    priceHeader?: DataTableHeaderProps;
    unitOfMeasureHeader?: DataTableHeaderProps;
    actionsHeader?: DataTableHeaderProps;
    descriptionCell?: DataTableCellProps;
    gridContainer?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
    productImageStyles?: ProductListProductImageStyles;
    attributesCell?: DataTableCellProps;
    availabilityCell?: DataTableCellProps;
    availabilityStyles?: ProductAvailabilityStyles;
    priceCell?: DataTableCellProps;
    productPrice?: ProductPriceStyles;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    unitOfMeasureCell?: DataTableCellProps;
    unitOfMeasureText?: TypographyPresentationProps;
    actionsCell?: DataTableCellProps;
    sponsoredText?: TypographyPresentationProps;
}

export const actionsStyles: ProductListTableStyles = {
    wrapper: {
        css: css`
            overflow: auto;
        `,
    },
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
            padding-right: 12px;
            flex-direction: column;
        `,
    },
    rightColumnGridItem: {
        width: [8, 8, 8, 9, 9],
        css: css`
            flex-direction: column;
        `,
    },
    productImageStyles: {
        compareCheckbox: {
            css: css`
                align-self: start;
                padding-top: 15px;
            `,
        },
    },
    actionsHeader: {
        css: css`
            position: sticky;
            right: 0;
            width: 200px;
            background-clip: padding-box;
        `,
    },
    descriptionCell: {
        css: css`
            white-space: normal;
        `,
    },
    attributesCell: {
        css: css`
            white-space: normal;
        `,
    },
    availabilityCell: {
        css: css`
            white-space: normal;
        `,
    },
    availabilityStyles: {
        messageText: {
            css: css`
                white-space: nowrap;
            `,
        },
    },
    actionsCell: {
        css: css`
            position: sticky;
            right: 0;
            width: 200px;
            background-color: inherit;
            background-clip: padding-box;
        `,
    },
    sponsoredText: {
        css: css`
            margin-bottom: 5px;
            font-size: 0.9em;
            opacity: 0.5;
        `,
    },
};

const styles = actionsStyles;

const ProductListTable: FC<Props> = ({
    products,
    productSettings,
    productInfosByProductId,
    attributeTypeFacets,
    brandFacets,
    productLineFacets,
    visibleColumnNames,
    tableColumns,
    pageCategoryId,
    setTableColumns,
    setVisibleColumnNames,
    showAvailability,
    showBrand,
    showPartNumbers,
    showTitle,
    showAddToList,
}) => {
    useEffect(() => {
        if (!attributeTypeFacets?.length && !brandFacets?.length && !productLineFacets?.length) {
            setTableColumns({ tableColumns: [] });
            setVisibleColumnNames({ visibleColumnNames: [] });
            return;
        }

        const columns = attributeTypeFacets
            ? sortBy(
                  attributeTypeFacets,
                  o => o.sortOrder,
                  o => o.name,
              )
            : [];
        if (brandFacets?.length) {
            columns.push({
                attributeTypeId: "",
                name: "Brand",
                nameDisplay: "",
                sortOrder: 0,
                attributeValueFacets: [],
            });
        }

        if (productLineFacets?.length) {
            columns.push({
                attributeTypeId: "",
                name: "Product Line",
                nameDisplay: "",
                sortOrder: 0,
                attributeValueFacets: [],
            });
        }

        setTableColumns({ tableColumns: columns });
        setVisibleColumnNames({ visibleColumnNames: columns?.slice(0, 3).map(o => o.name) || [] });
    }, [pageCategoryId]);

    const getAttributeValueForSection = (facet: AttributeTypeFacetModel, product: ProductModel) => {
        const attributeValues = product.attributeTypes
            ?.find(o => o.id === facet.attributeTypeId)
            ?.attributeValues?.map(o => o.valueDisplay)
            .join(", ");
        if (attributeValues) {
            return attributeValues;
        }
        if (facet.name === "Brand" && product.brand) {
            return product.brand.name;
        }
        if (facet.name === "Product Line" && product.productLine) {
            return product.productLine.name;
        }

        return null;
    };

    const visibleTableColumns = tableColumns?.filter(o => visibleColumnNames.indexOf(o.name) > -1) || [];
    const productListRows = products.map((product, idx) => {
        const productInfo = productInfosByProductId[product.id];
        if (!productInfo) {
            return;
        }

        const productContext: ProductContextModel = {
            product,
            productInfo,
        };
        const unitOfMeasure = productContext.product.unitOfMeasures?.find(
            o => o.unitOfMeasure === productContext.productInfo.unitOfMeasure,
        );
        return (
            <ProductListProductContext product={product} key={product.id} idx={idx}>
                <DataTableRow key={product.id} data-test-selector={`productListProductCard${product.id}`}>
                    <DataTableCell {...styles.descriptionCell}>
                        <GridContainer {...styles.gridContainer}>
                            <GridItem {...styles.leftColumnGridItem}>
                                {product.isSponsored && (
                                    <Typography {...styles.sponsoredText}>{translate("Sponsored")}</Typography>
                                )}
                                <ProductListProductImage
                                    showImage={true}
                                    showCompare={false}
                                    extendedStyles={styles.productImageStyles}
                                />
                            </GridItem>
                            <GridItem {...styles.rightColumnGridItem}>
                                <ProductListProductInformation
                                    showAttributes={false}
                                    showAvailability={false}
                                    showBrand={showBrand}
                                    showPartNumbers={showPartNumbers}
                                    showTitle={showTitle}
                                />
                                <ProductListProductImage
                                    showImage={false}
                                    showCompare={true}
                                    extendedStyles={styles.productImageStyles}
                                />
                            </GridItem>
                        </GridContainer>
                    </DataTableCell>
                    {visibleTableColumns.map(facet => (
                        <DataTableCell key={`${facet.name}_tableCell`} {...styles.attributesCell}>
                            {getAttributeValueForSection(facet, product)}
                        </DataTableCell>
                    ))}
                    {productSettings.showInventoryAvailability && showAvailability && (
                        <DataTableCell {...styles.availabilityCell}>
                            <ProductContextAvailability extendedStyles={styles.availabilityStyles} />
                        </DataTableCell>
                    )}
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
            </ProductListProductContext>
        );
    });

    return (
        <StyledWrapper {...styles.wrapper}>
            <DataTable {...styles.dataTable}>
                <DataTableHead>
                    <DataTableHeader {...styles.descriptionHeader}>{translate("Description")}</DataTableHeader>
                    {visibleTableColumns.map(facet => (
                        <DataTableHeader key={`${facet.name}_tableHeader`} {...styles.attributesHeader}>
                            {facet.nameDisplay ||
                                (facet.name === "Brand"
                                    ? translate("Brand")
                                    : facet.name === "Product Line"
                                    ? translate("Product Line")
                                    : facet.name)}
                        </DataTableHeader>
                    ))}
                    {productSettings.showInventoryAvailability && (
                        <DataTableHeader {...styles.availabilityHeader}>{translate("Availability")}</DataTableHeader>
                    )}
                    <DataTableHeader {...styles.priceHeader}>{translate("Price")}</DataTableHeader>
                    <DataTableHeader {...styles.unitOfMeasureHeader}>{translate("U/M")}</DataTableHeader>
                    <DataTableHeader {...styles.actionsHeader}></DataTableHeader>
                </DataTableHead>
                <DataTableBody>{productListRows}</DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListTable);
