import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import clearProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/ClearProduct";
import reset from "@insite/client-framework/Store/Components/ProductSelector/Handlers/Reset";
import searchProducts from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SearchProducts";
import setProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SetProduct";
import setUnitOfMeasure from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SetUnitOfMeasure";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import translate from "@insite/client-framework/Translate";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    onSelectProduct: (productInfo: ProductInfo, product: ProductModel) => void;
    skipInventoryValidation?: boolean;
    denyFixedConfiguration?: boolean;
    selectButtonTitle?: string;
    productIsConfigurableMessage?: ReactNode;
    productIsUnavailableMessage?: ReactNode;
    customErrorMessage?: ReactNode;
    extendedStyles?: ProductSelectorStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    const { isSearching, searchResults, selectedProductInfo, errorType } = getProductSelector(state);
    const product = getProductState(state, selectedProductInfo?.productId).value;
    return {
        isSearching,
        searchResults,
        selectedProductInfo,
        product,
        errorType,
        location: getLocation(state),
    };
};

const mapDispatchToProps = {
    searchProducts,
    setProduct,
    clearProduct,
    setUnitOfMeasure,
    reset,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductSelectorStyles {
    container?: GridContainerProps;
    searchGridItem?: GridItemProps;
    qtyGridItem?: GridItemProps;
    unitOfMeasureGridItem?: GridItemProps;
    buttonGridItem?: GridItemProps;
    unitOfMeasureSelect?: SelectPresentationProps;
    qtyTextField?: TextFieldPresentationProps;
    optionWrapper?: InjectableCss;
    imageWrapper?: InjectableCss;
    productImage?: LazyImageProps;
    infoWrapper?: InjectableCss;
    autocompleteTitleText?: TypographyPresentationProps;
    autocompleteErpText?: TypographyPresentationProps;
    selectButton?: ButtonPresentationProps;
    searchDynamicDropdown?: DynamicDropdownPresentationProps;
}

export const productSelectorStyles: ProductSelectorStyles = {
    container: {
        gap: 10,
    },
    searchGridItem: {
        width: [12, 12, 4, 5, 5],
    },
    qtyGridItem: {
        width: [3, 3, 2, 1, 1],
    },
    unitOfMeasureGridItem: {
        width: [9, 9, 3, 3, 3],
    },
    buttonGridItem: {
        width: [12, 12, 3, 3, 3],
    },
    optionWrapper: {
        css: css`
            display: flex;
            cursor: pointer;
        `,
    },
    imageWrapper: {
        css: css`
            display: flex;
            width: 50px;
            height: 50px;
            margin-right: 10px;
        `,
    },
    productImage: {
        width: "50px",
        css: css`
            flex-shrink: 0;
            img {
                height: 100%;
            }
        `,
    },
    infoWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
        `,
    },
    autocompleteTitleText: {
        size: 14,
    },
    autocompleteErpText: {
        size: 14,
        css: css`
            margin-top: 5px;
        `,
    },
    selectButton: {
        css: css`
            margin-top: 30px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
};

const ENTER_KEY = 13;

const ProductSelector = ({
    onSelectProduct,
    skipInventoryValidation,
    denyFixedConfiguration,
    selectButtonTitle,
    searchProducts,
    isSearching,
    searchResults,
    setProduct,
    clearProduct,
    setUnitOfMeasure,
    selectedProductInfo,
    product,
    errorType,
    extendedStyles,
    customErrorMessage,
    productIsConfigurableMessage,
    productIsUnavailableMessage,
    location,
    reset,
}: Props) => {
    const [qty, setQty] = useState("1");
    const [errorMessage, setErrorMessage] = useState<ReactNode>("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [options, setOptions] = useState<OptionObject[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [styles] = useState(() => mergeToNew(productSelectorStyles, extendedStyles));

    useEffect(() => {
        reset();
    }, [location.pathname]);

    useEffect(() => {
        if (!searchResults) {
            return;
        }

        const newOptions = searchResults.map(product => ({
            optionText: product.title,
            optionValue: product.id || undefined,
            rowChildren: (
                <StyledWrapper {...styles.optionWrapper}>
                    <StyledWrapper {...styles.imageWrapper}>
                        <LazyImage {...styles.productImage} src={product.image} />
                    </StyledWrapper>
                    <StyledWrapper {...styles.infoWrapper}>
                        <Typography {...styles.autocompleteTitleText}>{product.displayTitle}</Typography>
                        <Typography {...styles.autocompleteErpText}>{product.displayErpNumber}</Typography>
                    </StyledWrapper>
                </StyledWrapper>
            ),
        }));
        setOptions(newOptions);
    }, [searchResults]);

    useEffect(() => {
        setErrorMessage(customErrorMessage);
    }, [customErrorMessage]);

    useEffect(() => {
        setSelectedProductId(selectedProductInfo ? selectedProductInfo.productId : "");
    }, [selectedProductInfo]);

    useEffect(() => {
        switch (errorType) {
            case "productIsConfigurable":
                setErrorMessage(productIsConfigurableMessage || translate("Cannot select configurable products"));
                break;
            case "productIsUnavailable":
                setErrorMessage(productIsUnavailableMessage || translate("Product is unavailable"));
                break;
            default:
                setErrorMessage("");
                break;
        }
    }, [errorType]);

    const onSelectionChangeHandler = (value?: string) => {
        if (searchResults && searchResults.length > 0) {
            const variantParentId = searchResults.find(o => o.id === value)?.styleParentId;
            if (variantParentId) {
                setProduct({
                    productId: variantParentId,
                    variantId: value,
                    validateProduct: true,
                    skipInventoryValidation,
                    denyFixedConfiguration,
                });
            } else {
                setProduct({
                    productId: value,
                    validateProduct: true,
                    skipInventoryValidation,
                    denyFixedConfiguration,
                });
            }
        }
    };

    const debouncedSearchProducts = debounce((query: string) => {
        searchProducts({ query });
    }, 300);

    const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");
        setSearchTerm(event.target.value);

        if (selectedProductInfo) {
            clearProduct();
        }

        debouncedSearchProducts(event.target.value);
    };

    const selectProduct = () => {
        if (!selectedProductInfo || errorMessage || !product) {
            return;
        }

        const newProductInfo = { ...selectedProductInfo };
        newProductInfo.qtyOrdered = Math.max(Number(qty) || 1, product.minimumOrderQty || 1);
        onSelectProduct(newProductInfo, product);

        clearProduct();
        setQty("1");
        searchProducts({ query: "" });
    };

    const uomChangeHandler = (unitOfMeasure: string) => {
        if (!selectedProductInfo) {
            return;
        }

        setUnitOfMeasure({ unitOfMeasure });
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        if (event.charCode === ENTER_KEY) {
            if (selectedProductInfo) {
                selectProduct();
            } else if (searchTerm && (!searchResults || searchResults.length === 0)) {
                setProduct({ searchTerm, skipInventoryValidation, denyFixedConfiguration });
            }
        }
    };

    return (
        <GridContainer {...styles.container} data-test-selector="productSelector">
            <GridItem {...styles.searchGridItem}>
                <DynamicDropdown
                    {...styles.searchDynamicDropdown}
                    label={translate("Search")}
                    onSelectionChange={onSelectionChangeHandler}
                    onInputChange={onInputChanged}
                    onKeyPress={onKeyPress}
                    filterOption={() => true}
                    selected={selectedProductId}
                    isLoading={isSearching}
                    options={options}
                    error={errorMessage}
                    data-test-selector="productSelector_search"
                />
            </GridItem>
            <GridItem {...styles.qtyGridItem}>
                <TextField
                    type="number"
                    defaultValue="1"
                    min="0"
                    label={translate("QTY")}
                    value={qty}
                    onChange={e => {
                        setQty(e.currentTarget.value);
                    }}
                    data-test-selector="productSelector_qty"
                />
            </GridItem>
            <GridItem {...styles.unitOfMeasureGridItem}>
                {product && selectedProductInfo && (
                    <ProductContext.Provider
                        value={{ product, productInfo: selectedProductInfo, onUnitOfMeasureChanged: uomChangeHandler }}
                    >
                        <ProductUnitOfMeasureSelect
                            extendedStyles={styles.unitOfMeasureSelect}
                            data-test-selector="productSelector_uom"
                        />
                    </ProductContext.Provider>
                )}
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Button
                    {...styles.selectButton}
                    onClick={() => selectProduct()}
                    disabled={!selectedProductInfo || !!errorMessage || Number(qty) < 1}
                    data-test-selector="productSelector_selectProduct"
                >
                    {selectButtonTitle || translate("Select Product")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelector);
