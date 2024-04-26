import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { StaticListPageContext } from "@insite/content-library/Pages/StaticListPage";
import StaticListProductListLine from "@insite/content-library/Widgets/StaticList/StaticListProductListLine";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    wishListState: getWishListState(state, state.pages.staticList.wishListId),
    productInfosByWishListLineId: state.pages.staticList.productInfosByWishListLineId,
});

const mapDispatchToProps = {};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface StaticListProductListStyles {
    mainWrapper?: InjectableCss;
    countText?: TypographyPresentationProps;
    linesWrapper?: InjectableCss;
}

export const staticListProductListStyles: StaticListProductListStyles = {
    mainWrapper: {
        css: css`
            margin-top: 10px;
        `,
    },
    countText: {
        weight: 600,
    },
    linesWrapper: {
        css: css`
            margin-top: 10px;
            border-top: 1px solid ${getColor("common.border")};
        `,
    },
};

const styles = staticListProductListStyles;

const StaticListProductList = ({ wishListState, productInfosByWishListLineId }: Props) => {
    if (wishListState.isLoading || !wishListState.value || Object.keys(productInfosByWishListLineId).length === 0) {
        return null;
    }

    const wishList = wishListState.value;

    return (
        <StyledWrapper {...styles.mainWrapper}>
            <Typography {...styles.countText}>
                {wishList.wishListLinesCount === 1 && translate("{0} Product", wishList.wishListLinesCount.toString())}
                {wishList.wishListLinesCount > 1 && translate("{0} Products", wishList.wishListLinesCount.toString())}
            </Typography>
            <StyledWrapper {...styles.linesWrapper}>
                {wishList.wishListLineCollection?.map(wishListLine => (
                    <StaticListProductListLine
                        key={wishListLine.id}
                        wishListLine={wishListLine}
                        productInfo={productInfosByWishListLineId[wishListLine.id]!}
                    />
                ))}
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(StaticListProductList),
    definition: {
        group: "Static List",
        displayName: "Product List",
        allowedContexts: [StaticListPageContext],
    },
};

export default widgetModule;
