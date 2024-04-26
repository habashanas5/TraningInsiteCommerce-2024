import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import getAutocompleteModel from "@insite/client-framework/Store/CommonHandlers/GetAutocompleteModel";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchFieldWrapper, {
    SearchFieldWrapperStyles,
} from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { ChangeEvent, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    productErpNumber: state.pages.orderHistory.getOrdersParameter.productErpNumber,
});

const mapDispatchToProps = {
    getAutocompleteModel,
    updateSearchFields,
};

export interface OrderHistorySearchFieldProductErpNumber2Styles {
    wrapper?: SearchFieldWrapperStyles;
    searchDynamicDropdown?: DynamicDropdownPresentationProps;
    optionWrapper?: InjectableCss;
    imageWrapper?: InjectableCss;
    productImage?: LazyImageProps;
    infoWrapper?: InjectableCss;
    autocompleteTitleText?: TypographyPresentationProps;
    autocompleteErpText?: TypographyPresentationProps;
}

export const orderHistorySearchFieldProductErpNumber2Styles: OrderHistorySearchFieldProductErpNumber2Styles = {
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
};
const styles = orderHistorySearchFieldProductErpNumber2Styles;

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const OrderHistorySearchFieldProductErpNumber2 = ({
    productErpNumber,
    getAutocompleteModel,
    updateSearchFields,
}: Props) => {
    const [options, setOptions] = useState<OptionObject[]>([]);

    const onSelectionChangeHandler = (value?: string) => {
        updateSearchFields({ productErpNumber: value });
    };

    const debouncedSearchProducts = debounce((query: string) => {
        getAutocompleteModel({
            query,
            onSuccess: result => {
                if (!result?.products) {
                    return;
                }

                const newOptions = result.products.map(product => ({
                    optionText: product.erpNumber,
                    optionValue: product.erpNumber || undefined,
                    rowChildren: (
                        <StyledWrapper {...styles.optionWrapper}>
                            <StyledWrapper {...styles.imageWrapper}>
                                <LazyImage {...styles.productImage} src={product.image} />
                            </StyledWrapper>
                            <StyledWrapper {...styles.infoWrapper}>
                                <Typography {...styles.autocompleteTitleText}>{product.title}</Typography>
                                <Typography {...styles.autocompleteErpText}>{product.erpNumber}</Typography>
                            </StyledWrapper>
                        </StyledWrapper>
                    ),
                }));
                setOptions(newOptions);
            },
            onComplete(resultProps) {
                if (resultProps?.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps?.apiResult);
                }
            },
        });
    }, 300);

    const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        debouncedSearchProducts(event.target.value);
    };

    return (
        <SearchFieldWrapper extendedStyles={styles.wrapper}>
            <DynamicDropdown
                {...styles.searchDynamicDropdown}
                label={translate("Product")}
                onSelectionChange={onSelectionChangeHandler}
                onInputChange={onInputChanged}
                filterOption={() => true}
                selected={productErpNumber}
                options={options}
                placeholder={translate("Enter keyword or item #")}
            />
        </SearchFieldWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldProductErpNumber2),
    definition: {
        group: "Order History",
        displayName: "Product ERP Number",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
