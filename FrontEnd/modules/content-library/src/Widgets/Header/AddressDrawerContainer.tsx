import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getIsPunchOutSession, getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    return {
        isAuthenticated: getSession(state).isAuthenticated,
        fulfillmentMethod: state.components.addressDrawer.fulfillmentMethod,
        isPunchOutSession: getIsPunchOutSession(state),
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasShellContext;

interface AddressDrawerContainerStyles {
    drawerContainer?: GridContainerProps;
    punchOutAddressGridItem?: GridItemProps;
    fulfillmentMethodGridItem?: GridItemProps;
    addressesGridItem?: GridItemProps;
    addressesGridItemAnonymousUser?: GridItemProps;
    pickUpAddressGridItem?: GridItemProps;
    pickUpAddressGridItemAnonymousUser?: GridItemProps;
    applyButtonGridItem?: GridItemProps;
}

export const addressDrawerContainerStyles: AddressDrawerContainerStyles = {
    drawerContainer: {
        css: [
            ({ gap, theme }) => css`
                margin-left: ${gap !== undefined && gap > 0 ? `${gap / 2}px` : "0"};
                width: ${gap !== undefined && gap > 0 ? `calc(100% - ${gap}px)` : "100%"};
                ${breakpointMediaQueries(
                    theme,
                    [
                        css`
                            max-width: inherit;
                        `,
                    ],
                    "min",
                )}
            `,
        ],
    },
    punchOutAddressGridItem: {
        width: 12,
    },
    fulfillmentMethodGridItem: {
        css: css`
            order: 1;
        `,
        width: 2,
    },
    addressesGridItem: {
        css: css`
            order: 2;
        `,
        width: 5,
    },
    addressesGridItemAnonymousUser: {
        css: css`
            order: 3;
        `,
        width: 5,
    },
    pickUpAddressGridItem: {
        css: css`
            order: 3;
        `,
        width: 5,
    },
    pickUpAddressGridItemAnonymousUser: {
        css: css`
            order: 2;
        `,
        width: 5,
    },
    applyButtonGridItem: {
        css: css`
            order: 4;
        `,
        width: 7,
    },
};

const styles = addressDrawerContainerStyles;

const AddressDrawerContainer = ({ id, isAuthenticated, fulfillmentMethod, isPunchOutSession, shellContext }: Props) => {
    return (
        <>
            {(isPunchOutSession || shellContext.isEditing) && (
                <GridContainer {...styles.drawerContainer}>
                    <GridItem {...styles.punchOutAddressGridItem}>
                        <Zone zoneName="PunchOutAddress" contentId={id} />
                    </GridItem>
                </GridContainer>
            )}
            {(!isPunchOutSession || shellContext.isEditing) && (
                <GridContainer {...styles.drawerContainer}>
                    <GridItem {...styles.fulfillmentMethodGridItem}>
                        <Zone zoneName="FulfillmentMethod" contentId={id} />
                    </GridItem>
                    <GridItem
                        {...(!isAuthenticated && fulfillmentMethod === FulfillmentMethod.PickUp
                            ? styles.addressesGridItemAnonymousUser
                            : styles.addressesGridItem)}
                    >
                        <Zone zoneName="Addresses" contentId={id} />
                    </GridItem>
                    <GridItem
                        {...(!isAuthenticated && fulfillmentMethod === FulfillmentMethod.PickUp
                            ? styles.pickUpAddressGridItemAnonymousUser
                            : styles.pickUpAddressGridItem)}
                    >
                        <Zone zoneName="PickUpAddress" contentId={id} />
                    </GridItem>
                    <GridItem {...styles.applyButtonGridItem}>
                        <Zone zoneName="ApplyButton" contentId={id} />
                    </GridItem>
                </GridContainer>
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withIsInShell(AddressDrawerContainer)),
    definition: {
        group: "Header",
    },
};

export default widgetModule;
