import Link, { LinkProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export type BreadcrumbsProps = MobiusStyledComponentProps<
    "nav",
    {
        /** CSS string or styled-components function to be injected into this component.
         * @themable */
        css?: StyledProp<BreadcrumbsProps>;
        /** An array of link props */
        links?: LinkProps[];
        /**
         * Indicates how the `css` property is combined with the variant `css` property from the theme.
         * If true, the variant css is applied first and then the component css is applied after causing
         * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
         */
        mergeCss?: boolean;
        /**
         * Optional props to be passed down to all Link and Typography components.
         * Can be overriden by individual typographyProps in the links array.
         * @themable */
        typographyProps?: TypographyPresentationProps;
    }
>;

export type BreadcrumbsPresentationProps = Omit<BreadcrumbsProps, "links">;

export const Slash = styled(Typography as any).attrs({ children: "/" })`
    margin: 0 10px;
`;

export const StyledNav = styled.nav.attrs({ "aria-label": "breadcrumbs" })`
    display: flex;
    flex-direction: row;
    align-items: center;
    ${injectCss}
`;

const Breadcrumbs: React.FC<BreadcrumbsProps> = withTheme(({ links, mergeCss, ...otherProps }) => {
    const { spreadProps, applyStyledProp } = applyPropBuilder(otherProps, { component: "breadcrumbs" });
    const typographyProps = spreadProps("typographyProps");
    const resolvedMergeCss = mergeCss ?? otherProps?.theme?.breadcrumbs?.defaultProps?.mergeCss;
    // return null if `links` is an empty empty object, collection, map, or set.
    if (!links || links.length === 0) {
        return null;
    }
    const children = links.map((link: any, index: number) => {
        const children = link.children;
        // yield null if no children
        if (!React.Children.count(children)) {
            return null;
        }
        const key = typeof children === "string" ? children : index;
        if (index === links.length - 1) {
            return (
                <Typography mergeCss={resolvedMergeCss} {...typographyProps} aria-current="page" key={key}>
                    {children}
                </Typography>
            );
        }
        return (
            <React.Fragment key={key}>
                <Link typographyProps={typographyProps} {...link} />
                <Slash {...typographyProps} />
            </React.Fragment>
        );
    });
    // return null if `links` map yields an array of nulls
    if (Object.keys(children.filter((x: typeof Link) => x !== null)).length === 0) {
        return null;
    }

    return (
        <StyledNav {...otherProps} css={applyStyledProp("css", resolvedMergeCss)}>
            {children}
        </StyledNav>
    );
});

/** @component */
export default Breadcrumbs;
