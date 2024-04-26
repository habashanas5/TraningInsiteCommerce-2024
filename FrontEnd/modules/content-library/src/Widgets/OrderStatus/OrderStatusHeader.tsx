import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import reorder from "@insite/client-framework/Store/Pages/OrderStatus/Handlers/Reorder";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ShareEntityButton, { ShareEntityButtonStyles } from "@insite/content-library/Components/ShareEntityButton";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    generateEmailAttachmentFromWebpage = "generateEmailAttachmentFromWebpage",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.generateEmailAttachmentFromWebpage]?: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{
        ordernumber?: string;
        stemail?: string;
        stpostalcode?: string;
        orderNumber?: string;
        stEmail?: string;
        stPostalCode?: string;
    }>(location.search);

    return {
        order: state.pages.orderStatus.order,
        isReordering: state.pages.orderStatus.isReordering,
        showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
        stEmail: parsedQuery.stEmail ?? parsedQuery.stemail ?? "",
        stPostalCode: parsedQuery.stPostalCode ?? parsedQuery.stpostalcode ?? "",
    };
};

const mapDispatchToProps = {
    reorder,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface OrderStatusHeaderStyles {
    container?: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    buttonsGridItem?: GridItemProps;
    buttonsHidden?: HiddenProps;
    shareEntityButtonStyles?: ShareEntityButtonStyles;
    printButton?: ButtonPresentationProps;
    buttonsMenuHidden?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    printClickable?: ClickablePresentationProps;
    reorderClickableHidden?: HiddenProps;
    reorderClickable?: ClickablePresentationProps;
    reorderClickableSpinner?: LoadingSpinnerProps;
    reorderButtonHidden?: HiddenProps;
    reorderButton?: ButtonPresentationProps;
    spinner?: LoadingSpinnerProps;
}

export const orderStatusHeaderStyles: OrderStatusHeaderStyles = {
    container: {
        gap: 5,
        css: css`
            margin-top: 10px;
        `,
    },
    titleGridItem: { width: [10, 10, 8, 8, 7] },
    titleText: { variant: "h2" },
    buttonsGridItem: {
        width: [2, 2, 4, 4, 5],
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    buttonsHidden: { below: "lg" },
    shareEntityButtonStyles: {
        button: {
            variant: "tertiary",
        },
    },
    printButton: {
        variant: "tertiary",
        css: css`
            margin-left: 10px;
        `,
    },
    buttonsMenuHidden: { above: "md" },
    reorderClickableHidden: { above: "sm" },
    reorderClickableSpinner: {
        size: 22,
        css: css`
            margin: 10px 0 5px 15px;
        `,
    },
    reorderButtonHidden: { below: "md" },
    reorderButton: {
        css: css`
            display: flex;
            align-items: center;
            margin-left: 10px;
        `,
    },
    spinner: {
        size: 22,
        css: css`
            margin: 8px 50px 0 34px;
        `,
    },
};

const styles = orderStatusHeaderStyles;

const OrderStatusHeader = ({
    fields,
    order,
    isReordering,
    showAddToCartConfirmationDialog,
    stEmail,
    stPostalCode,
    toaster,
    reorder,
}: Props) => {
    if (!order) {
        return null;
    }

    const onClickPrint = () => {
        if (!order) {
            return;
        }
        openPrintDialog();
    };

    const onClickReorder = () => {
        reorder({
            onSuccess: () => {
                if (!showAddToCartConfirmationDialog) {
                    return;
                }
                toaster.addToast({
                    body: `${order.webOrderNumber || order.erpOrderNumber} ${translate("Added to Cart")}`,
                    messageType: "success",
                    timeoutLength: 6000,
                });
            },
        });
    };

    const resolvedGenerateEmailAttachmentFromWebpage =
        fields.generateEmailAttachmentFromWebpage === true || fields.generateEmailAttachmentFromWebpage === undefined;

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.titleGridItem}>
                <Typography as="h1" {...styles.titleText}>
                    {order.erpOrderNumber
                        ? `${translate("Order #")}${order.erpOrderNumber}`
                        : `${translate("Web Order #")}${order.webOrderNumber}`}
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonsGridItem}>
                <Hidden {...styles.buttonsHidden}>
                    <ShareEntityButton
                        entityId={order.webOrderNumber}
                        entityName="Order"
                        extendedStyles={styles.shareEntityButtonStyles}
                        generateAttachmentFromWebpage={resolvedGenerateEmailAttachmentFromWebpage}
                        extraProperties={{ stEmail, stPostalCode }}
                    />
                    <Button {...styles.printButton} onClick={onClickPrint}>
                        {translate("Print")}
                    </Button>
                </Hidden>
                <Hidden {...styles.buttonsMenuHidden}>
                    <OverflowMenu hasChildPortal position="end" {...styles.overflowMenu}>
                        <ShareEntityButton
                            entityId={order.webOrderNumber}
                            entityName="Order"
                            variant="clickable"
                            extendedStyles={styles.shareEntityButtonStyles}
                            extraProperties={{ stEmail, stPostalCode }}
                        />
                        <Clickable {...styles.printClickable} onClick={onClickPrint}>
                            {translate("Print")}
                        </Clickable>
                        <Hidden {...styles.reorderClickableHidden}>
                            {!isReordering && (
                                <Clickable
                                    {...styles.reorderClickable}
                                    onClick={onClickReorder}
                                    disabled={isReordering}
                                >
                                    {translate("Reorder")}
                                </Clickable>
                            )}
                            {isReordering && <LoadingSpinner {...styles.reorderClickableSpinner} />}
                        </Hidden>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.reorderButtonHidden}>
                    {!isReordering && (
                        <Button
                            {...styles.reorderButton}
                            onClick={onClickReorder}
                            disabled={isReordering}
                            data-test-selector="orderStatusHeader_reorder"
                        >
                            {translate("Reorder")}
                        </Button>
                    )}
                    {isReordering && <LoadingSpinner {...styles.spinner} />}
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(OrderStatusHeader)),
    definition: {
        group: "Order Status",
        displayName: "Header",
        allowedContexts: [OrderStatusPageContext],
        fieldDefinitions: [
            {
                name: fields.generateEmailAttachmentFromWebpage,
                fieldType: "General",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                tooltip:
                    "If checked, sharing the order generates an email attachment using the Order Status page, rather than a pre-defined PDF file.",
            },
        ],
    },
};

export default widgetModule;
