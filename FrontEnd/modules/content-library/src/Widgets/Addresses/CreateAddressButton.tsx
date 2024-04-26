import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setCurrentShipTo from "@insite/client-framework/Store/Context/Handlers/SetCurrentShipTo";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { isVmiAdmin } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import createShipTo from "@insite/client-framework/Store/Pages/Addresses/Handlers/CreateShipTo";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CustomerAddressForm from "@insite/content-library/Components/CustomerAddressForm";
import { AddressesPageContext } from "@insite/content-library/Pages/AddressesPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        customerSettings: settings.customerSettings,
        currentBillTo: getCurrentBillToState(state).value,
        newShipTo: state.pages.addresses.newShipTo,
        countries: getCurrentCountries(state),
        billToAddressFields: getAddressFieldsDataView(state).value?.billToAddressFields,
        location: getLocation(state),
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
    };
};

const mapDispatchToProps = {
    createShipTo,
    setCurrentShipTo,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CreateAddressButtonStyles {
    gridContainer?: GridContainerProps;
    createNewAddressButtonGridItem?: GridItemProps;
    overflowMenu?: OverflowMenuPresentationProps;
    createNewAddressButton?: ButtonPresentationProps;
    addressFormModal?: ModalPresentationProps;
}

export const createAddressButtonStyles: CreateAddressButtonStyles = {
    createNewAddressButtonGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    addressFormModal: { sizeVariant: "medium" },
};

const styles = createAddressButtonStyles;

const CreateAddressButton = ({
    customerSettings,
    currentBillTo,
    newShipTo,
    countries,
    billToAddressFields,
    location,
    isVmiAdmin,
    createShipTo,
    setCurrentShipTo,
}: Props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    useEffect(() => {
        const parsedQuery = parseQueryString<{ isNewShipTo: string }>(location.search);
        if (parsedQuery.isNewShipTo === "true") {
            setModalIsOpen(true);
        }
    }, []);

    if (!customerSettings.allowCreateNewShipToAddress && !isVmiAdmin) {
        return null;
    }

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const editClickHandler = () => {
        setModalIsOpen(true);
    };

    const formCancelHandler = (e: any) => {
        e.preventDefault();
        modalCloseHandler();
    };

    const formSubmitHandler = (_: React.FormEvent<HTMLFormElement>, address: ShipToModel) => {
        if (!currentBillTo || !newShipTo) {
            return;
        }

        createShipTo({
            billToId: currentBillTo.id,
            shipTo: {
                ...newShipTo,
                ...address,
            },
            onComplete: result => {
                if (result.apiResult) {
                    setCurrentShipTo({ shipToId: result.apiResult.id });
                }
            },
        });
        modalCloseHandler();
    };

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.createNewAddressButtonGridItem}>
                <Hidden above="sm">
                    <OverflowMenu position="end" {...styles.overflowMenu}>
                        <Clickable onClick={editClickHandler}>{translate("Create New Address")}</Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden below="md">
                    <Button {...styles.createNewAddressButton} onClick={editClickHandler}>
                        {translate("Create New Address")}
                    </Button>
                </Hidden>
                <Modal
                    headline={translate("Create New Address")}
                    {...styles.addressFormModal}
                    isOpen={modalIsOpen}
                    handleClose={modalCloseHandler}
                >
                    {newShipTo && countries && billToAddressFields && (
                        <CustomerAddressForm
                            address={newShipTo}
                            countries={countries}
                            addressFieldDisplayCollection={billToAddressFields}
                            onCancel={formCancelHandler}
                            onSubmit={formSubmitHandler}
                        />
                    )}
                </Modal>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CreateAddressButton),
    definition: {
        group: "Addresses",
        icon: "Button",
        allowedContexts: [AddressesPageContext],
    },
};

export default widgetModule;
