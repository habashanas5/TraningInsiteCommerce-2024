import Select from "@insite/mobius/Select";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetNewValueInDraft } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import { configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import get from "lodash/get";
import * as React from "react";

const SelectConfig: React.FunctionComponent<
    {
        locationInTheme: string;
        title: string;
        disabled?: boolean;
    } & PresetHelpers
> = ({ locationInTheme, theme, title, update, postStyleGuideTheme, disabled, children }) => {
    const codeOverridden = !!get(postStyleGuideTheme, locationInTheme);

    return (
        <Select
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
            value={get(theme, locationInTheme) || ""}
            disabled={codeOverridden || disabled}
            onChange={event => {
                const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                update(draft => createSetNewValueInDraft(locationInTheme)(draft, resultVal));
            }}
            {...configFormFieldStyles}
        >
            {children}
        </Select>
    );
};

export default SelectConfig;
