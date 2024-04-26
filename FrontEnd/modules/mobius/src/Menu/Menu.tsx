import Clickable, { ClickablePresentationProps, ClickableProps } from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import isMobile from "ismobilejs";
import React from "react";
import styled, { ThemeConsumer, ThemeProps, withTheme } from "styled-components";

export interface MappedLink {
    // expanded from content-library/src/widgets/header/MainNavigation.tsx
    title: string;
    url?: string;
    type?: string;
    clickableProps?: ClickableProps;
    openInNewWindow?: boolean;
    numberOfColumns?: number;
    maxDepth?: number;
    childrenType?: "MegaMenu" | "CascadingMenu";
    children?: MappedLink[];
    excludeFromNavigation?: boolean;
}

export interface MenuPresentationProps {
    /** CSS string or styled-components function to be injected into this component
     * @themable */
    cssOverrides?: {
        wrapper?: StyledProp<MenuPresentationProps>;
        menu?: StyledProp<MenuPresentationProps>;
        menuItem?: StyledProp<MenuPresentationProps>;
    };
    /** Props passed to the menu items.
     * @themable */
    menuItemTypographyProps?: TypographyPresentationProps;
    /** Props passed to the menu item Clickable.
     * @themable */
    menuItemClickableProps?: ClickablePresentationProps;
    /** Props to be passed to the right chevron arrow for menu items with children.
     * @themable */
    moreIconProps?: IconPresentationProps;
}

type MenuComponentProps = MobiusStyledComponentProps<
    "nav",
    {
        /** Aria attributes used internally require an `id`. If not provided, a random id is generated. */
        descriptionId?: string;
        /** Maximum number of menus that will appear through submenu cascading. */
        maxDepth?: number;
        /** The nested child structure that will be rendered by the menu. */
        menuItems: MappedLink[];
        /** The element that triggers the menu. */
        menuTrigger: React.ReactElement;
        /** Width of the menu and submenus in pixels. */
        width?: number;
        /** Allows forcing the state of this menu to be open */
        isOpen?: true;
        /** Session boolean value that decides whether to show Change Customer Link */
        displayChangeCustomerLink?: boolean;
    }
>;

/** MenuComponentProps with defaulted properties now listed as not-optional, plus theme. */
export type MenuProps = MenuComponentProps & MenuPresentationProps & ThemeProps<BaseTheme>;

type MenuStyleProps = ThemeProps<BaseTheme> &
    InjectableCss & {
        width?: number;
    };

// eslint-disable-next-line no-unexpected-multiline
const MenuStyle = styled.ul<MenuStyleProps>`
    background: ${getColor("common.background")};
    z-index: ${getProp("theme.zIndex.menu")};
    box-shadow: ${getProp("theme.shadows.2")};
    width: ${getProp("width", 175)}px;
    list-style: none;
    position: absolute;
    margin: 0;
    padding: 0;
    display: none;
    ${injectCss}
`;

type MenuWrapperProps = { canBeOpen: boolean; isOpen?: true } & InjectableCss;

const MenuWrapper = styled.nav<MenuWrapperProps>`
    position: relative; /* stylelint-disable */
    ${({ isOpen }) =>
        isOpen &&
        `& > ${MenuStyle} {
                display: block;
            }
    `}
    ${({ canBeOpen }) =>
        canBeOpen &&
        `
    &:focus-within > ${MenuStyle}  /* stylelint-enable */ {
        display: block;
    }
    .trigger:focus + ${MenuStyle},
    &:hover > ${MenuStyle},
    &.focus-within > ${MenuStyle} {
        display: block;
    }`}
    ${injectCss}
`;

// eslint-disable-next-line no-unexpected-multiline
type MenuItemStyleProps = ThemeProps<BaseTheme> &
    InjectableCss & {
        width?: number;
        onClick: () => void;
    };

const MenuItemStyle = styled.li<MenuItemStyleProps>`
    position: relative;
    &:focus-within > ${MenuStyle} {
        display: block;
        left: ${getProp("width", 175)}px;
        top: 0;
    }
    &:focus > ${MenuStyle}, &:hover > ${MenuStyle}, &.focus-within > ${MenuStyle} {
        display: block;
        left: ${getProp("width", 175)}px;
        top: 0;
    }
    a {
        width: 100%;
        min-height: 42px;
        justify-content: space-between;
        &:hover {
            background: ${getColor("common.border")};
        }
    }
    ${injectCss}
`;

const MenuItemText = styled(Typography as any)<{ hasChildren?: boolean }>`
    padding: 10px 15px 10px 20px;
    color: ${getColor("text.main")};
    display: block;
    box-sizing: border-box;
    ${({ hasChildren }: { hasChildren?: boolean }) => hasChildren && "width: calc(100% - 24px);"}
`;

const trigger = React.createRef<HTMLElement>();

interface MenuState {
    canBeOpen: boolean;
    isMobile: boolean;
    shouldRender: boolean;
}

/**
 * A cascading menu that renders a defined number of sub-menus.
 */
class Menu extends React.Component<MenuProps, MenuState> {
    static defaultProps: Partial<MenuProps> = {
        maxDepth: 3,
        width: 175,
    };

    state: MenuState = {
        canBeOpen: true,
        isMobile: false,
        shouldRender: true,
    };

    componentDidMount() {
        this.setState({
            isMobile: isMobile().any,
        });

        window.addEventListener("resize", () => {
            window.setTimeout(() => {
                this.setState({
                    isMobile: isMobile().any,
                });
            }, 50);
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => {
            window.setTimeout(() => {
                this.setState({
                    isMobile: isMobile().any,
                });
            }, 50);
        });
    }

    closeMenu = () => {
        // On Mobile, the below logic
        // where we switch the canBeOpen state from false to true
        // causes the mobile experience to not function well
        // due to Mobile not doing hover functionality

        // Solution:
        // I prevent the boolean toggle when we detect mobile

        this.setState({ canBeOpen: this.state.isMobile }, () =>
            setTimeout(() => {
                // The make the all browsers act the same on item click.
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                this.setState({ canBeOpen: true });
            }, 100),
        );
    };

    closeMenuWithoutChildren = (hasMenuChildren?: boolean) => {
        // This is for high resolution mobile users.
        // So that the menu closes on nav items without children
        if (!hasMenuChildren) {
            this.setState(
                {
                    shouldRender: false,
                },
                () => {
                    this.setState({ shouldRender: true });
                },
            );
        }
    };

    render() {
        return (
            <ThemeConsumer>
                {theme => {
                    const { menuItems, menuTrigger, isOpen, ...otherProps } = this.props;
                    const { applyProp, spreadProps } = applyPropBuilder(
                        { ...otherProps, theme },
                        { component: "menu" },
                    );

                    const renderMenuItems = (childMenuItems: MappedLink[], currentDepth: number) => {
                        const cssOverrides = spreadProps("cssOverrides");
                        const maxDepth = otherProps.maxDepth || 3;
                        return (
                            <MenuStyle width={otherProps.width} css={cssOverrides?.menu}>
                                {childMenuItems
                                    ?.filter(item => !item.excludeFromNavigation)
                                    .map((item, index) => {
                                        const hasChildren =
                                            item.children?.some(o => !o.excludeFromNavigation) &&
                                            currentDepth < maxDepth;

                                        if (
                                            (item.type === "ChangeCustomerPage" &&
                                                !this.props.displayChangeCustomerLink) ||
                                            !this.state.shouldRender
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <MenuItemStyle
                                                width={otherProps.width}
                                                css={cssOverrides?.menuItem}
                                                key={`${item.title}_${index}`}
                                                data-test-selector="menuItem"
                                                onClick={() => {
                                                    this.closeMenuWithoutChildren(hasChildren);
                                                }}
                                            >
                                                <Clickable
                                                    href={item.url}
                                                    onClick={this.closeMenu}
                                                    {...applyProp("menuItemClickableProps")}
                                                >
                                                    <MenuItemText
                                                        hasChildren={hasChildren}
                                                        {...applyProp("menuItemTypographyProps")}
                                                    >
                                                        {item.title}
                                                    </MenuItemText>
                                                    {hasChildren && <IconMemo {...applyProp("moreIconProps")} />}
                                                </Clickable>
                                                {hasChildren
                                                    ? renderMenuItems(item!.children!, currentDepth + 1)
                                                    : null}
                                            </MenuItemStyle>
                                        );
                                    })}
                            </MenuStyle>
                        );
                    };

                    const cssOverrides = spreadProps("cssOverrides");
                    const descriptionId = otherProps.descriptionId || uniqueId();
                    return (
                        <>
                            <MenuWrapper
                                canBeOpen={this.state.canBeOpen}
                                isOpen={isOpen}
                                css={cssOverrides?.wrapper}
                                {...{ "aria-labelledby": descriptionId }}
                                {...otherProps}
                            >
                                {React.cloneElement(menuTrigger, { id: descriptionId, className: "trigger" })}
                                {renderMenuItems(menuItems, 1)}
                            </MenuWrapper>
                            <span ref={trigger} tabIndex={-1} />
                        </>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

/** @component */
export default withTheme(Menu);

export { MenuItemText };
