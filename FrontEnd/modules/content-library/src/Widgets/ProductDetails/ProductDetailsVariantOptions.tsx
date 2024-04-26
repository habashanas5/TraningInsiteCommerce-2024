import useFilteredVariantTraits from "@insite/client-framework/Common/Hooks/useFilteredVariantTraits";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasParentProductId, withParentProductId } from "@insite/client-framework/Components/ParentProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getProductState,
    getVariantChildrenDataView,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import updateVariantSelection from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/UpdateVariantSelection";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasParentProductId;

const mapStateToProps = (state: ApplicationState, ownProps: HasParentProductId) => ({
    variantTraits: getProductState(state, ownProps.parentProductId).value?.variantTraits,
    variantChildren: getVariantChildrenDataView(state, ownProps.parentProductId).value,
    variantSelection: state.pages.productDetails.variantSelection,
    variantSelectionCompleted: state.pages.productDetails.variantSelectionCompleted,
    variantProductState: getProductState(state, state.pages.productDetails.selectedProductId),
    selectedProductId: state.pages.productDetails.selectedProductId,
});

const mapDispatchToProps = {
    updateVariantSelection,
};

export interface ProductDetailsVariantOptionsStyles {
    wrapper?: InjectableCss;
    select?: SelectProps;
}

export const variantOptionsStyles: ProductDetailsVariantOptionsStyles = {
    wrapper: {
        css: css`
            width: 100%;
        `,
    },
    select: {
        cssOverrides: {
            formField: css`
                margin-top: 10px;
            `,
        },
    },
};

const styles = variantOptionsStyles;

const ProductDetailsVariantOptions: React.FC<Props> = ({
    variantChildren,
    variantSelection,
    updateVariantSelection,
    variantTraits,
    parentProductId,
    variantProductState,
    selectedProductId,
}) => {
    useEffect(() => {
        if (
            variantProductState.value &&
            (variantProductState.value.isVariantParent || variantProductState.value.childTraitValues)
        ) {
            window.history.replaceState(null, "", variantProductState.value.canonicalUrl);
        }
    }, [selectedProductId]);

    const variantChangeHandler = (traitValueId: string, variantTraitId: string) => {
        updateVariantSelection({ traitValueId, variantTraitId, productId: parentProductId });
    };

    if (!variantTraits || variantTraits.length === 0 || !variantChildren) {
        return null;
    }

    const filteredVariantTraits = useFilteredVariantTraits(variantTraits, variantChildren, variantSelection);

    return (
        <StyledWrapper {...styles.wrapper}>
            {filteredVariantTraits.map(
                variantTrait =>
                    !!variantTrait.traitValues?.length && (
                        <Select
                            {...styles.select}
                            key={variantTrait.id}
                            label={variantTrait.nameDisplay}
                            value={variantSelection[variantTrait.id]}
                            onChange={event => {
                                variantChangeHandler(event.currentTarget.value, variantTrait.id);
                            }}
                            data-test-selector={`styleSelect_${variantTrait.name}`}
                        >
                            <option value="">
                                {variantTrait.unselectedValue
                                    ? variantTrait.unselectedValue
                                    : `${translate("Select")} ${variantTrait.nameDisplay}`}
                            </option>
                            {variantTrait.traitValues?.map(traitValue => (
                                <option value={`${traitValue.id}`} key={`${traitValue.id}`}>
                                    {traitValue.valueDisplay}
                                </option>
                            ))}
                        </Select>
                    ),
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withParentProductId(connect(mapStateToProps, mapDispatchToProps)(ProductDetailsVariantOptions)),
    definition: {
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
