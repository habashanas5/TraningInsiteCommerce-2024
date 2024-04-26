import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage, { siteMessageWithCustomParserOptions } from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

import setFulfillmentMethod from "@insite/client-framework/Store/Context/Handlers/SetFulfillmentMethod";
import updatePickUpWarehouse from "@insite/client-framework/Store/Context/Handlers/UpdatePickUpWarehouse";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import {
    canPlaceOrder,
    canSubmitForApprovalOrder,
    getCartState,
    getCurrentCartState,
    hasProductsWithInvalidPrice,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import {
    getCurrentPromotionsDataView,
    getDiscountTotal,
    getOrderPromotions,
    getPromotionsDataView,
    getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { getCurrentShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import FindLocationModal, { FindLocationModalStyles } from "@insite/content-library/Components/FindLocationModal";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import PlaceOrderButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitPlaceOrderButton";
import SubmitForApprovalButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitSubmitForApprovalButton";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link from "@insite/mobius/Link";
import Modal from "@insite/mobius/Modal";
import Radio, { RadioComponentProps, RadioStyle } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import { domToReact, HTMLReactParserOptions } from "html-react-parser";
import React, { ChangeEvent, FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    updatePickUpWarehouse,
    setFulfillmentMethod,
};

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const promotionsDataView = cartId ? getPromotionsDataView(state, cartId) : getCurrentPromotionsDataView(state);
    const billTo = getCurrentBillToState(state).value;
    const shipTo = getCurrentShipToState(state).value;
    const customerSettings = getSettingsCollection(state).customerSettings;

    let orderPromotions;
    let shippingPromotions;
    let discountTotal;
    if (promotionsDataView.value) {
        orderPromotions = getOrderPromotions(promotionsDataView.value);
        shippingPromotions = getShippingPromotions(promotionsDataView.value);
        discountTotal = getDiscountTotal(promotionsDataView.value);
    }

    return {
        isLoading: cartState.isLoading,
        cart: cartState.value,
        orderPromotions,
        shippingPromotions,
        discountTotal,
        showPlaceOrderButton: canPlaceOrder(cartState.value),
        placeOrderErrorMessage: state.pages.checkoutReviewAndSubmit.placeOrderErrorMessage,
        showSubmitForApprovalOrder: canSubmitForApprovalOrder(cartState.value),
        hasProductsWithInvalidPrice: hasProductsWithInvalidPrice(cartState.value),
        canUpdateShipToAddress:
            billTo?.isGuest ||
            shipTo?.oneTimeAddress ||
            customerSettings.allowBillToAddressEdit ||
            customerSettings.allowShipToAddressEdit,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitCartTotalStyles {
    container?: GridContainerProps;
    cartTotalGridItem?: GridItemProps;
    cartTotal?: CartTotalDisplayStyles;
    buttonsGridItem?: GridItemProps;
    hasInsufficientInventoryGridItem?: GridItemProps;
    availabilityErrorMessageText?: TypographyPresentationProps;
    placeOrderErrorMessageGridItem?: GridItemProps;
    placeOrderErrorMessageText?: TypographyPresentationProps;
    invalidEditableAddressErrorMessageGridItem?: GridItemProps;
    invalidEditableAddressErrorMessageText?: TypographyPresentationProps;
    invalidAddressErrorMessageGridItem?: GridItemProps;
    invalidAddressErrorMessageText?: TypographyPresentationProps;
    invalidPriceErrorMessageGridItem?: GridItemProps;
    invalidPriceErrorMessageText?: TypographyPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
    submitForApprovalButton?: ButtonPresentationProps;
    findLocationModal?: FindLocationModalStyles;
    defaultFulfillmentMethodRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    defaultFulfillmentMethodRadio?: FieldSetPresentationProps<RadioComponentProps>;
}

export const cartTotalStyles: CheckoutReviewAndSubmitCartTotalStyles = {
    container: { gap: 10 },
    cartTotalGridItem: { width: 12 },
    buttonsGridItem: {
        width: 12,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            display: none;
                        `,
                    ],
                    "max",
                )}
            flex-direction: column;
        `,
    },
    hasInsufficientInventoryGridItem: { width: 12 },
    availabilityErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    placeOrderErrorMessageGridItem: { width: 12 },
    placeOrderErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    invalidEditableAddressErrorMessageGridItem: { width: 12 },
    invalidEditableAddressErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    invalidAddressErrorMessageGridItem: { width: 12 },
    invalidAddressErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    invalidPriceErrorMessageGridItem: { width: 12 },
    invalidPriceErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    placeOrderButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            width: 100%;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    submitForApprovalButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            width: 100%;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    defaultFulfillmentMethodRadioGroup: {
        css: css`
            display: block;
            ${RadioStyle} {
                display: inline-block;
                margin-right: 1em;
                & + ${RadioStyle} {
                    margin-top: 0;
                }
            }
        `,
    },
};

const styles = cartTotalStyles;

const CheckoutReviewAndSubmitCartTotal: FC<Props> = ({
    showPlaceOrderButton,
    cart,
    isLoading,
    shippingPromotions,
    discountTotal,
    orderPromotions,
    placeOrderErrorMessage,
    updatePickUpWarehouse,
    setFulfillmentMethod,
    showSubmitForApprovalOrder,
    canUpdateShipToAddress,
    hasProductsWithInvalidPrice,
}) => {
    const [isFindLocationOpen, setIsFindLocationOpen] = React.useState(false);
    const openWarehouseSelectionModal = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        setIsFindLocationOpen(true);
    };
    const handleFindLocationModalClose = () => setIsFindLocationOpen(false);

    const toasterContext = React.useContext(ToasterContext);
    const handleWarehouseSelected = async (pickUpWarehouse: WarehouseModel) => {
        await updatePickUpWarehouse({ pickUpWarehouse });
        toasterContext.addToast({
            body: translate("Pick Up Address Updated"),
            messageType: "success",
        });
        setIsFindLocationOpen(false);
    };

    const [isFulfillmentMethodOpen, setIsFulfillmentMethodOpen] = React.useState(false);
    const openDeliveryMethodPopup = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        setIsFulfillmentMethodOpen(true);
    };

    const modalCloseHandler = () => {
        setIsFulfillmentMethodOpen(false);
    };

    const fulfillmentMethodChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFulfillmentMethod({ fulfillmentMethod: event.currentTarget.value as "Ship" | "PickUp" });
    };

    const parserOptions: HTMLReactParserOptions = {
        replace: node => {
            const { name, children, attribs = { style: "" }, ...rest } = node;
            const { style, class: className, ...otherAttribs } = attribs;

            otherAttribs.className = className;

            if (name === "a") {
                let onClickHandler: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
                for (const key in otherAttribs) {
                    if (key === "ng-click") {
                        if (otherAttribs[key] === "vm.openWarehouseSelectionModal()") {
                            onClickHandler = openWarehouseSelectionModal;
                        }
                        if (otherAttribs[key] === "vm.openDeliveryMethodPopup()") {
                            onClickHandler = openDeliveryMethodPopup;
                        }
                    }
                }
                return (
                    <Link
                        css={style as any}
                        id={otherAttribs.name}
                        {...otherAttribs}
                        onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                            onClickHandler && onClickHandler(event)
                        }
                    >
                        {children && domToReact(children, parserOptions)}
                    </Link>
                );
            }
        },
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.cartTotalGridItem}>
                <CartTotalDisplay
                    cart={cart}
                    isLoading={isLoading}
                    shippingPromotions={shippingPromotions}
                    discountTotal={discountTotal}
                    orderPromotions={orderPromotions}
                />
            </GridItem>
            {cart && showPlaceOrderButton && (
                <GridItem {...styles.buttonsGridItem}>
                    <PlaceOrderButton styles={styles.placeOrderButton} />
                </GridItem>
            )}
            {cart && showSubmitForApprovalOrder && (
                <GridItem {...styles.buttonsGridItem}>
                    <SubmitForApprovalButton extendedStyles={styles.submitForApprovalButton} />
                </GridItem>
            )}
            {cart && cart.hasInsufficientInventory === true && (
                <GridItem {...styles.hasInsufficientInventoryGridItem}>
                    <Typography
                        {...styles.availabilityErrorMessageText}
                        data-test-selector="checkoutReviewAndSubmit_availabilityErrorMessage"
                    >
                        {siteMessageWithCustomParserOptions("ReviewAndPay_NotEnoughInventoryForPickup", parserOptions)}
                    </Typography>
                    <FindLocationModal
                        modalIsOpen={isFindLocationOpen}
                        onWarehouseSelected={handleWarehouseSelected}
                        onModalClose={handleFindLocationModalClose}
                        extendedStyles={styles.findLocationModal}
                    />
                    <Modal
                        size={500}
                        headline={translate("Fulfillment Method")}
                        isOpen={isFulfillmentMethodOpen}
                        handleClose={modalCloseHandler}
                    >
                        <RadioGroup
                            value={cart.fulfillmentMethod}
                            onChangeHandler={fulfillmentMethodChangeHandler}
                            {...styles.defaultFulfillmentMethodRadioGroup}
                        >
                            <Radio value={FulfillmentMethod.Ship} {...styles.defaultFulfillmentMethodRadio}>
                                {translate("Ship")}
                            </Radio>
                            <Radio value={FulfillmentMethod.PickUp} {...styles.defaultFulfillmentMethodRadio}>
                                {translate("Pick Up")}
                            </Radio>
                        </RadioGroup>
                    </Modal>
                </GridItem>
            )}
            {placeOrderErrorMessage && (
                <GridItem {...styles.placeOrderErrorMessageGridItem}>
                    <Typography
                        {...styles.placeOrderErrorMessageText}
                        data-test-selector="checkoutReviewAndSubmit_placeOrderErrorMessage"
                    >
                        {placeOrderErrorMessage}
                    </Typography>
                </GridItem>
            )}
            {cart?.taxFailureReason === "InvalidAddress" && canUpdateShipToAddress && (
                <GridItem {...styles.invalidEditableAddressErrorMessageGridItem}>
                    <Typography {...styles.invalidEditableAddressErrorMessageText}>
                        {siteMessage("ReviewAndPay_InvalidAddress_CannotCalculateTax_UpdateAddress")}
                    </Typography>
                </GridItem>
            )}
            {cart?.taxFailureReason === "InvalidAddress" && !canUpdateShipToAddress && (
                <GridItem {...styles.invalidAddressErrorMessageGridItem}>
                    <Typography {...styles.invalidAddressErrorMessageText}>
                        {siteMessage("ReviewAndPay_InvalidAddress_CannotCalculateTax")}
                    </Typography>
                </GridItem>
            )}
            {hasProductsWithInvalidPrice && (
                <GridItem {...styles.invalidPriceErrorMessageGridItem}>
                    <Typography {...styles.invalidPriceErrorMessageText}>
                        {siteMessage("ReviewAndPay_HasProductsWithInvalidPrice")}
                    </Typography>
                </GridItem>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitCartTotal),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        displayName: "Cart Total",
    },
};

export default widgetModule;
