import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import changeCustomerContext from "@insite/client-framework/Store/Context/Handlers/ChangeCustomerContext";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import placeOrder from "@insite/client-framework/Store/Pages/SavedOrderDetails/Handlers/PlaceOrder";
import translate from "@insite/client-framework/Translate";
import { CartModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Radio, { RadioProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

enum addressType {
    order = "order",
    session = "session",
}

interface OwnProps {
    isOpen: boolean;
    onClose: () => void;
    extendedStyles?: SavedOrderDetailsAddressModalStyles;
}

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasCartContext &
    HasHistory &
    HasToasterContext;

const mapStateToProps = (state: ApplicationState) => ({
    sessionShipTo: getShipToState(state, state.context.session.shipToId).value,
    sessionBillTo: getBillToState(state, state.context.session.billToId).value,
    cartPageLink: getPageLinkByPageType(state, "CartPage"),
});

const mapDispatchToProps = {
    placeOrder,
    changeCustomerContext,
};

export interface SavedOrderDetailsAddressModalStyles {
    modal?: ModalPresentationProps;
    addressSelectText?: TypographyPresentationProps;
    form?: InjectableCss;
    orderAddressSelectText?: TypographyPresentationProps;
    sessionAddressSelectText?: TypographyPresentationProps;
    selectCustomerRadioGroup?: RadioGroupProps;
    selectCustomerRadio?: RadioProps;
    orderCustomerInformationGridContainer?: GridContainerProps;
    sessionCustomerInformationGridContainer?: GridContainerProps;
    orderShippingInformationGridItem?: GridItemProps;
    orderShippingAddressTitle?: TypographyPresentationProps;
    orderShippingAddress?: AddressInfoDisplayStyles;
    sessionShippingInformationGridItem?: GridItemProps;
    sessionShippingAddressTitle?: TypographyPresentationProps;
    sessionShippingAddress?: AddressInfoDisplayStyles;
    orderBillingInformationGridItem?: GridItemProps;
    orderBillingAddressTitle: TypographyPresentationProps;
    orderBillingAddress?: AddressInfoDisplayStyles;
    sessionBillingInformationGridItem?: GridItemProps;
    sessionBillingAddressTitle: TypographyPresentationProps;
    sessionBillingAddress?: AddressInfoDisplayStyles;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    continueButton?: ButtonPresentationProps;
}

export const savedOrderDetailsAddressModalStyles: SavedOrderDetailsAddressModalStyles = {
    modal: {
        size: 600,
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    selectCustomerRadioGroup: {
        css: css`
            margin-top: 15px;
        `,
    },

    orderCustomerInformationGridContainer: {
        gap: 15,
        css: css`
            padding-left: 30px;
            margin: 5px 0 10px 0;
        `,
    },
    sessionCustomerInformationGridContainer: {
        gap: 15,
        css: css`
            padding-left: 30px;
            margin: 5px 0 10px 0;
        `,
    },
    orderAddressSelectText: {
        variant: "h5",
        css: css`
            margin-bottom: 0;
        `,
    },
    orderShippingInformationGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    orderShippingAddressTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    sessionShippingInformationGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    sessionShippingAddressTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    sessionAddressSelectText: {
        variant: "h5",
        css: css`
            margin-bottom: 0;
        `,
    },
    orderBillingInformationGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    orderBillingAddressTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    sessionBillingInformationGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    sessionBillingAddressTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    continueButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const StyledForm = getStyledWrapper("form");

const SavedOrderDetailsAddressModal: React.FC<Props> = ({
    isOpen,
    cart,
    extendedStyles,
    onClose,
    sessionShipTo,
    sessionBillTo,
    placeOrder,
    history,
    cartPageLink,
    toaster,
    changeCustomerContext,
}) => {
    if (!cart || !cart.shipTo || !cart.billTo || !sessionShipTo || !sessionBillTo) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(savedOrderDetailsAddressModalStyles, extendedStyles));
    const [useCustomerFrom, setUseCustomerFrom] = React.useState(addressType.order);

    const modalCloseHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        onClose();
    };

    const handleSelectCustomerClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUseCustomerFrom(addressType[event.target.value as keyof typeof addressType]);
    };

    const continuePlaceOrder = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onClose();
        if (useCustomerFrom === addressType.session) {
            executePlaceOrder();
        } else {
            // changeCustomerContext reset all orders, so we creating a copy
            const currentOrder = { ...cart };
            changeCustomerContext({
                billToId: cart.billTo!.id,
                shipToId: cart.shipTo!.id,
                fulfillmentMethod: FulfillmentMethod.Ship,
                pickUpWarehouse: null,
                skipRedirect: true,
                onSuccess: () => {
                    executePlaceOrder(currentOrder);
                },
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.();
                    }
                },
            });
        }
    };

    const executePlaceOrder = (order?: CartModel) => {
        placeOrder({
            order,
            onSuccess: () => {
                history.push(cartPageLink!.url);
            },
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
        });
    };

    const hiddenRadioLabel = <VisuallyHidden>{translate("Order address type")}</VisuallyHidden>;

    return (
        <Modal
            {...styles.modal}
            headline={translate("Saved Order Address")}
            isOpen={isOpen}
            handleClose={modalCloseHandler}
        >
            <StyledForm {...styles.form} onSubmit={event => continuePlaceOrder(event)} noValidate>
                <Typography data-test-selector="addressModal_addressSelect" {...styles.addressSelectText}>
                    {siteMessage("SavedOrder_AddressSelect")}
                </Typography>
                <RadioGroup
                    value={useCustomerFrom}
                    label={hiddenRadioLabel}
                    onChangeHandler={event => {
                        handleSelectCustomerClick(event);
                    }}
                    {...styles.selectCustomerRadioGroup}
                >
                    <Radio
                        value={addressType.order}
                        {...styles.selectCustomerRadio}
                        data-test-selector="savedOrderDetailsAddressModal_useFromOrder"
                    >
                        <Typography {...styles.orderAddressSelectText}>{translate("Saved Order")}</Typography>
                    </Radio>
                    <GridContainer
                        data-test-selector="savedOrderDetailsAddressModal_orderCustomer"
                        {...styles.orderCustomerInformationGridContainer}
                    >
                        <GridItem {...styles.orderShippingInformationGridItem}>
                            <Typography {...styles.orderShippingAddressTitle} as="h3">
                                {translate("Shipping Address")}
                            </Typography>
                            <AddressInfoDisplay
                                companyName={cart.shipTo.companyName}
                                address1={cart.shipTo.address1}
                                address2={cart.shipTo.address2}
                                address3={cart.shipTo.address3}
                                address4={cart.shipTo.address4}
                                city={cart.shipTo.city}
                                postalCode={cart.shipTo.postalCode}
                                state={cart.shipTo.state ? cart.shipTo.state.abbreviation : undefined}
                                extendedStyles={styles.orderShippingAddress}
                            />
                        </GridItem>
                        <GridItem {...styles.orderBillingInformationGridItem}>
                            <Typography {...styles.orderBillingAddressTitle} as="h3">
                                {translate("Billing Address")}
                            </Typography>
                            <AddressInfoDisplay
                                companyName={cart.billTo.companyName}
                                address1={cart.billTo.address1}
                                address2={cart.billTo.address2}
                                address3={cart.billTo.address3}
                                address4={cart.billTo.address4}
                                city={cart.billTo.city}
                                postalCode={cart.billTo.postalCode}
                                state={cart.billTo.state ? cart.billTo.state.abbreviation : undefined}
                                extendedStyles={styles.orderBillingAddress}
                            />
                        </GridItem>
                    </GridContainer>
                    <Radio
                        value={addressType.session}
                        {...styles.selectCustomerRadio}
                        data-test-selector="savedOrderDetailsAddressModal_useFromSession"
                    >
                        <Typography {...styles.sessionAddressSelectText}>{translate("Currently Selected")}</Typography>
                    </Radio>
                    <GridContainer
                        data-test-selector="savedOrderDetailsAddressModal_sessionCustomer"
                        {...styles.sessionCustomerInformationGridContainer}
                    >
                        <GridItem {...styles.sessionShippingInformationGridItem}>
                            <Typography {...styles.sessionShippingAddressTitle} as="h3">
                                {translate("Shipping Address")}
                            </Typography>
                            <AddressInfoDisplay
                                companyName={sessionShipTo.companyName}
                                address1={sessionShipTo.address1}
                                address2={sessionShipTo.address2}
                                address3={sessionShipTo.address3}
                                address4={sessionShipTo.address4}
                                city={sessionShipTo.city}
                                postalCode={sessionShipTo.postalCode}
                                state={sessionShipTo.state ? sessionShipTo.state.abbreviation : undefined}
                                extendedStyles={styles.sessionShippingAddress}
                            />
                        </GridItem>
                        <GridItem {...styles.sessionBillingInformationGridItem}>
                            <Typography {...styles.sessionBillingAddressTitle} as="h3">
                                {translate("Billing Address")}
                            </Typography>
                            <AddressInfoDisplay
                                companyName={sessionBillTo.companyName}
                                address1={sessionBillTo.address1}
                                address2={sessionBillTo.address2}
                                address3={sessionBillTo.address3}
                                address4={sessionBillTo.address4}
                                city={sessionBillTo.city}
                                postalCode={sessionBillTo.postalCode}
                                state={sessionBillTo.state ? sessionBillTo.state.abbreviation : undefined}
                                extendedStyles={styles.sessionBillingAddress}
                            />
                        </GridItem>
                    </GridContainer>
                </RadioGroup>
                <StyledWrapper {...styles.buttonsWrapper}>
                    <Button {...styles.cancelButton} onClick={modalCloseHandler}>
                        {translate("Cancel")}
                    </Button>
                    <Button
                        {...styles.continueButton}
                        type="submit"
                        data-test-selector="savedOrderDetailsAddressModal_continueButton"
                    >
                        {translate("Continue")}
                    </Button>
                </StyledWrapper>
            </StyledForm>
        </Modal>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withHistory(withCart(withToaster(SavedOrderDetailsAddressModal))));
