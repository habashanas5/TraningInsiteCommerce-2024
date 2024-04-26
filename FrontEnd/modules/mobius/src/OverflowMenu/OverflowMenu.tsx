import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme, ThemeTransitionDuration } from "@insite/mobius/globals/baseTheme";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import Popover, { ContentBodyProps, PopoverProps } from "@insite/mobius/Popover";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitSingle from "@insite/mobius/utilities/omitSingle";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export interface OverflowMenuPresentationProps {
    /** An object containing props to be passed down to trigger button component.
     * @themable */
    buttonProps?: ButtonPresentationProps;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<OverflowMenuProps>;
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable */
    cssOverrides?: {
        wrapper?: StyledProp<OverflowMenuProps>;
        menu?: StyledProp<OverflowMenuProps>;
        menuItem?: StyledProp<OverflowMenuProps>;
    };
    /** Props to be passed into the trigger Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Theme transition length for appearance.
     * @themable */
    transitionDuration?: keyof ThemeTransitionDuration;
    /** override the default max height */
    maxHeight?: string;
    /** Boolean value indicating that there is a portal modal inside the menu, which affects popover click outside functionality */
    hasChildPortal?: boolean;
}

export type OverflowMenuComponentProps = MobiusStyledComponentProps<
    "ul",
    Pick<PopoverProps, "isOpen" | "onClose" | "onOpen"> & {
        /** Where the menu origin is located in relation to the trigger button. */
        position?: "start" | "middle" | "end";
        /** Where the top or bottom external popover corner is located vertically in relation to the trigger. */
        yPosition?: "top" | "bottom";
        /**
         * Unique id to be passed into the popover element.
         * If not provided, a random id is assigned (an id is required for accessibility purposes).
         */
        uid?: string;
        /** Used for targeting with an automated test. */
        "data-test-selector"?: string;
    }
>;

export type OverflowMenuProps = OverflowMenuComponentProps & OverflowMenuPresentationProps;

const OverflowButton = styled(Button)`
    z-index: ${props => getProp("theme.zIndex.menu", 0)(props) - 1};
    width: 40px;
    padding: 0;
`;

const OverflowMenuItem = styled.li`
    span,
    button {
        width: 100%;
    }
    span,
    button,
    a {
        display: block;
        padding: 10px 15px;
        &:hover {
            background: ${getColor("common.border")};
        }
        &:active,
        &:focus {
            background: ${getColor("primary.main")};
            color: ${getColor("primary.contrast")};
        }
        ${injectCss}
    }
` as any; // The returned type doesn't have the expected "css" property.

type Props = OverflowMenuProps & ThemeProps<BaseTheme> & { isOpen?: boolean };
type State = {
    controlsId: string;
};

/**
 * An icon button that triggers an overflow menu of `Clickable` children.
 */
class OverflowMenu extends React.Component<Props, State> {
    element = React.createRef<HTMLElement>();
    popover = React.createRef<HTMLUListElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            controlsId: this.props.uid || uniqueId(),
        };
    }

    render() {
        const {
            children,
            isOpen,
            onClose,
            onOpen,
            position,
            transitionDuration,
            yPosition,
            mergeCss,
            maxHeight,
            hasChildPortal,
            ...otherProps
        } = this.props;
        const { controlsId } = this.state;
        const { spreadProps, applyStyledProp } = applyPropBuilder(otherProps, { component: "overflowMenu" });
        const cssOverrides = spreadProps(
            "cssOverrides" as any,
        ) as Required<OverflowMenuPresentationProps>["cssOverrides"];
        const resolvedMergeCss = mergeCss ?? otherProps?.theme?.overflowMenu?.defaultProps?.mergeCss;
        const iconProps = spreadProps("iconProps" as any);
        const menuItems: JSX.Element[] = React.Children.map(children, (menuChild, index) => {
            const newProps: { onClick?: (event: Event) => void } = {};
            if (typeof (menuChild as React.ReactElement)?.props?.onClick === "function") {
                newProps.onClick = event => {
                    (menuChild as React.ReactElement)?.props?.onClick(event);
                    this.popover.current && (this.popover.current! as any).closePopover();
                };
            }
            if (!menuChild) {
                return <></>;
            }
            return (
                // eslint-disable-next-line react/no-array-index-key
                <OverflowMenuItem key={index} css={applyStyledProp(["cssOverrides", "menuItem"], resolvedMergeCss)}>
                    {React.cloneElement(menuChild as React.ReactElement, newProps)}
                </OverflowMenuItem>
            );
        });

        const popoverBodyProps: ContentBodyProps = {
            uid: controlsId,
            _width: 191,
            ...omitSingle(otherProps, "cssOverrides"),
            css: applyStyledProp(["cssOverrides", "menu"], resolvedMergeCss),
        };
        const popoverTrigger = (
            <OverflowButton
                {...spreadProps("buttonProps" as any)}
                type="button"
                data-test-selector={otherProps["data-test-selector"] ?? "popoverOverflowTrigger"}
            >
                {iconProps.color ? <IconMemo {...iconProps} /> : <ButtonIcon {...iconProps} />}
                <VisuallyHidden>{otherProps.theme.translate("Menu")}</VisuallyHidden>
            </OverflowButton>
        );
        return (
            <Popover
                ref={this.popover}
                contentBodyProps={popoverBodyProps}
                wrapperProps={{
                    css: applyStyledProp(["cssOverrides", "wrapper"], resolvedMergeCss),
                    _width: "40px",
                    _height: "40px",
                }}
                popoverTrigger={popoverTrigger}
                onClose={onClose}
                onOpen={onOpen}
                zIndexKey="menu"
                title={otherProps.theme.translate("Popover Menu")}
                isOpen={isOpen}
                insideRefs={[this.element]}
                transitionDuration={transitionDuration}
                xPosition={position}
                yPosition={yPosition}
                _height={maxHeight}
                hasChildPortal={hasChildPortal}
            >
                {menuItems}
            </Popover>
        );
    }
}

/** @component */
export default withTheme(OverflowMenu);
