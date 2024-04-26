import React from "react";
import { css } from "styled-components";

import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem from "@insite/mobius/GridItem";

const GridContainerExample = () => {
    return (
        <div style={{ width: "600px", margin: "0 auto" }}>
            <GridContainer
                css={css`
                    background: #e5593f;
                    padding: 25px;
                    border-radius: 3px;
                `}
                offsetCss={css`
                    background: tomato;
                    padding: 5px;
                    color: #fff;
                `}
            >
                <GridItem width={12}>
                    Because GridOffset has negative margins (-15px, in this case), a padding of 25px on GridContainer
                    (the darker border) appears to be only 10px of padding.
                </GridItem>
            </GridContainer>
        </div>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)

const gridContainerModule: WidgetModule = {
    component: GridContainerExample,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default gridContainerModule;
