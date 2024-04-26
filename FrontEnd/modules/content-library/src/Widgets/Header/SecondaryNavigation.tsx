/* eslint-disable spire/export-styles */
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Hidden from "@insite/mobius/Hidden";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    enableWarehousePickup: getSettingsCollection(state).accountSettings.enableWarehousePickup,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

const Navigation = styled.div`
    color: ${getContrastColor("common.accent")};
    font-size: 15px;
    background-color: ${getColor("common.accent")};
    padding: 9px 45px 4px 45px;
    text-transform: uppercase;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const NavItem = styled.span<InjectableCss>`
    display: inline-flex;

    > span,
    > a {
        margin-left: 10px;
    }
    ${injectCss}
`;

export interface SecondaryNavigationStyles {
    wrapper?: InjectableCss;
    languageLink?: InjectableCss;
    warehousePickupLink?: InjectableCss;
    signInLink?: InjectableCss;
}

export const secondaryNavigationStyles: SecondaryNavigationStyles = {
    languageLink: {
        css: css`
            flex: 0 0 auto;
            margin-left: 30px;
        `,
    },
    warehousePickupLink: {
        css: css`
            flex: 0 1 auto;
            margin-left: 30px;
            min-width: 0;
        `,
    },
    signInLink: {
        css: css`
            flex: 0 0 auto;
            margin-left: 30px;
        `,
    },
};

const SecondaryNavigation: FC<Props> = ({ id, enableWarehousePickup }) => {
    const styles = useMergeStyles("secondaryNavigation", secondaryNavigationStyles);

    return (
        <Hidden below="lg">
            <Navigation {...styles.wrapper}>
                <NavItem>
                    <Zone zoneName="Currency" contentId={id} fixed />
                </NavItem>
                <NavItem {...styles.languageLink}>
                    <Zone zoneName="Language" contentId={id} fixed />
                </NavItem>
                {enableWarehousePickup && (
                    <NavItem {...styles.warehousePickupLink}>
                        <Zone zoneName="ShipToAddress" contentId={id} fixed />
                    </NavItem>
                )}
                <NavItem {...styles.signInLink}>
                    <Zone zoneName="SignIn" contentId={id} fixed />
                </NavItem>
            </Navigation>
        </Hidden>
    );
};

const secondaryNavigation: WidgetModule = {
    component: connect(mapStateToProps)(SecondaryNavigation),
    definition: {
        group: "Common",
        icon: "NavigationList",
    },
};

export default secondaryNavigation;
