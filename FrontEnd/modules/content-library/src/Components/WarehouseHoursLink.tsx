/* eslint-disable spire/export-styles */
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import * as React from "react";

type WarehouseHoursLinkProps = LinkPresentationProps & {
    warehouse: WarehouseModel;
    onOpenWarehouseHours: (warehouse: WarehouseModel) => void;
};

const WarehouseHoursLink: React.FC<WarehouseHoursLinkProps> = ({ warehouse, onOpenWarehouseHours, ...otherProps }) => {
    if (!warehouse.hours) {
        return null;
    }
    const handleHoursClicked = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onOpenWarehouseHours(warehouse);
    };
    return (
        <Link onClick={handleHoursClicked} {...otherProps}>
            {translate("Hours")}
        </Link>
    );
};

export default WarehouseHoursLink;
