import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { CartContext } from "@insite/client-framework/Components/CartContext";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import displayOrder from "@insite/client-framework/Store/Pages/SavedOrderDetails/Handlers/DisplayOrder";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    let cartId;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ cartId: string }>(location.search);
        cartId = parsedQuery.cartId;
    }

    const savedOrderState = getCartState(state, cartId);

    return {
        cartId,
        savedCartState: savedOrderState,
        billToState: getBillToState(state, savedOrderState?.value?.billToId),
        shipToState: getShipToState(state, savedOrderState?.value?.shipToId),
        savedOrderListPageLink: getPageLinkByPageType(state, "SavedOrderListPage")?.url,
    };
};

const mapDispatchToProps = {
    displayOrder,
};

export interface SavedOrderDetailsPageStyles {
    loadFailedWrapper?: InjectableCss;
    loadFailedText?: TypographyPresentationProps;
}

export const savedOrderDetailsPageStyles: SavedOrderDetailsPageStyles = {
    loadFailedWrapper: {
        css: css`
            display: flex;
            height: 200px;
            justify-content: center;
            align-items: center;
            background-color: ${getColor("common.accent")};
        `,
    },
    loadFailedText: { weight: "bold" },
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;
const styles = savedOrderDetailsPageStyles;

const SavedOrderDetailsPage = ({
    id,
    cartId,
    savedCartState,
    displayOrder,
    billToState,
    shipToState,
    history,
    savedOrderListPageLink,
}: Props) => {
    useEffect(() => {
        if (cartId) {
            displayOrder({
                cartId,
                onError: () => {
                    history.push(savedOrderListPageLink!);
                },
            });
        }
    }, [cartId]);

    const savedOrder = savedCartState.value
        ? {
              ...savedCartState.value,
              billTo: billToState.value,
              shipTo: shipToState.value,
          }
        : undefined;

    return (
        <Page>
            {savedCartState.errorStatusCode === 404 ? (
                <StyledWrapper {...styles.loadFailedWrapper}>
                    <Typography {...styles.loadFailedText}>{siteMessage("Cart_CartNotFound")}</Typography>
                </StyledWrapper>
            ) : (
                <CartContext.Provider value={savedOrder}>
                    <Zone contentId={id} zoneName="Content" />
                    <Modals />
                </CartContext.Provider>
            )}
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(SavedOrderDetailsPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const SavedOrderDetailsPageContext = "SavedOrderDetailsPage";
