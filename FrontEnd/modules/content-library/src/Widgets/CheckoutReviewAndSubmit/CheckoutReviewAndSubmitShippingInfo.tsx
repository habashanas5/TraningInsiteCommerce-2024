import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import BillingAndShippingInfo from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/BillingAndShippingInfo";
import PickUpLocation from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PickUpLocation";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion";
import AccordionSection, { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    const { fulfillmentMethod, pickUpWarehouse, language } = state.context.session;
    let deliveryDateDisplay;
    let pickUpDateDisplay;
    if (cart) {
        if (cart.requestedDeliveryDate) {
            deliveryDateDisplay = getLocalizedDateTime({
                dateTime: new Date(cart.requestedDeliveryDateDisplay!),
                language,
            });
        }
        if (cart.requestedPickupDate) {
            deliveryDateDisplay = getLocalizedDateTime({
                dateTime: new Date(cart.requestedPickupDateDisplay!),
                language,
            });
        }
    }
    return {
        cartId,
        cart,
        shipToState: getShipToState(state, cart?.shipToId),
        billToState: getBillToState(state, cart?.billToId),
        deliveryDateDisplay,
        pickUpDateDisplay,
        fulfillmentMethod,
        pickUpWarehouse,
        shippingPageNavLink: getPageLinkByPageType(state, "CheckoutShippingPage"),
    };
};

const mapDispatchToProps = {
    loadShipTo,
    loadBillTo,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps & HasHistory;

export interface CheckoutReviewAndSubmitShippingInfoStyles {
    accordion?: AccordionPresentationProps;
    shippingInfoAccordionSection?: AccordionSectionPresentationProps;
}

export const shippingInfoStyles: CheckoutReviewAndSubmitShippingInfoStyles = {
    shippingInfoAccordionSection: {
        titleTypographyProps: { weight: 600 },
    },
};

const styles = shippingInfoStyles;

const CheckoutReviewAndSubmitShippingInfo: FC<Props> = ({
    shippingPageNavLink,
    shipToState,
    billToState,
    loadShipTo,
    cart,
    fulfillmentMethod,
    pickUpWarehouse,
    history,
    loadBillTo,
    cartId,
}) => {
    useEffect(() => {
        if (!shipToState.value && !shipToState.isLoading && cart && cart.billToId && cart.shipToId) {
            loadShipTo({ billToId: cart.billToId, shipToId: cart.shipToId });
        }
    }, [shipToState]);

    useEffect(() => {
        if (!billToState.value && !billToState.isLoading && cart && cart.billToId) {
            loadBillTo({ billToId: cart.billToId });
        }
    }, [billToState]);

    if (!cart || !shipToState.value || !billToState.value) {
        return null;
    }

    const goBackToShipping = () => {
        if (!shippingPageNavLink) {
            return;
        }

        const backUrl = cartId ? `${shippingPageNavLink.url}?cartId=${cartId}` : shippingPageNavLink.url;
        return history.push(backUrl);
    };

    const sectionTitle =
        fulfillmentMethod === FulfillmentMethod.Ship ? "Billing & Shipping Information" : "Pick Up Location";
    const { carrier, shipVia, requestedDeliveryDateDisplay, requestedPickupDateDisplay } = cart;

    return (
        <Accordion {...styles.accordion} headingLevel={2} data-test-selector="checkoutReviewAndSubmitShippingInfo">
            <AccordionSection
                title={translate(sectionTitle)}
                {...styles.shippingInfoAccordionSection}
                data-test-selector="checkoutReviewAndSubmitShippingInfo_accordionSection"
            >
                {fulfillmentMethod === FulfillmentMethod.Ship && (
                    <BillingAndShippingInfo
                        billTo={billToState.value}
                        shipTo={shipToState.value}
                        carrier={carrier!}
                        shipVia={shipVia!}
                        deliveryDate={requestedDeliveryDateDisplay}
                        onEditBillTo={goBackToShipping}
                        onEditShipTo={goBackToShipping}
                    />
                )}
                {fulfillmentMethod === FulfillmentMethod.PickUp && (
                    <PickUpLocation
                        location={pickUpWarehouse!}
                        billTo={billToState.value}
                        pickUpDate={requestedPickupDateDisplay}
                        onEditLocation={goBackToShipping}
                        onEditBillTo={goBackToShipping}
                    />
                )}
            </AccordionSection>
        </Accordion>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitShippingInfo)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        displayName: "Shipping Info",
    },
};

export default widgetModule;
