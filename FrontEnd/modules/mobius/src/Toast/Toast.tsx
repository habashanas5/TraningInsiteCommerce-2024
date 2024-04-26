import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import get from "@insite/mobius/utilities/get";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface ToastPresentationProps {
    /** Props that will be passed to the typography body component if the `body` is a string.
     * @themable */
    bodyTypographyProps?: TypographyPresentationProps;
    /** Props to be passed down to the close button component.
     * @themable */
    closeButtonProps?: ButtonPresentationProps;
    /** Props to be passed down to the close button icon component.
     * @themable */
    closeButtonIconProps?: IconPresentationProps;
    /** CSS strings or styled-components functions to be injected into nested components,
     * these will override the theme defaults.
     * @themable */
    cssOverrides?: {
        toast?: StyledProp<ToastProps>;
        toastBody?: StyledProp<ToastProps>;
    };
    /** Props that will be passed to the toast's icon.
     * @themable */
    iconProps?: IconPresentationProps;
    /** Description of the transition duration as available in the theme.
     * @themable */
    transitionDuration?: "short" | "regular" | "long";
    /** Source for icons that will be rendered based on the type of message in the toast.
     * @themable */
    iconSrcByMessage?: {
        success?: React.ComponentType | string;
        warning?: React.ComponentType | string;
        danger?: React.ComponentType | string;
        info?: React.ComponentType | string;
    };
}

export type ToastComponentProps = MobiusStyledComponentProps<
    "div",
    {
        /** Text to display in the body of the Toast. Will be ignored if `children` are passed. */
        body?: React.ReactNode;
        /** The type of message to be displayed, which governs color and iconography. */
        messageType?: "success" | "danger" | "info" | "warning";
        /** Description of type of message to be read to screenreader, to replace the iconography and color in relaying
         * the importance or valence of the message. Defaults to `messageType` value if not passed in.
         * Can be used for translations or additional specificity if necessary. */
        messageTypeString?: string;
        /** The length of time in milliseconds for the toast to display. Themable in `Toaster`. */
        timeoutLength?: number;
        /** Focus the close button on render */
        isFocusAfterMount?: boolean;
        onClose?: () => void;
    }
>;

export type ToastProps = ToastComponentProps & ToastPresentationProps;

type ToastStyleProps = {
    transitionState: TransitionStatus;
    transitionLength: number;
    messageType: ToastProps["messageType"];
} & ThemeProps<BaseTheme> &
    InjectableCss;

const ToastStyle = styled.div<ToastStyleProps>`
    ${({ transitionState, theme }) => {
        const liveMargin = breakpointMediaQueries(
            theme,
            [
                null,
                null,
                css`
                    margin-top: 20px;
                `,
                null,
                null,
            ],
            "min",
        );
        switch (transitionState) {
            case "entering":
                return css`
                    margin-top: 0;
                    top: -100px;
                    max-height: 0;
                    opacity: 0;
                `;
            case "entered":
                return css`
                    ${liveMargin}
                    top: 0;
                    max-height: 500px;
                    opacity: 1;
                `;
            case "exiting":
                return css`
                    ${liveMargin}
                    opacity: 0;
                    top: -20px;
                    height: 100%;
                `;
            case "exited":
                return css`
                    margin-top: 0;
                    opacity: 0;
                    height: 0;
                `;
            default:
                return "";
        }
    }}
    transition: all ease-in-out ${getProp("transitionLength")}ms;
    pointer-events: all;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    width: 400px;
    max-width: 100%;
    box-shadow: ${getProp("theme.shadows.3")};
    background: ${getColor("common.background")};
    border-color: ${({ messageType, theme }: ToastStyleProps) => resolveColor(messageType, theme)};
    border-style: none none none solid;
    border-width: 0 0 0 10px;
    ${injectCss}
`;

const ToastBody = styled.div<InjectableCss>`
    ${({ theme }) =>
        breakpointMediaQueries(
            theme,
            [
                css`
                    margin: 5px 44px 5px 10px;
                `,
                null,
                css`
                    margin: 20px 44px 20px 10px;
                `,
                null,
                null,
            ],
            "min",
        )}
    margin-right: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    ${injectCss}
`;

const ToastText = styled(Typography as any)`
    ${getProp("theme.toast.defaultProps.bodyTypographyProps.css")}
    ${injectCss}
`;

/**
 * Component governing the visual style of the Toasts rendered within the toaster.
 * Relies on Toaster and ToasterContext for positioning, animation, and timeout.
 */
const Toast: React.FC<{ toastId: number; in?: boolean } & ToastProps> = ({
    body,
    children,
    in: transitionIn,
    messageType,
    messageTypeString,
    onClose,
    toastId,
    isFocusAfterMount,
    ...otherProps
}) => {
    const { applyProp, spreadProps } = applyPropBuilder(otherProps, { component: "toast" });
    const cssOverrides = spreadProps("cssOverrides");
    const iconSrcByMessage = spreadProps("iconSrcByMessage");
    const transitionLength = get(otherProps.theme, `transition.duration.${applyProp("transitionDuration")}`);
    return (
        <Transition
            in={transitionIn}
            unmountOnExit={true}
            timeout={{
                enter: transitionLength,
                exit: transitionLength,
            }}
        >
            {transitionState => (
                <ToastStyle
                    css={cssOverrides.toast}
                    {...{ transitionState, transitionLength, messageType }}
                    data-test-selector={`toast${messageType}`}
                    onKeyPress={e => {
                        if (e.key === "Enter") {
                            e.stopPropagation();
                        }
                    }}
                >
                    <ToastBody css={cssOverrides.toastBody} data-id="toast-body">
                        <IconMemo
                            src={messageType && iconSrcByMessage[messageType]}
                            color={messageType}
                            size={40}
                            css={css`
                                margin-right: 10px;
                            `}
                            {...spreadProps("iconProps")}
                        />
                        <VisuallyHidden>{messageTypeString || messageType}</VisuallyHidden>
                        {children || (
                            <Typography {...spreadProps("bodyTypographyProps")} data-test-selector="toastBody">
                                {body}
                            </Typography>
                        )}
                    </ToastBody>
                    <ToasterContext.Consumer>
                        {({ removeToast }) => (
                            <Button
                                onClick={() => {
                                    onClose?.();
                                    removeToast(toastId);
                                }}
                                isFocusAfterMount={isFocusAfterMount}
                                aria-labelledby={`close-toast${toastId}`}
                                {...spreadProps("closeButtonProps")}
                            >
                                <IconMemo {...spreadProps("closeButtonIconProps")} />
                                <VisuallyHidden id={`close-toast${toastId}`}>
                                    {otherProps.theme!.translate("close toast")}
                                </VisuallyHidden>
                            </Button>
                        )}
                    </ToasterContext.Consumer>
                </ToastStyle>
            )}
        </Transition>
    );
};

Toast.defaultProps = {
    timeoutLength: 200,
};

/** @component */
export default withTheme(Toast);

// Exported for use in custom `children` implementations, not used in situ.
export { ToastText };
