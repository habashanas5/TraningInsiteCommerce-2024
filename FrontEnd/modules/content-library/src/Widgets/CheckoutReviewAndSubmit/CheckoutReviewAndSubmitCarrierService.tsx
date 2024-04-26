import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import addDays from "@insite/client-framework/Common/Utilities/addDays";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import setIsPreloadingData from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetIsPreloadingData";
import setRequestedDeliveryDate from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetRequestedDeliveryDate";
import setRequestedPickUpDate from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetRequestedPickUpDate";
import setShippingMethod from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetShippingMethod";
import translate from "@insite/client-framework/Translate";
import { CarrierDto, ShipViaDto } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    const settingsCollection = getSettingsCollection(state);
    const { session } = state.context;
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    return {
        cart: cartState.value,
        showShippingMethod: session.fulfillmentMethod === FulfillmentMethod.Ship,
        showPickUpDate:
            settingsCollection.accountSettings.enableWarehousePickup &&
            settingsCollection.cartSettings.enableRequestPickUpDate &&
            session.fulfillmentMethod === FulfillmentMethod.PickUp,
        session,
        accountSettings: settingsCollection.accountSettings,
        cartSettings: settingsCollection.cartSettings,
    };
};

const mapDispatchToProps = {
    setShippingMethod,
    setRequestedDeliveryDate,
    setRequestedPickUpDate,
    setIsPreloadingData,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutShippingCarrierServiceStyles {
    container?: GridContainerProps;
    centeringWrapper?: InjectableCss;
    noCarriersFoundGridItem?: GridItemProps;
    noCarriersFoundText?: TypographyPresentationProps;
    carrierGridItem?: GridItemProps;
    carrierSelect?: SelectPresentationProps;
    serviceGridItem?: GridItemProps;
    serviceSelect?: SelectPresentationProps;
    deliveryDateGridItem?: GridItemProps;
    deliveryDatePicker?: DatePickerPresentationProps;
    pickUpDateGridItem?: GridItemProps;
    pickUpDatePicker?: DatePickerPresentationProps;
}

export const checkoutShippingCarrierServiceStyles: CheckoutShippingCarrierServiceStyles = {
    container: { gap: 20 },
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 450px;
        `,
    },
    noCarriersFoundGridItem: { width: 12 },
    carrierGridItem: { width: [6, 6, 6, 3, 3] },
    serviceGridItem: { width: [6, 6, 6, 3, 3] },
    deliveryDateGridItem: { width: [12, 12, 12, 6, 6] },
    pickUpDateGridItem: { width: [12, 12, 12, 6, 6] },
};

/**
 * @deprecated Use checkoutShippingCarrierServiceStyles instead.
 */
export const checkoutShippingCarrierService = checkoutShippingCarrierServiceStyles;
const styles = checkoutShippingCarrierServiceStyles;

const CheckoutReviewAndSubmitCarrierService: FC<Props> = ({
    cart,
    cartSettings,
    setRequestedDeliveryDate,
    setRequestedPickUpDate,
    showShippingMethod,
    setShippingMethod,
    showPickUpDate,
    setIsPreloadingData,
}) => {
    const [selectedCarrier, setSelectedCarrier] = useState<CarrierDto | null>(null);
    const [selectedShipVia, setSelectedShipVia] = useState<ShipViaDto | null>(null);
    useEffect(() => {
        if (cart) {
            setSelectedCarrier(cart.carrier);
            setSelectedShipVia(cart.shipVia);
        }
    }, [cart?.carrier, cart?.shipVia]);

    if (!cart || !cart.cartLines) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner data-test-selector="checkoutShipping_carrierServiceLoading" />
            </StyledWrapper>
        );
    }

    const carrierChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedCarrier = cart.carriers!.find(c => c.id === event.currentTarget.value)!;
        setIsPreloadingData({ isPreloadingData: true });
        setSelectedCarrier(selectedCarrier);
        setSelectedShipVia(selectedCarrier.shipVias![0]);
        setShippingMethod({
            carrier: selectedCarrier,
            shipVia: selectedCarrier.shipVias![0],
            onComplete: () => {
                setIsPreloadingData({ isPreloadingData: false });
            },
        });
    };
    const shipViaChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        if (!selectedCarrier) {
            return;
        }
        const selectedShipVia = selectedCarrier.shipVias!.find(s => s.id === event.currentTarget.value)!;
        setIsPreloadingData({ isPreloadingData: true });
        setSelectedShipVia(selectedShipVia);
        setShippingMethod({
            carrier: selectedCarrier,
            shipVia: selectedShipVia,
            onComplete: () => {
                setIsPreloadingData({ isPreloadingData: false });
            },
        });
    };

    const handleRequestPickUpDateChanged = ({ selectedDay }: DatePickerState) => {
        setRequestedPickUpDate({
            requestedPickUpDate: selectedDay,
        });
    };
    const handleRequestDeliveryDateChanged = ({ selectedDay }: DatePickerState) => {
        setRequestedDeliveryDate({
            requestedDeliveryDate: selectedDay,
        });
    };

    return (
        <GridContainer {...styles.container}>
            {showShippingMethod && (
                <>
                    {cart.carriers!.length === 0 && (
                        <GridItem {...styles.noCarriersFoundGridItem}>
                            <Typography {...styles.noCarriersFoundText}>
                                {siteMessage("ReviewAndPay_NoCarriersFound")}
                            </Typography>
                        </GridItem>
                    )}
                    {cart.carriers!.length > 0 && (
                        <>
                            <GridItem {...styles.carrierGridItem}>
                                <Select
                                    label={translate("Select Carrier")}
                                    {...styles.carrierSelect}
                                    value={selectedCarrier?.id || ""}
                                    onChange={carrierChangeHandler}
                                    data-test-selector="checkoutReviewAndSubmitCarrierSelect"
                                >
                                    {cart.carriers!.map(c => {
                                        const id = c.id!.toString();
                                        return (
                                            <option key={id} value={id}>
                                                {c.description}
                                            </option>
                                        );
                                    })}
                                </Select>
                            </GridItem>
                            <GridItem {...styles.serviceGridItem}>
                                <Select
                                    label={translate("Select Service")}
                                    {...styles.serviceSelect}
                                    value={selectedShipVia?.id || ""}
                                    onChange={shipViaChangeHandler}
                                    data-test-selector="checkoutReviewAndSubmitShippingServiceSelect"
                                >
                                    {selectedCarrier &&
                                        selectedCarrier.shipVias!.map(s => {
                                            const id = s.id.toString();
                                            return (
                                                <option key={id} value={id}>
                                                    {s.description}
                                                </option>
                                            );
                                        })}
                                </Select>
                            </GridItem>
                        </>
                    )}
                    {cartSettings.canRequestDeliveryDate && (
                        <GridItem
                            {...styles.deliveryDateGridItem}
                            data-test-selector="checkoutShippingRequestedDeliveryDate"
                        >
                            <DatePicker
                                label={`${translate("Request Delivery Date")} (${translate("optional")})`}
                                hint={siteMessage("Checkout_RequestedDeliveryDateInformation")}
                                {...styles.deliveryDatePicker}
                                selectedDay={cart.requestedDeliveryDateDisplay!}
                                dateTimePickerProps={{
                                    minDate: new Date(),
                                    maxDate: addDays(new Date(), cartSettings.maximumDeliveryPeriod),
                                    monthAriaLabel: translate("Request delivery date month"),
                                    dayAriaLabel: translate("Request delivery date day"),
                                    yearAriaLabel: translate("Request delivery date year"),
                                    ...styles.deliveryDatePicker?.dateTimePickerProps,
                                }}
                                onDayChange={handleRequestDeliveryDateChanged}
                            />
                        </GridItem>
                    )}
                </>
            )}
            {showPickUpDate && (
                <>
                    <GridItem {...styles.pickUpDateGridItem} data-test-selector="checkoutPickUpRequestedDeliveryDate">
                        <DatePicker
                            label={`${translate("Request Pick Up Date")} (${translate("optional")})`}
                            hint={siteMessage("Checkout_RequestedPickupDateInformation")}
                            {...styles.pickUpDatePicker}
                            selectedDay={cart.requestedPickupDateDisplay!}
                            dateTimePickerProps={{
                                minDate: new Date(),
                                maxDate: addDays(new Date(), cartSettings.maximumDeliveryPeriod),
                                ...styles.pickUpDatePicker?.dateTimePickerProps,
                            }}
                            onDayChange={handleRequestPickUpDateChanged}
                            monthAriaLabel={`${translate("Request Pick Up Date optional")}. ${translate(
                                "Enter month, format M M",
                            )}`}
                            dayAriaLabel={`${translate("Request Pick Up Date optional")}. ${translate(
                                "Enter day, format D D",
                            )}`}
                            yearAriaLabel={`${translate("Request Pick Up Date optional")}. ${translate(
                                "Enter year, format Y Y Y Y",
                            )}`}
                        />
                    </GridItem>
                </>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitCarrierService),
    definition: {
        displayName: "Carrier & Service",
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
    },
};

export default widgetModule;
