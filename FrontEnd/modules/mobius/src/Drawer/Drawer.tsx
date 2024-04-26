import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import Overlay, { OverlayComponentProps, ScrimProps, Transition } from "@insite/mobius/Overlay";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import omitSingle from "@insite/mobius/utilities/omitSingle";
import VisuallyHidden from "@insite/mobius/VisuallyHidden/VisuallyHidden";
import * as React from "react";
import styled, { css, ThemeProps, withTheme } from "styled-components";

const SWIPE_CHANGE_UNCERTAINTY_THRESHOLD = 4;
const SNAP_OPEN_THRESHOLD = 0.2;
const EDGE_THRESHOLD = 10;

type Position = "left" | "top" | "right" | "bottom";

const isHorizontal = (position: Position) => position === "right" || position === "left";

export interface DrawerPresentationProps {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable
     */
    cssOverrides?: {
        scrim?: StyledProp<ScrimProps>;
        drawerContainer?: StyledProp<DrawerProps>;
        drawerBody?: StyledProp<DrawerProps>;
        drawerTitle?: StyledProp<DrawerProps>;
        drawerContent?: StyledProp<DrawerProps>;
        headlineTypography?: StyledProp<DrawerProps>;
        titleButton?: StyledProp<DrawerProps>;
    };
    /** Defines the depth of the Drawer, as the number of pixels. */
    size?: number;
    /** Defines the position of the drawer in the window. */
    position?: Position;
    /** Defines if the scrim is click through when isOpen is true. */
    enableClickThrough?: boolean;
    /** Custom transition styles for each drawer position
     * @themable */
    transitions?: {
        left: Partial<Transition>;
        top?: Partial<Transition>;
        right?: Partial<Transition>;
        bottom?: Partial<Transition>;
    };
    /** Props passed into the Drawer's headline Typography component if `headline` is a string.
     * Ignored if `headline` is a node.
     * @themable */
    headlineTypographyProps?: TypographyPresentationProps;
    /** Props passed into the Drawer's close button.
     * @themable */
    closeButtonProps?: ButtonPresentationProps;
    /** Props passed into the icon in the Drawer's close button.
     * @themable */
    closeButtonIconProps?: IconPresentationProps;
}

interface DrawerOwnProps {
    /** String or node to render as drawer headline. */
    headline?: string | React.ReactElement;
    /** Whether the drawer can be opened via a drag / swipe touch on screen from the edge of the screen where
     * the drawer originates as set by `position`. */
    draggable?: boolean;
}

export type DrawerProps = DrawerPresentationProps &
    DrawerOwnProps &
    Omit<
        OverlayComponentProps,
        "isCloseable" | "closeOnEsc" | "closeOnScrimClick" | "titleId" | "zIndexLevel" | "cssOverrides"
    > &
    ThemeProps<BaseTheme>;

type DrawerState = {
    isOpen?: boolean;
    receivedIsOpen?: boolean;
    maybeSwiping: boolean;
    isSwipedOpen: boolean;
    visible: boolean;
};

const DrawerTitle = styled.div<InjectableCss<any>>`
    background: ${getColor("common.backgroundContrast")};
    color: ${getContrastColor("common.backgroundContrast")};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    min-height: 50px;
    flex: none;
    ${injectCss}
`;

const DrawerContent = styled.div<InjectableCss<any>>`
    overflow-y: auto;
    ${injectCss}
`;

const drawerContainerStyles = (cssOverrides: any) => css`
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100%;
    transition: ${({ isClosing }: { isClosing: boolean }) => css`
        ${isClosing
            ? getProp("transition.overlayExitKeyframes")
            : getProp("transition.overlayEntryKeyframes")} ${getProp("transition.length")}ms
    `};
    ${cssOverrides}
`;

const drawerBodyStyles = (position: Position, cssOverrides: any, depth?: number, initialTranslate?: string) => {
    // default position is 'left' and these values reflect a left positioning.
    let width = `${depth}px`;
    let height = "100%";
    if (!isHorizontal(position)) {
        height = `${depth}px`;
        width = "100%";
    }
    return css`
        width: ${width};
        height: ${height};
        position: fixed;
        ${position}: 0;
        background: ${getColor("common.accent")};
        box-shadow: ${getProp("theme.shadows.3")};
        overflow-x: hidden;
        overflow-y: auto;
        flex: initial;
        display: flex;
        flex-direction: column;
        &:focus {
            outline: none;
        }
        transition: 300ms ease-in-out;
        ${initialTranslate}
        ${cssOverrides}
    `;
};

function calculateCurrentX(position: Position, event: TouchEvent) {
    return position === "right" ? document.body.offsetWidth - event.touches[0].pageX : event.touches[0].pageX;
}

function calculateCurrentY(position: Position, event: TouchEvent) {
    return position === "bottom" ? window.innerHeight - event.touches[0].clientY : event.touches[0].clientY;
}

/**
 * Drawer is an overlay that handles its own visibility, and manages app focus based on its visibility.
 */
Overlay.setAppElement("body");
class Drawer extends React.Component<DrawerProps, DrawerState> {
    static defaultProps = {
        size: 300,
        position: "left",
    };

    state = {
        isOpen: this.props.isOpen,
        receivedIsOpen: this.props.isOpen,
        maybeSwiping: false,
        isSwipedOpen: false,
        visible: !!this.props.isOpen,
    };

    contentRef?: any = undefined;
    scrimRef?: any = undefined;
    setContentRef = (ref: any) => {
        this.contentRef = ref;
    };
    setScrimRef = (ref: any) => {
        this.scrimRef = ref;
    };

    // because setState is async, it cannot be used for realtime function reference, for which we use the following.
    startX?: number;
    startY?: number;
    swipeInstance: {
        open?: boolean;
        dragDepth: number;
        isSwiping?: boolean;
    } = {
        dragDepth: 0,
        isSwiping: undefined,
    };

    componentDidMount() {
        if (this.props.draggable) {
            window.addEventListener("touchstart", this.tap);
            window.addEventListener("touchmove", this.drag, { passive: false });
            window.addEventListener("touchend", this.release);
        }
    }

    componentWillUnmount() {
        window.removeEventListener("touchstart", this.tap);
        window.removeEventListener("touchmove", this.drag);
        window.removeEventListener("touchend", this.release);
    }

    static getDerivedStateFromProps(nextProps: any, prevState: DrawerState) {
        const nextState: DrawerState = prevState;
        if (prevState.receivedIsOpen !== nextProps.isOpen) {
            nextState.receivedIsOpen = nextProps.isOpen;
            nextState.isOpen = nextProps.isOpen;
        }
        return nextState;
    }

    componentDidUpdate() {
        if (this.props.draggable) {
            if (this.state.isOpen && !this.state.visible) {
                this.openPersistedDrawer();
            }
            if (!this.state.isOpen && this.state.visible) {
                this.closePersistedDrawer();
            }
        }
    }

    openPersistedDrawer = (event?: React.SyntheticEvent, swipedOpen?: boolean) => {
        this.swipeInstance.open = true;
        this.swipeInstance.dragDepth = 0;
        this.setPosition(0);
        this.swipeInstance.isSwiping = false;
        this.setState({ maybeSwiping: false, isSwipedOpen: swipedOpen || false, visible: true, isOpen: true });
        event && this.props.handleOpen?.(event);
    };

    closePersistedDrawer = (event?: React.SyntheticEvent) => {
        this.swipeInstance.open = false;
        this.swipeInstance.dragDepth = this.props.size!;
        this.setPosition(this.props.size!, { mode: "closing" });
        this.swipeInstance.isSwiping = false;
        this.setState({ maybeSwiping: false, isSwipedOpen: false, receivedIsOpen: false, visible: false });
        this.startX = undefined;
        this.startY = undefined;
        event && this.props.handleClose?.(event);
    };

    buildTransform = (translate: number) => {
        const { position = "left" } = this.props;
        let translateValue = Math.round(translate);
        const rightOrBottom = position === "right" || position === "bottom";
        if (translate < 1) {
            translateValue = 0;
        }
        if (translate > this.props.size! && !rightOrBottom) {
            translateValue = this.props.size!;
        }
        const rtlTranslateMultiplier = rightOrBottom ? 1 : -1;
        return isHorizontal(position)
            ? `translate(${rtlTranslateMultiplier * translateValue}px, 0)`
            : `translate(0, ${rtlTranslateMultiplier * translateValue}px)`;
    };

    buildInitialTransform = () => {
        const { position } = this.props;
        if (position === "left" || position === "top") {
            return this.buildTransform(this.props.size!);
        }
        if (position === "right") {
            return this.buildTransform(window.innerWidth + this.props.size!);
        }
        if (position === "bottom") {
            return this.buildTransform(window.innerHeight + this.props.size!);
        }
    };

    buildScrimClickThrough = () => {
        const { enableClickThrough, size, position = "left" } = this.props;
        const isVertical = !isHorizontal(position);

        if (enableClickThrough) {
            if (isVertical) {
                const height = `height: ${size}px`;
                if (position === "top") {
                    return `${height}; bottom: initial;`;
                }
                return `${height}; top: initial;`;
            }
            const width = `width: ${size}px`;
            if (position === "left") {
                return `${width}; right: initial;`;
            }
            return `${width}; left: initial;`;
        }
        return "";
    };

    setPosition = (translate: number, options: { mode?: "closing" } = {}) => {
        const { position = "left" } = this.props;
        const { mode = null } = options;

        const isVertical = !isHorizontal(position);

        const drawerStyle = this.contentRef?.current?.style;
        const scrimStyle = this.scrimRef?.current?.style;
        if (drawerStyle && scrimStyle) {
            if (mode === "closing") {
                drawerStyle.webkitTransform = "";
                drawerStyle.transform = "";
                setTimeout(() => {
                    if (isVertical) {
                        scrimStyle.height = "";
                    } else {
                        scrimStyle.width = "";
                    }
                }, 300);
            } else {
                const transform = this.buildTransform(translate);
                drawerStyle.webkitTransform = transform;
                drawerStyle.transform = transform;
                if (isVertical) {
                    scrimStyle.height = "100%";
                } else {
                    scrimStyle.width = "100%";
                }
            }
        }
    };

    tap = (event: TouchEvent) => {
        const { position = "left" } = this.props;
        const currentX = calculateCurrentX(position, event);
        const currentY = calculateCurrentY(position, event);

        const start = isHorizontal(position) ? currentX : currentY;
        const currentDepth = start - this.props.size!;
        // if the start is a smaller distance from the edge than the threshold (set to 20), the touch is a possible drawer open swiping event
        const possibleOpenSwipeBegin = start < EDGE_THRESHOLD;
        // if the start is a within the threshold of the edge of the drawer, the touch is a possible drawer close swiping event
        const possibleCloseSwipeBegin =
            this.swipeInstance.open &&
            start > this.props.size! - EDGE_THRESHOLD &&
            start < this.props.size! + EDGE_THRESHOLD;
        if (possibleOpenSwipeBegin || possibleCloseSwipeBegin) {
            this.swipeInstance.dragDepth = currentDepth;
            // if opening, translation argument is negative current depth, if closing, translation argument is current depth
            this.setPosition(possibleOpenSwipeBegin ? -currentDepth : currentDepth);
            this.startX = currentX;
            this.startY = currentY;
            this.setState({ maybeSwiping: true });
        }
    };

    drag = (event: TouchEvent) => {
        const { position = "left", size } = this.props;
        const currentX = calculateCurrentX(position, event);
        const currentY = calculateCurrentY(position, event);
        // if we may be swiping but have not yet set isSwiping, we will check if we're swiping.
        if (this.state.maybeSwiping && !this.swipeInstance.isSwiping) {
            const dx = Math.abs(currentX - this.startX!);
            const dy = Math.abs(currentY - this.startY!);
            const isSwiping = isHorizontal(position)
                ? dx > dy && dx > SWIPE_CHANGE_UNCERTAINTY_THRESHOLD
                : dy > dx && dy > SWIPE_CHANGE_UNCERTAINTY_THRESHOLD;
            if (isSwiping) {
                this.swipeInstance.isSwiping = isSwiping;
            } else {
                // if it is not a swipe event, close the drawer.
                this.closePersistedDrawer(event as unknown as React.SyntheticEvent);
            }
        }
        if (this.swipeInstance.isSwiping) {
            // set the start position to currentY if it's a vertical drag, currentX if it's a horizontal drag
            const current = isHorizontal(position) ? currentX : currentY;
            this.swipeInstance.dragDepth = current < size! ? current - size! : 0;
            this.setPosition(current < size! ? -(current - size!) : 0);
        }
    };

    release = (event: TouchEvent) => {
        if (this.state.maybeSwiping && this.swipeInstance.isSwiping) {
            if (this.swipeInstance.dragDepth > -(this.props.size! * SNAP_OPEN_THRESHOLD)) {
                this.openPersistedDrawer(event as unknown as React.SyntheticEvent, true);
            } else {
                this.closePersistedDrawer(event as unknown as React.SyntheticEvent);
            }
        }
    };

    render() {
        if (typeof window === "undefined") {
            return null;
        }
        const {
            children,
            draggable,
            size,
            enableClickThrough,
            headline,
            position = "left",
            theme,
            ...otherProps
        } = this.props;

        const { receivedIsOpen, isSwipedOpen, maybeSwiping } = this.state;

        const { spreadProps } = applyPropBuilder(this.props, { component: "drawer" });
        const cssOverrides = spreadProps("cssOverrides");
        const transitions = spreadProps("transitions");

        let headlineComponent: React.ReactElement = <div />;
        if (typeof headline === "string") {
            headlineComponent = (
                <Typography
                    variant="h4"
                    {...spreadProps("headlineTypographyProps")}
                    css={cssOverrides?.headlineTypography}
                >
                    {headline}
                </Typography>
            );
        } else if (headline) {
            headlineComponent = headline;
        }

        return (
            <Overlay
                {...theme.drawer.defaultProps}
                role={alert ? "alertdialog" : "dialog"}
                transition={{ ...transitions.left, ...transitions[position] }}
                titleId="drawerTitle"
                isCloseable={true}
                zIndexLevel="drawer"
                cssOverrides={{
                    ...cssOverrides,
                    scrim: css`
                        ${this.buildScrimClickThrough()}
                        ${cssOverrides.scrim} ${draggable && (isHorizontal(position) ? "width: 0;" : "height: 0;")}
                    `,
                    contentContainer: drawerContainerStyles(cssOverrides.drawerContainer),
                    contentBody: drawerBodyStyles(
                        position,
                        cssOverrides.drawerBody,
                        size,
                        draggable
                            ? `transform: ${this.buildInitialTransform()}; webkit-transform: ${this.buildInitialTransform()};`
                            : undefined,
                    ),
                }}
                {...omitSingle(otherProps, "cssOverrides")}
                handleOpen={draggable ? this.openPersistedDrawer : this.props.handleOpen}
                handleClose={draggable ? this.closePersistedDrawer : this.props.handleClose}
                isOpen={receivedIsOpen || isSwipedOpen}
                persisted={!!draggable}
                setContentRef={this.setContentRef}
                setScrimRef={this.setScrimRef}
                enableClickThrough={enableClickThrough}
            >
                {draggable && !maybeSwiping && !isSwipedOpen && !receivedIsOpen ? null : (
                    <>
                        <DrawerTitle id="drawerTitle" css={cssOverrides?.drawerTitle}>
                            {headlineComponent}
                            <Button
                                color="common.backgroundContrast"
                                size={36}
                                css={cssOverrides?.titleButton}
                                {...spreadProps("closeButtonProps")}
                                onClick={draggable ? this.closePersistedDrawer : this.props.handleClose}
                                aria-labelledby="close-drawer"
                            >
                                <ButtonIcon {...spreadProps("closeButtonIconProps")} />
                                <VisuallyHidden id="close-drawer">{theme.translate("Close Drawer")}</VisuallyHidden>
                            </Button>
                        </DrawerTitle>
                        <DrawerContent css={cssOverrides?.drawerContent}>{children}</DrawerContent>
                    </>
                )}
            </Overlay>
        );
    }
}

/** @component */
export default withTheme(Drawer);
