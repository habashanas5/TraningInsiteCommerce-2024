import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import setCanSendReturnRequest from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SetCanSendReturnRequest";
import setOrderLines from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SetOrderLines";
import translate from "@insite/client-framework/Translate";
import { OrderLineModel, OrderModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer from "@insite/content-library/Components/CardContainer";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import SmallHeadingAndText from "@insite/content-library/Components/SmallHeadingAndText";
import { RequestRmaPageContext } from "@insite/content-library/Pages/RequestRmaPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    orderLines: state.pages.requestRma.orderLines,
});

const mapDispatchToProps = {
    setOrderLines,
    setCanSendReturnRequest,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RequestRmaProductListStyles {
    gridContainer?: GridContainerProps;
    orderLineCardContainer?: GridContainerProps;
    orderLineCardGridContainer?: GridContainerProps;
    orderLineCardImageGridItem?: GridItemProps;
    orderLineCardImage?: LazyImageProps;
    orderLineCardInfoGridItem?: GridItemProps;
    orderLineCardInfoGridContainer?: GridContainerProps;
    returnReasonGridItem?: GridItemProps;
    qtyToReturnTextField?: TextFieldPresentationProps;
    returnReasonSelect?: SelectPresentationProps;
    productInfoGridItem?: GridItemProps;
    productInfoGridContainer?: GridContainerProps;
    productInfoBrandDescriptionGridItem?: GridItemProps;
    productInfoBrandDescriptionGridContainer?: GridContainerProps;
    productInfoBrandGridItem?: GridItemProps;
    productInfoDescriptionGridItem?: GridItemProps;
    productDescriptionStyles?: ProductDescriptionStyles;
    productBrandStyles?: ProductBrandStyles;
    productInfoPartNumbersGridItem?: GridItemProps;
    productPartNumbers?: ProductPartNumbersStyles;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoGridContainer?: GridContainerProps;
    orderLinePriceGridItem?: GridItemProps;
    productInfoQtyOrderedGridItem?: GridItemProps;
    productInfoSubtotalGridItem?: GridItemProps;
}

export const requestRmaProductListStyles: RequestRmaProductListStyles = {
    gridContainer: {
        css: css`
            margin-top: 35px;
            margin-bottom: 25px;
        `,
    },
    orderLineCardImageGridItem: {
        width: [3, 3, 2, 2, 1],
        printWidth: 1,
        css: css`
            padding-left: 0;
        `,
    },
    orderLineCardInfoGridItem: { width: [9, 9, 7, 7, 8] },
    orderLineCardInfoGridContainer: { gap: 10 },
    returnReasonGridItem: {
        width: [9, 9, 3, 3, 3],
        printWidth: 0,
        css: css`
            flex-direction: column;
            margin-left: auto !important;
        `,
    },
    qtyToReturnTextField: {
        cssOverrides: {
            formInputWrapper: css`
                width: 90px;
            `,
        },
    },
    productInfoGridItem: { width: [12, 12, 8, 8, 8] },
    productInfoGridContainer: { gap: 5 },
    productInfoBrandDescriptionGridItem: { width: 12 },
    productInfoBrandDescriptionGridContainer: { gap: 5 },
    productInfoBrandGridItem: { width: 12 },
    productInfoDescriptionGridItem: { width: 12 },
    productInfoPartNumbersGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    productPartNumbers: {
        erpNumberLabelText: {
            css: css`
                margin-right: 8px;
            `,
        },
        customerNameLabelText: {
            css: css`
                margin-right: 8px;
            `,
        },
        manufacturerItemLabelText: {
            css: css`
                margin-right: 8px;
            `,
        },
    },
    orderLineInfoGridItem: {
        width: [12, 12, 4, 4, 4],
        printWidth: 6,
    },
    orderLineInfoGridContainer: { gap: 10 },
    orderLinePriceGridItem: {
        width: [12, 12, 12, 12, 7],
        printWidth: 7,
    },
    productInfoQtyOrderedGridItem: {
        width: [12, 12, 12, 12, 5],
        printWidth: 5,
    },
    productInfoSubtotalGridItem: { width: 12 },
};

const ProductInfo = ({ orderLine }: { orderLine: OrderLineModel }) => {
    return (
        <GridItem {...styles.productInfoGridItem}>
            <GridContainer {...styles.productInfoGridContainer}>
                <GridItem {...styles.productInfoBrandDescriptionGridItem}>
                    <GridContainer {...styles.productInfoBrandDescriptionGridContainer}>
                        {orderLine.brand && (
                            <GridItem {...styles.productInfoBrandGridItem}>
                                <ProductBrand brand={orderLine.brand} extendedStyles={styles.productBrandStyles} />
                            </GridItem>
                        )}
                        <GridItem {...styles.productInfoDescriptionGridItem}>
                            <ProductDescription product={orderLine} extendedStyles={styles.productDescriptionStyles} />
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.productInfoPartNumbersGridItem}>
                    <ProductPartNumbers
                        productNumber={orderLine.productErpNumber}
                        customerProductNumber={orderLine.customerProductNumber}
                        manufacturerItem={orderLine.manufacturerItem}
                        extendedStyles={styles.productPartNumbers}
                    />
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

const OrderLineInfo = ({ orderLine }: { orderLine: OrderLineModel }) => {
    return (
        <GridItem {...styles.orderLineInfoGridItem}>
            <GridContainer {...styles.orderLineInfoGridContainer}>
                <GridItem {...styles.orderLinePriceGridItem}>
                    <SmallHeadingAndText
                        heading={translate("Price")}
                        text={
                            orderLine.unitPriceDisplay +
                            (orderLine.unitOfMeasure ? ` / ${orderLine.unitOfMeasure}` : "")
                        }
                    />
                </GridItem>
                <GridItem {...styles.productInfoQtyOrderedGridItem}>
                    <SmallHeadingAndText heading={translate("QTY")} text={`${orderLine.qtyOrdered}`} />
                </GridItem>
                <GridItem {...styles.productInfoSubtotalGridItem}>
                    <SmallHeadingAndText heading={translate("Subtotal")} text={orderLine.extendedUnitNetPriceDisplay} />
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

const OrderLineCard = (props: {
    order: OrderModel;
    orderLine: OrderLineModel;
    totalQuantity: number;
    qtyChangeHandler: (event: React.ChangeEvent<HTMLInputElement>, lineNumber: number) => void;
    returnReasonChangeHandler: (event: React.ChangeEvent<HTMLSelectElement>, lineNumber: number) => void;
}) => {
    const { order, orderLine, totalQuantity, qtyChangeHandler, returnReasonChangeHandler } = props;
    const minQtyToReturn = totalQuantity > 0 ? 0 : 1;
    const qtyToReturnError =
        totalQuantity > 0 &&
        ((orderLine.rmaQtyRequested > orderLine.qtyOrdered &&
            siteMessage("Field_Max_Number", translate("QTY Returning"), orderLine.qtyOrdered.toString())) ||
            (orderLine.rmaQtyRequested < minQtyToReturn &&
                siteMessage("Field_Min_Number", translate("QTY Returning"), minQtyToReturn.toString())));

    return (
        <GridContainer {...styles.orderLineCardGridContainer}>
            <GridItem {...styles.orderLineCardImageGridItem}>
                {orderLine.productUri && orderLine.isActiveProduct && (
                    <Link href={orderLine.productUri}>
                        <LazyImage {...styles.orderLineCardImage} src={orderLine.mediumImagePath} />
                    </Link>
                )}
            </GridItem>
            <GridItem {...styles.orderLineCardInfoGridItem}>
                <GridContainer {...styles.orderLineCardInfoGridContainer}>
                    <ProductInfo orderLine={orderLine} />
                    <OrderLineInfo orderLine={orderLine} />
                </GridContainer>
            </GridItem>
            <GridItem {...styles.returnReasonGridItem}>
                <TextField
                    {...styles.qtyToReturnTextField}
                    label={translate("QTY to Return")}
                    type="number"
                    value={orderLine.rmaQtyRequested.toString()}
                    min={minQtyToReturn}
                    max={orderLine.qtyOrdered}
                    error={qtyToReturnError}
                    data-test-selector={`requestRmaLine_qtyToReturn_${orderLine.id}`}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        qtyChangeHandler(event, orderLine.lineNumber)
                    }
                />
                <Select
                    label={translate("Return Reason")}
                    {...styles.returnReasonSelect}
                    value={orderLine.returnReason}
                    required={orderLine.rmaQtyRequested > 0}
                    error={
                        orderLine.rmaQtyRequested > 0 &&
                        !orderLine.returnReason &&
                        siteMessage("Field_Required", translate("Return Reason"))
                    }
                    data-test-selector={`requestRmaLine_ReturnReason_${orderLine.id}`}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                        returnReasonChangeHandler(event, orderLine.lineNumber)
                    }
                >
                    <option value="">{translate("Select a Reason Code")}</option>
                    {order.returnReasons?.map(returnReason => (
                        <option key={returnReason} value={returnReason}>
                            {returnReason}
                        </option>
                    ))}
                </Select>
            </GridItem>
        </GridContainer>
    );
};

const styles = requestRmaProductListStyles;

const RequestRmaProductList: FC<Props> = ({ orderLines, setOrderLines, setCanSendReturnRequest }) => {
    const [totalQuantity, setTotalQuantity] = React.useState(0);
    const { value: order } = useContext(OrderStateContext);

    React.useEffect(() => {
        if (!order || !order.orderLines) {
            return;
        }

        setOrderLines({ orderLines: order.orderLines });
    }, [order?.orderLines]);

    React.useEffect(() => {
        setCanSendReturnRequest({
            value:
                orderLines.some(line => line.rmaQtyRequested > 0 && line.returnReason) &&
                !orderLines.some(
                    line => line.rmaQtyRequested > line.qtyOrdered || (line.rmaQtyRequested > 0 && !line.returnReason),
                ),
        });
    }, [orderLines]);

    if (!order || !order.orderLines) {
        return null;
    }

    const qtyChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, lineNumber: number) => {
        const qty = parseInt(event.target.value, 10);
        const updatedOrderLines = orderLines.map(line =>
            line.lineNumber === lineNumber ? { ...line, rmaQtyRequested: qty } : line,
        );
        setOrderLines({ orderLines: updatedOrderLines });

        let totalQty = 0;
        updatedOrderLines.forEach(orderLine => {
            totalQty += orderLine.rmaQtyRequested > 0 ? 1 : 0;
        });

        setTotalQuantity(totalQty);
    };

    const returnReasonChangeHandler = (event: React.FormEvent<HTMLSelectElement>, lineNumber: number) => {
        setOrderLines({
            orderLines: orderLines.map(line =>
                line.lineNumber === lineNumber ? { ...line, returnReason: event.currentTarget.value } : line,
            ),
        });
    };

    return (
        <GridContainer {...styles.gridContainer} data-test-selector="requestRmaProductList">
            {orderLines.map(orderLine => (
                <CardContainer {...styles.orderLineCardContainer} key={orderLine.id}>
                    <OrderLineCard
                        order={order}
                        orderLine={orderLine}
                        totalQuantity={totalQuantity}
                        qtyChangeHandler={qtyChangeHandler}
                        returnReasonChangeHandler={returnReasonChangeHandler}
                    />
                </CardContainer>
            ))}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequestRmaProductList),
    definition: {
        allowedContexts: [RequestRmaPageContext],
        group: "Return Request (RMA)",
        fieldDefinitions: [],
    },
};

export default widgetModule;
