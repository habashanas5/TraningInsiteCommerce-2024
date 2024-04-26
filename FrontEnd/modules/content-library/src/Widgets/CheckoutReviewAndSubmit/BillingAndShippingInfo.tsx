import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { BillToModel, CarrierDto, ShipToModel, ShipViaDto } from "@insite/client-framework/Types/ApiModels";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import BillingAddressInfoDisplay, {
    BillingAddressInfoDisplayStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/BillingAddressInfoDisplay";
import ShippingAddressInfoDisplay, {
    ShippingAddressInfoDisplayStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/ShippingAddressInfoDisplay";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    billTo: BillToModel;
    shipTo: ShipToModel;
    carrier: CarrierDto;
    shipVia: ShipViaDto;
    deliveryDate: Date | null;
    onEditBillTo: () => void;
    onEditShipTo: () => void;
    extendedStyles?: BillingAndShippingAddressStyles;
}

export interface BillingAndShippingAddressStyles {
    container?: GridContainerProps;
    carrierGridItem?: GridItemProps;
    carrierHeadingText?: TypographyPresentationProps;
    carrierText?: TypographyPresentationProps;
    shippingServiceGridItem?: GridItemProps;
    shippingServiceHeadingText?: TypographyPresentationProps;
    shippingServiceText?: TypographyPresentationProps;
    deliveryDateGridItem?: GridItemProps;
    deliveryDateHeadingText?: TypographyPresentationProps;
    deliveryDateText?: TypographyPresentationProps;
    shippingAddressGridItem?: GridItemProps;
    shippingAddress?: ShippingAddressInfoDisplayStyles;
    billingAddressGridItem?: GridItemProps;
    billingAddress?: BillingAddressInfoDisplayStyles;
}

export const billingAndShippingAddressStyles: BillingAndShippingAddressStyles = {
    container: { gap: 20 },
    carrierGridItem: {
        width: [6, 6, 3, 3, 3],
        css: css`
            flex-direction: column;
        `,
    },
    shippingServiceHeadingText: { weight: 600 },
    shippingServiceGridItem: {
        width: [6, 6, 3, 3, 3],
        css: css`
            flex-direction: column;
        `,
    },
    carrierHeadingText: { weight: 600 },
    deliveryDateGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    deliveryDateHeadingText: { weight: 600 },
    shippingAddressGridItem: {
        width: [12, 12, 6, 6, 6],
    },
    billingAddressGridItem: {
        width: [12, 12, 6, 6, 6],
    },
};

const BillingAndShippingInfo = ({
    billTo,
    shipTo,
    carrier,
    shipVia,
    deliveryDate,
    onEditBillTo,
    onEditShipTo,
    extendedStyles,
}: OwnProps) => {
    const styles = mergeToNew(billingAndShippingAddressStyles, extendedStyles);
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.carrierGridItem}>
                <Typography {...styles.carrierHeadingText}>{translate("Carrier")}</Typography>
                <Typography {...styles.carrierText}>{carrier?.description}</Typography>
            </GridItem>
            <GridItem {...styles.shippingServiceGridItem}>
                <Typography {...styles.shippingServiceHeadingText}>{translate("Service")}</Typography>
                <Typography {...styles.shippingServiceText}>{shipVia?.description}</Typography>
            </GridItem>
            <GridItem {...styles.deliveryDateGridItem}>
                {/*
                    Don't wrap this check around the parent GridItem because
                    it keeps the billing and shipping address in a separate row.
                */}
                {deliveryDate && (
                    <>
                        <Typography {...styles.deliveryDateHeadingText}>
                            {translate("Requested Delivery Date")}
                        </Typography>
                        <Typography {...styles.deliveryDateText} data-test-selector="requestedDeliveryDateValue">
                            <LocalizedDateTime dateTime={deliveryDate} />
                        </Typography>
                    </>
                )}
            </GridItem>
            <GridItem {...styles.shippingAddressGridItem}>
                <ShippingAddressInfoDisplay
                    shipTo={shipTo}
                    onEdit={onEditShipTo}
                    extendedStyles={styles.shippingAddress}
                />
            </GridItem>
            <GridItem {...styles.billingAddressGridItem}>
                <BillingAddressInfoDisplay
                    billTo={billTo}
                    onEdit={onEditBillTo}
                    extendedStyles={styles.billingAddress}
                />
            </GridItem>
        </GridContainer>
    );
};

export default BillingAndShippingInfo;
