import getColor from "@insite/mobius/utilities/getColor";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface OwnProps {}

const mapStateToProps = ({ shellContext: { homePageId, mobileCmsModeActive } }: ShellState) => ({
    homePageId,
    mobileCmsModeActive,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & RouteComponentProps;

const MainNavigation = ({ mobileCmsModeActive, location: { pathname }, homePageId }: Props) => {
    if (mobileCmsModeActive) {
        return null;
    }

    const url = pathname.toLowerCase();

    const link = (to: string, title: string, toCheck?: string) => {
        const isActive = url.startsWith((toCheck || to).toLowerCase());
        return (
            <NavigationLink to={to} data-active={isActive}>
                {title}
            </NavigationLink>
        );
    };

    return (
        <NavigationWrapper data-test-selector="shell_navigation">
            {link(`/ContentAdmin/Page${homePageId}`, "Pages", "/ContentAdmin/Page")}
            {link("/ContentAdmin/Design/StyleGuide", "Style Guide")}
        </NavigationWrapper>
    );
};

export default connect(mapStateToProps)(withRouter(MainNavigation));

const NavigationWrapper = styled.div`
    height: ${(props: ShellThemeProps) => props.theme.headerHeight};
    display: flex;
    padding: 0 36px;
    align-items: flex-end;
`;

const NavigationLink = styled(Link)`
    margin-right: 16px;
    font-size: 18px;
    border-bottom: 2px solid transparent;

    &[data-active="true"] {
        color: ${getColor("primary.main")};
        border-bottom: 2px solid ${getColor("custom.activeBorder")};
    }
`;
