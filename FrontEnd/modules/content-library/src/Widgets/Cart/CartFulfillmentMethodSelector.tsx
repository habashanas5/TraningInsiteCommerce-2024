import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setFulfillmentMethod from "@insite/client-framework/Store/Context/Handlers/SetFulfillmentMethod";
import updatePickUpWarehouse from "@insite/client-framework/Store/Context/Handlers/UpdatePickUpWarehouse";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import FindLocationModal, { FindLocationModalStyles } from "@insite/content-library/Components/FindLocationModal";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ChangeEvent, FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state).value,
    session: state.context.session,
    accountSettings: getSettingsCollection(state).accountSettings,
});

const mapDispatchToProps = {
    setFulfillmentMethod,
    updatePickUpWarehouse: makeHandlerChainAwaitable(updatePickUpWarehouse),
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CartFulfillmentMethodSelectorStyles {
    fulfillmentMethodradioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    fulfillmentMethodRadio?: FieldSetPresentationProps<RadioComponentProps>;
    pickUpLocation?: PickUpLocationStyles;
}

interface PickUpLocationStyles {
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

export const cartFulfillmentMethodStyles: CartFulfillmentMethodSelectorStyles = {
    pickUpLocation: {
        wrapper: {
            css: css`
                margin-top: 20px;
            `,
        },
        headerText: {
            weight: 600,
        },
        changeLink: {
            css: css`
                margin-left: 15px;
            `,
        },
        warehouseAddress: {
            wrapper: {
                css: css`
                    margin-top: 8px;
                `,
            },
            nameText: {
                as: "p",
            },
        },
    },
};

const styles = cartFulfillmentMethodStyles;

const CartFulfillmentMethodSelector: FC<Props> = ({
    cart,
    session,
    accountSettings,
    setFulfillmentMethod,
    updatePickUpWarehouse,
}) => {
    if (!cart || !accountSettings || !accountSettings.enableWarehousePickup) {
        return null;
    }

    const toasterContext = React.useContext(ToasterContext);
    const fulfillmentMethodChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFulfillmentMethod({ fulfillmentMethod: event.currentTarget.value as "Ship" | "PickUp" });
    };

    const handlePickUpAddressChange = async (pickUpWarehouse: WarehouseModel) => {
        await updatePickUpWarehouse({ pickUpWarehouse });
        toasterContext.addToast({
            body: translate("Pick Up Address Updated"),
            messageType: "success",
        });
    };

    return (
        <>
            <RadioGroup
                label={translate("Fulfillment Method")}
                value={cart.fulfillmentMethod}
                onChangeHandler={fulfillmentMethodChangeHandler}
                {...styles.fulfillmentMethodradioGroup}
                data-test-selector="cartFulfillmentMethod"
            >
                <Radio
                    value={FulfillmentMethod.Ship}
                    {...styles.fulfillmentMethodRadio}
                    data-test-selector="fulfillmentMethod_ship"
                >
                    {translate("Ship")}
                </Radio>
                <Radio
                    value={FulfillmentMethod.PickUp}
                    {...styles.fulfillmentMethodRadio}
                    data-test-selector="fulfillmentMethod_pickUp"
                >
                    {translate("Pick Up")}
                </Radio>
            </RadioGroup>
            {cart.fulfillmentMethod === FulfillmentMethod.PickUp && session.pickUpWarehouse && (
                <PickUpLocation warehouse={session.pickUpWarehouse} onChange={handlePickUpAddressChange} />
            )}
        </>
    );
};

interface PickUpLocationProps {
    warehouse: WarehouseModel;
    onChange: (address: WarehouseModel) => void;
}

const PickUpLocation: FC<PickUpLocationProps> = ({ warehouse, onChange }) => {
    const componentStyles = styles.pickUpLocation || {};
    const [isFindLocationOpen, setIsFindLocationOpen] = React.useState(false);
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
            <StyledWrapper {...componentStyles.wrapper} data-test-selector="cart_pickUpLocation">
                <Typography {...componentStyles.headerText}>{translate("Pick Up Location")}</Typography>
                <Link
                    onClick={handleOpenFindLocation}
                    {...componentStyles.changeLink}
                    data-test-selector="cart_pickUpLocation_findLocation"
                >
                    {translate("Change")}
                </Link>
                <WarehouseAddressInfoDisplay warehouse={warehouse} />
            </StyledWrapper>
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

const WarehouseAddressInfoDisplay: FC<WarehouseAddressInfoDisplayProps> = ({ warehouse }) => {
    const componentStyles =
        styles.pickUpLocation && styles.pickUpLocation.warehouseAddress ? styles.pickUpLocation.warehouseAddress : {};

    return (
        <StyledWrapper {...componentStyles.wrapper}>
            <Typography {...componentStyles.nameText} data-test-selector="cart_warehouseName">
                {warehouse.description || warehouse.name}
            </Typography>
            <AddressInfoDisplay
                address1={warehouse.address1}
                address2={warehouse.address2}
                city={warehouse.city}
                state={warehouse.state}
                postalCode={warehouse.postalCode}
                phone={warehouse.phone}
                extendedStyles={componentStyles.address}
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CartFulfillmentMethodSelector),
    definition: {
        group: "Cart",
        displayName: "Fulfillment Method Selector",
        allowedContexts: [CartPageContext],
    },
};

export default widgetModule;
