import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import React from "react";

import Button from "@insite/mobius/Button";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";

const ToastIconSrcByMessageWidget = () => {
    return (
        <ToasterContext.Consumer>
            {({ addToast }) => (
                <Button
                    shape="rounded"
                    color="success"
                    onClick={() =>
                        addToast({
                            body: "Item(s) added to your cart!",
                            messageType: "success",
                        })
                    }
                >
                    Success
                </Button>
            )}
        </ToasterContext.Consumer>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)
const widgetModule: WidgetModule = {
    component: ToastIconSrcByMessageWidget,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default widgetModule;
