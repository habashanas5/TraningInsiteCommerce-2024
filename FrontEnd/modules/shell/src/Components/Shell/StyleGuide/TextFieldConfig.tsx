import Checkbox from "@insite/mobius/Checkbox/Checkbox";
import { TextField } from "@insite/mobius/index";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetNewValueInDraft } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import { configCheckboxStyles, configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import get from "lodash/get";
import * as React from "react";

const TextFieldConfig: React.FunctionComponent<
    {
        locationInTheme: string;
        title: string;
        disabled?: boolean;
        hint?: React.ReactNode;
    } & PresetHelpers
> = ({ locationInTheme, theme, title, hint, update, postStyleGuideTheme, disabled }) => {
    const codeOverridden = !!get(postStyleGuideTheme, locationInTheme);

    return (
        <TextField
            label={
                codeOverridden ? (
                    <>
                        <span>{title} </span>
                        <DisabledInCodeTooltip />
                    </>
                ) : (
                    title
                )
            }
            hint={hint}
            value={get(theme, locationInTheme)}
            onChange={event => {
                const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                update(draft => createSetNewValueInDraft(locationInTheme)(draft, resultVal));
            }}
            disabled={codeOverridden || disabled}
            {...configFormFieldStyles}
        />
    );
};

export default TextFieldConfig;
