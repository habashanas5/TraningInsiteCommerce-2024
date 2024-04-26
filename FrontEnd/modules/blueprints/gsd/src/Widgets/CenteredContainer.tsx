import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import baseTheme from "@insite/mobius/globals/baseTheme";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import React from "react";
import { css } from "styled-components";

// This widget is for making a centered container that won't go wider than the breakpoint width
// for use on full width pages.

const wrapperStyles = {
    css: css`
        margin: 0 auto;
        ${({ theme }) => {
            const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
            return breakpointMediaQueries(theme, [
                css`
                    max-width: ${maxWidths[1]}px;
                `,
                css`
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

const CenteredContainer: React.FC<WidgetProps> = ({ id }: WidgetProps) => {
    return (
        <StyledWrapper {...wrapperStyles}>
            <Zone contentId={id} zoneName="Content" />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: CenteredContainer,
    definition: {
        group: "Basic",
        icon: "Banner",
    },
};

export default widgetModule;
