// based on https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
import AccordionContext, { AccordionContextData } from "@insite/mobius/Accordion/AccordionContext";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { applyPropBuilder } from "@insite/mobius/utilities";
import get from "@insite/mobius/utilities/get";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export interface AccordionPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<AccordionComponentProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export type AccordionComponentProps = MobiusStyledComponentProps<"dl", AccordionContextData>;

export type AccordionProps = AccordionPresentationProps & AccordionComponentProps;

const AccordionStyle = styled.dl.attrs({
    role: "presentation",
})`
    margin: 0;
    ${injectCss}
`;

const Accordion: React.FC<AccordionProps & ThemeProps<BaseTheme>> = ({
    children,
    headingLevel,
    mergeCss,
    ...otherProps
}) => {
    const { applyStyledProp } = applyPropBuilder(otherProps, { component: "accordion" });

    const resolvedMergeCss = mergeCss ?? otherProps?.theme?.accordion?.defaultProps?.mergeCss;

    return (
        <AccordionContext.Provider value={{ headingLevel }}>
            <AccordionStyle {...otherProps} css={applyStyledProp("css", resolvedMergeCss)}>
                {children}
            </AccordionStyle>
        </AccordionContext.Provider>
    );
};

/** @component */
export default withTheme(Accordion);

export { AccordionStyle };
