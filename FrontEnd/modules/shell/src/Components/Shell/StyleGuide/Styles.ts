import { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import { FormFieldProps } from "@insite/mobius/FormField";
import getColor from "@insite/mobius/utilities/getColor";
import { css } from "styled-components";

const defaultConfigFormFieldStyles: Partial<FormFieldProps> = {
    labelPosition: "left",
    labelProps: {
        transform: "initial",
        weight: 300,
        css: css`
            text-transform: initial;
            text-align: left;
        `,
    },
    cssOverrides: {
        inputSelect: css`
            &:disabled {
                border-color: transparent;
                color: ${getColor("text.main")};
            }
        `,
        formField: css<FormFieldProps>`
            margin-top: 10px;
            &:hover {
                label {
                    color: ${({ theme, disabled }) => (disabled ? "inherit" : theme.colors.primary.main)};
                }
            }
        `,
    },
};

const defaultConfigCheckboxStyles: Partial<CheckboxProps> & CheckboxPresentationProps = {
    labelPosition: "left",
    variant: "toggle",
    typographyProps: {
        weight: 300,
        size: "1rem",
        css: css`
            text-transform: initial;
            text-align: left;
            margin-right: 10px;
        `,
    },
    css: css<FormFieldProps>`
        margin-left: 0;
        height: 40px;
        width: 100%;
        &:hover {
            label {
                color: ${({ theme, disabled }) => (disabled ? "inherit" : theme.colors.primary.main)};
            }
        }
    ` as any,
};

export const configFormFieldStyles: Pick<FormFieldProps, "cssOverrides" | "labelProps"> = {
    ...defaultConfigFormFieldStyles,
    cssOverrides: {
        ...defaultConfigFormFieldStyles?.cssOverrides,
        formField: css<FormFieldProps>`
            ${() => defaultConfigFormFieldStyles?.cssOverrides?.formField}
            label {
                > span {
                    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
                }
            }
        `,
    },
    labelProps: {
        ...defaultConfigFormFieldStyles?.labelProps,
        css: css`
            ${() => defaultConfigFormFieldStyles?.labelProps?.css}
            overflow: visible;
            white-space: nowrap;
        ` as any,
    },
};

export const configCheckboxStyles = {
    ...defaultConfigCheckboxStyles,
    typographyProps: {
        ...defaultConfigCheckboxStyles.typographyProps,
        disabledColor: "text.main",
    },
};
