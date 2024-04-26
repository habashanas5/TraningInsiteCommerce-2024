import { ButtonSizeVariants } from "@insite/mobius/Button";
import { FormFieldIcon, FormFieldPresentationPropsCommon } from "@insite/mobius/FormField/FormField";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import get from "@insite/mobius/utilities/get";
import Color from "color";
import { css } from "styled-components";

export interface VariantValues {
    fontSize: number;
    height: number;
    icon: number;
    iconPadding: number;
    descriptionLineSpacing: number;
    borderRadius: number;
    datePickerWidth: number;
    leftLabelPadding: number;
    button: ButtonSizeVariants;
    labelHeight: number;
}

interface SizeVariantValues {
    default: VariantValues;
    small: VariantValues;
}

export const sizeVariantValues: SizeVariantValues = {
    default: {
        fontSize: 15,
        height: 40,
        icon: 18,
        iconPadding: 10,
        descriptionLineSpacing: 10,
        borderRadius: 7,
        datePickerWidth: 145,
        leftLabelPadding: 9,
        button: "medium",
        labelHeight: 32,
    },
    small: {
        fontSize: 13,
        height: 30,
        icon: 15,
        iconPadding: 7,
        descriptionLineSpacing: 5,
        borderRadius: 5,
        datePickerWidth: 118,
        leftLabelPadding: 5,
        button: "small",
        labelHeight: 27,
    },
};

export const borderTypes = {
    error: {
        color: "colors.danger.main",
        width: 2,
        borderPaddingRule: "padding: 0 10px 0 10px;",
        textAreaBorderPaddingRule: "padding: 10px 10px;",
        underlinePaddingRule: "padding: 0 10px;",
        textAreaUnderlinePaddingRule: "padding: 10px 10px 8px 10px;",
    },
    focus: {
        color: "focus.color",
        width: 2,
        borderPaddingRule: "padding: 0 9px 0 9px;",
        textAreaBorderPaddingRule: "padding: 9px 9px;",
        underlinePaddingRule: "padding: 0 10px;",
        textAreaUnderlinePaddingRule: "padding: 10px 10px 8px 10px;",
    },
    inactive: {
        color: "colors.common.border",
        width: 1,
        borderPaddingRule: "padding: 0 10px 0 10px;",
        textAreaBorderPaddingRule: "padding: 10px 10px;",
        underlinePaddingRule: "padding: 0 10px 1px 10px;",
        textAreaUnderlinePaddingRule: "padding: 10px 10px 9px 10px;",
    },
} as const;

type BorderKind = FormFieldPresentationPropsCommon["border"];

const borderByState = (
    {
        border,
        _sizeVariant,
        theme,
    }: {
        border: BorderKind;
        _sizeVariant: keyof typeof sizeVariantValues;
        theme: BaseTheme;
    },
    state: keyof typeof borderTypes,
    textarea = false,
) => {
    const {
        width,
        color,
        borderPaddingRule,
        underlinePaddingRule,
        textAreaBorderPaddingRule,
        textAreaUnderlinePaddingRule,
    } = borderTypes[state];
    let borderStyle = "solid";
    if (state === "focus") {
        borderStyle = get(theme, "focus.style");
    }
    const colorProp = get(theme, color);
    /* Border radius of 0 is included to override macOS select default 5px radius */
    if (border === "rectangle") {
        return `border: ${width}px ${borderStyle} ${colorProp};
        border-radius: 0;
        ${textarea ? textAreaBorderPaddingRule : borderPaddingRule}`;
    }
    if (border === "rounded") {
        return `border: ${width}px ${borderStyle} ${colorProp};
        border-radius: ${sizeVariantValues[_sizeVariant].borderRadius}px;
        ${textarea ? textAreaBorderPaddingRule : borderPaddingRule}`;
    }
    return `border-style: ${borderStyle};
    border-width: 0 0 ${width}px 0;
    border-color: ${colorProp};
    ${textarea ? textAreaUnderlinePaddingRule : underlinePaddingRule}
    border-radius: 0;`;
};

export const disabledByType = ({ border, theme }: { border: BorderKind; theme: BaseTheme }) => {
    if (border === "rectangle" || border === "rounded") {
        const disabledBkg = Color(get(theme, "colors.common.disabled"))
            .rgb()
            .mix(Color(get(theme, "colors.common.background")), 0.8)
            .toString();
        return css`
            background: ${disabledBkg};
            color: ${get(theme, "colors.common.disabled")};
            & + ${/* sc-selector */ FormFieldIcon}, & + button ${/* sc-selector */ FormFieldIcon} {
                background: ${disabledBkg};
            }
        `;
    }
    return "border-bottom-style: dotted;";
};

export default borderByState;
