import get from "@insite/mobius/utilities/get";
import CheckboxConfig from "@insite/shell/Components/Shell/StyleGuide/CheckboxConfig";
import ColorPickerConfig from "@insite/shell/Components/Shell/StyleGuide/ColorPickerConfig";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import { createSetParentIfUndefined } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import SelectConfig from "@insite/shell/Components/Shell/StyleGuide/SelectConfig";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";
import * as React from "react";
import { ReactNode } from "react";

const ButtonConfig: React.FunctionComponent<
    {
        title: string;
        idPrefix: string;
        disableTypography?: boolean;
        insideForm?: boolean;
        locationInTheme: string;
        disabled?: boolean;
    } & PresetHelpers
> = ({ title, idPrefix, locationInTheme, disableTypography, insideForm, disabled, ...presetHelpers }) => {
    const {
        postStyleGuideTheme,
        update,
        tryMatchColorStringToPresetValue,
        tryMatchColorResultToPresetName,
        presetColors,
        theme,
    } = presetHelpers;
    const getProps = createSetParentIfUndefined(locationInTheme);
    const codeOverrideProps = get(postStyleGuideTheme, locationInTheme) || {};
    const presentationProps = get(theme, locationInTheme) || {};

    const selectConfig = (title: string, locationInTheme: string, children: ReactNode) => {
        return (
            <SelectConfig title={title} locationInTheme={locationInTheme} {...presetHelpers} disabled={disabled}>
                {children}
            </SelectConfig>
        );
    };

    return (
        <ConfigMenu title={title} insideForm={insideForm}>
            <ColorPickerConfig
                firstInput
                isInPopover
                title="Color"
                id={`${idPrefix}-button-color`}
                locationInTheme={`${locationInTheme}.color`}
                disabled={disabled}
                {...presetHelpers}
            />
            {selectConfig(
                "Shape",
                `${locationInTheme}.shape`,
                <>
                    <option value="" hidden disabled></option>
                    <option value="rectangle">Rectangle</option>
                    <option value="pill">Pill</option>
                    <option value="rounded">Rounded</option>
                </>,
            )}
            <CheckboxConfig locationInTheme={`${locationInTheme}.shadow`} title="Shadow" {...presetHelpers} />
            {selectConfig(
                "Active Mode",
                `${locationInTheme}.activeMode`,
                <>
                    <option value="none">None</option>
                    <option value="darken">Darken</option>
                    <option value="lighten">Lighten</option>
                </>,
            )}
            {selectConfig(
                "Hover Mode",
                `${locationInTheme}.hoverMode`,
                <>
                    <option value="none">None</option>
                    <option value="darken">Darken</option>
                    <option value="lighten">Lighten</option>
                </>,
            )}
            {selectConfig(
                "Hover Animation",
                `${locationInTheme}.hoverAnimation`,
                <>
                    <option value="none">None</option>
                    <option value="grow">Grow</option>
                    <option value="shrink">Shrink</option>
                    <option value="float">Float</option>
                </>,
            )}
            {selectConfig(
                "Size Variant",
                `${locationInTheme}.sizeVariant`,
                <>
                    <option value="" hidden disabled></option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </>,
            )}
            {selectConfig(
                "Button Type",
                `${locationInTheme}.buttonType`,
                <>
                    <option value="" hidden disabled></option>
                    <option value="outline">Outline</option>
                    <option value="solid">Solid</option>
                </>,
            )}
            {!disableTypography && (
                <TypographyConfig
                    variant="accordion"
                    title="Button Label Typography"
                    idPrefix={`${idPrefix}-typography`}
                    locationInTheme={`${locationInTheme}.typographyProps`}
                    enableColorPresets={true}
                    disabled={disabled}
                    {...presetHelpers}
                />
            )}
        </ConfigMenu>
    );
};

export default ButtonConfig;
