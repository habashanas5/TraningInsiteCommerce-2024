import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";
import {
    AddressFieldDisplayCollectionModel,
    BillToModel,
    CountryModel,
} from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import BillToSelector, { BillToSelectorStyles } from "@insite/content-library/Components/BillToSelector";
import CustomerAddressForm, { CustomerAddressFormStyles } from "@insite/content-library/Components/CustomerAddressForm";
import BillingAddressForm, {
    BillingAddressFormStyles,
} from "@insite/content-library/Widgets/CheckoutShipping/BillingAddressForm";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    address: BillToModel;
    onChange: (address: BillToModel) => void;
    countries: CountryModel[];
    addressFieldDisplayCollection: AddressFieldDisplayCollectionModel;
    extendedStyles?: BillingAddressStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutShipping;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    return {
        currentUserIsGuest: getCurrentUserIsGuest(state),
        isBillingAddressUpdateRequired: state.pages.checkoutShipping.isBillingAddressUpdateRequired,
        cart: cartState.value,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasToasterContext;

export interface BillingAddressStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    selectSavedAddressLink?: LinkPresentationProps;
    addressBookModal?: ModalPresentationProps;
    billToSelector?: BillToSelectorStyles;
    addressBookModalButtonsWrapper?: InjectableCss;
    addressBookModalCancelButton?: ButtonPresentationProps;
    addressDisplayAndFormGridItem?: GridItemProps;
    addressForm?: BillingAddressFormStyles;
    addressDisplay?: AddressInfoDisplayStyles;
    editAddressForm?: CustomerAddressFormStyles;
}

export const billingAddressStyles: BillingAddressStyles = {
    container: { gap: 20 },
    headingGridItem: {
        width: 12,
        css: css`
            align-items: center;
        `,
    },
    headingText: {
        variant: "h5",
        css: css`
            margin-bottom: 0;
        `,
    },
    selectSavedAddressLink: {
        css: css`
            margin-left: 20px;
        `,
    },
    addressBookModal: { sizeVariant: "medium" },
    addressBookModalButtonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        `,
    },
    addressBookModalCancelButton: { variant: "secondary" },
    addressDisplayAndFormGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
};

const BillingAddress = ({
    address,
    onChange,
    countries,
    addressFieldDisplayCollection,
    extendedStyles,
    currentUserIsGuest,
    toaster,
    isBillingAddressUpdateRequired,
    cart,
}: Props) => {
    const [isCustomerSelectorModalOpen, setIsCustomerSelectorModalOpen] = useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
    const [addressBeingEdited, setAddressBeingEdited] = useState<BillToModel | undefined>(undefined);

    useEffect(() => {
        if (addressBeingEdited) {
            setIsEditAddressModalOpen(true);
        }
    }, [addressBeingEdited]);

    const styles = mergeToNew(billingAddressStyles, extendedStyles);

    const selectAddressClickHandler = () => setIsCustomerSelectorModalOpen(true);

    const customerSelectorModalCloseHandler = () => setIsCustomerSelectorModalOpen(false);

    const selectCustomerHandler = (billTo: BillToModel) => {
        customerSelectorModalCloseHandler();
        onChange(billTo);
    };

    const editCustomerHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BillToModel) => {
        event.preventDefault();
        setAddressBeingEdited(customer);
    };

    const editAddressModalCloseHandler = () => {
        setIsEditAddressModalOpen(false);
        setAddressBeingEdited(undefined);
    };

    const editAddressFormSubmitHandler = (_: React.FormEvent<HTMLFormElement>, address: BillToModel) => {
        onChange(address);
        editAddressModalCloseHandler();
        customerSelectorModalCloseHandler();
        toaster.addToast({
            messageType: "success",
            body: "Address updated.",
        });
    };

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.headingGridItem}>
                    <Typography {...styles.headingText} as="h3">
                        {translate("Billing Address")}
                    </Typography>
                    {!currentUserIsGuest &&
                        cart?.status !== "QuoteProposed" &&
                        !(cart?.status === "Cart" && cart?.type === "Job") && (
                            <Link
                                {...styles.selectSavedAddressLink}
                                type="button"
                                onClick={selectAddressClickHandler}
                                data-test-selector="checkoutShipping_selectSavedAddress"
                            >
                                {translate("Select Saved Address")}
                                <VisuallyHidden>{translate("For Billing Address")}</VisuallyHidden>
                            </Link>
                        )}
                </GridItem>
                <GridItem {...styles.addressDisplayAndFormGridItem}>
                    {currentUserIsGuest || isBillingAddressUpdateRequired ? (
                        <>
                            {addressFieldDisplayCollection && countries && (
                                <BillingAddressForm
                                    countries={countries}
                                    fieldDisplay={addressFieldDisplayCollection}
                                    extendedStyles={styles.addressForm}
                                />
                            )}
                        </>
                    ) : (
                        <AddressInfoDisplay
                            {...address}
                            state={address.state?.abbreviation}
                            country={address.country?.abbreviation}
                            extendedStyles={styles.addressDisplay}
                        />
                    )}
                </GridItem>
            </GridContainer>
            <Modal
                {...styles.addressBookModal}
                headline={translate("Address Book")}
                isOpen={isCustomerSelectorModalOpen}
                handleClose={customerSelectorModalCloseHandler}
                data-test-selector="checkoutShipping_addressModal"
            >
                <BillToSelector
                    onSelect={selectCustomerHandler}
                    onEdit={editCustomerHandler}
                    extendedStyles={styles.billToSelector}
                />
                <StyledWrapper {...styles.addressBookModalButtonsWrapper}>
                    <Button
                        {...styles.addressBookModalCancelButton}
                        onClick={customerSelectorModalCloseHandler}
                        data-test-selector="addressModal_cancel"
                    >
                        {translate("Cancel")}
                    </Button>
                </StyledWrapper>
            </Modal>
            {addressBeingEdited && (
                <Modal
                    {...styles.addressBookModal}
                    headline={translate("Edit Address")}
                    isOpen={isEditAddressModalOpen}
                    handleClose={editAddressModalCloseHandler}
                    data-test-selector="checkoutShipping_editAddressModal"
                >
                    <CustomerAddressForm
                        address={addressBeingEdited}
                        countries={countries}
                        addressFieldDisplayCollection={addressFieldDisplayCollection}
                        onSubmit={editAddressFormSubmitHandler}
                        saveButtonTextOverride={translate("Save & Apply")}
                        onCancel={editAddressModalCloseHandler}
                        extendedStyles={styles.editAddressForm}
                    />
                </Modal>
            )}
        </>
    );
};

export default connect(mapStateToProps)(withToaster(BillingAddress));
