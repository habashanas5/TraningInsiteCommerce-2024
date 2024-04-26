import Tooltip, { TooltipComponentProps } from "@insite/mobius/Tooltip";
import getColor from "@insite/mobius/utilities/getColor";
import React from "react";
import { css } from "styled-components";

const DisabledInCodeTooltip: React.FC<
    Pick<TooltipComponentProps, "triggerComponent"> & { tooltipPosition?: "top" | "left" }
> = props => (
    <Tooltip
        text="This value is customized and cannot be changed using the CMS Style Guide."
        triggerComponent={props.triggerComponent && props.triggerComponent}
        cssOverrides={
            props.tooltipPosition === "left"
                ? {
                      tooltipClickable: css`
                          padding: 0;
                      `,
                      tooltipBody: css`
                          min-width: 100%;
                          z-index: 1;
                      `,
                      tooltipContainer: css`
                          width: 120px;
                          right: calc(100% + 6px);
                          bottom: calc(-100% - 18px);
                          left: auto;
                          margin-bottom: 0;
                          &::after {
                              border-color: transparent transparent transparent ${getColor("common.backgroundContrast")};
                              top: calc(50% - 6px);
                              left: 100%;
                              margin-left: 0;
                          }
                      `,
                  }
                : {
                      tooltipContainer: css`
                          width: 120px;
                          margin-left: -60px;
                      `,
                  }
        }
        typographyProps={{
            css: css`
                white-space: break-spaces;
                font-weight: 400;
                font-size: 15px;
                line-height: 18px;
            `,
        }}
    />
);

export default DisabledInCodeTooltip;
