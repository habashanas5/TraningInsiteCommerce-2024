import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getOrderState, OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import cancelOrder from "@insite/client-framework/Store/Pages/OrderDetails/Handlers/CancelOrder";
import reorder from "@insite/client-framework/Store/Pages/OrderDetails/Handlers/Reorder";
import { canCancelOrder, canRmaOrder } from "@insite/client-framework/Store/Pages/OrderDetails/OrderDetailsSelectors";
import translate from "@insite/client-framework/Translate";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderDetailPageTypeLink from "@insite/content-library/Components/OrderDetailPageTypeLink";
import ShareEntityButton, { ShareEntityButtonStyles } from "@insite/content-library/Components/ShareEntityButton";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { GridContainerProps } from "@insite/mobius/GridContainer";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    buttonsOrder = "buttonsOrder",
    generateEmailAttachmentFromWebpage = "generateEmailAttachmentFromWebpage",
}

const enum buttons {
    cancel = "Cancel",
    print = "Print",
    email = "Email",
    reorder = "Reorder",
    rma = "Rma",
}

interface ButtonMapper {
    [key: string]: {
        button: any;
        clickable: any;
        showButtonOnTablet?: boolean;
    };
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.buttonsOrder]: ButtonModel[];
        [fields.generateEmailAttachmentFromWebpage]?: boolean;
    };
}

interface ButtonModel {
    fields: {
        name: string;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    const order = getOrderState(state, state.pages.orderDetails.orderNumber).value;
    const settingsCollection = getSettingsCollection(state);
    return {
        order,
        canCancel: canCancelOrder(state, order),
        allowRma: canRmaOrder(state, order),
        rmaLink: getPageLinkByPageType(state, "RequestRmaPage"),
        canReorderItems: settingsCollection.orderSettings.canReorderItems,
        showAddToCartConfirmationDialog: settingsCollection.productSettings.showAddToCartConfirmationDialog,
        isReordering: state.pages.orderDetails.isReordering,
    };
};

const mapDispatchToProps = {
    cancelOrder,
    reorder,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface OrderDetailsButtonSetStyles {
    buttonsWrapper?: InjectableCss;
    buttonHidden?: HiddenProps;
    buttonGridContainer?: GridContainerProps;
    tabletButtonHidden?: HiddenProps;
    tabletMenuHidden?: HiddenProps;
    menuHidden?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    shareEntityButtonStyles?: ShareEntityButtonStyles;
    cancelButton?: ButtonPresentationProps;
    cancelClickable?: ClickablePresentationProps;
    printButton?: ButtonPresentationProps;
    printClickable?: ClickablePresentationProps;
    reorderButton?: ButtonPresentationProps;
    spinner?: LoadingSpinnerProps;
    reorderClickable?: ClickablePresentationProps;
    reorderClickableSpinner?: LoadingSpinnerProps;
    rmaButton?: ButtonPresentationProps;
    rmaClickable?: ClickablePresentationProps;
    buttonWrapper?: InjectableCss;
}

export const orderDetailsButtonSetStyles: OrderDetailsButtonSetStyles = {
    buttonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            clear: both;
        `,
    },
    shareEntityButtonStyles: {
        button: {
            variant: "secondary",
        },
    },
    buttonHidden: {
        below: "lg",
        css: css`
            width: 100%;
            display: flex;
            justify-content: flex-end;
        `,
    },
    tabletButtonHidden: {
        below: "md",
        above: "md",
    },
    tabletMenuHidden: {
        below: "md",
        above: "md",
    },
    menuHidden: {
        above: "sm",
        css: css`
            width: 100%;
            display: flex;
            justify-content: flex-end;
        `,
    },
    buttonWrapper: {
        css: css`
            margin-left: 20px;
        `,
    },
    cancelButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    printButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    reorderButton: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
    rmaButton: {
        buttonType: "solid",
        variant: "secondary",
    },
    spinner: {
        size: 22,
        css: css`
            margin: 8px 50px 0 34px;
        `,
    },
    reorderClickableSpinner: {
        size: 22,
        css: css`
            margin: 10px 0 5px 15px;
        `,
    },
};

/**
 * @deprecated Use orderDetailsButtonSetStyles instead.
 */
export const emailButtonStyles = orderDetailsButtonSetStyles;
const styles = orderDetailsButtonSetStyles;

const OrderDetailsButtonSet: React.FC<Props> = ({
    order,
    cancelOrder,
    reorder,
    canCancel,
    allowRma,
    fields,
    rmaLink,
    canReorderItems,
    showAddToCartConfirmationDialog,
    isReordering,
    history,
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const resolvedGenerateEmailAttachmentFromWebpage =
        fields.generateEmailAttachmentFromWebpage === true || fields.generateEmailAttachmentFromWebpage === undefined;
    if (!order) {
        return null;
    }

    const onClickCancel = () => {
        cancelOrder();
    };

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
                toasterContext.addToast({
                    children: (
                        <>
                            <OrderDetailPageTypeLink
                                title={order.webOrderNumber}
                                orderNumber={order.webOrderNumber || order.erpOrderNumber}
                            />
                            &nbsp;{translate("Added to Cart")}
                        </>
                    ),
                    messageType: "success",
                    timeoutLength: 6000,
                });
            },
        });
    };

    const onClickRma = (url: string) => {
        history.push(`${url}?orderNumber=${order.webOrderNumber || order.erpOrderNumber}`);
    };

    const buttonList: ButtonMapper = {};
    if (order.canAddToCart && canCancel) {
        buttonList[buttons.cancel] = {
            button: (
                <Button {...styles.cancelButton} onClick={onClickCancel}>
                    {translate("Cancel")}
                </Button>
            ),
            clickable: (
                <Clickable {...styles.cancelClickable} onClick={onClickCancel}>
                    {translate("Cancel")}
                </Clickable>
            ),
        };
    }

    if (order.canAddToCart && canReorderItems) {
        buttonList[buttons.reorder] = {
            button: (
                <>
                    {!isReordering && (
                        <Button
                            {...styles.reorderButton}
                            onClick={onClickReorder}
                            disabled={isReordering}
                            data-test-selector="orderDetailsReorderButton"
                        >
                            {translate("Reorder")}
                        </Button>
                    )}
                    {isReordering && <LoadingSpinner {...styles.spinner} />}
                </>
            ),
            clickable: (
                <>
                    {!isReordering && (
                        <Clickable {...styles.reorderClickable} onClick={onClickReorder} disabled={isReordering}>
                            {translate("Reorder")}
                        </Clickable>
                    )}
                    {isReordering && <LoadingSpinner {...styles.reorderClickableSpinner} />}
                </>
            ),
            showButtonOnTablet: true,
        };
    }

    if (allowRma && rmaLink) {
        buttonList[buttons.rma] = {
            button: (
                <Button
                    {...styles.rmaButton}
                    onClick={() => onClickRma(rmaLink.url)}
                    data-test-selector="orderDetails_returnRequestButton"
                >
                    {translate("Return Request")}
                </Button>
            ),
            clickable: (
                <Clickable {...styles.rmaClickable} onClick={() => onClickRma(rmaLink.url)}>
                    {translate("Return Request")}
                </Clickable>
            ),
        };
    }

    buttonList[buttons.email] = {
        button: (
            <ShareEntityButton
                entityId={order.webOrderNumber}
                entityName="Order"
                extendedStyles={styles.shareEntityButtonStyles}
                generateAttachmentFromWebpage={resolvedGenerateEmailAttachmentFromWebpage}
            />
        ),
        clickable: (
            <ShareEntityButton
                entityId={order.webOrderNumber}
                entityName="Order"
                variant="clickable"
                extendedStyles={styles.shareEntityButtonStyles}
                generateAttachmentFromWebpage={resolvedGenerateEmailAttachmentFromWebpage}
            />
        ),
    };

    buttonList[buttons.print] = {
        button: (
            <Button {...styles.printButton} onClick={onClickPrint}>
                {translate("Print")}
            </Button>
        ),
        clickable: (
            <Clickable {...styles.printClickable} onClick={onClickPrint}>
                {translate("Print")}
            </Clickable>
        ),
    };

    const buttonsToRender = fields.buttonsOrder.map(button => buttonList[button.fields.name]).filter(button => button);

    return (
        <StyledWrapper {...styles.buttonsWrapper}>
            <Hidden {...styles.buttonHidden}>
                {buttonsToRender.map((button, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <StyledWrapper {...styles.buttonWrapper} key={index}>
                        {button.button}
                    </StyledWrapper>
                ))}
            </Hidden>
            <Hidden {...styles.tabletButtonHidden}>
                {buttonsToRender
                    .filter(o => o.showButtonOnTablet)
                    .map((button, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <StyledWrapper {...styles.buttonWrapper} key={index}>
                            {button.button}
                        </StyledWrapper>
                    ))}
            </Hidden>
            <Hidden {...styles.tabletMenuHidden}>
                <OverflowMenu hasChildPortal position="end" {...styles.overflowMenu}>
                    {buttonsToRender
                        .filter(o => !o.showButtonOnTablet)
                        .map((button, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={index}>{button.clickable}</div>
                        ))}
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.menuHidden}>
                <OverflowMenu hasChildPortal position="end" {...styles.overflowMenu}>
                    {buttonsToRender.map((button, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index}>{button.clickable}</div>
                    ))}
                </OverflowMenu>
            </Hidden>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(OrderDetailsButtonSet)),
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        displayName: "Order Details Button Set",
        group: "Order Details",
        fieldDefinitions: [
            {
                name: fields.buttonsOrder,
                displayName: "Buttons Order",
                editorTemplate: "ListField",
                defaultValue: [
                    { fields: { name: buttons.rma } },
                    { fields: { name: buttons.print } },
                    { fields: { name: buttons.email } },
                    { fields: { name: buttons.cancel } },
                    { fields: { name: buttons.reorder } },
                ],
                getDisplay: (item: HasFields) => {
                    return item.fields.name;
                },
                hideAdd: true,
                hideEdit: true,
                hideDelete: true,
                fieldType: "General",
                sortOrder: 1,
                fieldDefinitions: [
                    {
                        name: "name",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                ],
            },
            {
                name: fields.generateEmailAttachmentFromWebpage,
                fieldType: "General",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                tooltip:
                    "If checked, sharing the order generates an email attachment using the Order Details page, rather than a pre-defined PDF file.",
            },
        ],
    },
};

export default widgetModule;
