/*
We've run into issues where the build breaks with a partner's blueprint, but the errors are in our base code.
It seems related to the name of the blueprint, possibly based on the order things are compiled in.

The build errors we've run into so far have to do with inconsistent versions of @types/react and @types/styled-components,
so this blueprint imports both of them and will trigger any build errors because of inconsistent versions.

We may need to add new imports to this later. We may also be able to remove this if we get a system in place that ensures our dependency versions stay consistent.
 */

import { notesStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsNotes";
import getColor from "@insite/mobius/utilities/getColor";
import * as React from "react";
import styled, { css } from "styled-components";

const StyledDiv = styled.div`
    background-color: red;
`;

notesStyles.wrapper = {
    css: css`
        border: 1px solid ${getColor("secondary")};
    `,
};

export const testComponent = () => {
    const items = [1, 2];
    return (
        <StyledDiv>
            {items.map((item, index) => (
                // THIS ESLINT FAILURE IS ON PURPOSE
                <div key={index}>{item}</div>
            ))}
        </StyledDiv>
    );
};
