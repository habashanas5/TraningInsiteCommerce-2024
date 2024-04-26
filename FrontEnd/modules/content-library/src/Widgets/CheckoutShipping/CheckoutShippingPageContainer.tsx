import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingOverlay, { LoadingOverlayProps } from "@insite/mobius/LoadingOverlay";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    isUpdatingCart: state.pages.checkoutShipping.isUpdatingCart,
});

interface OwnProps extends WidgetProps {}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface CheckoutShippingPageContainerStyles {
    loadingOverlay?: LoadingOverlayProps;
    container?: GridContainerProps;
    headerGridItem?: GridItemProps;
    approverInfoGridItem?: GridItemProps;
    cartTotalGridItemNarrow?: GridItemProps;
    fulfillmentMethodAndAddressesGridItem?: GridItemProps;
    fulfillmentMethodAndAddressesContainer?: GridContainerProps;
    fulfillmentMethodAndNotesGridItem?: GridItemProps;
    fulfillmentMethodAndNotesContainer?: GridContainerProps;
    fulfillmentMethodGridItem?: GridItemProps;
    notesGridItemWide?: GridItemProps;
    addressesGridItem?: GridItemProps;
    notesAndCartTotalGridItem?: GridItemProps;
    notesAndCartTotalContainer?: GridContainerProps;
    notesGridItemNarrow?: GridItemProps;
    cartTotalGridItemWide?: GridItemProps;
}

export const containerStyles: CheckoutShippingPageContainerStyles = {
    loadingOverlay: {
        css: css`
            width: 100%;
        `,
    },
    headerGridItem: { width: 12 },
    approverInfoGridItem: {
        width: 12,
        css: css`
            padding: 0 15px;
        `,
    },
    cartTotalGridItemNarrow: { width: [12, 12, 0, 0, 0] },
    fulfillmentMethodAndAddressesGridItem: { width: [12, 12, 6, 8, 8] },
    fulfillmentMethodAndNotesGridItem: { width: 12 },
    fulfillmentMethodGridItem: { width: [12, 12, 12, 6, 6] },
    notesGridItemWide: { width: [0, 0, 0, 6, 6] },
    addressesGridItem: { width: 12 },
    notesAndCartTotalGridItem: { width: [12, 12, 6, 4, 4] },
    notesGridItemNarrow: { width: [12, 12, 12, 0, 0] },
    cartTotalGridItemWide: { width: [0, 0, 12, 12, 12] },
};

const styles = containerStyles;

const CheckoutShippingPageContainer = ({ id, isUpdatingCart }: Props) => {
    return (
        <LoadingOverlay {...styles.loadingOverlay} loading={isUpdatingCart}>
            <GridContainer {...styles.container}>
                <GridItem {...styles.headerGridItem}>
                    <Zone zoneName="Content0" contentId={id} />
                </GridItem>
                <GridItem {...styles.cartTotalGridItemNarrow}>
                    <Zone zoneName="Content3" contentId={id} />
                </GridItem>
                <GridItem {...styles.approverInfoGridItem}>
                    <Zone zoneName="Content5" contentId={id} />
                </GridItem>
                <GridItem {...styles.fulfillmentMethodAndAddressesGridItem}>
                    <GridContainer {...styles.fulfillmentMethodAndAddressesContainer}>
                        <GridItem {...styles.fulfillmentMethodAndNotesGridItem}>
                            <GridContainer {...styles.fulfillmentMethodAndNotesContainer}>
                                <GridItem {...styles.fulfillmentMethodGridItem}>
                                    <Zone zoneName="Content1" contentId={id} />
                                </GridItem>
                                <GridItem {...styles.notesGridItemWide}>
                                    <Zone zoneName="Content2" contentId={id} />
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem {...styles.addressesGridItem}>
                            <Zone zoneName="Content4" contentId={id} />
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.notesAndCartTotalGridItem}>
                    <GridContainer {...styles.notesAndCartTotalContainer}>
                        <GridItem {...styles.notesGridItemNarrow}>
                            <Zone zoneName="Content2" contentId={id} />
                        </GridItem>
                        <GridItem {...styles.cartTotalGridItemWide}>
                            <Zone zoneName="Content3" contentId={id} />
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </LoadingOverlay>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CheckoutShippingPageContainer),
    definition: {
        displayName: "Page Container",
        group: "Checkout - Shipping",
        allowedContexts: [CheckoutShippingPageContext],
    },
};

export default widgetModule;
