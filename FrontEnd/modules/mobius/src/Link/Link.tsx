import Clickable, { ClickableComponentProps, ClickableLinkProps } from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import Color from "color";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export type LinkPresentationProps = InjectableCss<ClickableComponentProps> & {
    /** Color of the link text and icon.
     * @themable */
    color?: string;
    /** How the color changes when the link is hovered over.
     * @themable */
    hoverMode?: "darken" | "lighten";
    /** Allows for fine-tuning of the hovered state of the link.
     * @themable */
    hoverStyle?: React.CSSProperties;
    /** Props to be passed down to the Icon component.
     * @themable */
    icon?: {
        iconProps?: IconPresentationProps;
        position?: "right" | "left";
    };
    /** Props to be passed down to the Typography component.
     * @themable */
    typographyProps?: TypographyPresentationProps;
    /** Description for a link */
    alt?: string;
};

export type LinkProps = LinkPresentationProps & ClickableLinkProps;

const StyledIcon = styled(Icon)<{ size: number; iconAlignment?: "right" | "left" }>`
    vertical-align: middle;
    ${({ size, iconAlignment }) => ` ${iconAlignment === "right" ? "margin-left:" : "margin-right:"}${size / 2}px; `}
    ${injectCss}
`;

const StyledTypography = styled(Typography as any)`
    @media print {
        color: ${getProp("theme.colors.text.main")} !important;
    }
    vertical-align: middle;
    ${injectCss}
`;

type StyledClickableProps = Pick<LinkPresentationProps, "hoverMode"> & { _color: string };

const StyledClickable = styled(Clickable)<any /* StyledClickableProps */>`
    display: inline-flex;
    ${({ iconAlignment }) => (iconAlignment === "right" ? "flex-direction: row-reverse;" : "")}
    ${/* sc-selector */ StyledIcon} {
        transition: all ${getProp("theme.transition.duration.regular")}ms ease-in-out;
        color: ${({ _color, iconColor, theme }) => resolveColor(iconColor || _color, theme)};
    }
    ${/* sc-selector */ StyledTypography} {
        color: ${({ _color, theme }) => resolveColor(_color, theme)};
    }
    &:hover {
        ${getProp("hoverStyle")}
        ${/* sc-selector */ StyledIcon}, ${/* sc-selector */ StyledTypography} {
            color: ${({ _color, theme, hoverMode }: StyledClickableProps & ThemeProps<BaseTheme>) => {
                if (!hoverMode && !_color) {
                    return null;
                }
                const hoverColor = resolveColor(_color, theme);
                if (hoverMode) {
                    return Color(hoverColor)[hoverMode](0.3).toString();
                }
                return hoverColor;
            }};
            ${getProp("hoverStyle")}
        }
    }
    ${injectCss}
`;

/**
 * A presentational concern wrapping the `Clickable` utility component. The Link component provides link-type text
 * styling for children and an associated icon.
 */
const Link: React.FC<LinkProps> = withTheme(({ children, ...otherProps }) => {
    const { applyProp, spreadProps } = applyPropBuilder(otherProps, { component: "link" });
    const typographyProps = spreadProps("typographyProps");
    const hoverOverrides = {
        hoverMode: applyProp("hoverMode"),
        hoverStyle: applyProp("hoverStyle"),
    };

    const icon = spreadProps("icon");

    return (
        <StyledClickable
            _color={applyProp("color")}
            css={applyProp("css")}
            iconColor={icon.iconProps?.color}
            iconAlignment={icon.position}
            {...hoverOverrides}
            {...omitMultiple(otherProps, ["color", "css", "icon", "hoverMode", "hoverStyle", "typographyProps"])}
        >
            {icon.iconProps && (
                <StyledIcon
                    size={typographyProps.size * 1.2}
                    iconAlignment={icon.position}
                    {...hoverOverrides}
                    {...icon.iconProps}
                />
            )}
            <StyledTypography {...hoverOverrides} {...typographyProps}>
                {children}
            </StyledTypography>
        </StyledClickable>
    );
});

export default Link;

export { StyledIcon, StyledTypography, StyledClickable };
