import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    const pagination = getProductListDataViewProperty(state, "pagination");
    const correctedQuery = getProductListDataViewProperty(state, "correctedQuery");
    const { productFilters } = state.pages.productList;

    return {
        totalItemCount: pagination?.totalItemCount,
        query: correctedQuery || productFilters.query,
    };
};

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export interface ProductListProductCountStyles {
    wrapper?: InjectableCss;
    countText?: TypographyPresentationProps;
    itemsText?: TypographyPresentationProps;
    queryText?: TypographyPresentationProps;
}

export const productCountStyles: ProductListProductCountStyles = {
    wrapper: {
        css: css`
            margin-top: 10px;
        `,
    },
    countText: {
        css: css`
            white-space: nowrap;
        `,
    },
    queryText: {
        css: css`
            white-space: nowrap;
            font-weight: bold;
        `,
    },
};

const styles = productCountStyles;

const ProductListProductCount: FC<Props> = ({ totalItemCount, query }) => {
    if (!totalItemCount) {
        return null;
    }

    const itemsText = (totalItemCount !== 1 ? " items" : " item") + (query ? " for " : "");

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.countText} data-test-selector="productListCountText">
                {totalItemCount}
            </Typography>
            <Typography {...styles.itemsText}>{translate(itemsText)}</Typography>
            {query && (
                <Typography {...styles.queryText} data-test-selector="productListQueryText">
                    {query}
                </Typography>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(ProductListProductCount),
    definition: {
        group: "Product List",
        displayName: "Product List Count",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
