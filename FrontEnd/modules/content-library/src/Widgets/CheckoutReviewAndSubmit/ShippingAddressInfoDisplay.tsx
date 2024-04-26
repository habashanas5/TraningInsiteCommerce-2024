import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    shipTo: ShipToModel;
    onEdit: () => void;
    extendedStyles?: ShippingAddressInfoDisplayStyles;
}

export interface ShippingAddressInfoDisplayStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    heading?: TypographyPresentationProps;
    editLink?: LinkPresentationProps;
    addressGridItem?: GridItemProps;
    address?: AddressInfoDisplayStyles;
}

export const shippingAddressInfoDisplayStyles: ShippingAddressInfoDisplayStyles = {
    container: { gap: 0 },
    headingGridItem: { width: 12 },
    heading: {
        weight: 600,
        css: css`
            margin: 0 1rem 0 0;
        `,
    },
    addressGridItem: { width: 12 },
};

const ShippingAddressInfoDisplay = ({ shipTo, onEdit, extendedStyles }: OwnProps) => {
    const styles = mergeToNew(shippingAddressInfoDisplayStyles, extendedStyles);
    return (
        <GridContainer {...styles.container} data-test-selector="shippingAddressInfoDisplay_container">
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.heading}>{translate("Shipping Address")}</Typography>
                <Link {...styles.editLink} onClick={onEdit} data-test-selector="checkoutReviewAndSubmit_changeShipping">
                    {translate("Edit")}
                    <VisuallyHidden>{translate("Shipping Address")}</VisuallyHidden>
                </Link>
            </GridItem>
            <GridItem {...styles.addressGridItem}>
                <AddressInfoDisplay
                    {...shipTo}
                    state={shipTo.state ? shipTo.state.abbreviation : undefined}
                    country={shipTo.country ? shipTo.country.abbreviation : undefined}
                    extendedStyles={styles.address}
                />
            </GridItem>
        </GridContainer>
    );
};

export default ShippingAddressInfoDisplay;
