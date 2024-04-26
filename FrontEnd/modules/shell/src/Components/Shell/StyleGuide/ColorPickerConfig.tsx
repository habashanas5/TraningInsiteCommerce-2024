import Checkbox from "@insite/mobius/Checkbox/Checkbox";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetNewValueInDraft } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import { configCheckboxStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import get from "lodash/get";
import * as React from "react";

const ColorPickerConfig: React.FunctionComponent<
    {
        locationInTheme: string;
        title: string;
        disabled?: boolean;
        id: string;
        firstInput?: boolean;
        isInPopover?: boolean;
        preventColorReset?: boolean;
    } & PresetHelpers
> = ({
    locationInTheme,
    isInPopover,
    preventColorReset,
    firstInput,
    theme,
    title,
    id,
    update,
    tryMatchColorStringToPresetValue,
    tryMatchColorResultToPresetName,
    presetColors,
    postStyleGuideTheme,
    disabled,
}) => {
    const codeOverridden = !!get(postStyleGuideTheme, locationInTheme);

    return (
        <ColorPicker
            label={title}
            id={id}
            disabled={codeOverridden || disabled}
            color={tryMatchColorStringToPresetValue(get(theme, locationInTheme))}
            presetColors={presetColors}
            onChange={color => {
                const resultVal = tryMatchColorResultToPresetName(color);
                update(draft => createSetNewValueInDraft(locationInTheme)(draft, resultVal));
            }}
            isInPopover={isInPopover}
            firstInput={firstInput}
            preventColorReset={preventColorReset}
        />
    );
};

export default ColorPickerConfig;
