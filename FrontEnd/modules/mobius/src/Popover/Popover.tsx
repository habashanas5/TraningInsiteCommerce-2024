import { ThemeTransitionDuration, ZIndex } from "@insite/mobius/globals/baseTheme";
import get from "@insite/mobius/utilities/get";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import { MobiusStyledComponentPropsWithRef } from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import styled, { withTheme } from "styled-components";

export type OverflowWrapperProps = MobiusStyledComponentPropsWithRef<
    "nav",
    { ref?: React.RefObject<HTMLElement> },
    InjectableCss & {
        _width?: string;
        _height?: string;
    }
>;

export type ContentBodyProps = MobiusStyledComponentPropsWithRef<
    "ul",
    { ref?: React.RefObject<HTMLUListElement> },
    InjectableCss & {
        _width?: number;
        _height?: string;
    }
>;

export type PositionStyle = {
    left?: number | string;
    right?: number | string;
    top?: number | string;
    position: "fixed" | "absolute";
    width?: string;
    height?: string;
};

export interface PopoverPresentationProps {
    /* Props passed to wrapper component. It governs the relational positioning of the popover.  */
    wrapperProps?: OverflowWrapperProps;
    /* Props passed into the component containing the content presented in the popover. */
    contentBodyProps?: Partial<ContentBodyProps>;
    /** Where the left or right external popover corner is located horizontally in relation to the trigger. */
    xPosition?: "before" | "start" | "middle" | "end" | "after";
    /** Where the top or bottom external popover corner is located vertically in relation to the trigger. */
    yPosition?: "top" | "bottom";
    /** Theme transition length for appearance. */
    transitionDuration?: keyof ThemeTransitionDuration;
    /** Theme zIndex value. */
    zIndexKey?: keyof ZIndex;
    /** Theme shadow depth value. */
    shadowDepth?: 1 | 2 | 3;
    /** Whether the popover should be toggled on trigger click or just opened. */
    toggle?: boolean;
    /** If the height of the element that is being positioned around is known, pass it in to avoid possible rendering bugs. */
    knownHeight?: number;
    /** Function to override standard position function. */
    positionFunction?: (element: React.RefObject<HTMLUListElement>) => PositionStyle;
    /** override the default max height */
    _height?: string;
}

export type PopoverProps = MobiusStyledComponentPropsWithRef<
    "ul",
    { ref?: React.RefObject<HTMLUListElement> },
    {
        /**
         * Unique id to be passed into the `popoverTrigger` element.
         * If not provided, a random id is assigned (an id is required for accessibility purposes).
         * */
        controlsId?: string;
        /** Trigger component for popover. */
        popoverTrigger: React.ReactElement;
        /** Components to be rendered alongside the trigger. */
        triggerSiblings?: React.ReactElement;
        /* Props passed into the component containing the content presented in the popover. */
        contentBodyProps: ContentBodyProps;
        /** Whether the menu initializes open or closed. */
        isOpen?: boolean;
        /** Function that will be called after the menu is closed. */
        onClose?: (event: Event) => void;
        /** Function that will be called after the menu is opened. */
        onOpen?: (event: Event) => void;
        /** Function that will be called after popover handleKeydown. */
        handleKeyDown?: (event: KeyboardEvent) => void;
        /** Function that will be called after popover handleClickOutside. */
        handleClickOutside?: (event: MouseEvent) => void;
        /** All refs that should be treated as being 'inside' the popover for key and click interaction. */
        insideRefs?: React.RefObject<any>[];
        /** Has a modal portal as a child, which means an outside click will happen yet should not unmount the popover */
        hasChildPortal?: boolean;
    } & PopoverPresentationProps
>;

const ESC_KEY = 27;

const OverflowWrapper = styled.nav<OverflowWrapperProps>`
    width: ${({ _width }) => _width || "100%"};
    height: ${({ _height }) => _height || "100%"};
    ${injectCss}
    position: relative; /* Do not override or modify. Vital for positioning of overlay. */
`;

type TransitionStateProperty = {
    transitionState: TransitionStatus;
};

type PopoverStyleProps = Pick<PopoverProps, "xPosition" | "yPosition" | "zIndexKey" | "shadowDepth"> &
    ContentBodyProps &
    TransitionStateProperty &
    InjectableCss & {
        transitionLength: keyof ThemeTransitionDuration;
        wrapperHeight: string;
        wrapperWidth: string;
    };

const PopoverStyle = styled.ul<PopoverStyleProps>`
    margin: 0;
    padding: 0;
    list-style: none;
    background: ${getColor("common.background")};
    z-index: ${({ theme, zIndexKey }) => get(theme, `zIndex.${zIndexKey}`)};
    box-shadow: ${({ theme, shadowDepth }) => get(theme, `shadows.${shadowDepth}`)};
    ${({ transitionState, _height }) => {
        switch (transitionState) {
            case "entering":
            case "exiting":
                return `max-height: 0;
            color: transparent;
            overflow: hidden;`;
            case "entered":
                return `max-height: ${typeof _height === "string" ? _height : "250px"};
            overflow: auto;`;
            case "exited":
                return "display: none";
            default:
                return "";
        }
    }}
    transition: all ease-in-out ${({ theme, transitionLength }) =>
        get(theme, `transition.duration.${transitionLength}`)}ms;
    width: ${getProp("_width")}px;
    ${injectCss}
`;

type State = {
    open: boolean;
    controlsId: string;
    positionStyle?: PositionStyle;
};

/**
 * An icon button that triggers an overflow menu of `Clickable` children.
 */
class Popover extends React.Component<PopoverProps, State> {
    static defaultProps = {
        zIndexKey: "popover",
        shadowDepth: 2,
        insideRefs: [],
        toggle: true,
        hasChildPortal: false,
    };

    element = React.createRef<HTMLUListElement>();

    constructor(props: PopoverProps) {
        super(props);
        this.state = {
            open: !!props.isOpen,
            controlsId: props.controlsId || uniqueId(),
            positionStyle: undefined,
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("mousedown", this.handleClickOutside);
        document.addEventListener("scroll", this.handleScroll, true);
        window.addEventListener("resize", this.handleResize, true);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("mousedown", this.handleClickOutside);
        document.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("resize", this.handleResize);
    }

    closePopover = (event: Event) => {
        this.setState({ open: false }, () => {
            // eslint-disable-next-line no-unused-expressions
            this.props.onClose && this.props.onClose(event);
        });
    };

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === ESC_KEY) {
            event.stopPropagation();
            this.closePopover(event);
        } else if (
            !this.isTargetInsideRef(event.target as Node) &&
            !this.isInsideChildPortalModal(event.target as Node)
        ) {
            this.closePopover(event);
            return;
        }
        typeof this.props.handleKeyDown === "function" && this.props.handleKeyDown(event);
    };

    handleClickOutside = (event: MouseEvent) => {
        if (
            this.state.open &&
            !this.isTargetInsideRef(event.target as Node) &&
            !this.isInsideChildPortalModal(event.target as Node) &&
            !this.isClickingScrollBar(event)
        ) {
            this.closePopover(event);
        }
        typeof this.props.handleClickOutside === "function" && this.props.handleClickOutside(event);
    };

    isClickingScrollBar = (event: MouseEvent) => {
        const box = document.getElementById("popupBox");
        if (box) {
            const x = event.clientX - box.getBoundingClientRect().left;
            if (x >= box.clientWidth && x <= box.clientWidth + 17) {
                return true;
            }
        }
        return false;
    };

    isInsideChildPortalModal = (target: Node) => {
        if (this.props.hasChildPortal) {
            let clickInsideModal = false;
            const modals = document.querySelectorAll('div[class^="Scrim"]');
            modals.forEach(el => {
                if (el.contains(target as Node)) {
                    clickInsideModal = true;
                }
            });
            return clickInsideModal;
        }
        return false;
    };

    handleScroll = () => {
        if (this.state.open) {
            this.setPopoverStyle();
        }
    };

    handleResize = () => {
        if (this.state.open) {
            this.setPopoverStyle();
        }
    };

    isTargetInsideRef = (target: Node) => {
        const { insideRefs } = this.props;

        const doesPopoverContainTarget = !!this.element.current?.contains(target);
        return (
            (insideRefs as []).length > 0 &&
            insideRefs?.reduce((acc: boolean, element: React.RefObject<HTMLElement>) => {
                if (acc) {
                    return acc;
                }
                if (element?.current?.contains(target)) {
                    return true;
                }
                return false;
            }, doesPopoverContainTarget)
        );
    };

    openPopover = (event: Event) => {
        this.setState({ open: true }, () => {
            this.setPopoverStyle();
            // eslint-disable-next-line no-unused-expressions
            this.props.onOpen && this.props.onOpen(event);
        });
    };

    togglePopover = (event: Event) => {
        if (this.state.open) {
            this.closePopover(event);
        } else {
            this.openPopover(event);
        }
    };

    setPopoverStyle() {
        let positionStyle: PositionStyle = {
            position: "absolute",
        };
        if (this.element.current) {
            if (this.props.positionFunction) {
                positionStyle = this.props.positionFunction(this.element);
            } else {
                const {
                    xPosition,
                    yPosition,
                    contentBodyProps: { _width },
                    knownHeight,
                } = this.props;
                const rect = this.element.current.getBoundingClientRect();
                positionStyle.position = "fixed";
                positionStyle.top = rect.top + (knownHeight ?? rect.height); // default to 'bottom'
                if (yPosition === "top") {
                    positionStyle.top = rect.top;
                }
                switch (xPosition) {
                    case "start":
                        positionStyle.left = rect.left;
                        break;
                    case "middle":
                        positionStyle.left = rect.left - ((_width || rect.width) - rect.width) / 2;
                        break;
                    case "after":
                        positionStyle.left = rect.left + rect.width;
                        break;
                    case "before":
                        positionStyle.left = rect.left - (_width || rect.width);
                        break;
                    default:
                        // default to 'end'
                        positionStyle.left = rect.right - (_width || rect.width);
                        break;
                }
                if (positionStyle.left && positionStyle.left < 0) {
                    positionStyle.left = 0;
                }
                if (positionStyle.right && positionStyle.right < 0) {
                    positionStyle.right = 0;
                }
            }
        }

        this.setState({ positionStyle });
    }

    render() {
        const {
            children,
            contentBodyProps,
            popoverTrigger,
            toggle,
            transitionDuration,
            triggerSiblings,
            wrapperProps,
            ...otherProps
        } = this.props;
        const { open, controlsId, positionStyle } = this.state;
        const transitionLength = get(otherProps.theme, `transition.duration.${transitionDuration}`) || 200;

        return (
            <OverflowWrapper ref={this.element} {...wrapperProps}>
                {React.cloneElement(popoverTrigger, {
                    onClick: toggle ? this.togglePopover : this.openPopover,
                    "aria-expanded": open,
                    "aria-controls": controlsId,
                })}
                {triggerSiblings}
                <Transition
                    mountOnEnter
                    unmountOnExit
                    in={open}
                    timeout={{
                        enter: transitionLength,
                        exit: transitionLength,
                    }}
                >
                    {state => (
                        <PopoverStyle
                            style={positionStyle}
                            wrapperHeight={wrapperProps?._height || "40px"}
                            wrapperWidth={wrapperProps?._width || "40px"}
                            transitionState={state}
                            id={controlsId}
                            transitionLength={transitionLength}
                            {...contentBodyProps}
                            {...omitMultiple(otherProps, ["onOpen", "onClose", "isOpen"])}
                        >
                            {children}
                        </PopoverStyle>
                    )}
                </Transition>
            </OverflowWrapper>
        );
    }
}

/** @component */
export default withTheme(Popover);
