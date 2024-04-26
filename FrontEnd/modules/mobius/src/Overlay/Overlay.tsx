/** Note: modal based on logic from `react-modal`. */
import { ZIndex } from "@insite/mobius/globals/baseTheme";
import * as ariaAppHider from "@insite/mobius/Overlay/helpers/ariaAppHider";
import OverlayManager from "@insite/mobius/Overlay/OverlayManager";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import { canUseDOM } from "exenv";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Keyframes } from "styled-components";

export interface Transition {
    enabled: boolean;
    length: number;
    overlayEntryKeyframes: Keyframes;
    overlayExitKeyframes: Keyframes;
    scrimEntryKeyframes: Keyframes;
    scrimExitKeyframes: Keyframes;
}

export interface OverlayOwnProps {
    /** Properties governing the transition of the overlay.
     * @themable */
    transition: Transition;
    /* Set this to properly hide your application from assistive screen readers and other assistive technologies while the modal is open. */
    appElement?: HTMLElement | {};
    /* String indicating the role of the modal, allowing the "dialog" role to be applied if desired. Defaults to "dialog". */
    role: string | null;
    /* Function accepting the ref for the content. */
    setContentRef?: (ref: React.Ref<HTMLDivElement>) => void;
    /* Function accepting the ref for the scrim. */
    setScrimRef?: (ref: React.Ref<HTMLDivElement>) => void;
}

export type OverlayComponentProps = MobiusStyledComponentProps<
    "div",
    {
        /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults. */
        cssOverrides?: {
            scrim?: StyledProp;
            contentContainer?: StyledProp;
            contentBody?: StyledProp;
        };
        /** Children of the overlay component */
        children?: React.ReactNode;
        /** Control whether a press of the escape key will close the overlay. */
        closeOnEsc?: boolean;
        /** Control whether clicking on the scrim behind the content will close the overlay. */
        closeOnScrimClick?: boolean;
        /** Text that will be used for the aria label describing the overlay. */
        contentLabel?: string;
        /** Handler for the open event */
        handleOpen?: React.EventHandler<React.SyntheticEvent>;
        /** Handler for the close event */
        handleClose?: React.EventHandler<React.SyntheticEvent>;
        /**
         * Governs whether the overlay can be closed, if false, the props `closeOnScrimClick` and `closeOnEsc` will be
         * set to false. Both props can also be managed independently.
         * */
        isCloseable?: boolean;
        /** Represents the current open (or closed) state of the overlay. */
        isOpen?: boolean;
        /** A persisted overlay is one that is always present in the DOM. */
        persisted?: boolean;
        /** Id that will be used to describe the content of the overlay. */
        titleId: number | string;
        /** Id that will be used to describe the content of the overlay. */
        zIndexLevel: keyof ZIndex;
        /** Defines if the scrim is click through when overlay is open. */
        enableClickThrough?: boolean;
        /** Function that will be executed after the overlay is opened, can be used to interact with data. */
        onAfterOpen?(event: React.SyntheticEvent | null): void;
        /* Function that will be run after the overlay has closed. */
        onAfterClose?(event: React.SyntheticEvent | null): void;
    }
>;

export type OverlayProps = OverlayComponentProps & OverlayOwnProps;

const exitDuration = (animationLength: number) => animationLength - 20;

type State = {
    /** When true, the environment is client-side and the initial hydration has been completed. */
    readyForPortal?: true;
};

class Overlay extends React.Component<OverlayProps, State> {
    private node?: HTMLElement;
    private manager?: OverlayManager | null;

    constructor(props: OverlayProps) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        persisted: false,
    };

    static setAppElement(element: string): void {
        ariaAppHider.setElement(element);
    }

    componentDidMount() {
        // `componentDidMount` never runs in server-side rendering, because there is no DOM to mount.
        // In client-side rendering, `setState` causes the overlay to re-render.
        // This is a performance win because the server-side-rendered DOM will match the initial client-side hydrated DOM.
        this.setState({ readyForPortal: true });
    }

    componentWillUnmount() {
        if (!canUseDOM || !this.node || !this.manager) {
            return;
        }

        const { state } = this.manager;
        const now = Date.now();
        const closesAt =
            state.isOpen &&
            this.props.transition.length &&
            (state.closesAt || now + exitDuration(this.props.transition.length));

        if (closesAt && !state.beforeClose) {
            this.manager.closeWithTimeout(null);
        }
    }

    managerRef = (ref: OverlayManager | null) => {
        this.manager = ref;
    };

    render() {
        if (!this.state.readyForPortal) {
            // ReactDOM.hydrate doesn't have a mechanism for handling the extra root node created by ReactDOM.createPortal.
            // So, don't even try.
            // `readyForPortal` becomes `true` after the component is mounted, preventing the hydration DOM mismatch.
            return null;
        }

        if (!this.node) {
            this.node = document.createElement("div");
        }
        const closeableProps = {
            closeOnScrimClick: this.props.isCloseable,
            closeOnEsc: this.props.isCloseable,
        };

        return ReactDOM.createPortal(
            <OverlayManager
                ref={this.managerRef as any}
                exitDuration={exitDuration(this.props.transition.length)}
                {...closeableProps}
                {...this.props}
            />,
            document.body,
        );
    }
}

export default Overlay;
