import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import getProp from "@insite/mobius/utilities/getProp";
import HistoryContext from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import isRelativeUrl from "@insite/mobius/utilities/isRelativeUrl";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export type ClickablePresentationProps = InjectableCss<ClickableComponentProps>;

export interface ClickableComponentProps {
    /** Stop click event propagation. */
    stopPropagation?: boolean;
    /** Function that will be called when the component is clicked. */
    onClick?: React.EventHandler<React.MouseEvent>;
    /** Disables automatic SPA transition. */
    spaOptOut?: true;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export type ClickableButtonProps = MobiusStyledComponentProps<
    "button",
    ClickableComponentProps &
        ClickablePresentationProps & {
            /** Never assigned to a button--distinguishes a button from a link. */
            href: never;
            /** Never assigned to a button--distinguishes a button from a link. */
            target: never;
            /** Description of the clickable element's role */
            "aria-roledescription"?: string;
        }
>;

export type ClickableLinkProps = MobiusStyledComponentProps<
    "a",
    ClickableComponentProps &
        ClickablePresentationProps & {
            /** Never assigned to a link--distinguishes a link from a button. */
            disabled?: boolean;
            /** Link target, defaults to self */
            target?: HTMLAnchorElement["target"];
        }
>;

export type ClickableProps = ClickableButtonProps | ClickableLinkProps;

export const StyledButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font: inherit;
    padding: 0;
    text-align: unset;
    text-decoration: none;
    &:disabled {
        cursor: not-allowed;
    }
    &:focus {
        outline-color: ${getProp("theme.focus.color", "#09f")};
        outline-style: ${getProp("theme.focus.style", "solid")};
        outline-width: ${getProp("theme.focus.width", "2px")};
    }
    ${injectCss}
`;

/**
 * The Clickable component is used to wrap any content that is to be made clickable.
 * Use it in favor of `<a>` or `<button>` tags as an easy way to enforce accessibility.
 * Do not use it in favor of `<Link>` or `<Button>` components.
 *
 * The Clickable handles the interplay between an `onClick` function, an `href` value and the presence or absence
 * of a `history` router object.
 *
 * In order to provide SPA routing, Clickable must be wrapped in a `HistoryContext.Provider`.
 */
const Clickable: React.FC<ClickableProps & HasDisablerContext> = withTheme(
    ({
        children,
        className,
        disabled,
        disable,
        href,
        mergeCss,
        onClick,
        spaOptOut,
        stopPropagation,
        target,
        ...otherProps
    }) => (
        <HistoryContext.Consumer>
            {({ history }) => {
                if (!children) {
                    return null;
                }
                const { applyStyledProp } = applyPropBuilder(otherProps, { component: "clickable" });
                const onClickIsFunction = typeof onClick === "function";
                const isRelativeLink = isRelativeUrl(href);
                const resolvedMergeCss = mergeCss ?? otherProps?.theme?.clickable?.defaultProps?.mergeCss;

                const forwardProps: {
                    as?: "a" | "button" | "span";
                    href?: string;
                    target?: "_blank" | "_self";
                    onClick?: React.EventHandler<React.MouseEvent>;
                    tabIndex: 0 | -1;
                } = { tabIndex: 0 };

                if (href) {
                    forwardProps.as = "a";
                    forwardProps.href = href;
                    forwardProps.target = target ?? "_self";
                    forwardProps.onClick = e => {
                        stopPropagation && e.stopPropagation();
                        onClickIsFunction && onClick!(e as any);

                        // cribbed from react-router-dom Link component
                        if (
                            !e.defaultPrevented && // onClick prevented default
                            e.button === 0 && // ignore everything but left clicks
                            (!target || target === "_self") && // let browser handle "target=_blank" etc.
                            !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) // ignore clicks with modifier keys
                        ) {
                            e.preventDefault();
                            if (
                                history &&
                                isRelativeLink &&
                                !spaOptOut &&
                                !href.startsWith("/RedirectTo/") &&
                                !href.startsWith("/UserFiles/")
                            ) {
                                history.push(href);
                            } else {
                                window.location.href = href;
                            }
                        }
                    };
                } else if (onClickIsFunction) {
                    forwardProps.as = "button";
                    forwardProps.onClick = onClick;
                } else {
                    forwardProps.as = "span";
                }

                if (disable) {
                    forwardProps.tabIndex = -1;
                }

                return (
                    <StyledButton
                        className={className}
                        {...forwardProps}
                        {...otherProps}
                        css={applyStyledProp("css", resolvedMergeCss)}
                        // Because disabled doesn't accept undefined
                        // eslint-disable-next-line no-unneeded-ternary
                        disabled={disable || disabled ? true : false}
                    >
                        {children}
                    </StyledButton>
                );
            }}
        </HistoryContext.Consumer>
    ),
);

/** @component */
export default withDisabler(Clickable);
