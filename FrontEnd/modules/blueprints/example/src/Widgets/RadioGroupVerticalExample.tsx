import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import React from "react";

import { css } from "styled-components";

import Button from "@insite/mobius/Button";
import Radio from "@insite/mobius/Radio";
import RadioGroup from "@insite/mobius/RadioGroup";

const RadioGroupVerticalWidget = () => {
    const [isHorizontal, toggle] = React.useState(false);
    const [radioVal, setRadioVal] = React.useState("0");

    return (
        <div style={{ display: "flex", justifyContent: "space-between", width: "800px", margin: "0 auto" }}>
            <RadioGroup
                horizontal={isHorizontal}
                label="Choose one"
                name="movie-2"
                onChangeHandler={e => setRadioVal(e.target.value)}
                value={radioVal}
            >
                <Radio>Blade Runner</Radio>
                <Radio>Toy Story</Radio>
            </RadioGroup>
            <RadioGroup
                horizontal={isHorizontal}
                label="Choose one"
                name="movie-3"
                onChangeHandler={e => setRadioVal(e.target.value)}
                value={radioVal}
            >
                <Radio>Blade Runner</Radio>
                <Radio>Toy Story</Radio>
                <Radio>Inception</Radio>
                <Radio>Gladiator</Radio>
                <Radio>World of Warcraft: The Movie</Radio>
                <Radio>Monster's Inc</Radio>
            </RadioGroup>
            <Button
                onClick={e => {
                    e.preventDefault();
                    toggle(curVal => !curVal);
                }}
                css={css`
                    height: 100px;
                    width: 200px;
                    word-wrap: none;
                `}
            >
                Toggle Horizontal
            </Button>
        </div>
    );
};

// The `WidgetModule` defines:
//   - The component used the render the widget.
//   - How the widget should appear in the CMS.
//   - How the widget is editable in the CMS.
//   - (many other things)
const radioGroupVerticalModule: WidgetModule = {
    component: RadioGroupVerticalWidget,
    definition: {
        fieldDefinitions: [],
        group: "Testing Extensions" as any,
    },
};

// The `WidgetModule` MUST be the default export of the widget file.
export default radioGroupVerticalModule;
