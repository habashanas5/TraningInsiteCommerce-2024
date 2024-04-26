/* eslint-disable spire/export-styles */
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import baseTheme from "@insite/mobius/globals/baseTheme";
import Hidden from "@insite/mobius/Hidden";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
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
    color: white;
    font-size: 15px;
    background-color: black;
    padding: 9px 21px 5px 45px;
    text-transform: uppercase;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    ${({ theme }) => {
        const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
        return breakpointMediaQueries(theme, [
            css`
                max-width: ${maxWidths[1]}px;
            `,
            css`
                max-width: ${maxWidths[1]}px;
            `,
            css`
                max-width: ${maxWidths[2]}px;
            `,
            css`
                max-width: ${maxWidths[3]}px;
            `,
            css`
                max-width: ${maxWidths[4]}px;
            `,
        ]);
    }}
`;

const NavItem = styled.span<InjectableCss>`
    display: inline-flex;

    > span,
    > a {
        margin-left: 10px;
    }
    ${injectCss}
`;

const SecondaryNavigation: FC<Props> = ({ id, enableWarehousePickup }) => {
    return (
        <Hidden below="lg">
            <Navigation>
                <NavItem
                    css={css`
                        margin-left: 40px;
                    `}
                >
                    <Zone zoneName="Currency" contentId={id} fixed />
                </NavItem>
                <NavItem
                    css={css`
                        flex: 0 0 auto;
                        margin-left: 0;
                    `}
                >
                    <Zone zoneName="Language" contentId={id} fixed />
                </NavItem>
                {enableWarehousePickup && (
                    <NavItem
                        css={css`
                            flex: 0 1 auto;
                            margin-left: 0;
                            min-width: 0;
                        `}
                    >
                        <Zone zoneName="ShipToAddress" contentId={id} fixed />
                    </NavItem>
                )}
                <NavItem
                    css={css`
                        flex: 0 0 auto;
                        margin-left: 30px;
                    `}
                >
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
