import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled from "styled-components";

export type AccordionSectionPanelProps = MobiusStyledComponentProps<"dd", InjectableCss>;

const AccordionSectionPanel = styled.dd.attrs(() => ({
    role: "region",
}))`
    margin: 0;
    padding: 15px;
    border: 1px solid ${getColor("common.border")};
    border-top: 0;
    display: ${({ hidden }) => (hidden ? "none" : "block")};
    ${injectCss}
`;

export default AccordionSectionPanel;
