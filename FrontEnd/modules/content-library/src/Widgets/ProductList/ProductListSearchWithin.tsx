import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Search from "@insite/mobius/Icons/Search";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    loaded: !!getProductListDataView(state).value,
    productFilters: state.pages.productList.productFilters,
});

const mapDispatchToProps = {
    addProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListSearchWithinStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    searchTextField?: TextFieldPresentationProps;
}

export const searchWithinStyles: ProductListSearchWithinStyles = {
    titleText: {
        variant: "h6",
    },
    searchTextField: {
        iconProps: { src: Search },
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
};

const styles = searchWithinStyles;

const ProductListSearchWithin: FC<Props> = ({ loaded, addProductFilters, productFilters }) => {
    if (!loaded) {
        return null;
    }

    const [searchText, setSearchText] = useState("");

    const doSearch = () => {
        if (searchText.trim() !== "") {
            addProductFilters({ searchWithinQueries: [searchText] });
        }
        setSearchText("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            doSearch();
        } else {
            setSearchText(event.currentTarget.value);
        }
    };

    let pageType: string;
    if (productFilters.pageProductLineId) {
        pageType = "Product Line";
    } else if (productFilters.pageBrandId) {
        pageType = "Brand";
    } else if (productFilters.pageCategoryId) {
        pageType = "Category";
    } else {
        pageType = "Results";
    }

    const label = translate(`Search Within ${pageType}`);

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography forwardAs="label" htmlFor="productsKeywordSearch" {...styles.titleText}>
                {label}
            </Typography>
            <TextField
                {...styles.searchTextField}
                iconClickableProps={{ onClick: doSearch, "aria-roledescription": `Search within ${pageType}` }}
                value={searchText}
                onChange={event => setSearchText(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
                placeholder={translate("Enter Keywords")}
                type="text"
                data-test-selector="productListSearchWithin"
                id="productsKeywordSearch"
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListSearchWithin),
    definition: {
        group: "Product List",
        displayName: "Search Within",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
