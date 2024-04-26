import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import React from "react";

interface OwnProps {
    warehouse: WarehouseModel;
    extendedStyles?: WarehouseAddressInfoDisplayStyles;
}

export interface WarehouseAddressInfoDisplayStyles {
    warehouseNameText?: TypographyPresentationProps;
    address?: AddressInfoDisplayStyles;
}

export const warehouseAddressInfoDisplayStyles: WarehouseAddressInfoDisplayStyles = {};

const WarehouseAddressInfoDisplay = ({ warehouse, extendedStyles }: OwnProps) => {
    const [styles] = React.useState(() => mergeToNew(warehouseAddressInfoDisplayStyles, extendedStyles));
    return (
        <>
            <Typography as="p" {...styles.warehouseNameText}>
                {warehouse.description || warehouse.name}
            </Typography>
            <AddressInfoDisplay {...warehouse} extendedStyles={styles.address} />
        </>
    );
};

export default WarehouseAddressInfoDisplay;
