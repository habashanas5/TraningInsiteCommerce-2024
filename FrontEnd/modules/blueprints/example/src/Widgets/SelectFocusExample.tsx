import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import React from "react";

import Button from "@insite/mobius/Button";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";

const children = [
    <option key={0} value={0}>
        Select
    </option>,
    <option key={1} value={1}>
        apple
    </option>,
    <option key={2} value={2}>
        bananas
    </option>,
    <option key={3} value={3}>
        cherries
    </option>,
];

const SelectFocusWidget = () => {
    const [error, setError] = React.useState("");
    const [value, setValue] = React.useState("");

    const handleChange = React.useCallback((e: any) => {
        setValue(e.target.value);
    }, []);

    const clearSelect = React.useCallback(() => {
        setError("");
        setValue("");
    }, []);

    const showError = React.useCallback(() => {
        setError("This is an error");
    }, []);

    return (
        <div style={{ width: 500, margin: "0 auto" }}>
            <div style={{ padding: 15 }}>
                <Select onChange={handleChange} error={error} placeholder="Select" value={value}>
                    {children}
                </Select>
            </div>
            <div style={{ padding: 15 }}>
                <Select onChange={handleChange} error={error} placeholder="Select" value={value}>
                    {children}
                </Select>
            </div>
            <div style={{ padding: 15 }}>
                <Select onChange={handleChange} error={error} placeholder="Select" value={value}>
                    {children}
                </Select>
            </div>
            <div style={{ padding: 15 }}>
                <TextField onChange={handleChange} error={error} value={value} />
            </div>
            <Button onClick={clearSelect}>CLEAR</Button>
            <Button onClick={showError}>Error</Button>
        </div>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)
const selectFocusWidget: WidgetModule = {
    component: SelectFocusWidget,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default selectFocusWidget;
