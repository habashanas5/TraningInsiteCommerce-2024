import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { BillToModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import BillingAddressInfoDisplay, {
    BillingAddressInfoDisplayStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/BillingAddressInfoDisplay";
import PickUpLocationAddressInfoDisplay from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PickUpLocationAddressInfoDisplay";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    pickUpDate: Date | null;
    location: WarehouseModel;
    billTo: BillToModel;
    onEditLocation: () => void;
    onEditBillTo: () => void;
    extendedStyles?: PickUpLocationInfoDisplayStyles;
}

export interface PickUpLocationInfoDisplayStyles {
    container?: GridContainerProps;
    pickUpDateGridItem?: GridItemProps;
    pickUpDateHeadingText?: TypographyPresentationProps;
    pickUpDateText?: TypographyPresentationProps;
    locationAddressGridItem?: GridItemProps;
    billingAddressGridItem?: GridItemProps;
    billingAddress?: BillingAddressInfoDisplayStyles;
}

export const pickUpLocationInfoDisplayStyles: PickUpLocationInfoDisplayStyles = {
    container: { gap: 20 },
    pickUpDateGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    pickUpDateHeadingText: { weight: 600 },
    locationAddressGridItem: {
        width: [12, 12, 6, 6, 6],
    },
    billingAddressGridItem: {
        width: [12, 12, 6, 6, 6],
    },
};

const PickUpLocation = ({
    pickUpDate,
    billTo,
    onEditLocation,
    onEditBillTo,
    extendedStyles,
    ...otherProps
}: OwnProps) => {
    const styles = mergeToNew(pickUpLocationInfoDisplayStyles, extendedStyles);
    return (
        <GridContainer {...styles.container}>
            {pickUpDate && (
                <GridItem {...styles.pickUpDateGridItem}>
                    <Typography {...styles.pickUpDateHeadingText}>{translate("Requested Pick Up Date")}</Typography>
                    <Typography {...styles.pickUpDateText} data-test-selector="requestedPickUpDateValue">
                        <LocalizedDateTime dateTime={pickUpDate} />
                    </Typography>
                </GridItem>
            )}
            <GridItem {...styles.locationAddressGridItem}>
                <PickUpLocationAddressInfoDisplay {...otherProps} onEdit={onEditLocation} />
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

export default PickUpLocation;
