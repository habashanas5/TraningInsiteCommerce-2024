import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    heading: string;
    text: string | number;
    extendedStyles?: SmallHeadingAndTextStyles;
}

export interface SmallHeadingAndTextStyles {
    wrapper?: InjectableCss;
    heading?: TypographyProps;
    text?: TypographyProps;
    extendedStyles?: SmallHeadingAndTextStyles;
}

export const smallHeadingAndTextStyles: SmallHeadingAndTextStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;

            @media print {
                display: block;
            }
        `,
    },
    heading: {
        variant: "legend",
    },
    text: {
        css: css`
            width: 100%;
            ${wrapInContainerStyles}
        `,
    },
};

const SmallHeadingAndText: React.FunctionComponent<OwnProps> = ({ heading, text, extendedStyles, ...otherProps }) => {
    const [styles] = React.useState(() => mergeToNew(smallHeadingAndTextStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper} {...otherProps}>
            <Typography as="p" {...styles.heading} data-test-selector="heading">
                {heading}
            </Typography>
            <Typography as="p" {...styles.text} data-test-selector="text">
                {text}
            </Typography>
        </StyledWrapper>
    );
};

export default SmallHeadingAndText;
