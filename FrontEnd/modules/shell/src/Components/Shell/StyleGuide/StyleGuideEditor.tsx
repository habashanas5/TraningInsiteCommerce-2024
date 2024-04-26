import { postStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import Accordion from "@insite/mobius/Accordion";
import Button, { ButtonIcon } from "@insite/mobius/Button";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import Clickable from "@insite/mobius/Clickable";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import get from "@insite/mobius/utilities/get";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import { RedoSrc } from "@insite/shell/Components/Icons/Redo";
import { UndoSrc } from "@insite/shell/Components/Icons/Undo";
import { SideBarStyle } from "@insite/shell/Components/Layout";
import ButtonConfig from "@insite/shell/Components/Shell/StyleGuide/ButtonConfig";
import CheckboxConfig from "@insite/shell/Components/Shell/StyleGuide/CheckboxConfig";
import ColorPickerConfig from "@insite/shell/Components/Shell/StyleGuide/ColorPickerConfig";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import ElementTypographyConfig from "@insite/shell/Components/Shell/StyleGuide/ElementTypographyConfig";
import { createSetNewValueInDraft } from "@insite/shell/Components/Shell/StyleGuide/Helpers";
import IconConfig from "@insite/shell/Components/Shell/StyleGuide/IconConfig";
import IconSelector from "@insite/shell/Components/Shell/StyleGuide/IconSelector";
import SelectConfig from "@insite/shell/Components/Shell/StyleGuide/SelectConfig";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import TextFieldConfig from "@insite/shell/Components/Shell/StyleGuide/TextFieldConfig";
import { createMergedTheme, Updater } from "@insite/shell/Components/Shell/StyleGuide/Types";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { colorResultToString } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import {
    cancelSave,
    loadTheme,
    redo,
    resetTheme,
    saveTheme,
    setTheme,
    undo,
} from "@insite/shell/Store/StyleGuide/StyleGuideActionCreators";
import * as React from "react";
import { ReactNode } from "react";
import { ColorResult } from "react-color";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const createColorPreset = (displayAs: string, name: string, currentValue: string, preventColorReset?: boolean) => ({
    displayAs,
    name,
    currentValue,
    update: createSetNewValueInDraft(`colors.${name}`),
    preventColorReset,
});

const mapStateToProps = (state: ShellState) => ({
    permissions: state.shellContext.permissions,
    ...state.styleGuide,
});

const mapDispatchToProps = {
    setTheme,
    saveTheme,
    loadTheme,
    cancelSave,
    undo,
    redo,
    resetTheme,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const ConnectableStyleGuideEditor: React.FunctionComponent<Props> = props => {
    const { setTheme, saveTheme, loadTheme, cancelSave, undo, redo, resetTheme } = props;
    React.useEffect(() => {
        if (props.theme) {
            return;
        }
        loadTheme();
    }, []);

    if (!props.theme) {
        return (
            <>
                <SideBarStyle
                    css={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `}
                >
                    <LoadingSpinner />
                </SideBarStyle>
            </>
        );
    }

    const codeOverridden = (path: string) => !!get(postStyleGuideTheme, path);

    // Being from redux, the theme is frozen.
    // `ThemeProvider` wants to write the `translate` property, which is root-level, so a shallow clone allows this.
    const shallowClonedTheme = { ...props.theme };
    const theme = createMergedTheme(shallowClonedTheme);

    const update = (update: Updater) => setTheme(shallowClonedTheme, update);

    const exitButtonProps = { color: "common.backgroundContrast", typographyProps: { weight: 400 } };
    const { colors } = theme;
    const exitLinks =
        props.history.length !== 1 ? (
            <ActionBar>
                <Button onClick={() => saveTheme(shallowClonedTheme)}>Save</Button>
                <Button {...exitButtonProps} buttonType="solid" onClick={() => cancelSave()}>
                    Cancel
                </Button>
                <Button
                    {...exitButtonProps}
                    buttonType="solid"
                    sizeVariant="small"
                    onClick={() => undo()}
                    disabled={props.historyIndex === 0}
                >
                    <ButtonIcon src={UndoSrc} />
                </Button>
                <Button
                    {...exitButtonProps}
                    buttonType="solid"
                    sizeVariant="small"
                    onClick={() => redo()}
                    disabled={props.historyIndex === props.history.length - 1}
                >
                    <ButtonIcon src={RedoSrc} />
                </Button>
            </ActionBar>
        ) : null;

    const presets = [
        createColorPreset("Primary", "primary.main", colors.primary.main),
        createColorPreset("Primary Contrast", "primary.contrast", colors.primary.contrast),
        createColorPreset("Secondary", "secondary.main", colors.secondary.main),
        createColorPreset("Secondary Contrast", "secondary.contrast", colors.secondary.contrast),
        createColorPreset("Success", "success.main", colors.success.main),
        createColorPreset("Success Contrast", "success.contrast", colors.success.contrast),
        createColorPreset("Danger", "danger.main", colors.danger.main),
        createColorPreset("Danger Contrast", "danger.contrast", colors.danger.contrast),
        createColorPreset("Warning", "warning.main", colors.warning.main),
        createColorPreset("Warning Contrast", "warning.contrast", colors.warning.contrast),
        createColorPreset("Info", "info.main", colors.info.main),
        createColorPreset("Info Contrast", "info.contrast", colors.info.contrast),
        createColorPreset("Background", "common.background", colors.common.background),
        createColorPreset("Background Contrast", "common.backgroundContrast", colors.common.backgroundContrast),
        createColorPreset("Accent", "common.accent", colors.common.accent),
        createColorPreset("Accent Contrast", "common.accentContrast", colors.common.accentContrast),
        createColorPreset("Border", "common.border", colors.common.border),
        createColorPreset("Disabled", "common.disabled", colors.common.disabled),
        createColorPreset("Text Main", "text.main", colors.text.main),
        createColorPreset("Text Accent", "text.accent", colors.text.accent),
        createColorPreset("Text Disabled", "text.disabled", colors.text.disabled),
        createColorPreset("Text Link", "text.link", colors.text.link, true),
    ];

    const presetColors: string[] = [];
    const presetValuesByName: { [color: string]: string | undefined } = {};
    const presetNamesByColor: { [color: string]: string | undefined } = {};

    for (const preset of presets) {
        if (presetColors.indexOf(preset.currentValue) < 0) {
            presetColors.push(preset.currentValue);
        }
        presetValuesByName[preset.name] = preset.currentValue;
        presetNamesByColor[preset.currentValue] = preset.name;
    }

    const tryMatchColorResultToPresetName = (color: ColorResult) => {
        const colorAsString = colorResultToString(color);
        if (!colorAsString) {
            return undefined;
        }
        return presetNamesByColor[colorAsString] || colorAsString;
    };

    const tryMatchColorStringToPresetValue = (color: string | undefined) => {
        if (!color) {
            return color;
        }

        const preset = presetValuesByName[color];
        return preset || resolveColor(color, theme);
    };

    const presetHelpers = {
        update,
        tryMatchColorStringToPresetValue,
        tryMatchColorResultToPresetName,
        presetColors,
        postStyleGuideTheme,
        theme,
    };

    const disableEditGlobalStyleGuide = !props.permissions?.canEditGlobalStyleGuide;

    const selectConfig = (title: string, locationInTheme: string, children: ReactNode) => {
        return (
            <SelectConfig
                title={title}
                locationInTheme={locationInTheme}
                {...presetHelpers}
                disabled={disableEditGlobalStyleGuide}
            >
                {children}
            </SelectConfig>
        );
    };

    const buttonConfig = (title: string, idPrefix: string, locationInTheme: string, disableTypography?: boolean) => {
        return (
            <ButtonConfig
                title={title}
                idPrefix={idPrefix}
                locationInTheme={locationInTheme}
                disableTypography={disableTypography}
                insideForm
                {...presetHelpers}
                disabled={disableEditGlobalStyleGuide}
            />
        );
    };

    const typographyConfig = (title: string, idPrefix: string, locationInTheme: string) => {
        return (
            <TypographyConfig
                title={title}
                idPrefix={idPrefix}
                locationInTheme={locationInTheme}
                enableColorPresets
                insideForm
                {...presetHelpers}
                disabled={disableEditGlobalStyleGuide}
            />
        );
    };

    const iconConfig = (idPrefix: string, locationInTheme: string, otherProps?: unknown) => {
        return (
            <IconConfig
                idPrefix={idPrefix}
                locationInTheme={locationInTheme}
                insideForm
                {...presetHelpers}
                disabled={disableEditGlobalStyleGuide}
                {...otherProps}
            />
        );
    };

    return (
        <>
            {exitLinks}
            <SideBarStyle>
                <form spellCheck={false} onSubmit={event => event.preventDefault()}>
                    <Typography {...sectionTitleProps}>Site Colors</Typography>
                    {presets.map(preset => (
                        <ColorPickerWrapper key={preset.name}>
                            <ColorPicker
                                label={preset.displayAs}
                                id={preset.name}
                                color={preset.currentValue}
                                disabled={codeOverridden(`colors.${preset.name}`) || disableEditGlobalStyleGuide}
                                preventColorReset={preset.preventColorReset}
                                onChange={color => update(draft => preset.update(draft, colorResultToString(color)))}
                            />
                        </ColorPickerWrapper>
                    ))}
                    <Typography {...sectionTitleProps}>Site Typography</Typography>
                    <Accordion headingLevel={3}>
                        <ElementTypographyConfig
                            element="body"
                            elementDisplayName="Body"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="p"
                            elementDisplayName="Paragraph (<p>)"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="h1"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="h2"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="h3"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="h4"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="h5"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="h6"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="legend"
                            elementDisplayName="Legend"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="headerPrimary"
                            elementDisplayName="Header Primary"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="headerSecondary"
                            elementDisplayName="Header Secondary"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ElementTypographyConfig
                            element="headerTertiary"
                            elementDisplayName="Header Tertiary"
                            {...presetHelpers}
                            disabled={disableEditGlobalStyleGuide}
                        />
                        <ConfigMenu title="Link">
                            <ColorPickerConfig
                                isInPopover
                                locationInTheme="link.defaultProps.color"
                                title="Color"
                                id="link-color"
                                {...presetHelpers}
                                preventColorReset
                            />
                            {selectConfig(
                                "Hover Mode",
                                "link.defaultProps.hoverMode",
                                <>
                                    <option value="" hidden disabled></option>
                                    <option value="darken">Darken</option>
                                    <option value="lighten">Lighten</option>
                                </>,
                            )}
                            {iconConfig("link", "link.defaultProps.icon.iconProps", {
                                disableSource: true,
                                variant: "accordion",
                            })}
                        </ConfigMenu>
                    </Accordion>
                    <Typography {...sectionTitleProps}>Components</Typography>
                    <Accordion headingLevel={3}>
                        <SideBarAccordionSection title="Accordion">
                            {typographyConfig(
                                "Header Text",
                                "accordion",
                                "accordion.sectionDefaultProps.titleTypographyProps",
                            )}
                            {iconConfig("accordion", "accordion.sectionDefaultProps.toggleIconProps")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Breadcrumb">
                            {typographyConfig(
                                "Breadcrumb Typography",
                                "breadcrumb",
                                "breadcrumbs.defaultProps.typographyProps",
                            )}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Button">
                            {buttonConfig("Primary Button", "primary-button", "button.primary")}
                            {buttonConfig("Secondary Button", "secondary-button", "button.secondary")}
                            {buttonConfig("Tertiary Button", "tertiary-button", "button.tertiary")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Form Field Options">
                            {selectConfig(
                                "Border",
                                "formField.defaultProps.border",
                                <>
                                    <option value="" hidden disabled></option>
                                    <option value="underline">Underline</option>
                                    <option value="rectangle">Rectangle</option>
                                    <option value="rounded">Rounded</option>
                                </>,
                            )}
                            {selectConfig(
                                "Size Variant",
                                "formField.defaultProps.sizeVariant",
                                <>
                                    <option value="" hidden disabled></option>
                                    <option value="default">Default</option>
                                    <option value="small">Small</option>
                                </>,
                            )}
                            {typographyConfig("Error Text", "error-text", "formField.defaultProps.errorProps")}
                            {typographyConfig("Label Text", "label-text", "formField.defaultProps.labelProps")}
                            {typographyConfig("Hint Text", "hint-text", "formField.defaultProps.hintProps")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Field Set Options">
                            <ColorPickerConfig
                                firstInput
                                locationInTheme="fieldSet.defaultProps.color"
                                title="Color"
                                id="field-set-options-color"
                                {...presetHelpers}
                            />
                            {selectConfig(
                                "Size Variant",
                                "fieldSet.defaultProps.sizeVariant",
                                <>
                                    <option value="" hidden disabled></option>
                                    <option value="default">Default</option>
                                    <option value="small">Small</option>
                                </>,
                            )}
                            {typographyConfig(
                                "Group Label Text Properties",
                                "group-label-text-properties",
                                "fieldSet.groupDefaultProps.labelProps",
                            )}
                            {typographyConfig(
                                "Item Label Text Properties",
                                "item-label-text-properties",
                                "fieldSet.defaultProps.typographyProps",
                            )}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Checkbox">
                            <IconSelector
                                title="Icon"
                                disabled={disableEditGlobalStyleGuide}
                                locationInTheme="checkbox.defaultProps.iconProps"
                                {...presetHelpers}
                            />
                            <IconSelector
                                title="Indeterminate Icon"
                                disabled={disableEditGlobalStyleGuide}
                                locationInTheme="checkbox.defaultProps.indeterminateIconProps"
                                {...presetHelpers}
                            />
                            <ColorPickerConfig
                                firstInput
                                locationInTheme="checkbox.defaultProps.indeterminateColor"
                                title="Indeterminate Color"
                                id="indeterminate-color"
                                {...presetHelpers}
                            />
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Date Picker">
                            <TextFieldConfig
                                title="Format"
                                hint={
                                    <Clickable
                                        href="https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table"
                                        target="_blank"
                                    >
                                        Format Reference
                                    </Clickable>
                                }
                                locationInTheme="datePicker.defaultProps.format"
                                disabled={disableEditGlobalStyleGuide}
                                {...presetHelpers}
                            />
                            {selectConfig(
                                "Calendar Type",
                                "datePicker.defaultProps.dateTimePickerProps.calendarType",
                                <>
                                    <option value="" hidden disabled></option>
                                    <option value="ISO 8601">ISO 8601</option>
                                    <option value="US">US</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Hebrew">Hebrew</option>
                                </>,
                            )}
                            <CheckboxGroup
                                css={css`
                                    margin-top: 10px;
                                `}
                            >
                                <CheckboxConfig
                                    locationInTheme="datePicker.defaultProps.dateTimePickerProps.showLeadingZeros"
                                    title="Show Leading Zeros"
                                    disabled={disableEditGlobalStyleGuide}
                                    {...presetHelpers}
                                />
                                <CheckboxConfig
                                    locationInTheme="datePicker.defaultProps.dateTimePickerProps.showFixedNumberOfWeeks"
                                    title="Show Fixed Number of Weeks"
                                    disabled={disableEditGlobalStyleGuide}
                                    {...presetHelpers}
                                />
                                <CheckboxConfig
                                    locationInTheme="datePicker.defaultProps.dateTimePickerProps.showNeighboringMonth"
                                    title="Show Neighboring Month"
                                    disabled={disableEditGlobalStyleGuide}
                                    {...presetHelpers}
                                />
                            </CheckboxGroup>
                            <TextFieldConfig
                                title="Year Placeholder"
                                locationInTheme="datePicker.defaultProps.placeholders.yearPlaceholder"
                                disabled={disableEditGlobalStyleGuide}
                                {...presetHelpers}
                            />
                            <TextFieldConfig
                                title="Month Placeholder"
                                locationInTheme="datePicker.defaultProps.placeholders.monthPlaceholder"
                                disabled={disableEditGlobalStyleGuide}
                                {...presetHelpers}
                            />
                            <TextFieldConfig
                                title="Day Placeholder"
                                locationInTheme="datePicker.defaultProps.placeholders.dayPlaceholder"
                                disabled={disableEditGlobalStyleGuide}
                                {...presetHelpers}
                            />
                            {iconConfig("datepicker-calendar", "datePicker.defaultProps.calendarIconProps", {
                                title: "Calendar Icon Configuration",
                            })}
                            {iconConfig("datepicker-clear", "datePicker.defaultProps.clearIconProps", {
                                title: "Clear Icon Configuration",
                            })}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="File Upload">
                            {buttonConfig("Button Props", "file-upload-button", "fileUpload.defaultProps.buttonProps")}
                            {iconConfig("file-upload", "fileUpload.defaultProps.iconProps")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Spinner">
                            <ColorPickerConfig
                                firstInput
                                locationInTheme="loadingSpinner.defaultProps.color"
                                title="Color"
                                id="spinner-color"
                                {...presetHelpers}
                            />
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Overflow Menu">
                            {buttonConfig(
                                "Primary Button",
                                "overflow-button",
                                "overflowMenu.defaultProps.buttonProps",
                                true,
                            )}
                            {iconConfig("overflow-icon", "overflowMenu.defaultProps.iconProps")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Pagination">
                            {selectConfig(
                                "Current Page Variant",
                                "pagination.defaultProps.currentPageButtonVariant",
                                <>
                                    <option value="" hidden disabled></option>
                                    <option value="primary">Primary</option>
                                    <option value="secondary">Secondary</option>
                                    <option value="tertiary">Tertiary</option>
                                </>,
                            )}
                            {buttonConfig("Other Buttons", "pagination-button", "pagination.defaultProps.buttonProps")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Tag">
                            <ColorPickerConfig
                                firstInput
                                locationInTheme="tag.defaultProps.color"
                                title="Color"
                                id="tag-color"
                                {...presetHelpers}
                            />
                            {iconConfig("tag", "tag.defaultProps.iconProps")}
                            {typographyConfig("Typography", "tag-text-properties", "tag.defaultProps.typographyProps")}
                        </SideBarAccordionSection>
                        <SideBarAccordionSection title="Tooltip">
                            {iconConfig("tooltip", "tooltip.defaultProps.iconProps")}
                            {typographyConfig(
                                "Typography",
                                "tooltip-text-properties",
                                "tooltip.defaultProps.typographyProps",
                            )}
                        </SideBarAccordionSection>
                    </Accordion>
                </form>
                <ResetButton disabled={disableEditGlobalStyleGuide} onClick={() => resetTheme()}>
                    Reset Styles to Default
                    <Typography variant="p" as="span">
                        This can be undone.
                    </Typography>
                </ResetButton>
            </SideBarStyle>
        </>
    );
};

const ColorPickerWrapper = styled.div`
    padding: 5px 35px;
    &:hover {
        background-color: #d4e0fd;
    }
`;

const ResetButton = styled.button`
    height: 35px;
    display: block;
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.primary.main};
    border-radius: 4px;
    background: transparent;
    color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    font-weight: bold;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
    text-transform: uppercase;
    margin: 42px auto 85vh auto;
    cursor: pointer;
    > span {
        text-transform: none;
    }
`;

const ActionBar = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    background: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
    padding: 12px 10px 12px 34px;
    display: flex;
    justify-content: space-between;
    z-index: 1300;
    button:disabled {
        background: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        border-color: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        ${ButtonIcon} {
            color: ${(props: ShellThemeProps) => props.theme.colors.common.disabled};
        }
    }
`;

const sectionTitleProps: TypographyProps = {
    as: "h2",
    variant: "h5",
    transform: "uppercase",
    css: css`
        margin: 20px 0 0;
        padding: 0 35px;
    `,
};

const StyleGuideEditor = connect(mapStateToProps, mapDispatchToProps)(ConnectableStyleGuideEditor);

export default StyleGuideEditor;
