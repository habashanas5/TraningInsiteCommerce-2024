import useFilteredVariantTraits from "@insite/client-framework/Common/Hooks/useFilteredVariantTraits";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import closeVariantModal from "@insite/client-framework/Store/Components/ProductSelector/Handlers/CloseVariantModal";
import setProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SetProduct";
import updateVariantSelection from "@insite/client-framework/Store/Components/ProductSelector/Handlers/UpdateVariantSelection";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";
import {
    getProductState,
    getVariantChildrenDataView,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import translate from "@insite/client-framework/Translate";
import ProductPrice from "@insite/content-library/Components/ProductPrice";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    skipInventoryValidation?: boolean;
    extendedStyles?: ProductSelectorVariantModalStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    const { variantModalIsOpen, variantModalProductId, variantSelection, selectedVariantProductInfo } =
        getProductSelector(state);
    return {
        variantModalIsOpen,
        variantParentProduct: getProductState(state, variantModalProductId).value,
        variantChildren: getVariantChildrenDataView(state, variantModalProductId).value,
        selectedVariant: getProductState(state, selectedVariantProductInfo?.productId).value,
        selectedVariantProductInfo,
        variantSelection,
    };
};

const mapDispatchToProps = {
    closeVariantModal,
    updateVariantSelection,
    setProduct,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductSelectorVariantModalStyles {
    modal?: ModalPresentationProps;
    wrapper?: InjectableCss;
    variantSelect?: SelectProps;
    selectButton?: ButtonPresentationProps;
}

export const productSelectorVariantModalStyles: ProductSelectorVariantModalStyles = {
    modal: {
        size: 400,
        cssOverrides: {
            modalContainer: css`
                align-items: flex-start;
            `,
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    variantSelect: {
        labelPosition: "left",
        labelProps: {
            css: css`
                width: 25%;
                text-align: left;
            `,
        },
        cssOverrides: {
            formField: css`
                margin-bottom: 10px;
            `,
            formInputWrapper: css`
                width: 75%;
            `,
        },
    },
    selectButton: {
        css: css`
            width: 100%;
            margin-top: 10px;
        `,
    },
};

/**
 * @deprecated Use productSelectorVariantModalStyles instead.
 */
export const quickOrderVariantModalStyles = productSelectorVariantModalStyles;

const ProductSelectorVariantModal = ({
    variantModalIsOpen,
    variantParentProduct,
    variantChildren,
    selectedVariant,
    variantSelection,
    extendedStyles,
    closeVariantModal,
    updateVariantSelection,
    setProduct,
    selectedVariantProductInfo,
    skipInventoryValidation,
}: Props) => {
    const [styles] = useState(() => mergeToNew(quickOrderVariantModalStyles, extendedStyles));

    if (!variantParentProduct?.variantTraits || !variantChildren) {
        return null;
    }

    const closeModalHandler = () => {
        closeVariantModal();
    };

    const variantChangeHandler = (traitValueId: string, variantTraitId: string) => {
        updateVariantSelection({ traitValueId, variantTraitId });
    };

    const selectButtonClickHandler = () => {
        setProduct({
            productId: variantParentProduct.id,
            variantId: selectedVariant?.id,
            validateProduct: true,
            skipInventoryValidation,
        });
        closeVariantModal();
    };

    const filteredVariantTraits = useFilteredVariantTraits(
        variantParentProduct.variantTraits,
        variantChildren,
        variantSelection,
    );

    return (
        <Modal
            {...styles.modal}
            headline={translate("Select options")}
            isOpen={variantModalIsOpen}
            handleClose={closeModalHandler}
        >
            <StyledWrapper {...styles.wrapper}>
                {filteredVariantTraits.map(variantTrait => (
                    <Select
                        {...styles.variantSelect}
                        key={variantTrait.id.toString()}
                        label={variantTrait.nameDisplay}
                        value={variantSelection[variantTrait.id]}
                        onChange={event => variantChangeHandler(event.currentTarget.value, variantTrait.id)}
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
                ))}
            </StyledWrapper>
            {selectedVariant && selectedVariantProductInfo && (
                <ProductPrice
                    product={{ product: selectedVariant, productInfo: selectedVariantProductInfo }}
                    showLabel={false}
                />
            )}
            <Button
                {...styles.selectButton}
                disabled={!selectedVariant || !selectedVariant.id}
                onClick={selectButtonClickHandler}
            >
                {translate("Select")}
            </Button>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelectorVariantModal);
