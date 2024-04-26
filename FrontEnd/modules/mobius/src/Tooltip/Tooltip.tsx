import Clickable from "@insite/mobius/Clickable";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import get from "@insite/mobius/utilities/get";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export interface TooltipPresentationProps {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable */
    cssOverrides?: {
        tooltipClickable?: StyledProp<TooltipProps>;
        tooltipBody?: StyledProp<TooltipProps>;
        tooltipContainer?: StyledProp<TooltipProps>;
        tooltipWrapper?: StyledProp<TooltipProps>;
    };
    /** Props to be passed into the trigger Icon component if no triggerComponent is provided.
     * @themable */
    iconProps?: IconPresentationProps;
    /** Props that will be passed to the typography component rendered in the tooltip.
     * @themable */
    typographyProps?: TypographyPresentationProps;
}

export type TooltipComponentProps = MobiusStyledComponentProps<
    "span",
    {
        /** Component to be used as the trigger to optionally replace the default trigger icon. */
        triggerComponent?: React.ReactElement;
        /** The text that will appear in the tooltip */
        text: string;
        /** Function called on tooltip open */
        onOpen?: React.EventHandler<React.SyntheticEvent>;
        /** Function called on tooltip close */
        onClose?: React.EventHandler<React.SyntheticEvent>;
        /** Text to be used to describe the tooltip trigger. Used for screenreaders. Defaults to "more info" */
        triggerAltText?: string;
    }
>;

type TooltipProps = TooltipComponentProps & TooltipPresentationProps;

const ESC_KEY = 27;
const ENTER_KEY = 13;

const TooltipContainer = styled.div<InjectableCss<any>>`
    width: 220px;
    position: absolute;
    display: inline-flex;
    justify-content: center;
    bottom: 100%;
    left: 50%;
    margin-left: -110px;
    margin-bottom: 11px;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -6px;
        border-width: 6px;
        border-style: solid;
        border-color: ${getColor("common.backgroundContrast")} transparent transparent transparent;
    }
    ${injectCss}
`;

const TooltipBody = styled.div<InjectableCss<any>>`
    display: inline;
    padding: 10px;
    text-align: center;
    min-width: 100px;
    border-radius: 5px;
    background: ${getColor("common.backgroundContrast")};
    color: ${getColor("common.background")};
    ${injectCss}
`;

const TooltipWrapper = styled.div<InjectableCss<any>>`
    position: relative;
    display: inline-block;
    ${injectCss}
`;

// necessary to use theme clickable styles and instance clickable overrides
const TooltipClickable = styled(Clickable)`
    padding: 0 1px 3px;
    ${injectCss}
`;

/**
 * Component that provides supplementatal information on click or enter.
 */
class Tooltip extends React.Component<TooltipProps> {
    state = { visible: false };

    element = React.createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClick);
    }

    openTooltip = (event: React.SyntheticEvent) => {
        event.preventDefault();
        /** For accssibility reasons, the tooltip can only be closed by blur or escape, if the tooltip is open,
         * it will close and then re-open after a discrete interval. */
        if (this.state.visible) {
            this.closeTooltip(event);
            setTimeout(() => {
                this.setState({ visible: true });
            }, 100);
        } else {
            this.setState({ visible: true });
            // eslint-disable-next-line no-unused-expressions
            this.props.onOpen && this.props.onOpen(event);
        }
    };

    closeTooltip = (event: React.SyntheticEvent) => {
        if (this.state.visible) {
            this.setState({ visible: false });
            // eslint-disable-next-line no-unused-expressions
            this.props.onClose && this.props.onClose(event);
        }
        // eslint-disable-next-line no-useless-return
        return;
    };

    handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode === ESC_KEY) {
            event.stopPropagation();
            this.closeTooltip(event);
        }
        if (event.keyCode === ENTER_KEY) {
            event.stopPropagation();
            this.openTooltip(event);
        }
    };

    handleClick = (event: MouseEvent) => {
        if (this.state.visible && !this.element.current?.contains(event?.target as Node)) {
            this.closeTooltip(event as any);
        }
    };

    render() {
        const { text, triggerComponent, triggerAltText, iconProps, ...otherProps } = this.props;
        if (!text || text.length === 0) {
            return null;
        }
        const { spreadProps } = applyPropBuilder(this.props, { component: "tooltip" });
        const cssOverrides = spreadProps("cssOverrides");
        let trigger;

        if (triggerComponent) {
            /** remove tabability because of `Clickable` wrapper to remove redundant tab if the triggerComponent
             * is a tabbable component. */
            trigger = React.cloneElement(triggerComponent, { tabIndex: -1 });
        } else {
            trigger = <IconMemo {...spreadProps("iconProps")} />;
        }

        const toolTipComponent = (
            <TooltipContainer data-id="tooltipContainer" css={get(cssOverrides, "tooltipContainer")} {...otherProps}>
                <TooltipBody data-id="tooltipBody" css={get(cssOverrides, "tooltipBody")}>
                    <Typography as="p" {...spreadProps("typographyProps")}>
                        {text}
                    </Typography>
                </TooltipBody>
            </TooltipContainer>
        );

        return (
            <TooltipWrapper ref={this.element} css={get(cssOverrides, "tooltipWrapper")}>
                <TooltipClickable
                    css={get(cssOverrides, "tooltipClickable")}
                    onClick={this.openTooltip}
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.closeTooltip}
                >
                    {trigger}
                    <VisuallyHidden>{triggerAltText || this.props.theme!.translate("more info")}</VisuallyHidden>
                </TooltipClickable>
                <div aria-live="polite">{this.state.visible ? toolTipComponent : null}</div>
            </TooltipWrapper>
        );
    }
}

/** @component */
export default withTheme(Tooltip);
