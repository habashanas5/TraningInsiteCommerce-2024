import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import React from "react";
import styled, { ThemeConsumer } from "styled-components";

export type PanelRowPresentationProps = {
    /** The background color of the panel.
     * @themable */
    color?: string;
    /** Props to be passed into the inner Icon component.
     * @themable */
    moreIconProps?: IconPresentationProps;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp; // using this construction instead of InjectableCss to avoid deep type instantiation
    /** CSS string or styled-components function to be injected into row representing current location.
     * @themable */
    isCurrentCss?: StyledProp; // using this construction instead of InjectableCss to avoid deep type instantiation
};

type PanelRowComponentProps = ClickableProps & {
    /** Flag governing whether this row is a header row, which governs padding. */
    header?: boolean;
    /** Flag governing whether this row represents a menu option with children, in which case a chevron will be included. */
    hasChildren?: boolean;
    /** Is this the current page? */
    isCurrent?: boolean;
};

// In the below type, MobiusStyledComponentProps is provided by `ClickableProps`
export type PanelRowProps = PanelRowPresentationProps & PanelRowComponentProps;

const PanelRowStyle = styled(Clickable)<any>`
    margin-bottom: 0;
    margin-top: 0;
    display: flex;
    padding: ${({ header }) => (header ? "5px 0" : "10px 10px 10px 20px")};
    justify-content: space-between;
    background: ${({ theme, color }) => resolveColor(color, theme)};
    color: ${({ theme, color }) => getContrastColor(color, theme)};
    &:active {
        color: ${({ theme, color }) => getContrastColor(color, theme)};
    }
    & > *:first-child {
        ${({ hasChildren }) => hasChildren && "width: calc(100% - 24px);"}
    }
    ${injectCss}
    ${({ isCurrent, isCurrentCss, theme }) =>
        isCurrent &&
        `
        background: ${resolveColor("primary.main", theme)};
        color: ${resolveColor("primary.contrast", theme)};
        margin: 0;
        ${isCurrentCss}
    `}
`;

/**
 * A building block for the `PanelMenu` and surrounding UIs.
 */
const PanelRow: React.FC<PanelRowProps> = ({ children, theme, ...otherProps }) => (
    <ThemeConsumer>
        {(theme?: BaseTheme) => {
            const { spreadProps } = applyPropBuilder(
                { panelRowProps: { ...otherProps }, theme },
                { component: "panelMenu" },
            );
            const panelRowThemeProps = spreadProps("panelRowProps");
            const appliedColor = panelRowThemeProps.color ?? "common.accent";
            return (
                <PanelRowStyle {...panelRowThemeProps} {...otherProps} color={appliedColor}>
                    {children}
                    {otherProps.hasChildren && (
                        <IconMemo {...panelRowThemeProps.moreIconProps} color={getContrastColor(appliedColor, theme)} />
                    )}
                </PanelRowStyle>
            );
        }}
    </ThemeConsumer>
);

/** @ignore */
export default PanelRow;
