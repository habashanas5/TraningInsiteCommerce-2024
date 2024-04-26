import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderLinesList, { OrderLinesListStyles } from "@insite/content-library/Components/OrderLinesList";
import { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { GridContainerProps } from "@insite/mobius/GridContainer";
import { GridItemProps } from "@insite/mobius/GridItem";
import { HiddenProps } from "@insite/mobius/Hidden";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import { LinkPresentationProps } from "@insite/mobius/Link";
import { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    order: getOrderState(state, state.pages.orderDetails.orderNumber),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderLineNotesStyles {
    /**
     * @deprecated Use orderLines.orderLineNotes.typographyStyles instead.
     */
    typographyStyles?: TypographyProps;
    /**
     * @deprecated Use orderLines.orderLineNotes.gridItemStyles instead.
     */
    gridItemStyles?: GridItemProps;
}

export interface OrderDetailSummaryTableStyles {
    orderLines?: OrderLinesListStyles;

    /**
     * @deprecated Use orderLines.gridContainer instead.
     */
    gridContainer?: GridContainerProps;
    /**
     * @deprecated Use orderLines.titleText instead.
     */
    titleText?: TypographyProps;
    /**
     * @deprecated Use orderLines.orderLineCardContainer instead.
     */
    orderLineCardContainer?: GridContainerProps;
    /**
     * @deprecated Use orderLines.orderLineCardImageGridItem instead.
     */
    orderLineCardImageGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineCardImage instead.
     */
    orderLineCardImage?: LazyImageProps;
    /**
     * @deprecated Use orderLines.orderLineCardInfoGridItem instead.
     */
    orderLineCardInfoGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineCardInfoGridContainer instead.
     */
    orderLineCardInfoGridContainer?: GridContainerProps;
    /**
     * @deprecated Use orderLines.orderLineCardAddToListGridItem instead.
     */
    orderLineCardAddToListGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineCardActionsWide instead.
     */
    orderLineCardActionsWide?: HiddenProps;
    /**
     * @deprecated Use orderLines.orderLineCardActionsNarrow instead.
     */
    orderLineCardActionsNarrow?: HiddenProps;
    /**
     * @deprecated Use orderLines.overflowMenu instead.
     */
    overflowMenu?: OverflowMenuPresentationProps;
    /**
     * @deprecated Use orderLines.addToListClickable instead.
     */
    addToListClickable?: ClickablePresentationProps;
    /**
     * @deprecated Use orderLines.orderLineCardAddToListButton instead.
     */
    orderLineCardAddToListButton?: ButtonPresentationProps;
    /**
     * @deprecated Use orderLines.productBrandStyles instead.
     */
    productBrandStyles?: ProductBrandStyles;
    /**
     * @deprecated Use orderLines.productInfoLink instead.
     */
    productInfoLink?: LinkPresentationProps;
    /**
     * @deprecated Use orderLines.productInfoDescription instead.
     */
    productInfoDescription?: TypographyProps;
    /**
     * @deprecated Use orderLines.productInfoSectionOptionsGridItem instead.
     */
    productInfoSectionOptionsGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoSectionOptionsList instead.
     */
    productInfoSectionOptionsList?: InjectableCss;
    /**
     * @deprecated Use orderLines.productInfoSectionOptionsListItem instead.
     */
    productInfoSectionOptionsListItem?: InjectableCss;
    /**
     * @deprecated Use orderLines.productInfoPartNumbersGridItem instead.
     */
    productInfoPartNumbersGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoSectionOptionsText instead.
     */
    productInfoSectionOptionsText?: InjectableCss;
    /**
     * @deprecated Use orderLines.productInfoGridItem instead.
     */
    productInfoGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoGridContainer instead.
     */
    productInfoGridContainer?: GridContainerProps;
    /**
     * @deprecated Use orderLines.productInfoBrandDescriptionGridItem instead.
     */
    productInfoBrandDescriptionGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoBrandDescriptionGridContainer instead.
     */
    productInfoBrandDescriptionGridContainer?: GridContainerProps;
    /**
     * @deprecated Use orderLines.productInfoBrandGridItem instead.
     */
    productInfoBrandGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoDescriptionGridItem instead.
     */
    productInfoDescriptionGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productDescriptionStyles instead.
     */
    productDescriptionStyles?: ProductDescriptionStyles;
    /**
     * @deprecated Use orderLines.productInfoErpNumberGridItem instead.
     */
    productInfoErpNumberGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoManufacturerItemGridItem instead.
     */
    productInfoManufacturerItemGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoCustomerProductGridItem instead.
     */
    productInfoCustomerProductGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineInfoPromotionGridItem instead.
     */
    orderLineInfoPromotionGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineInfoPromotionList instead.
     */
    orderLineInfoPromotionList?: InjectableCss;
    /**
     * @deprecated Use orderLines.orderLineInfoPromotionText instead.
     */
    orderLineInfoPromotionText?: TypographyProps;
    /**
     * @deprecated Use orderLines.orderLineInfoGridItem instead.
     */
    orderLineInfoGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineInfoGridContainer instead.
     */
    orderLineInfoGridContainer?: GridContainerProps;
    /**
     * @deprecated Use orderLines.orderLinePriceGridItem instead.
     */
    orderLinePriceGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoQtyOrderedGridItem instead.
     */
    productInfoQtyOrderedGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoQtyShippedGridItem instead.
     */
    productInfoQtyShippedGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.productInfoSubtotalGridItem instead.
     */
    productInfoSubtotalGridItem?: GridItemProps;
    /**
     * @deprecated Use orderLines.orderLineNotes instead.
     */
    orderLineNotes?: OrderLineNotesStyles;
    /**
     * @deprecated Use orderLines.productInfoTotalsGridItem instead.
     */
    productInfoTotalsGridItem?: GridItemProps;
}

export const summaryTableStyles: OrderDetailSummaryTableStyles = {
    orderLines: {
        gridContainer: {
            css: css`
                .card_container__wrapper {
                    border-top: 1px solid ${getColor("common.border")};
                }
                .card_container__wrapper ~ .card_container__wrapper {
                    border-top: none;
                }
            `,
        },
    },
};

const styles = summaryTableStyles;

const OrderDetailsSummaryTable: React.FunctionComponent<Props> = ({ order }) => {
    if (!order.value || !order.value.orderLines) {
        return null;
    }

    return <OrderLinesList order={order.value} extendedStyles={styles.orderLines || styles} />;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderDetailsSummaryTable),
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
