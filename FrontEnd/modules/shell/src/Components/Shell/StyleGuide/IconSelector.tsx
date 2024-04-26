import Checkbox from "@insite/mobius/Checkbox";
import DynamicDropdown, { DynamicDropdownProps } from "@insite/mobius/DynamicDropdown";
import { FormFieldProps } from "@insite/mobius/FormField";
import Icon from "@insite/mobius/Icon";
import iconsObject from "@insite/mobius/Icons/commonIcons";
import TextField from "@insite/mobius/TextField";
import Typography from "@insite/mobius/Typography";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { createSetParentIfUndefined, undefinedIfFunction } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import { configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/Styles";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import get from "lodash/get";
import React from "react";
import styled, { css } from "styled-components";

const OptionRow = styled.div`
    display: flex;
    align-items: center;
`;

const IconSelector: React.FunctionComponent<
    {
        locationInTheme: string;
        title: string;
        disabled?: boolean;
    } & PresetHelpers
> = ({ locationInTheme, postStyleGuideTheme, theme, disabled, title, update }) => {
    const codeOverridden = !!get(postStyleGuideTheme, `${locationInTheme}.src`);
    const value = undefinedIfFunction(get(theme, `${locationInTheme}.src`));
    /* eslint-disable no-prototype-builtins */
    const valueIsIconKey = value ? iconsObject.hasOwnProperty(value) : false;
    const [useDirectSource, setUseDirectSource] = React.useState(value ? !iconsObject.hasOwnProperty(value) : false);
    /* eslint-enable no-prototype-builtins */
    const textFieldProps = valueIsIconKey ? {} : { value };
    const options = Object.keys(iconsObject).map(iconKey => {
        return {
            optionText: iconKey,
            optionValue: iconKey,
            rowChildren: (
                <OptionRow key={iconKey}>
                    <Icon src={iconsObject[iconKey]} />
                    <Typography
                        css={css`
                            padding-left: 10px;
                        `}
                    >
                        {iconKey}
                    </Typography>
                </OptionRow>
            ),
        };
    });

    const setValue = (value?: string) => {
        update(draft => {
            const props = createSetParentIfUndefined(locationInTheme)(draft);
            if (!value) {
                delete props.src;
            } else {
                props.src = value;
            }
        });
    };

    return (
        <>
            {useDirectSource ? (
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
                    {...textFieldProps}
                    {...configFormFieldStyles}
                    onChange={event => setValue(event.currentTarget.value)}
                    disabled={disabled}
                />
            ) : (
                <DynamicDropdown
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
                    options={options}
                    selected={value || ""}
                    disabled={disabled}
                    onSelectionChange={setValue}
                    {...(configFormFieldStyles as Partial<DynamicDropdownProps>)}
                />
            )}
            {disabled || (
                <Checkbox
                    variant="toggle"
                    labelPosition="right"
                    checked={useDirectSource}
                    onChange={() => setUseDirectSource(!useDirectSource)}
                    css={css`
                        margin-top: 10px;
                    `}
                >
                    Use direct source
                </Checkbox>
            )}
        </>
    );
};

export default IconSelector;
