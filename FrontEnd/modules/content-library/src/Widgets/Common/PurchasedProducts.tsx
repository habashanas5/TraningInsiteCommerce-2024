import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductsForProductInfoList } from "@insite/client-framework/Store/Components/ProductInfoList/ProductInfoListSelectors";
import loadPurchasedProducts from "@insite/client-framework/Store/Components/PurchasedProducts/Handlers/LoadPurchasedProducts";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import PurchasedProductCard from "@insite/content-library/Components/PurchasedProductCard";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const enum fields {
    title = "title",
    titlePosition = "titlePosition",
    purchaseType = "purchaseType",
    showBrand = "showBrand",
    showPartNumbers = "showPartNumbers",
    showPrice = "showPrice",
    showAvailability = "showAvailability",
    showAddToCart = "showAddToCart",
    showAddToList = "showAddToList",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.titlePosition]: string;
        [fields.purchaseType]: string;
        [fields.showBrand]: boolean;
        [fields.showPartNumbers]: boolean;
        [fields.showPrice]: boolean;
        [fields.showAvailability]: boolean;
        [fields.showAddToCart]: boolean;
        [fields.showAddToList]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const session = getSession(state);
    const isAuthenticated = (session.isAuthenticated || session.rememberMe) && !session.isGuest;
    return {
        products: getProductsForProductInfoList(state, ownProps.id),
        canViewPurchasedProducts: isAuthenticated,
    };
};

const mapDispatchToProps = {
    loadPurchasedProducts,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface PurchasedProductsStyles {
    titleWrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    headerContainer?: GridContainerProps;
    itemHeaderGridItem?: GridItemProps;
    itemHeaderText?: TypographyPresentationProps;
    priceHeaderGridItem?: GridItemProps;
    priceHeaderText?: TypographyPresentationProps;
    addToCartHeaderGridItem?: GridItemProps;
    addToCartHeaderText?: TypographyPresentationProps;
}

export const purchasedProductsStyles: PurchasedProductsStyles = {
    titleText: {
        variant: "h2",
        css: css`
            text-align: center;
            margin-bottom: 10px;
        `,
    },
    headerContainer: {
        gap: 0,
        css: css`
            padding: 10px;
            background-color: ${getColor("common.accent")};
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            display: none;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    itemHeaderGridItem: { width: [0, 0, 6, 6, 6] },
    itemHeaderText: { weight: "bold" },
    priceHeaderGridItem: {
        width: [0, 0, 3, 3, 3],
        css: css`
            justify-content: flex-end;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    null,
                    null,
                    css`
                        padding-right: 35px;
                    `,
                    null,
                    null,
                ])}
        `,
    },
    priceHeaderText: { weight: "bold" },
    addToCartHeaderGridItem: {
        width: [0, 0, 3, 3, 3],
        css: css`
            justify-content: flex-end;
        `,
    },
    addToCartHeaderText: { weight: "bold" },
};

const styles = purchasedProductsStyles;

const getJustifyContent = (position: string) => {
    if (position === "left") {
        return "flex-start";
    }
    if (position === "right") {
        return "flex-end";
    }
    return "center";
};

const TitleWrapper = styled.div<{ position: string }>`
    display: flex;
    justify-content: ${({ position }) => getJustifyContent(position)};
`;

const PurchasedProducts = ({ id, fields, products, canViewPurchasedProducts, loadPurchasedProducts }: Props) => {
    React.useEffect(() => {
        if (canViewPurchasedProducts) {
            loadPurchasedProducts({ widgetId: id, purchaseType: fields.purchaseType });
        }
    }, [fields.purchaseType]);

    if (!canViewPurchasedProducts || !products || products.length === 0) {
        return null;
    }

    return (
        <>
            <TitleWrapper {...styles.titleWrapper} position={fields.titlePosition}>
                <Typography {...styles.titleText}>{fields.title}</Typography>
            </TitleWrapper>
            <GridContainer {...styles.headerContainer}>
                <GridItem {...styles.itemHeaderGridItem}>
                    <Typography {...styles.itemHeaderText}>{translate("Item")}</Typography>
                </GridItem>
                <GridItem {...styles.priceHeaderGridItem}>
                    <Typography {...styles.priceHeaderText}>{translate("Price")}</Typography>
                </GridItem>
                <GridItem {...styles.addToCartHeaderGridItem}>
                    <Typography {...styles.addToCartHeaderText}>{translate("Add to Cart")}</Typography>
                </GridItem>
            </GridContainer>
            {products.map(product => (
                <PurchasedProductCard
                    key={product.id}
                    product={product}
                    widgetId={id}
                    showBrand={fields.showBrand}
                    showPartNumbers={fields.showPartNumbers}
                    showPrice={fields.showPrice}
                    showAvailability={fields.showAvailability}
                    showAddToCart={fields.showAddToCart}
                    showAddToList={fields.showAddToList}
                />
            ))}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(PurchasedProducts),
    definition: {
        group: "Common",
        icon: "List",
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
                sortOrder: 0,
            },
            {
                name: fields.titlePosition,
                displayName: "Title Position",
                editorTemplate: "DropDownField",
                options: [
                    { value: "center", displayName: "Center" },
                    { value: "left", displayName: "Left" },
                    { value: "right", displayName: "Right" },
                ],
                defaultValue: "center",
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.purchaseType,
                displayName: "Purchase Type",
                editorTemplate: "DropDownField",
                options: [
                    { value: "recently", displayName: "Recently Purchased" },
                    { value: "frequently", displayName: "Frequently Purchased" },
                ],
                defaultValue: "recently",
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.showBrand,
                displayName: "Brand Name",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.showPartNumbers,
                displayName: "Part Numbers",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.showPrice,
                displayName: "Price",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.showAvailability,
                displayName: "Availability",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                sortOrder: 6,
            },
            {
                name: fields.showAddToCart,
                displayName: "Add to Cart",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 7,
            },
            {
                name: fields.showAddToList,
                displayName: "Add to List",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 8,
            },
        ],
    },
};

export default widgetModule;
