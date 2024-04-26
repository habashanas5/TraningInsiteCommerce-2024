import { AccordionContextData } from "@insite/mobius/Accordion/AccordionContext";
import AccordionSectionPanel from "@insite/mobius/AccordionSection/AccordionSectionPanel";
import { IconWrapper } from "@insite/mobius/Icon";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import React from "react";
import styled, { css } from "styled-components";

export type AccordionSectionHeaderProps = MobiusStyledComponentProps<
    "dt",
    {
        /** Sets the initial expanded state of the section. */
        expanded?: boolean;
    } & InjectableCss &
        AccordionContextData,
    "headingLevel"
>;

const AccordionSectionHeader = styled.dt.attrs((props: AccordionSectionHeaderProps) => ({
    ariaLevel: props.headingLevel,
}))`
    background: ${getColor("common.background")};
    button {
        border: 1px solid ${getColor("common.border")};
        padding: 9px;
        padding-left: 15px;
        height: 100%;
        width: 100%;
        background: ${getColor("common.accent")};
        font-family: inherit;
        display: flex;
        text-align: left;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        &:focus {
            border-color: ${getProp("theme.focus.color", "#09f")};
            border-style: ${getProp("theme.focus.style", "solid")};
            border-width: ${getProp("theme.focus.width", "2px")};
            outline: 0;
            padding: 8px;
            padding-left: 14px;
        }
    }
    ${/* sc-selector */ AccordionSectionPanel} + & button {
        border-top: 0;
        &:focus {
            border-color: ${getProp("theme.focus.color", "#09f")};
            border-style: ${getProp("theme.focus.style", "solid")};
            border-width: ${getProp("theme.focus.width", "2px")};
            padding-top: 7px;
        }
    }
    ${/* sc-selector */ IconWrapper}.toggle {
        ${({ expanded }: AccordionSectionHeaderProps) =>
            expanded
                ? css`
                      transform: rotate(180deg);
                  `
                : null}
    }
    ${injectCss}
`;

export default AccordionSectionHeader;
