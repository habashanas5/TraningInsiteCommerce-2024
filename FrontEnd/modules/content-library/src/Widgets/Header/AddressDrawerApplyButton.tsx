import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import applyChanges from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/ApplyChanges";
import setDrawerIsOpen from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetDrawerIsOpen";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { enableWarehousePickup } = getSettingsCollection(state).accountSettings;
    const {
        fulfillmentMethod: currentFulfillmentMethod,
        isAuthenticated,
        isGuest,
        billToId,
        shipToId,
        pickUpWarehouse: currentPickUpWarehouse,
    } = getSession(state);
    const { fulfillmentMethod, selectedBillTo, selectedShipTo, isApplyingChanges, pickUpWarehouse } =
        state.components.addressDrawer;
    const { value: currentBillTo } = getBillToState(state, billToId);
    const { value: currentShipTo } = getShipToState(state, shipToId);
    const isExistingUser = isAuthenticated && !isGuest;
    const isFulfillmentMethodChanged = fulfillmentMethod !== currentFulfillmentMethod;
    const isBillToChanged = selectedBillTo && selectedBillTo.id !== currentBillTo?.id;
    const isShipToChanged = selectedShipTo && selectedShipTo.id !== currentShipTo?.id;
    const isPickUpWarehouseChanged = pickUpWarehouse !== null && pickUpWarehouse !== currentPickUpWarehouse;
    return {
        showButton: currentFulfillmentMethod === FulfillmentMethod.Ship || enableWarehousePickup,
        isEnabled:
            (isFulfillmentMethodChanged ||
                isPickUpWarehouseChanged ||
                (isExistingUser && (isBillToChanged || isShipToChanged))) &&
            !isApplyingChanges,
        isApplyingChanges,
    };
};

const mapDispatchToProps = {
    applyChanges: makeHandlerChainAwaitable(applyChanges),
    setDrawerIsOpen,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasToasterContext;

export interface AddressDrawerApplyButtonStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    button?: ButtonPresentationProps;
}

export const addressDrawerApplyButtonStyles: AddressDrawerApplyButtonStyles = {
    gridItem: {
        css: css`
            justify-content: flex-end;
            padding-bottom: 20px;
        `,
        width: 12,
    },
};

const styles = addressDrawerApplyButtonStyles;

const AddressDrawerApplyButton = ({
    showButton,
    isEnabled,
    isApplyingChanges,
    applyChanges,
    setDrawerIsOpen,
    toaster,
}: Props) => {
    const handleClickApply = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        await applyChanges({
            onError: (errorMessage: string) => {
                toaster.addToast({
                    messageType: "warning",
                    body: siteMessage("ChangeCustomer_Update_Failed", errorMessage),
                });
            },
        });
        setDrawerIsOpen({ isOpen: false });
    };

    if (!showButton) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem}>
                <Button
                    {...styles.button}
                    onClick={handleClickApply}
                    disabled={!isEnabled}
                    icon={{ src: isApplyingChanges ? LoadingSpinner : "", position: "left" }}
                    data-test-selector="addressDrawer_apply"
                >
                    {translate("Apply")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(AddressDrawerApplyButton)),
    definition: {
        // allowedContexts: [HeaderContext],
        fieldDefinitions: [],
        group: "Header",
    },
};

export default widgetModule;
