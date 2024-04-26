import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Typography from "@insite/mobius/Typography";
import React from "react";

import { css } from "styled-components";

import Breadcrumbs from "@insite/mobius/Breadcrumbs";
import Clickable from "@insite/mobius/Clickable";

const links = [
    {
        children: "Home",
        href: "https://home.insitesoft.com",
    },
    {
        children: "Category",
        onClick: () => undefined,
    },
    {
        children: "Subcategory",
        href: "https://subcategory.insitesoft.com",
    },
    {
        children: "Current Page",
    },
];

const BreadcrumbsClickableMergedStylesExample = () => {
    return (
        // This uses the Mobius `Typography` component to render text.
        <>
            <Typography>Breadcrumbs example</Typography>
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Typography>Styles from theme</Typography>
                <Breadcrumbs links={links} />
                <Typography>Styles css property, no merge</Typography>
                <Breadcrumbs
                    css={css`
                        font-weight: bold;
                    `}
                    links={links}
                />
                <Typography>Styles merged</Typography>
                <Breadcrumbs
                    css={css`
                        font-weight: bold;
                    `}
                    mergeCss
                    links={links}
                />
            </div>
            <Typography>Clickable example</Typography>
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Clickable onClick={() => undefined}>
                    <span>Styles from theme</span>
                </Clickable>
                <Clickable
                    css={css`
                        background: #222;
                        color: #fff;
                        padding: 10px;
                        margin: 10px;
                    `}
                    onClick={() => undefined}
                >
                    <span>Styles from css property, no merging</span>
                </Clickable>
                <Clickable
                    css={css`
                        background: #222;
                        color: #fff;
                        padding: 10px;
                        margin: 10px;
                    `}
                    mergeCss
                    onClick={() => undefined}
                >
                    <span>OnClick</span>
                </Clickable>
            </div>
        </>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)
const widgetModule: WidgetModule = {
    component: BreadcrumbsClickableMergedStylesExample,
    definition: {
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default widgetModule;
