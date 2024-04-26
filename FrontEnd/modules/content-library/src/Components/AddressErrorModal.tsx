import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddressErrorModalIsOpen from "@insite/client-framework/Store/Components/AddressErrorModal/Handlers/SetAddressErrorModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: AddressErrorModalStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

const mapStateToProps = (state: ApplicationState) => {
    const customerSettings = getSettingsCollection(state).customerSettings;
    const session = state.context.session;
    const shipTo = getShipToState(state, session.shipToId).value;
    const location = getLocation(state);
    const checkoutShippingPageUrl = getPageLinkByPageType(state, "CheckoutShippingPage")?.url;
    const addressesPageUrl = getPageLinkByPageType(state, "AddressesPage")?.url;
    const checkoutReviewAndSubmitPageUrl = getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage")?.url;
    const oneTimeAddress = shipTo && shipTo.oneTimeAddress;

    let continueUrl: string | undefined;
    const path = location.pathname.toLowerCase();
    if (
        (checkoutShippingPageUrl && path.indexOf(checkoutShippingPageUrl.toLowerCase()) > -1) ||
        (addressesPageUrl && path.indexOf(addressesPageUrl.toLowerCase()) > -1)
    ) {
        continueUrl = "";
    } else {
        continueUrl =
            (checkoutReviewAndSubmitPageUrl && path.indexOf(checkoutReviewAndSubmitPageUrl.toLowerCase()) > -1) ||
            oneTimeAddress
                ? checkoutShippingPageUrl
                : addressesPageUrl;
    }

    return {
        isAddressEditAllowed: customerSettings.allowBillToAddressEdit && customerSettings.allowShipToAddressEdit,
        modalIsOpen: state.components.addressErrorModal.isOpen,
        continueUrl,
    };
};

const mapDispatchToProps = {
    setAddressErrorModalIsOpen,
};

export interface AddressErrorModalStyles {
    modal?: ModalPresentationProps;
    innerWrapper?: InjectableCss;
    descriptionText?: TypographyPresentationProps;
    buttonsWrapper?: InjectableCss;
    continueButton?: ButtonPresentationProps;
}

export const addressErrorModalStyles: AddressErrorModalStyles = {
    modal: {
        size: 550,
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    continueButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const AddressErrorModal = ({
    modalIsOpen,
    isAddressEditAllowed,
    continueUrl,
    setAddressErrorModalIsOpen,
    extendedStyles,
    history,
}: Props) => {
    const [styles] = useState(() => mergeToNew(addressErrorModalStyles, extendedStyles));

    const modalCloseHandler = () => {
        setAddressErrorModalIsOpen({ modalIsOpen: false });
    };

    const continueButtonClickHandler = () => {
        setAddressErrorModalIsOpen({ modalIsOpen: false });
        if (continueUrl) {
            history.push(continueUrl);
        }
    };

    return (
        <Modal {...styles.modal} isOpen={modalIsOpen} handleClose={modalCloseHandler}>
            <StyledWrapper {...styles.innerWrapper}>
                <Typography {...styles.descriptionText}>
                    {isAddressEditAllowed
                        ? siteMessage("Cart_InvalidAddress_Update")
                        : siteMessage("Cart_InvalidAddress_ContactSupport")}
                </Typography>
                <StyledWrapper {...styles.buttonsWrapper}>
                    {isAddressEditAllowed && continueUrl && (
                        <Button {...styles.continueButton} onClick={continueButtonClickHandler}>
                            {translate("Continue")}
                        </Button>
                    )}
                </StyledWrapper>
            </StyledWrapper>
        </Modal>
    );
};

export default withHistory(connect(mapStateToProps, mapDispatchToProps)(AddressErrorModal));
