/* eslint-disable spire/export-styles */
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import Select, { SelectPresentationProps, SelectProps } from "@insite/mobius/Select";
import * as React from "react";
import { connect } from "react-redux";

interface OwnProps extends SelectProps {
    labelOverride?: React.ReactNode;
    disabled?: boolean;
    extendedStyles?: SelectPresentationProps;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasProductContext;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

export const productUnitOfMeasureSelectStyles: SelectPresentationProps = {};

const ProductUnitOfMeasureSelect: React.FC<Props> = ({
    productContext: {
        product: { unitOfMeasures },
        productInfo: { unitOfMeasure, productId },
        onUnitOfMeasureChanged,
    },
    disabled,
    productSettings,
    labelOverride,
    extendedStyles,
    ...otherProps
}) => {
    const [styles] = React.useState(() => mergeToNew(productUnitOfMeasureSelectStyles, extendedStyles));

    if (
        !productSettings?.alternateUnitsOfMeasure ||
        !unitOfMeasures ||
        unitOfMeasures.filter(uom => uom.unitOfMeasure).length <= 1
    ) {
        return null;
    }

    const uomChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!onUnitOfMeasureChanged) {
            logger.warn(`There was no onUnitOfMeasureChanged passed to the ProductContext for ${productId}`);
            return;
        }
        onUnitOfMeasureChanged(event.target.value);
    };

    return (
        <Select
            label={labelOverride ?? translate("U/M")}
            value={unitOfMeasure}
            onChange={uomChangeHandler}
            disabled={disabled}
            data-test-selector="product_unitOfMeasureSelect"
            {...styles}
            {...otherProps}
        >
            {unitOfMeasures.map(uom => (
                <option key={uom.id.toString()} value={uom.unitOfMeasure}>
                    {uom.description ? uom.description : uom.unitOfMeasureDisplay}{" "}
                    {uom.qtyPerBaseUnitOfMeasure !== 1 ? `/${uom.qtyPerBaseUnitOfMeasure}` : ""}
                </option>
            ))}
        </Select>
    );
};

export default connect(mapStateToProps)(withProductContext(ProductUnitOfMeasureSelect));
