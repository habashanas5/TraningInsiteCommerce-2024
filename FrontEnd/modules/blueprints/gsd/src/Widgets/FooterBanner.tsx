import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import baseTheme from "@insite/mobius/globals/baseTheme";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import React from "react";
import { css } from "styled-components";

// custom banner for the full width black bar on the bottom of the footer

const wrapperStyles = {
    css: css`
        background-color: black;
        width: 100%;
    `,
};

const innerWrapperStyles = {
    css: css`
        background-color: black;
        padding: 25px 0;
        margin: 0 auto;
        ${({ theme }) => {
            const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
            return breakpointMediaQueries(theme, [
                css`
                    margin: 0 40px;
                    max-width: ${maxWidths[1]}px;
                `,
                css`
                    margin: 0 40px;
                    max-width: ${maxWidths[1]}px;
                `,
                css`
                    max-width: ${maxWidths[2]}px;
                `,
                css`
                    max-width: ${maxWidths[3]}px;
                `,
                css`
                    max-width: ${maxWidths[4]}px;
                `,
            ]);
        }}
    `,
};

const textStyles: TypographyPresentationProps = {
    color: "white",
};

const FooterBanner: React.FC<WidgetProps> = () => {
    const year = new Date().getFullYear();

    return (
        <StyledWrapper {...wrapperStyles}>
            <StyledWrapper {...innerWrapperStyles}>
                <Typography {...textStyles}>&copy; {year} Hero Tools. All Rights Reserved</Typography>
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: FooterBanner,
    definition: {
        group: "Footer",
        icon: "Banner",
    },
};

export default widgetModule;
