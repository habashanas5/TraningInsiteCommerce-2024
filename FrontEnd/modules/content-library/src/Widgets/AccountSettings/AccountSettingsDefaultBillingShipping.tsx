import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillTosDataView, getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import FindLocationModal, { FindLocationModalStyles } from "@insite/content-library/Components/FindLocationModal";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import DefaultBillingAddress from "@insite/content-library/Widgets/AccountSettings/DefaultBillingAddress";
import DefaultShippingAddress from "@insite/content-library/Widgets/AccountSettings/DefaultShippingAddress";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Radio, { RadioComponentProps, RadioProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ChangeEvent, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    updateAccountSettings,
    loadBillTo,
    loadShipTo,
    loadBillTos,
};

const mapStateToProps = (state: ApplicationState) => ({
    account: state.pages.accountSettings.editingAccount,
    enableWarehousePickup: getSettingsCollection(state).accountSettings.enableWarehousePickup,
    requireSelectCustomerOnSignIn: getSettingsCollection(state).accountSettings.requireSelectCustomerOnSignIn,
    billToState: getBillToState(state, state.pages.accountSettings.selectedBillToId),
    selectedBillToId: state.pages.accountSettings.selectedBillToId,
    shipToState: getShipToState(state, state.pages.accountSettings.selectedShipToId),
    selectedShipToId: state.pages.accountSettings.selectedShipToId,
    useDefaultCustomer: state.pages.accountSettings.useDefaultCustomer,
    session: state.context.session,
    billTosDataView: getBillTosDataView(state, { expand: ["shipTos", "excludeOneTime"] }),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountSettingsDefaultBillingShippingStyles {
    customerSelectorGridContainer?: GridContainerProps;
    headingText?: TypographyProps;
    defaultFulfillmentMethodRadioGridItem?: GridItemProps;
    warehouseAddressWrapper?: GridItemProps;
    defaultFulfillmentMethodRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    defaultFulfillmentMethodRadio?: FieldSetPresentationProps<RadioComponentProps>;
    defaultShippingRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    customerSelectorGridItem?: GridItemProps;
    defaultShippingRadioGridItem?: GridItemProps;
    defaultShippingRadio?: RadioProps;
    defaultBillingShippingTitle?: TypographyProps;
    pickUpLocation?: PickUpLocationStyles;
}

interface PickUpLocationStyles {
    gridContainer?: GridContainerProps;
    headingGridItem?: GridItemProps;
    warehouseGridItem?: GridItemProps;
    wrapper?: InjectableCss;
    headerText?: TypographyProps;
    changeLink?: LinkPresentationProps;
    warehouseAddress?: WarehouseAddressInfoDisplayStyles;
    findLocationModal?: FindLocationModalStyles;
}

interface WarehouseAddressInfoDisplayStyles {
    wrapper?: InjectableCss;
    nameText?: TypographyProps;
    address?: AddressInfoDisplayStyles;
}

export const accountSettingsDefaultBillingShippingStyles: AccountSettingsDefaultBillingShippingStyles = {
    customerSelectorGridContainer: {
        css: css`
            margin-left: 15px;
            margin-bottom: 15px;
        `,
        gap: 15,
    },
    headingText: {
        variant: "h5",
        css: css`
            width: 100%;
            margin-bottom: 0;
        `,
    },
    defaultBillingShippingTitle: {
        variant: "h4",
        as: "h3",
    },
    defaultShippingRadioGridItem: {
        width: 12,
    },
    defaultFulfillmentMethodRadioGridItem: {
        width: 12,
        css: css`
            display: block;
        `,
    },
    customerSelectorGridItem: {
        width: 12,
    },
    warehouseAddressWrapper: {
        width: [12, 12, 6, 6, 6],
    },
    defaultShippingRadioGroup: {
        css: css`
            display: inline-block;
            width: 100%;
            flex-direction: row;
            & > div {
                margin-right: 20px;
                display: inline-flex;
            }
        `,
    },
    defaultFulfillmentMethodRadioGroup: {
        css: css`
            display: inline-block;
            width: 100%;
            flex-direction: row;
            & > div {
                margin-right: 20px;
                display: inline-flex;
            }
        `,
    },
    pickUpLocation: {
        gridContainer: { gap: 5 },
        headingGridItem: { width: 12 },
        headerText: {
            variant: "h5",
            css: css`
                margin-bottom: 0;
            `,
        },
        changeLink: {
            css: css`
                margin-left: 10px;
                margin-top: 5px;
            `,
        },
        warehouseGridItem: {
            width: 12,
        },
        warehouseAddress: {
            nameText: {
                as: "p",
            },
        },
    },
};

const styles = accountSettingsDefaultBillingShippingStyles;

const AccountSettingsDefaultBillingShipping = ({
    account,
    shipToState,
    billToState,
    session,
    enableWarehousePickup,
    requireSelectCustomerOnSignIn,
    loadBillTo,
    loadShipTo,
    selectedBillToId,
    selectedShipToId,
    useDefaultCustomer,
    billTosDataView,
    loadBillTos,
    updateAccountSettings,
}: Props) => {
    if (!billTosDataView.value && !billTosDataView.isLoading) {
        loadBillTos({ expand: ["shipTos", "excludeOneTime"] });
    }

    if (!billToState.value && !billToState.isLoading && selectedBillToId) {
        loadBillTo({ billToId: selectedBillToId });
    }

    if (!shipToState.value && !shipToState.isLoading && selectedShipToId && selectedBillToId) {
        loadShipTo({ shipToId: selectedShipToId, billToId: selectedBillToId });
    }

    const defaultShippingChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        updateAccountSettings({ useDefaultCustomer: event.currentTarget.value.toLowerCase() === "true" });
    };

    const defaultFulfillmentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        updateAccountSettings({ fulfillmentMethod: event.currentTarget.value });
    };

    const defaultWarehouseChangeHandler = (warehouse: WarehouseModel) => {
        updateAccountSettings({ defaultWarehouse: warehouse });
    };

    if (!billTosDataView.value || !account || requireSelectCustomerOnSignIn) {
        return null;
    }

    if (!enableWarehousePickup && billTosDataView.value.length === 1) {
        const existsShipTos = billTosDataView.value[0].shipTos?.filter(o => !o.isNew);
        if (!existsShipTos || existsShipTos.length <= 1) {
            return null;
        }
    }

    const pickUpWarehouse = account.defaultWarehouse || session.pickUpWarehouse;

    const warehouseAddressWrapperStyle =
        account.defaultFulfillmentMethod === FulfillmentMethod.PickUp
            ? styles.warehouseAddressWrapper
            : styles.customerSelectorGridItem;

    const billTo = billToState ? billToState.value : undefined;
    const shipTo = shipToState ? shipToState.value : undefined;

    return (
        <>
            <Typography {...styles.defaultBillingShippingTitle}>{translate("Default Billing & Shipping")}</Typography>
            <Typography>{siteMessage("DefaultCustomer_SectionLabel")}</Typography>
            <GridContainer data-test-selector="accountSettings_selectDefaultCustomer">
                <GridItem {...styles.defaultShippingRadioGridItem}>
                    <RadioGroup
                        value={useDefaultCustomer.toString()}
                        onChangeHandler={defaultShippingChangeHandler}
                        {...styles.defaultShippingRadioGroup}
                    >
                        <Radio
                            {...styles.defaultShippingRadio}
                            value="false"
                            data-test-selector="accountSettings_doNotUseDefaultCustomer"
                        >
                            {translate("Do Not Use Defaults")}
                        </Radio>
                        <Radio
                            {...styles.defaultShippingRadio}
                            value="true"
                            data-test-selector="accountSettings_useDefaultCustomer"
                        >
                            {translate("Use Default Addresses")}
                        </Radio>
                    </RadioGroup>
                </GridItem>
                {useDefaultCustomer && (
                    <GridContainer {...styles.customerSelectorGridContainer}>
                        <GridItem {...styles.customerSelectorGridItem}>
                            <DefaultBillingAddress currentBillTo={billTo} />
                        </GridItem>
                        {enableWarehousePickup && (
                            <GridItem {...styles.defaultFulfillmentMethodRadioGridItem}>
                                <Typography {...styles.headingText}>{translate("Fulfillment Method")}</Typography>
                                <RadioGroup
                                    value={account.defaultFulfillmentMethod || session.fulfillmentMethod}
                                    onChangeHandler={defaultFulfillmentChangeHandler}
                                    data-test-selector="accountSettings_fulfillmentMethod"
                                    {...styles.defaultFulfillmentMethodRadioGroup}
                                >
                                    <Radio
                                        data-test-selector="fulfillmentMethod_ship"
                                        value={FulfillmentMethod.Ship}
                                        {...styles.defaultFulfillmentMethodRadio}
                                    >
                                        {translate("Ship")}
                                    </Radio>
                                    <Radio
                                        data-test-selector="fulfillmentMethod_pickUp"
                                        value={FulfillmentMethod.PickUp}
                                        {...styles.defaultFulfillmentMethodRadio}
                                    >
                                        {translate("Pick Up")}
                                    </Radio>
                                </RadioGroup>
                            </GridItem>
                        )}
                        {account.defaultFulfillmentMethod === FulfillmentMethod.PickUp && pickUpWarehouse && (
                            <GridItem {...warehouseAddressWrapperStyle}>
                                <PickUpLocation warehouse={pickUpWarehouse} onChange={defaultWarehouseChangeHandler} />
                            </GridItem>
                        )}
                        <GridItem {...warehouseAddressWrapperStyle}>
                            <DefaultShippingAddress
                                currentShipTo={shipTo}
                                currentBillTo={billTo}
                                isPickUp={account.defaultFulfillmentMethod === FulfillmentMethod.PickUp}
                            />
                        </GridItem>
                    </GridContainer>
                )}
            </GridContainer>
        </>
    );
};

interface PickUpLocationProps {
    warehouse: WarehouseModel;
    onChange: (address: WarehouseModel) => void;
}

const PickUpLocation = ({ warehouse, onChange }: PickUpLocationProps) => {
    const componentStyles = styles.pickUpLocation || {};
    const [isFindLocationOpen, setIsFindLocationOpen] = useState(false);
    const handleOpenFindLocation = () => {
        setIsFindLocationOpen(true);
    };
    const handleFindLocationModalClose = () => setIsFindLocationOpen(false);
    const handleWarehouseSelected = (warehouse: WarehouseModel) => {
        onChange(warehouse);
        setIsFindLocationOpen(false);
    };

    return (
        <>
            <GridContainer {...componentStyles.gridContainer}>
                <GridItem {...componentStyles.headingGridItem}>
                    <Typography {...componentStyles.headerText}>{translate("Pick Up Location")}</Typography>
                    <Link onClick={handleOpenFindLocation} {...componentStyles.changeLink}>
                        {translate("Change")}
                    </Link>
                </GridItem>
                <GridItem {...componentStyles.warehouseGridItem}>
                    <WarehouseAddressInfoDisplay warehouse={warehouse} />
                </GridItem>
            </GridContainer>
            <FindLocationModal
                modalIsOpen={isFindLocationOpen}
                onWarehouseSelected={handleWarehouseSelected}
                onModalClose={handleFindLocationModalClose}
                extendedStyles={componentStyles.findLocationModal}
            />
        </>
    );
};

interface WarehouseAddressInfoDisplayProps {
    warehouse: WarehouseModel;
}

const WarehouseAddressInfoDisplay = ({ warehouse }: WarehouseAddressInfoDisplayProps) => {
    const componentStyles =
        styles.pickUpLocation && styles.pickUpLocation.warehouseAddress ? styles.pickUpLocation.warehouseAddress : {};

    return (
        <>
            <AddressInfoDisplay
                companyName={warehouse.description || warehouse.name}
                address1={warehouse.address1}
                address2={warehouse.address2}
                city={warehouse.city}
                state={warehouse.state}
                postalCode={warehouse.postalCode}
                extendedStyles={componentStyles.address}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsDefaultBillingShipping),
    definition: {
        allowedContexts: [AccountSettingsPageContext],
        group: "Account Settings",
        displayName: "Default Billing & Shipping",
    },
};

export default widgetModule;
