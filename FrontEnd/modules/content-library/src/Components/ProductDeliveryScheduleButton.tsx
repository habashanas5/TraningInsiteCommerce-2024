/* eslint-disable spire/export-styles */
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import setDeliveryScheduleModalIsOpen from "@insite/client-framework/Store/Components/ProductDeliverySchedule/Handlers/SetDeliveryScheduleModalIsOpen";
import translate from "@insite/client-framework/Translate";
import { ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface OwnProps {
    subscription: ProductSubscriptionDto;
    labelOverride?: string;
    disabled?: boolean;
    onSave?: (subscription: ProductSubscriptionDto) => void;
    extendedStyles?: ButtonPresentationProps;
}

export const productDeliveryScheduleButtonStyles: ButtonPresentationProps = {};

const ProductDeliveryScheduleButton = ({
    subscription,
    labelOverride,
    disabled,
    onSave,
    extendedStyles,
    ...otherProps
}: OwnProps) => {
    const dispatch = useDispatch();

    const [styles] = useState(() => mergeToNew(productDeliveryScheduleButtonStyles, extendedStyles));

    const deliveryScheduleClickHandler = () => {
        dispatch(setDeliveryScheduleModalIsOpen({ isOpen: true, subscription, onSave }));
    };

    return (
        <Button
            {...styles}
            onClick={deliveryScheduleClickHandler}
            disabled={disabled}
            data-test-selector="deliverySchedule"
            {...otherProps}
        >
            {labelOverride ?? translate("Delivery Schedule")}
        </Button>
    );
};
export default ProductDeliveryScheduleButton;
