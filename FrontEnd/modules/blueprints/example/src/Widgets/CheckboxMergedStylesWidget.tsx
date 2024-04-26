import React from "react";
import { css } from "styled-components";

import WidgetModule from "@insite/client-framework/Types/WidgetModule";

import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import Typography from "@insite/mobius/Typography";

const CheckboxExampleWidget = () => {
    return (
        <div style={{ width: "600px", margin: "0 auto" }}>
            <CheckboxGroup
                label="Checkbox Group Legend"
                css={css`
                    color: green;
                `}
                mergeCss
            >
                <Typography>
                    CheckboxGroup with mergeCss, theme has black background and yellow text; instance of component has
                    green text
                </Typography>
                <Checkbox>Theme CSS only, theme has black background and yellow text</Checkbox>
                <Checkbox
                    css={css`
                        background: purple;
                        color: green;
                    `}
                >
                    Css override only - has purple background and green text
                </Checkbox>
                <Checkbox
                    css={css`
                        background: purple;
                    `}
                    mergeCss
                >
                    Css is merged - Css override has purple background only; theme has yellow text;
                </Checkbox>
            </CheckboxGroup>
        </div>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)

const checkBoxExampleModule: WidgetModule = {
    component: CheckboxExampleWidget,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default checkBoxExampleModule;
