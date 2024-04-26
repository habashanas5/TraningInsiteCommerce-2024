import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import translate from "@insite/client-framework/Translate";
import { BillToModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay from "@insite/content-library/Components/AddressInfoDisplay";
import ShipToSelector, { ShipToSelectorStyles } from "@insite/content-library/Components/ShipToSelector";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    currentShipTo?: ShipToModel;
    currentBillTo?: BillToModel;
    isPickUp: boolean;
    extendedStyles?: DefaultShippingAddressStyles;
}

const mapDispatchToProps = {
    updateAccountSettings,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface DefaultShippingAddressStyles {
    gridContainer?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyProps;
    editLinkGridItem?: GridItemProps;
    editLink?: LinkPresentationProps;
    customerSelectorModal?: ModalPresentationProps;
    shipToSelector?: ShipToSelectorStyles;
    customerSelectorModalButtonsWrapper?: InjectableCss;
    customerSelectorModalCancelButton?: ButtonPresentationProps;
    addressInfoDisplayGridItem?: GridItemProps;
}

export const defaultShippingAddressStyles: DefaultShippingAddressStyles = {
    gridContainer: { gap: 5 },
    headingGridItem: { width: 12 },
    headingText: {
        variant: "h5",
        css: css`
            margin-bottom: 0;
        `,
    },
    editLink: {
        css: css`
            margin-left: 10px;
            margin-top: 5px;
        `,
    },
    customerSelectorModal: { sizeVariant: "medium" },
    customerSelectorModalButtonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        `,
    },
    customerSelectorModalCancelButton: { variant: "secondary" },
    addressInfoDisplayGridItem: { width: 12 },
};

const DefaultShippingAddress = ({
    currentShipTo,
    currentBillTo,
    updateAccountSettings,
    extendedStyles,
    isPickUp,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const editClickHandler = () => {
        setIsModalOpen(true);
    };

    const selectShipToHandler = (customer: ShipToModel) => {
        if (currentShipTo?.id !== customer.id) {
            updateAccountSettings({ shipToId: customer.id });
        }

        modalCloseHandler();
    };

    const modalCloseHandler = () => setIsModalOpen(false);

    const [styles] = useState(() => mergeToNew(defaultShippingAddressStyles, extendedStyles));

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText}>
                    {isPickUp ? translate("Recipient Address") : translate("Default Shipping Address")}
                </Typography>
                <Link
                    {...styles.editLink}
                    onClick={editClickHandler}
                    data-test-selector="accountSettings_changeShipping"
                >
                    {translate("Change")}
                </Link>
                <Modal
                    {...styles.customerSelectorModal}
                    headline={translate("Choose Shipping Information")}
                    isOpen={isModalOpen}
                    handleClose={modalCloseHandler}
                >
                    <ShipToSelector
                        currentShipTo={currentShipTo}
                        currentBillToId={currentBillTo?.id}
                        onSelect={selectShipToHandler}
                        allowSelectBillTo={true}
                        extendedStyles={styles.shipToSelector}
                    />
                    <StyledWrapper {...styles.customerSelectorModalButtonsWrapper}>
                        <Button {...styles.customerSelectorModalCancelButton} onClick={modalCloseHandler}>
                            {translate("Cancel")}
                        </Button>
                    </StyledWrapper>
                </Modal>
            </GridItem>
            {currentShipTo && (
                <GridItem
                    {...styles.addressInfoDisplayGridItem}
                    data-test-selector={`accountSettings_shipping_${currentShipTo?.id}`}
                >
                    <AddressInfoDisplay
                        {...currentShipTo}
                        state={currentShipTo.state?.abbreviation}
                        country={currentShipTo.country?.abbreviation}
                    />
                </GridItem>
            )}
        </GridContainer>
    );
};

export default connect(null, mapDispatchToProps)(DefaultShippingAddress);
