import Checkbox from "@insite/mobius/Checkbox/Checkbox";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetNewValueInDraft } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import { configCheckboxStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import get from "lodash/get";
import * as React from "react";

const CheckboxConfig: React.FunctionComponent<
    {
        locationInTheme: string;
        title: string;
        disabled?: boolean;
    } & PresetHelpers
> = ({ locationInTheme, theme, title, update, postStyleGuideTheme, disabled }) => {
    const codeOverridden = !!get(postStyleGuideTheme, locationInTheme);

    return (
        <Checkbox
            checked={get(theme, locationInTheme) || false}
            onChange={(_, value) =>
                update(draft => {
                    createSetNewValueInDraft(locationInTheme)(draft, value);
                })
            }
            disabled={codeOverridden || disabled}
            {...configCheckboxStyles}
        >
            {title} {codeOverridden && <DisabledInCodeTooltip />}
        </Checkbox>
    );
};

export default CheckboxConfig;
