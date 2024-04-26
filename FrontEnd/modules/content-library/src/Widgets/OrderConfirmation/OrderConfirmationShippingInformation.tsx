import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { Cart } from "@insite/client-framework/Services/CartService";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import translate from "@insite/client-framework/Translate";
import { ShipToModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { useState } from "react";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    shipTo: ShipToModel;
    pickUpWarehouse?: WarehouseModel | null;
    extendedStyles?: OrderConfirmationShippingInformationStyles;
}

export interface OrderConfirmationShippingInformationStyles {
    shippingInformationGridContainer?: GridContainerProps;
    shippingInformationTitleGridItem?: GridItemProps;
    shippingInformationTitle?: TypographyProps;
    shippingInformationAddressGridItem?: GridItemProps;
    shippingAddressTitle?: TypographyProps;
    shippingAddress?: AddressInfoDisplayStyles;
    shippingOtherInformationGridItem?: GridItemProps;
    shippingOtherInformationGridContainer?: GridContainerProps;
    shippingInformationCarrierGridItem?: GridItemProps;
    shippingCarrierTitle?: TypographyProps;
    shippingCarrierDescription?: TypographyProps;
    shippingInformationDateRequestedGridItem?: GridItemProps;
    shippingDateRequestedTitle?: TypographyProps;
    shippingDateRequestedText?: TypographyProps;
    shippingInformationServiceGridItem?: GridItemProps;
    shippingServiceTitle?: TypographyProps;
    shippingServiceDescription?: TypographyProps;
    shippingInformationPoNumberGridItem?: GridItemProps;
    shippingPoNumberTitle?: TypographyProps;
    shippingPoNumberText?: TypographyProps;
}

export const orderConfirmationShippingInformationStyles: OrderConfirmationShippingInformationStyles = {
    shippingInformationGridContainer: {
        gap: 10,
    },
    shippingInformationTitleGridItem: {
        width: 12,
    },
    shippingInformationTitle: {
        variant: "h5",
        as: "h2",
        css: css`
            @media print {
                font-size: 15px;
            }
            padding-top: 0;
            margin-bottom: 0;
        `,
    },
    shippingInformationAddressGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            flex-direction: column;
        `,
    },
    shippingAddressTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    shippingOtherInformationGridItem: {
        width: [12, 12, 8, 8, 8],
    },
    shippingOtherInformationGridContainer: {
        gap: 10,
    },
    shippingInformationCarrierGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 6,
    },
    shippingCarrierTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    shippingInformationDateRequestedGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    shippingDateRequestedTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    shippingInformationServiceGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 6,
    },
    shippingServiceTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    shippingInformationPoNumberGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 6,
    },
    shippingPoNumberTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
};

type Props = OwnProps;

const OrderConfirmationShippingInformation = ({ cart, shipTo, pickUpWarehouse, extendedStyles }: Props) => {
    const [styles] = useState(() => mergeToNew(orderConfirmationShippingInformationStyles, extendedStyles));

    return (
        <GridContainer
            {...styles.shippingInformationGridContainer}
            data-test-selector="orderConfirmationShippingInformation"
        >
            <GridItem {...styles.shippingInformationTitleGridItem}>
                <Typography {...styles.shippingInformationTitle}>{translate("Shipping Information")}</Typography>
            </GridItem>
            {cart.fulfillmentMethod === FulfillmentMethod.Ship && (
                <GridItem {...styles.shippingInformationAddressGridItem}>
                    <Typography {...styles.shippingAddressTitle}>{translate("Shipping Address")}</Typography>
                    <AddressInfoDisplay
                        companyName={shipTo.companyName}
                        address1={shipTo.address1}
                        address2={shipTo.address2}
                        address3={shipTo.address3}
                        address4={shipTo.address4}
                        city={shipTo.city}
                        postalCode={shipTo.postalCode}
                        state={shipTo.state ? shipTo.state.abbreviation : undefined}
                        extendedStyles={styles.shippingAddress}
                    />
                </GridItem>
            )}
            {cart.fulfillmentMethod === FulfillmentMethod.PickUp && pickUpWarehouse && (
                <GridItem {...styles.shippingInformationAddressGridItem}>
                    <Typography {...styles.shippingAddressTitle}>{translate("Pick Up Location")}</Typography>
                    <AddressInfoDisplay
                        {...pickUpWarehouse}
                        companyName={pickUpWarehouse.description || pickUpWarehouse.name}
                        extendedStyles={styles.shippingAddress}
                    />
                </GridItem>
            )}
            <GridItem {...styles.shippingOtherInformationGridItem}>
                <GridContainer {...styles.shippingOtherInformationGridContainer}>
                    {cart.fulfillmentMethod === FulfillmentMethod.Ship && (
                        <GridItem {...styles.shippingInformationCarrierGridItem}>
                            <Typography {...styles.shippingCarrierTitle}>{translate("Carrier")}</Typography>
                            <Typography {...styles.shippingCarrierDescription}>{cart.carrier!.description}</Typography>
                        </GridItem>
                    )}
                    {(cart.requestedDeliveryDate || cart.requestedPickupDate) && (
                        <GridItem {...styles.shippingInformationDateRequestedGridItem}>
                            <Typography {...styles.shippingDateRequestedTitle}>
                                {translate("Date Requested")}
                            </Typography>
                            <Typography
                                {...styles.shippingDateRequestedText}
                                data-test-selector="orderConfirmation_requestedDate"
                            >
                                <LocalizedDateTime
                                    dateTime={cart.requestedDeliveryDateDisplay || cart.requestedPickupDateDisplay}
                                />
                            </Typography>
                        </GridItem>
                    )}
                    {cart.fulfillmentMethod === FulfillmentMethod.Ship && (
                        <GridItem {...styles.shippingInformationServiceGridItem}>
                            <Typography {...styles.shippingServiceTitle}>{translate("Service")}</Typography>
                            <Typography {...styles.shippingServiceDescription}>{cart.shipVia?.description}</Typography>
                        </GridItem>
                    )}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default OrderConfirmationShippingInformation;
