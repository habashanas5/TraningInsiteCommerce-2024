import Button, { ButtonProps } from "@insite/mobius/Button";
import Typography from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitSingle from "@insite/mobius/utilities/omitSingle";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export interface TabPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<TabProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Props to be passed down to the Typography component.
     * @themable */
    typographyProps?: object;
}

export type TabProps = MobiusStyledComponentProps<
    "button",
    {
        /** Whether or not the tab is currently selected */
        selected?: boolean;
        /** Unique key for tab presentation. */
        tabKey: string;
        /** String to render as the tab headline. */
        headline: React.ReactNode;
    } & TabPresentationProps
>;

type TabStyleProps = {
    ref?: React.Ref<React.Component<ButtonProps>>;
    role: string | undefined;
};

const TabStyle = styled(Button).attrs<TabProps, TabStyleProps>({ role: "presentation" })`
    flex-shrink: 0;
    box-sizing: border-box;
    display: inline-block;
    padding: 8px 16px 16px;
    min-width: 85px;
    text-align: center;
    border-bottom: 4px solid
        ${({ selected, theme }: TabProps) =>
            selected ? resolveColor("common.backgroundContrast", theme!) : "transparent"};
    transition: all 0.4s;
    &:hover {
        border-bottom: 4px solid ${getColor("secondary.main")};
    }
    &:focus {
        outline-color: ${getProp("theme.focus.color", "#09f")};
        outline-style: ${getProp("theme.focus.style", "solid")};
        outline-width: ${getProp("theme.focus.width", "2px")};
    }
    ${injectCss}
`;

const Tab = React.forwardRef<React.Component<ButtonProps>, TabProps>(
    ({ headline, onClick, mergeCss, ...otherProps }: TabProps, ref) => {
        const { spreadProps, applyStyledProp } = applyPropBuilder(otherProps, { component: "tab" });
        const tabHeader =
            typeof headline === "string" ? (
                <Typography role="tab" {...spreadProps("typographyProps")}>
                    {headline}
                </Typography>
            ) : (
                headline
            );
        const resolvedMergeCss = mergeCss ?? otherProps.theme?.tab?.defaultProps?.mergeCss;
        return (
            <TabStyle
                as="li"
                aria-selected={otherProps.selected}
                tabIndex={otherProps.selected ? 0 : -1}
                onClick={onClick}
                ref={ref}
                css={applyStyledProp("css", resolvedMergeCss)}
                headline={headline}
                {...omitSingle(otherProps, "css")}
            >
                {tabHeader}
            </TabStyle>
        );
    },
);

Tab.displayName = "Tab";

/** @component */
export default withTheme(Tab);

export { TabStyle };
