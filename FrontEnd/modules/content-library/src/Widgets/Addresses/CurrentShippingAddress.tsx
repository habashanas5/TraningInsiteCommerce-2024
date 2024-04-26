import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setCurrentShipTo from "@insite/client-framework/Store/Context/Handlers/SetCurrentShipTo";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import loadCurrentShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";
import updateShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/UpdateShipTo";
import {
    getCurrentShipTosDataView,
    getCurrentShipToState,
} from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay from "@insite/content-library/Components/AddressInfoDisplay";
import CustomerAddressForm from "@insite/content-library/Components/CustomerAddressForm";
import { AddressesPageContext } from "@insite/content-library/Pages/AddressesPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    currentShipTo: getCurrentShipToState(state).value,
    currentShipTosDataView: getCurrentShipTosDataView(state),
    currentBillTo: getCurrentBillToState(state).value,
    countries: getCurrentCountries(state),
    shipToAddressFields: getAddressFieldsDataView(state).value?.shipToAddressFields,
});

const mapDispatchToProps = {
    updateShipTo,
    setCurrentShipTo,
    loadCurrentShipTos,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CurrentShippingAddressStyles {
    gridContainer?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyProps;
    editLinkGridItem?: GridItemProps;
    editLink?: LinkPresentationProps;
    addressFormModal?: ModalPresentationProps;
    addressInfoDisplayGridItem?: GridItemProps;
    useBillingAddressButtonGridItem?: GridItemProps;
    useBillingAddress?: UseBillingAddressStyles;
}

interface UseBillingAddressStyles {
    button?: ButtonPresentationProps;
}

export const currentShippingAddressStyles: CurrentShippingAddressStyles = {
    gridContainer: { gap: 5 },
    headingGridItem: { width: 10 },
    headingText: { variant: "h5" },
    editLinkGridItem: { width: 2 },
    addressFormModal: { sizeVariant: "medium" },
    addressInfoDisplayGridItem: { width: 12 },
    useBillingAddressButtonGridItem: { width: 12 },
    useBillingAddress: {
        button: {
            color: "secondary",
            css: css`
                margin-top: 20px;
            `,
        },
    },
};

const styles = currentShippingAddressStyles;

const CurrentShippingAddress: React.FunctionComponent<Props> = (props: Props) => {
    const { currentShipTo, currentBillTo, currentShipTosDataView, loadCurrentShipTos } = props;

    useEffect(() => {
        // we reset all dataviews when adding a new address, so we have to load these if they go away
        if (!currentShipTosDataView.value && !currentShipTosDataView.isLoading) {
            loadCurrentShipTos();
        }
    });

    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    if (!currentShipTo || !currentBillTo || !currentShipTosDataView.value) {
        return null;
    }

    const billToAsShipTo = currentShipTosDataView.value.find(o => o.id === currentBillTo.id);

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };
    const editClickHandler = () => {
        setModalIsOpen(true);
    };
    const useBillingAddressHandler = () => {
        if (!billToAsShipTo) {
            return;
        }
        props.setCurrentShipTo({
            shipToId: billToAsShipTo.id,
        });
    };
    const formCancelHandler = (e: any) => {
        e.preventDefault();
        modalCloseHandler();
    };
    const formSubmitHandler = (_: React.FormEvent<HTMLFormElement>, address: ShipToModel) => {
        if (!currentBillTo || !currentShipTo) {
            return;
        }

        props.updateShipTo({
            billToId: currentBillTo.id,
            shipTo: {
                ...currentShipTo,
                ...address,
            },
        });
        modalCloseHandler();
    };

    const { countries, shipToAddressFields } = props;

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText}>{translate("Shipping Information")}</Typography>
            </GridItem>
            <GridItem {...styles.editLinkGridItem}>
                {countries && (
                    <Link {...styles.editLink} onClick={editClickHandler}>
                        {translate("Edit")}
                    </Link>
                )}
                {countries && shipToAddressFields && (
                    <Modal
                        headline={translate("Edit Shipping Information")}
                        {...styles.addressFormModal}
                        isOpen={modalIsOpen}
                        handleClose={modalCloseHandler}
                    >
                        <CustomerAddressForm
                            address={currentShipTo}
                            countries={countries}
                            addressFieldDisplayCollection={shipToAddressFields}
                            onCancel={formCancelHandler}
                            onSubmit={formSubmitHandler}
                        />
                    </Modal>
                )}
            </GridItem>
            <GridItem {...styles.addressInfoDisplayGridItem}>
                <AddressInfoDisplay
                    firstName={currentShipTo.firstName}
                    lastName={currentShipTo.lastName}
                    companyName={currentShipTo.companyName}
                    attention={currentShipTo.attention}
                    address1={currentShipTo.address1}
                    address2={currentShipTo.address2}
                    address3={currentShipTo.address3}
                    address4={currentShipTo.address4}
                    city={currentShipTo.city}
                    state={currentShipTo.state ? currentShipTo.state.abbreviation : undefined}
                    postalCode={currentShipTo.postalCode}
                    country={currentShipTo.country ? currentShipTo.country.abbreviation : undefined}
                    phone={currentShipTo.phone}
                    fax={currentShipTo.fax}
                    email={currentShipTo.email}
                />
            </GridItem>
            {billToAsShipTo && currentShipTo.id !== billToAsShipTo.id && (
                <GridItem {...styles.useBillingAddressButtonGridItem}>
                    <UseBillingAddressButton onClick={useBillingAddressHandler} />
                </GridItem>
            )}
        </GridContainer>
    );
};

interface UseBillingAddressButtonProps {
    onClick: () => void;
}

const UseBillingAddressButton: React.FunctionComponent<UseBillingAddressButtonProps> = (
    props: UseBillingAddressButtonProps,
) => {
    const componentStyles: UseBillingAddressStyles = styles.useBillingAddress || {};

    return (
        <Button {...componentStyles.button} onClick={props.onClick}>
            {translate("Use Billing Address")}
        </Button>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CurrentShippingAddress),
    definition: {
        group: "Addresses",
        allowedContexts: [AddressesPageContext],
    },
};

export default widgetModule;
