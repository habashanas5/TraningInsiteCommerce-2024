import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import Clickable from "@insite/mobius/Clickable/Clickable";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import { TypographyProps } from "@insite/mobius/Typography";
import get from "@insite/mobius/utilities/get";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import CheckboxConfig from "@insite/shell/Components/Shell/StyleGuide/CheckboxConfig";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetParentIfUndefined } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import SelectConfig from "@insite/shell/Components/Shell/StyleGuide/SelectConfig";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { configCheckboxStyles, configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import TextFieldConfig from "@insite/shell/Components/Shell/StyleGuide/TextFieldConfig";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import { FontWeightProperty, TextTransformProperty } from "csstype";
import * as React from "react";
import { css } from "styled-components";

const TypographyConfig: React.FunctionComponent<
    {
        title: string;
        idPrefix: string;
        insideForm?: boolean;
        variant?: "accordion" | "popover";
        locationInTheme: string;
        enableColorPresets: boolean;
        disabled?: boolean;
    } & PresetHelpers
> = ({ title, idPrefix, enableColorPresets, insideForm, variant, locationInTheme, disabled, ...presetHelpers }) => {
    const {
        update,
        postStyleGuideTheme,
        theme,
        tryMatchColorResultToPresetName,
        tryMatchColorStringToPresetValue,
        presetColors,
    } = presetHelpers;
    const ConfigWrapper = variant === "accordion" ? SideBarAccordionSection : ConfigMenu;
    const getCssProperties = createSetParentIfUndefined(locationInTheme);
    const codeOverrideProps = get(postStyleGuideTheme, locationInTheme) || {};
    const cssProperties: TypographyProps = get(theme, locationInTheme) || {};
    return (
        <ConfigWrapper title={title} insideForm={insideForm} inPopover>
            <ColorPicker
                isInPopover
                firstInput
                label="Color"
                id={`${idPrefix}-color`}
                color={
                    cssProperties.color && enableColorPresets
                        ? tryMatchColorStringToPresetValue(cssProperties.color)
                        : cssProperties.color
                }
                onChange={color =>
                    update(draft => {
                        getCssProperties(draft).color = tryMatchColorResultToPresetName(color);
                    })
                }
                disabled={!!codeOverrideProps.color || disabled}
                presetColors={enableColorPresets ? presetColors : undefined}
            />
            <TextFieldConfig
                title="Font Weight"
                locationInTheme={`${locationInTheme}.weight`}
                disabled={disabled}
                {...presetHelpers}
            />
            <CheckboxGroup
                css={css`
                    margin-top: 10px;
                `}
            >
                <CheckboxConfig
                    locationInTheme={`${locationInTheme}.italic`}
                    title="Italic"
                    disabled={disabled}
                    {...presetHelpers}
                />
                <CheckboxConfig
                    locationInTheme={`${locationInTheme}.underline`}
                    title="Underline"
                    disabled={disabled}
                    {...presetHelpers}
                />
            </CheckboxGroup>
            <TextField
                label={
                    codeOverrideProps.size ? (
                        <>
                            <span>Font Size </span>
                            <DisabledInCodeTooltip />
                        </>
                    ) : (
                        "Font Size"
                    )
                }
                value={cssProperties.size}
                onChange={event =>
                    update(draft => {
                        getCssProperties(draft).size = event.currentTarget.value;
                    })
                }
                disabled={!!codeOverrideProps.size || disabled}
                {...configFormFieldStyles}
            />
            <TextField
                label={
                    codeOverrideProps.lineHeight ? (
                        <>
                            <span>Line Height </span>
                            <DisabledInCodeTooltip />
                        </>
                    ) : (
                        "Line Height"
                    )
                }
                value={cssProperties.lineHeight}
                onChange={event =>
                    update(draft => {
                        getCssProperties(draft).lineHeight = event.currentTarget.value;
                    })
                }
                disabled={!!codeOverrideProps.lineHeight || disabled}
                {...configFormFieldStyles}
            />
            <SelectConfig
                title="Text Transform"
                locationInTheme={`${locationInTheme}.transform`}
                {...presetHelpers}
                disabled={disabled}
            >
                <option value="none">None</option>
                <option value="capitalize">Capitalize</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
            </SelectConfig>
        </ConfigWrapper>
    );
};

export default TypographyConfig;
