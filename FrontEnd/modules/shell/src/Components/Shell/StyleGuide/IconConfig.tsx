import TextField from "@insite/mobius/TextField";
import get from "@insite/mobius/utilities/get";
import ColorPickerConfig from "@insite/shell/Components/Shell/StyleGuide/ColorPickerConfig";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetParentIfUndefined } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import IconSelector from "@insite/shell/Components/Shell/StyleGuide/IconSelector";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import * as React from "react";

const IconConfig: React.FunctionComponent<
    {
        idPrefix: string;
        disableSource?: true;
        insideForm?: boolean;
        title?: string;
        variant?: "accordion" | "popover";
        locationInTheme: string;
        disabled?: boolean;
    } & PresetHelpers
> = ({ idPrefix, locationInTheme, disableSource, title, insideForm, variant, disabled, ...presetHelpers }) => {
    const { theme, postStyleGuideTheme, update } = presetHelpers;

    const ConfigWrapper = variant === "accordion" ? SideBarAccordionSection : ConfigMenu;
    const getProps = createSetParentIfUndefined(locationInTheme);
    const codeOverrideProps = get(postStyleGuideTheme, locationInTheme) || {};
    const iconProps = get(theme, locationInTheme) || {};

    return (
        <ConfigWrapper
            title={title || "Icon Configuration"}
            insideForm={insideForm}
            inPopover={variant === "accordion"}
        >
            <ColorPickerConfig
                title="Color"
                isInPopover
                id={`${idPrefix}-icon-color`}
                locationInTheme={`${locationInTheme}.color`}
                disabled={disabled}
                {...presetHelpers}
            />
            {!disableSource && (
                <IconSelector disabled={disabled} title="Icon" locationInTheme={locationInTheme} {...presetHelpers} />
            )}
            <TextField
                {...configFormFieldStyles}
                label={
                    codeOverrideProps.size ? (
                        <>
                            <span>Size </span>
                            <DisabledInCodeTooltip />
                        </>
                    ) : (
                        "Size"
                    )
                }
                disabled={!!codeOverrideProps.size || disabled}
                value={iconProps.size}
                onChange={event =>
                    update(draft => {
                        const props = getProps(draft);
                        if (!event.currentTarget.value) {
                            delete props.size;
                        } else {
                            props.size = parseInt(event.currentTarget.value, 10);
                        }
                    })
                }
            />
        </ConfigWrapper>
    );
};

export default IconConfig;
