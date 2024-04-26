import Button, { ButtonIcon } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconProps } from "@insite/mobius/Icon";
import { MappedLink } from "@insite/mobius/Menu";
import PanelRow, { PanelRowPresentationProps } from "@insite/mobius/PanelMenu/PanelRow";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React from "react";
import styled, { css, ThemeConsumer, ThemeProps } from "styled-components";

export interface PanelMenuPresentationProps {
    /** CSS string or styled-components function to be injected into this component
     * @themable */
    cssOverrides?: {
        wrapper?: StyledProp<PanelMenuPresentationProps>;
        children?: StyledProp<PanelMenuPresentationProps>;
        menu?: StyledProp<PanelMenuPresentationProps>;
    };
    /** Props passed to the typography children of the menu.
     * @themable */
    childTypographyProps?: TypographyPresentationProps;
    /** Props passed to the menu close icon.
     * @themable */
    closeIconProps?: IconProps;
    /** Props passed to the menu back icon.
     * @themable */
    backIconProps?: IconProps;
    /** Color of the background of the menu header.
     * @themable */
    headerColor?: string;
    /** Color of the background of the menu body.
     * @themable */
    bodyColor?: string;
    /** Props to be passed into the panel row component.
     * @themable */
    panelRowProps?: PanelRowPresentationProps;
}

export type PanelMenuComponentProps = MobiusStyledComponentProps<
    "nav",
    {
        /** The element that triggers the menu. */
        panelTrigger: React.ReactElement;
        /** Aria attributes used internally require an `id`. If not provided, a random id is generated. */
        descriptionId?: string;
        /**
         * The nested child structure that will be rendered by the menu.
         * If menu items are provided, children organically passed to the component
         * will not be rendered.
         */
        menuItems?: MappedLink[];
        /** Maximum number of menus that will appear in submenu panels. */
        maxDepth?: number;
        /** Function called to close overlay (Drawer) in which menu resides. Governs presence of `x` icons in headers. */
        closeOverlay?: () => void;
        /** The current URL of the application, used to apply 'current page' styles to the menu item */
        currentUrl?: string;
        /** @ignore internal prop */
        layer: number;
    }
>;

const PanelMenuWrapper = styled.nav<ThemeProps<BaseTheme> & InjectableCss>`
    button,
    link {
        &:focus {
            outline-offset: -${getProp("theme.focus.width")};
        }
    }
    > button {
        width: 100%;
    }
    ${injectCss}
`;

const PanelMenuStyle = styled.div<ThemeProps<BaseTheme> & InjectableCss & { color?: string }>`
    height: calc(100% - 50px);
    overflow-y: auto;
    background: ${({ color, theme }) => resolveColor(color, theme)};
    ${injectCss}
`;

const PanelChildren = styled.div<ThemeProps<BaseTheme> & InjectableCss & { displayLayer: number }>`
    max-height: 100vh;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 100%;
    transition: all ease-in-out ${getProp("theme.transition.duration.short")}ms;
    ${({ displayLayer }) => {
        if (displayLayer <= 0) {
            return css`
                left: 0;
            `;
        }
        return css`
            left: 100%;
        `;
    }}
    ${injectCss}
`;

/** PanelMenuProps with defaulted properties now listed as not-optional, plus theme. */
export type PanelMenuProps = PanelMenuComponentProps & PanelMenuPresentationProps;

type PanelMenuPropsCompleted = PanelMenuPresentationProps &
    Omit<PanelMenuComponentProps, "maxDepth"> &
    Required<Pick<PanelMenuComponentProps, "maxDepth">>;

class PanelMenu extends React.Component<PanelMenuPropsCompleted> {
    static defaultProps = { maxDepth: 3 };

    state = {
        layer: this.props.layer + 1,
        descriptionId: this.props.descriptionId || uniqueId(),
    };

    UNSAFE_componentWillReceiveProps(nextProps: PanelMenuPropsCompleted) {
        // eslint-disable-line camelcase
        if (nextProps.layer !== this.props.layer + 1 && !nextProps.children && !this.props.children) {
            this.setState({ layer: nextProps.layer + 1 }, () => {});
        }
    }

    moveNextLeft = () => {
        this.setState(({ layer }: { layer: number }) => {
            return { layer: layer - 1 };
        });
    };

    moveNextRight = () => {
        this.setState(({ layer }: { layer: number }) => {
            return { layer: layer + 1 };
        });
    };

    renderMenuItems(childMenuItems: MappedLink[], currentDepth: number, propBuilder: any) {
        const { applyProp } = propBuilder;
        const { currentUrl } = this.props;
        const typographyProps = applyProp("childTypographyProps");
        const panelRowProps = applyProp("panelRowProps");
        return (
            <>
                {childMenuItems
                    .filter(item => !item.excludeFromNavigation)
                    .map(item => {
                        const renderChildren =
                            item.children?.filter(child => !child.excludeFromNavigation).length &&
                            currentDepth < this.props.maxDepth;
                        const clickableProps: { href?: string } = { ...item.clickableProps };
                        if (!renderChildren && item.url) {
                            clickableProps.href = item.url;
                        }
                        const menuItem = (
                            <PanelRow
                                key={item.title}
                                isCurrent={currentUrl === item.url}
                                onClick={this.props.closeOverlay}
                                color={applyProp("bodyColor")}
                                hasChildren={renderChildren || false}
                                tabIndex={this.state.layer === 0 ? 0 : -1}
                                {...clickableProps}
                                {...panelRowProps}
                            >
                                <Typography
                                    data-test-selector={`${this.props["data-test-selector"]}_${item.title}`}
                                    weight="bold"
                                    size={15}
                                    {...typographyProps}
                                >
                                    {item.title}
                                </Typography>
                            </PanelRow>
                        );
                        if (renderChildren) {
                            return (
                                <PanelMenu
                                    {...this.props}
                                    as="div"
                                    key={item.title}
                                    panelTrigger={menuItem}
                                    menuItems={item.children as MappedLink[]}
                                    maxDepth={this.props.maxDepth - 1}
                                    layer={this.state.layer}
                                />
                            );
                        }
                        return menuItem;
                    })}
            </>
        );
    }

    render() {
        return (
            <ThemeConsumer>
                {theme => {
                    const { currentUrl, descriptionId, menuItems, panelTrigger, closeOverlay, ...otherProps } =
                        this.props;
                    const propBuilder = applyPropBuilder({ ...this.props, theme }, { component: "panelMenu" });
                    const { translate } = theme;
                    const { layer, descriptionId: navId } = this.state;
                    const { spreadProps, applyProp } = propBuilder;
                    const cssOverrides = spreadProps("cssOverrides");
                    const headerColor = applyProp("headerColor", "common.backgroundContrast");
                    return (
                        <PanelMenuWrapper
                            css={cssOverrides?.wrapper}
                            {...{ "aria-labelledby": navId }}
                            {...otherProps}
                            tabIndex={-1}
                        >
                            {React.cloneElement(panelTrigger, { id: navId, onClick: this.moveNextLeft })}
                            <PanelChildren
                                displayLayer={layer}
                                aria-hidden={layer > 0}
                                css={cssOverrides?.children}
                                data-layer={layer}
                            >
                                <PanelRow as="div" color={headerColor} header>
                                    <Button
                                        color={headerColor}
                                        onClick={this.moveNextRight}
                                        tabIndex={layer === 0 ? 0 : -1}
                                    >
                                        <ButtonIcon {...spreadProps("backIconProps")} />
                                        <VisuallyHidden>{translate("back")}</VisuallyHidden>
                                    </Button>
                                    {closeOverlay && (
                                        <Button
                                            color={headerColor}
                                            onClick={closeOverlay}
                                            tabIndex={layer === 0 ? 0 : -1}
                                        >
                                            <ButtonIcon {...spreadProps("closeIconProps")} />
                                            <VisuallyHidden>{translate("close")}</VisuallyHidden>
                                        </Button>
                                    )}
                                </PanelRow>
                                <PanelMenuStyle
                                    css={cssOverrides?.menu}
                                    color={applyProp("bodyColor", "common.accent")}
                                >
                                    {menuItems ? (
                                        this.renderMenuItems(menuItems, 1, propBuilder)
                                    ) : (
                                        <>{this.props.children}</>
                                    )}
                                </PanelMenuStyle>
                            </PanelChildren>
                        </PanelMenuWrapper>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

/**
 * Menu composed of slide-in panels.
 */
// TODO ISC-11903
// export const PanelMenu = (props: PanelMenuProps) => (<PanelMenuCC {...props as PanelMenuPropsCompleted} />);

PanelMenu.defaultProps = {
    maxDepth: 3,
};

/** @component */
export default PanelMenu;
