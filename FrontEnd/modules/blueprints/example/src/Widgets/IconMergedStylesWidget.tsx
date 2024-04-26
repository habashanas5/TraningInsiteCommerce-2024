import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Typography from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

import Icon from "@insite/mobius/Icon";
import Box from "@insite/mobius/Icons/Box";

const IconMergedStylesWidget = () => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", width: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography>Styles from theme.</Typography>
                <Icon src="Box" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography>
                    Styles from <strong>css</strong> prop, no <strong>mergeCss</strong>
                </Typography>
                <Icon
                    src="Box"
                    css={css`
                        height: 70px;
                        width: 70px;
                        color: chartreuse;
                        background: #000;
                    `}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography>Merged Styles</Typography>
                <Icon
                    src="Box"
                    css={css`
                        color: chartreuse;
                        height: 70px;
                        width: 70px;
                    `}
                    mergeCss
                />
            </div>
        </div>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)
const iconMergedStylesModule: WidgetModule = {
    component: IconMergedStylesWidget,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default iconMergedStylesModule;
