import { useShellContext } from "@insite/client-framework/Components/IsInShell";
import * as React from "react";
import styled from "styled-components";

interface Props {
    type: string;
    isWidget: boolean;
}

const MissingComponentStyle = styled.div`
    color: red;
`;

const MissingComponent: React.FunctionComponent<Props> = props => {
    const { isInShell } = useShellContext();
    if (isInShell) {
        return (
            <MissingComponentStyle>
                There was no {props.isWidget ? "widget" : "page"} found for {props.type}
            </MissingComponentStyle>
        );
    }

    return null;
};

export default MissingComponent;
