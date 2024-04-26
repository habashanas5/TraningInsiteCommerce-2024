import React from "react";

import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Tab from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import Typography from "@insite/mobius/Typography";

const ZIndexGetPropsWidget = () => {
    let TabContentElement;

    return (
        <>
            <TabGroup current="Accessibility">
                <Tab headline="Tab Component" tabKey="Tab Component">
                    <Typography as="p">Tabs require a headline prop, which is rendered into the tab itself.</Typography>
                    <Typography as="p">
                        Tab content is passed to the tab component as children, and displays when the relevant tab is
                        selected. The tab content is labelled by the headline of the tab for accessibility purposes.
                    </Typography>
                </Tab>
                <Tab headline="Tab Component" tabKey="Tab Component2">
                    <Typography as="p">Tabs require a headline prop, which is rendered into the tab itself.</Typography>
                    <Typography as="p">
                        Tab content is passed to the tab component as children, and displays when the relevant tab is
                        selected. The tab content is labelled by the headline of the tab for accessibility purposes.
                    </Typography>
                </Tab>
            </TabGroup>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: ZIndexGetPropsWidget,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default widgetModule;
