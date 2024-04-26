import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import FindLocationModal, { FindLocationModalStyles } from "@insite/content-library/Components/FindLocationModal";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { css } from "styled-components";

export interface PickUpAddressStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    findLocationLink?: LinkPresentationProps;
    selectedLocationGridItem?: GridItemProps;
    selectedLocationName?: TypographyPresentationProps;
    selectedLocationAddressDisplay?: AddressInfoDisplayStyles;
    findLocationModal?: FindLocationModalStyles;
}

export const pickUpAddressStyles: PickUpAddressStyles = {
    container: { gap: 20 },
    headingGridItem: {
        width: 12,
        css: css`
            align-items: center;
        `,
    },
    headingText: {
        variant: "h5",
        css: css`
            margin-bottom: 0;
        `,
    },
    findLocationLink: {
        css: css`
            margin-left: 20px;
        `,
    },
    selectedLocationGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
};

const PickUpAddress: FC<{
    address?: WarehouseModel;
    onChange?: (address: WarehouseModel) => void;
    extendedStyles?: PickUpAddressStyles;
}> = ({ address, onChange, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(pickUpAddressStyles, extendedStyles));
    const [isFindLocationOpen, setIsFindLocationOpen] = React.useState(false);
    const handleOpenFindLocation = () => {
        setIsFindLocationOpen(true);
    };
    const handleFindLocationModalClose = () => setIsFindLocationOpen(false);
    const handleWarehouseSelected = (warehouse: WarehouseModel) => {
        if (onChange) {
            onChange(warehouse);
            setIsFindLocationOpen(false);
        }
    };
    return (
        <GridContainer {...styles.container} data-test-selector="checkoutShipping_pickUpAddress">
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText} as="h3">
                    {translate("Pick Up Address")}
                </Typography>
                <Link
                    {...styles.findLocationLink}
                    type="button"
                    onClick={handleOpenFindLocation}
                    data-test-selector="checkoutShipping_pickUpAddress_findLocation"
                >
                    {translate("Find Location")}
                </Link>
            </GridItem>
            {address && (
                <GridItem {...styles.selectedLocationGridItem}>
                    <Typography
                        {...styles.selectedLocationName}
                        data-test-selector="checkoutShipping_pickUpAddress_warehouseName"
                    >
                        {address.description || address.name}
                    </Typography>
                    <AddressInfoDisplay {...address} extendedStyles={styles.selectedLocationAddressDisplay} />
                </GridItem>
            )}
            <FindLocationModal
                modalIsOpen={isFindLocationOpen}
                onWarehouseSelected={handleWarehouseSelected}
                onModalClose={handleFindLocationModalClose}
                extendedStyles={styles.findLocationModal}
            />
        </GridContainer>
    );
};

export default PickUpAddress;
