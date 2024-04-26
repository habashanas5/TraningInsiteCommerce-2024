import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Toast, { ToastProps } from "@insite/mobius/Toast/Toast";
import ToasterContext, { ToastContextData } from "@insite/mobius/Toast/ToasterContext";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import { TransitionGroup } from "react-transition-group";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface ToasterPresentationProps {
    /** The position for the toasts to display on medium, large, and extra large breakpoints.
     * @themable */
    position?: "top-right" | "top" | "top-left" | "bottom-right" | "bottom" | "bottom-left";
    /** The position for the toasts to display on small and extra small breakpoints.
     * @themable */
    mobilePosition?: "top" | "bottom";
    /** Offset from the the top or bottom that toasts will display on mobile.
     * @themable */
    mobileOffset?: number | string;
}

export type ToasterComponentProps = MobiusStyledComponentProps<
    "div",
    {
        /** The length of time in miliseconds for the toasts in the toaster to display. */
        timeoutLength?: number;
    }
>;

export type ToasterProps = ToasterComponentProps & ToasterPresentationProps;

const ToasterWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
`;

type ToasterSlotsProps = Required<Pick<ToasterProps, "position">> &
    Pick<ToasterProps, "mobileOffset" | "mobilePosition">;

const ToasterSlots = styled.div<ToasterSlotsProps>`
    ${({ theme }) => {
        const { maxWidths } = theme.breakpoints;
        return breakpointMediaQueries(theme, [
            css`
                max-width: ${maxWidths[0] + 40}px;
            `,
            css`
                max-width: ${maxWidths[1] + 40}px;
            `,
            css`
                max-width: ${maxWidths[2] + 40}px;
            `,
            css`
                max-width: ${maxWidths[3] + 40}px;
            `,
            css`
                max-width: ${maxWidths[4] + 40}px;
            `,
        ]);
    }}
    pointer-events: none;
    margin: 0 auto;
    position: fixed;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 0 20px 20px;
    ${({ theme, mobileOffset = 10, mobilePosition }) => {
        const mobileOffsetVal = typeof mobileOffset === "number" ? `${mobileOffset}px` : mobileOffset;
        const mobileVal =
            mobilePosition === "top"
                ? css`
                      padding: ${mobileOffsetVal} 0 20px;
                      top: 0;
                      bottom: auto;
                  `
                : css`
                      padding: 20px 0 ${mobileOffsetVal};
                      flex-direction: column-reverse;
                      top: auto;
                      bottom: 0;
                  `;
        return breakpointMediaQueries(theme, [null, mobileVal, null, null, null], "max");
    }}
    z-index: ${({ theme }) => theme.zIndex.toaster};
    overflow: hidden;
    ${({ position }) => {
        if (position.match(/^bottom/)) {
            return css`
                flex-direction: column-reverse;
                top: auto;
                bottom: 0;
            `;
        }
        /* Default return styling for top */
        return css`
            top: 0;
            bottom: auto;
        `;
    }}
    ${({ position }) => {
        if (position.match(/left$/)) {
            return css`
                align-items: flex-start;
            `;
        }
        if (position.match(/right$/)) {
            return css`
                align-items: flex-end;
            `;
        }
        /* Default return styling for center */
        return css`
            align-items: center;
        `;
    }}
`;

type State = {
    toasts: {
        [key: string]: ToastProps;
    };
    displayToasts: number[];
    queuedToasts: number[];
    lastToastId: number;
};

class Toaster extends React.Component<ToasterProps & ThemeProps<BaseTheme>, State> {
    state: State = {
        toasts: {},
        displayToasts: [],
        queuedToasts: [],
        lastToastId: 0,
    };

    applyProp = applyPropBuilder(this.props, { component: "toast", propKey: "toasterProps" }).applyProp;

    addToast: ToastContextData["addToast"] = toastProps => {
        this.setState(({ lastToastId, toasts, displayToasts, queuedToasts }) => {
            const toastId = lastToastId + 1;
            const newToasts = toasts;
            newToasts[toastId] = toastProps;
            let topSlice = 3;
            if (window && window.innerWidth < this.props.theme.breakpoints.values[2]) {
                topSlice = 1;
            }
            const newDisplayToasts = displayToasts;
            const newQueuedToasts = queuedToasts;
            if (displayToasts.length < topSlice) {
                newDisplayToasts.unshift(toastId);

                setTimeout(() => {
                    this.removeToast(toastId);
                }, toastProps?.timeoutLength || this.applyProp("timeoutLength"));
            } else {
                newQueuedToasts.push(toastId);
            }
            return {
                toasts: newToasts,
                lastToastId: toastId,
                displayToasts: newDisplayToasts,
                queuedToasts: newQueuedToasts,
            };
        });
    };

    removeToast: ToastContextData["removeToast"] = toastId => {
        this.setState(({ toasts, displayToasts, queuedToasts }) => {
            const newDisplayToasts = displayToasts.filter(item => item !== toastId);
            const nextToastId = queuedToasts[0];
            const newQueuedToasts = queuedToasts;
            if (nextToastId !== undefined) {
                newDisplayToasts.unshift(nextToastId);
                setTimeout(() => {
                    this.removeToast(nextToastId);
                }, toasts[nextToastId]?.timeoutLength || this.applyProp("timeoutLength"));
                newQueuedToasts.shift();
            }
            return { displayToasts: newDisplayToasts, queuedToasts: newQueuedToasts };
        });
    };

    render() {
        const { children, ...otherProps } = this.props;
        const { displayToasts, toasts } = this.state;
        return (
            <ToasterContext.Provider
                value={{
                    addToast: this.addToast,
                    removeToast: this.removeToast,
                    defaultTimeout: this.applyProp("timeoutLength"),
                }}
            >
                {children}
                <ToasterWrapper>
                    <ToasterSlots
                        {...otherProps}
                        position={this.applyProp("position")}
                        mobileOffset={this.applyProp("mobileOffset")}
                        mobilePosition={this.applyProp("mobilePosition")}
                        role="status"
                        aria-live="polite"
                    >
                        <TransitionGroup component={null}>
                            {displayToasts.map(key => (
                                <Toast key={key} toastId={key} {...toasts[key]} />
                            ))}
                        </TransitionGroup>
                    </ToasterSlots>
                </ToasterWrapper>
            </ToasterContext.Provider>
        );
    }
}

(Toaster as any).defaultProps = {
    timeoutLength: 3000,
};

/** @component */
export default withTheme(Toaster);
