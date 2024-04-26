import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import DisablerContext from "@insite/mobius/utilities/DisablerContext";
import getProp from "@insite/mobius/utilities/getProp";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import safeColor from "@insite/mobius/utilities/safeColor";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export type LoadingOverlayProps = MobiusStyledComponentProps<
    "div",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<LoadingOverlayProps>;
        /** Show/hide status of the backdrop and spinner. */
        loading?: boolean;
        /** Props to be passed to the inner LoadingSpinner component. */
        spinnerProps?: any;
    }
>;

const LoadingOverlayStyle = styled.div<Pick<LoadingOverlayProps, "css">>`
    display: inline-block;
    position: relative;
    width: 100%;
    & > div:first-child {
        height: 100%;
        width: 100%;
        background: ${props => safeColor(props.theme.colors.common.background).rgb().alpha(0.6).string()};
        will-change: opacity;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        &[data-loading="true"] {
            opacity: 1;
            position: absolute;
            z-index: ${getProp("theme.zIndex.loadingOverlay")};
        }
        &[data-loading="false"] {
            position: fixed;
            display: none;
        }
    }
    ${injectCss}
`;

const SpinnerWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    right: 50%;
    bottom: 50%;
    margin: auto;
`;

/**
 * Adds a layer over the content to indicate that it is loading.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps & ThemeProps<BaseTheme>> = ({
    children,
    css,
    loading,
    spinnerProps,
    theme,
    ...otherProps
}) => (
    <LoadingOverlayStyle css={css} {...otherProps}>
        <div data-loading={loading} data-test-selector="loadingOverlaySpinner" role="alert" aria-live="assertive">
            <VisuallyHidden>
                {loading ? theme.translate("loading content") : theme.translate("content loaded")}
            </VisuallyHidden>
            <SpinnerWrapper>
                <LoadingSpinner {...spinnerProps} />
            </SpinnerWrapper>
        </div>
        <DisablerContext.Provider value={{ disable: loading }}>{children}</DisablerContext.Provider>
    </LoadingOverlayStyle>
);

LoadingOverlay.defaultProps = {
    loading: true,
};

/** @component */
export default withTheme(LoadingOverlay);

export { LoadingOverlayStyle };
