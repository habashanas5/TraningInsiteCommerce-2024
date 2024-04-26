import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    location: WarehouseModel;
    onEdit: () => void;
    extendedStyles?: PickUpLocationAddressInfoDisplayStyles;
}

export interface PickUpLocationAddressInfoDisplayStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    editLink?: LinkPresentationProps;
    addressGridItem?: GridItemProps;
    locationNameText?: TypographyPresentationProps;
    address?: AddressInfoDisplayStyles;
}

export const pickUpLocationAddressInfoDisplayStyles: PickUpLocationAddressInfoDisplayStyles = {
    container: { gap: 0 },
    headingGridItem: { width: 12 },
    headingText: {
        weight: 600,
        css: css`
            margin: 0 1rem 0 0;
        `,
    },
    addressGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
};

const PickUpLocationAddressInfoDisplay = ({ location, onEdit, extendedStyles }: OwnProps) => {
    const styles = mergeToNew(pickUpLocationAddressInfoDisplayStyles, extendedStyles);
    return (
        <GridContainer {...styles.container} data-test-selector="pickUpLocationAddressInfoDisplay_container">
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText}>{translate("Pick Up Location")}</Typography>
                <Link {...styles.editLink} onClick={onEdit}>
                    {translate("Edit")}
                    <VisuallyHidden>{translate("Pick Up Location")}</VisuallyHidden>
                </Link>
            </GridItem>
            <GridItem {...styles.addressGridItem}>
                <Typography {...styles.locationNameText}>{location.description || location.name}</Typography>
                <AddressInfoDisplay {...location} extendedStyles={styles.address} />
            </GridItem>
        </GridContainer>
    );
};

export default PickUpLocationAddressInfoDisplay;
