import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled from "styled-components";

const VisuallyHiddenStyle = styled.span`
    /** from https://allyjs.io/tutorials/hiding-elements.html */
    &:not(:focus):not(:active) {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        border: 0;
        padding: 0;
        white-space: nowrap;
        clip-path: inset(100%);
        clip: rect(0 0 0 0);
        overflow: hidden;
    }
`;

const VisuallyHidden: React.FunctionComponent<MobiusStyledComponentProps<"span">> = props => {
    if (!React.Children.count(props.children)) {
        return null;
    }
    return <VisuallyHiddenStyle {...props} />;
};

/** @component */
export default VisuallyHidden;
