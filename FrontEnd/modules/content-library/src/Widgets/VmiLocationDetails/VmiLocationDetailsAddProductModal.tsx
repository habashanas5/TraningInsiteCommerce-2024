import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import clearProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/ClearProduct";
import reset from "@insite/client-framework/Store/Components/ProductSelector/Handlers/Reset";
import searchProducts from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SearchProducts";
import setProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SetProduct";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import addVmiBin from "@insite/client-framework/Store/Data/VmiBins/Handlers/AddVmiBin";
import { VmiLocationStateContext } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import ProductSelectorVariantModal from "@insite/content-library/Components/ProductSelectorVariantModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { ChangeEvent, ReactNode, useContext, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    isOpen?: boolean;
    onSuccess: () => void;
    onClose: () => void;
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    const { isSearching, searchResults, selectedProductInfo, errorType } = getProductSelector(state);
    const product = getProductState(state, selectedProductInfo?.productId).value;
    return {
        isSearching,
        searchResults,
        selectedProductInfo,
        product,
        errorType,
    };
};

const mapDispatchToProps = {
    addVmiBin,
    searchProducts,
    setProduct,
    clearProduct,
    reset,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface VmiLocationDetailsAddProductModalStyles {
    modal?: ModalPresentationProps;
    form?: InjectableCss;
    container?: GridContainerProps;
    commonContainer?: GridContainerProps;
    inputsContainer?: GridContainerProps;
    commonGridItem?: GridItemProps;

    titleGridItem?: GridItemProps;
    searchGridItem?: GridItemProps;
    binGridItem?: GridItemProps;
    minGridItem?: GridItemProps;
    maxGridItem?: GridItemProps;

    titleText?: TypographyPresentationProps;
    searchDynamicDropdown?: DynamicDropdownPresentationProps;
    binTextField?: TextFieldPresentationProps;
    minTextField?: TextFieldPresentationProps;
    maxTextField?: TextFieldPresentationProps;

    buttonsGridItem?: GridItemProps;
    importLink?: LinkPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const vmiLocationDetailsAddProductModalStyles: VmiLocationDetailsAddProductModalStyles = {
    modal: {
        cssOverrides: {
            modalBody: css`
                overflow: visible;
            `,
        },
    },
    container: { gap: 15 },
    commonGridItem: { width: 12 },
    titleGridItem: { width: 12 },
    searchGridItem: { width: [12, 12, 6, 6, 6] },
    binGridItem: { width: [3, 3, 2, 2, 2] },
    minGridItem: { width: [3, 3, 2, 2, 2] },
    maxGridItem: { width: [3, 3, 2, 2, 2] },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: 12,
    },
    importLink: {
        css: css`
            margin: 9px 20px;
            white-space: nowrap;
        `,
    },
    submitButton: {
        css: css`
            margin-left: 1rem;
        `,
    },
    titleText: {
        variant: "h4",
    },
};

const styles = vmiLocationDetailsAddProductModalStyles;

const StyledForm = getStyledWrapper("form");

const VmiLocationDetailsAddProductModal = ({
    isOpen,
    onClose,
    onSuccess,
    toaster,
    isSearching,
    searchResults,
    selectedProductInfo,
    product,
    errorType,
    addVmiBin,
    searchProducts,
    setProduct,
    clearProduct,
    reset,
}: Props) => {
    const [binNumber, setBinNumber] = useState("");
    const [minValue, setMinValue] = useState("0");
    const [maxValue, setMaxValue] = useState("0");
    const [options, setOptions] = useState<OptionObject[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [errorMessage, setErrorMessage] = useState<ReactNode>("");

    const { value: vmiLocation } = useContext(VmiLocationStateContext);
    if (!vmiLocation) {
        return null;
    }

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!searchResults) {
            return;
        }

        const newOptions = searchResults.map(product => ({
            optionText: product.title,
            optionValue: product.id || undefined,
        }));
        setOptions(newOptions);
    }, [searchResults]);

    useEffect(() => {
        setSelectedProductId(selectedProductInfo ? selectedProductInfo.productId : "");
    }, [selectedProductInfo]);

    useEffect(() => {
        switch (errorType) {
            case "productIsConfigurable":
                setErrorMessage(translate("Cannot select configurable products"));
                break;
            case "productIsUnavailable":
                setErrorMessage(translate("Product is unavailable"));
                break;
            default:
                setErrorMessage("");
                break;
        }
    }, [errorType]);

    const binNumberChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBinNumber(event.target.value);
    };

    const minValueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMinValue(event.target.value);
    };

    const maxValueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxValue(event.target.value);
    };

    const validateForm = () => {
        return selectedProductId;
    };

    const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm() || !product) {
            return false;
        }

        addVmiBin({
            vmiLocationId: vmiLocation.id,
            vmiBin: {
                productId: selectedProductId,
                binNumber,
                minimumQty: +minValue || 0,
                maximumQty: +maxValue || 0,
                vmiLocationId: vmiLocation.id,
            },
            onComplete: result => {
                if (result.apiResult?.successful) {
                    toaster.addToast({
                        body: translate("Vmi bin added successfully"),
                        messageType: "success",
                    });

                    onSuccess();
                    resetState();
                } else if (result.apiResult?.errorMessage) {
                    toaster.addToast({ body: result.apiResult?.errorMessage, messageType: "danger" });
                }
            },
        });
    };

    const resetState = () => {
        setBinNumber("");
        setMinValue("0");
        setMaxValue("0");
        setOptions([]);
        setErrorMessage("");
    };

    const closeModalHandler = () => {
        onClose();
        resetState();
    };

    const onSelectionChangeHandler = (value?: string) => {
        if (searchResults && searchResults.length > 0) {
            const variantParentId = searchResults.find(o => o.id === value)?.styleParentId;
            if (variantParentId) {
                setProduct({
                    productId: variantParentId,
                    variantId: value,
                    validateProduct: true,
                    skipInventoryValidation: true,
                });
            } else {
                setProduct({
                    productId: value,
                    validateProduct: true,
                    skipInventoryValidation: true,
                });
            }
        }
    };

    const debouncedSearchProducts = debounce((query: string) => {
        searchProducts({ query });
    }, 300);

    const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");

        if (selectedProductInfo) {
            clearProduct();
        }

        debouncedSearchProducts(event.target.value);
    };

    return (
        <Modal
            {...styles.modal}
            handleClose={closeModalHandler}
            headline={translate("Add Product")}
            isOpen={isOpen}
            size={700}
        >
            <StyledForm {...styles.form} noValidate onSubmit={formSubmitHandler}>
                <GridContainer {...styles.container}>
                    <GridItem {...styles.titleGridItem}>
                        <Typography as="h4" {...styles.titleText}>
                            {translate("Product/Bin Information")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.commonGridItem}>
                        <GridContainer {...styles.inputsContainer}>
                            <GridItem {...styles.searchGridItem}>
                                <DynamicDropdown
                                    {...styles.searchDynamicDropdown}
                                    label={translate("Product")}
                                    onSelectionChange={onSelectionChangeHandler}
                                    onInputChange={onInputChanged}
                                    filterOption={() => true}
                                    selected={selectedProductId}
                                    isLoading={isSearching}
                                    options={options}
                                    error={errorMessage}
                                    required
                                />
                                <ProductSelectorVariantModal skipInventoryValidation={true} />
                            </GridItem>
                            <GridItem {...styles.binGridItem}>
                                <TextField
                                    {...styles.binTextField}
                                    label={translate("Bin #")}
                                    onChange={binNumberChangeHandler}
                                    maxLength={25}
                                    value={binNumber}
                                />
                            </GridItem>
                            <GridItem {...styles.minGridItem}>
                                <TextField
                                    {...styles.minTextField}
                                    type="number"
                                    min={0}
                                    label={translate("Min")}
                                    value={minValue}
                                    onChange={minValueChangeHandler}
                                />
                            </GridItem>
                            <GridItem {...styles.maxGridItem}>
                                <TextField
                                    {...styles.maxTextField}
                                    type="number"
                                    min={minValue}
                                    label={translate("Max")}
                                    value={maxValue}
                                    onChange={maxValueChangeHandler}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.buttonsGridItem}>
                        <Link {...styles.importLink}>{translate("Import CSV")}</Link>
                        <Button {...styles.submitButton} type="submit" disabled={!selectedProductId || !!errorMessage}>
                            {translate("Add Product")}
                        </Button>
                    </GridItem>
                </GridContainer>
            </StyledForm>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(VmiLocationDetailsAddProductModal));
