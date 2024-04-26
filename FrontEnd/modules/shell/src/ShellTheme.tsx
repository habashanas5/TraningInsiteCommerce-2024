import { ButtonPresentationProps } from "@insite/mobius/Button";
import baseTheme, { ThemeColors } from "@insite/mobius/globals/baseTheme";
import getColor from "@insite/mobius/utilities/getColor";
import * as axiomColors from "@optimizely/design-tokens/dist/js/colors";
import { css, FlattenSimpleInterpolation } from "styled-components";

export interface ShellThemeProps {
    theme: ShellTheme;
}

type ShellThemeInferred = typeof shellTheme;

export type ShellTheme = Omit<ShellThemeInferred, "sideBarWidth" | "headerHeight"> &
    Partial<Pick<ShellThemeInferred, "sideBarWidth" | "headerHeight">>;

export interface ShellColors extends ThemeColors {
    custom: {
        mainHeader: string;
        nonmatchingTreeLinks: string;
        accentSecondary: string;
        futurePublish: string;
        draftPage: string;
        neverPublished: string;
        isWaitingForApproval: string;
        isWaitingForApprovalActive: string;
        activeBorder: string;
        activeBackground: string;
        blueBase: string;
        brandPrimaryColor: string;
        buttonPrimaryActiveBackgroundColor: string;
        buttonPrimaryActiveBorderColor: string;
        buttonPrimaryActiveLabelColor: string;
        buttonPrimaryHoverBackgroundColor: string;
        buttonPrimaryHoverBorderColor: string;
        buttonPrimaryHoverLabelColor: string;
        borderDividerColor: string;
        buttonOutlinedActiveBackgroundColor: string;
        buttonOutlinedActiveBorderColor: string;
        buttonOutlinedActiveLabelColor: string;
        buttonOutlinedDisabledBackgroundColor: string;
        buttonOutlinedDisabledBorderColor: string;
        buttonOutlinedDisabledLabelColor: string;
        buttonOutlinedHoverBackgroundColor: string;
        buttonOutlinedHoverBorderColor: string;
        buttonOutlinedHoverLabelColor: string;
        buttonOutlinedFocusBackgroundColor: string;
        buttonOutlinedFocusBorderColor: string;
        buttonOutlinedFocusLabelColor: string;
        buttonOutlinedPressedBackgroundColor: string;
        buttonOutlinedPressedBorderColor: string;
        buttonPrimaryDisabledBackgroundColor: string;
        buttonPrimaryDisabledBorderColor: string;
        buttonPrimaryDisabledLabelColor: string;
        buttonPrimaryFocusBackgroundColor: string;
        buttonPrimaryFocusBorderColor: string;
        buttonPrimaryFocusLabelColor: string;
        buttonPrimaryPressedBackgroundColor: string;
        buttonPrimaryPressedBorderColor: string;
        buttonPrimaryPressedLabelColor: string;
    };
}

const colors: ShellColors = {
    custom: {
        mainHeader: "#d4e0fd",
        nonmatchingTreeLinks: "#bbb",
        accentSecondary: "#cccccc",
        futurePublish: "#0072bc",
        draftPage: "#ff6a00",
        neverPublished: "#ff2300",
        isWaitingForApproval: "#f7941d",
        isWaitingForApprovalActive: "#f2d7b8",
        activeBorder: axiomColors.brandBlueDark,
        activeBackground: axiomColors.brandBlueLight,
        blueBase: axiomColors.blueBase,
        brandPrimaryColor: axiomColors.brandPrimaryColor,
        buttonPrimaryActiveBackgroundColor: axiomColors.buttonPrimaryActiveBackgroundColor,
        buttonPrimaryActiveBorderColor: axiomColors.buttonPrimaryActiveBorderColor,
        buttonPrimaryActiveLabelColor: axiomColors.buttonPrimaryActiveLabelColor,
        buttonPrimaryHoverBackgroundColor: axiomColors.buttonPrimaryHoverBackgroundColor,
        buttonPrimaryHoverBorderColor: axiomColors.buttonPrimaryHoverBorderColor,
        buttonPrimaryHoverLabelColor: axiomColors.buttonPrimaryHoverLabelColor,
        borderDividerColor: axiomColors.borderDividerColor,
        buttonOutlinedActiveBackgroundColor: axiomColors.buttonOutlinedActiveBackgroundColor,
        buttonOutlinedActiveBorderColor: axiomColors.buttonOutlinedActiveBorderColor,
        buttonOutlinedActiveLabelColor: axiomColors.buttonOutlinedActiveLabelColor,
        buttonOutlinedDisabledBackgroundColor: axiomColors.buttonOutlinedDisabledBackgroundColor,
        buttonOutlinedDisabledBorderColor: axiomColors.buttonOutlinedDisabledBorderColor,
        buttonOutlinedDisabledLabelColor: axiomColors.buttonOutlinedDisabledLabelColor,
        buttonOutlinedHoverBackgroundColor: axiomColors.buttonOutlinedHoverBackgroundColor,
        buttonOutlinedHoverBorderColor: axiomColors.buttonOutlinedHoverBorderColor,
        buttonOutlinedHoverLabelColor: axiomColors.buttonOutlinedHoverLabelColor,
        buttonOutlinedFocusBackgroundColor: axiomColors.buttonOutlinedFocusBackgroundColor,
        buttonOutlinedFocusBorderColor: axiomColors.buttonOutlinedFocusBorderColor,
        buttonOutlinedFocusLabelColor: axiomColors.buttonOutlinedFocusLabelColor,
        buttonOutlinedPressedBackgroundColor: axiomColors.buttonOutlinedPressedBackgroundColor,
        buttonOutlinedPressedBorderColor: axiomColors.buttonOutlinedPressedBorderColor,
        buttonPrimaryDisabledBackgroundColor: axiomColors.buttonPrimaryDisabledBackgroundColor,
        buttonPrimaryDisabledBorderColor: axiomColors.buttonPrimaryDisabledBorderColor,
        buttonPrimaryDisabledLabelColor: axiomColors.buttonPrimaryDisabledLabelColor,
        buttonPrimaryFocusBackgroundColor: axiomColors.buttonPrimaryFocusBackgroundColor,
        buttonPrimaryFocusBorderColor: axiomColors.buttonPrimaryFocusBorderColor,
        buttonPrimaryFocusLabelColor: axiomColors.buttonPrimaryFocusLabelColor,
        buttonPrimaryPressedBackgroundColor: axiomColors.buttonPrimaryPressedBackgroundColor,
        buttonPrimaryPressedBorderColor: axiomColors.buttonPrimaryPressedBorderColor,
        buttonPrimaryPressedLabelColor: axiomColors.buttonPrimaryPressedLabelColor,
    },
    primary: {
        main: axiomColors.brandPurpleDark,
        contrast: axiomColors.brandBackgroundPrimaryColor,
    },
    secondary: {
        main: "#6c757d",
        contrast: axiomColors.brandBackgroundSecondaryColor,
    },
    common: {
        background: axiomColors.neutralColorsWhite,
        backgroundContrast: "#4A4A4A",
        accent: "#f4f4f4",
        accentContrast: "#4A4A4A",
        border: "#000000",
        disabled: "#888888",
    },
    text: {
        main: axiomColors.brandTextPrimaryColor,
        disabled: "#888",
        accent: "#9B9B9B",
        link: axiomColors.linkDefaultTextColor,
    },
    success: {
        main: "#28a745",
        contrast: "#fff",
    },
    danger: {
        main: axiomColors.brandErrorColor,
        contrast: "#fff",
    },
    warning: {
        main: "#ffc107",
        contrast: "#fff",
    },
    info: {
        main: "#17a2b8",
        contrast: "#fff",
    },
} as const;

const controlStyles = (withPadding: boolean) => css`
    border-radius: 4px;
    border: 1px solid ${colors.common.border};
    font-size: 16px;
    line-height: 19px;
    font-weight: 300;
    color: black;
    ${withPadding && "padding: 10px;"}
    width: 100%;
`;

const formField = css`
    margin-top: 10px;
    & .mobiusFileUpload {
        padding: 0 10px;
    }
`;

const buttonStyles: FlattenSimpleInterpolation = css`
    height: 32px;
    border-radius: 3px;
    border-width: 1px;
    padding: 0 16px;
    &:disabled {
        color: #bbb;
    }
`;

const buttonProps: ButtonPresentationProps = {
    buttonType: "solid",
    shape: "rounded",
    color: "common.backgroundContrast",
    typographyProps: {
        transform: "uppercase",
        weight: 700,
    },
    sizeVariant: "medium",
    css: buttonStyles,
};

const shellTheme = {
    sideBarWidth: "340px",
    headerHeight: "40px",
    ...baseTheme,
    colors,
    focus: {
        color: "#1456f1",
        style: "solid",
        width: "2px",
    },
    button: {
        primary: {
            ...buttonProps,
            color: "primary",
            css: css`
                height: 32px;
                border-radius: 3px;
                border-width: 1px;
                padding: 0 16px;
                background: ${({ theme }) => theme.colors.custom.buttonPrimaryActiveBackgroundColor};
                border: 2px solid ${({ theme }) => theme.colors.custom.buttonPrimaryActiveBorderColor};
                color: ${({ theme }) => theme.colors.custom.buttonPrimaryActiveLabelColor};

                &:hover {
                    background: ${({ theme }) => theme.colors.custom.buttonPrimaryHoverBackgroundColor};
                    border: 2px solid ${({ theme }) => theme.colors.custom.buttonPrimaryActiveBorderColor};
                    color: ${({ theme }) => theme.colors.custom.buttonPrimaryHoverLabelColor};
                }
                &:disabled {
                    color: #bbb;
                }
            `,
        },
        secondary: {
            ...buttonProps,
            color: "secondary",
            css: css`
                height: 32px;
                border-radius: 3px;
                border-width: 1px;
                padding: 0 16px;
                background: ${({ theme }) => theme.colors.custom.buttonOutlinedActiveBackgroundColor};
                border: 2px solid ${({ theme }) => theme.colors.custom.buttonOutlinedActiveBorderColor};
                color: ${({ theme }) => theme.colors.custom.buttonOutlinedActiveLabelColor};

                &:hover {
                    background: ${({ theme }) => theme.colors.custom.buttonOutlinedHoverBackgroundColor};
                    border: 2px solid ${({ theme }) => theme.colors.custom.buttonHoverActiveBorderColor};
                    color: ${({ theme }) => theme.colors.custom.buttonOutlinedHoverLabelColor};
                }
                &:disabled {
                    color: #bbb;
                }
            `,
        },
        tertiary: {
            ...buttonProps,
            buttonType: "outline",
            css: css`
                ${buttonStyles}
                border-width: 1px;
            `,
        },
    },
    formField: {
        defaultProps: {
            backgroundColor: "common.background",
            border: "rounded",
            cssOverrides: {
                inputSelect: controlStyles(true),
                formField,
            },
            labelProps: {
                size: "1rem",
                transform: "uppercase",
                weight: "bold",
                lineHeight: "21px",
                css: css`
                    overflow: visible;
                    white-space: nowrap;
                `,
                ellipsis: false,
            },
        },
    },
    datePicker: {
        defaultProps: {
            cssOverrides: {
                inputSelect: controlStyles(false),
                datePicker: css`
                    & .react-datetime-picker {
                        font-size: 13px;
                    }
                `,
            },
        },
    },
    typography: {
        ...baseTheme.typography,
        body: {
            fontFamily: "Inter, Barlow, sans-serif;",
            color: colors.text.main,
        },
        h1: {
            ...baseTheme.typography.h1,
            color: colors.primary.main,
            size: "2rem",
            lineHeight: "25px",
            weight: "bold",
        },
        h2: {
            ...baseTheme.typography.h2,
            size: "1.75rem",
            lineHeight: "21px",
            weight: 600,
            css: css`
                margin: 30px 0 10px;
            `,
        },
        h3: {
            ...baseTheme.typography.h3,
            size: "1.5rem",
            lineHeight: "21px",
            weight: 400,
            css: css`
                margin: 30px 0 10px;
            `,
        },
        h4: {
            ...baseTheme.typography.h4,
            size: "1.25rem",
            weight: 600,
        },
        h5: {
            ...baseTheme.typography.h5,
            size: "1.125rem",
            weight: 600,
        },
        h6: {
            ...baseTheme.typography.h6,
            size: "1rem",
            weight: 400,
        },
        p: {
            ...baseTheme.typography.p,
            color: "#9B9B9B",
            size: "13px",
            lineHeight: "15px",
        },
    },
    modal: {
        ...baseTheme.modal,
        defaultProps: {
            cssOverrides: {
                modalTitle: css`
                    background-color: ${getColor("common.backgroundContrast")};
                    padding: 10px 15px;
                    & button {
                        margin: -5px 0; /* makes sure modal title height does not differ if there is or is not a close button. */
                    }
                `,
                headlineTypography: css`
                    margin-bottom: 0;
                    text-transform: capitalize;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                `,
                modalContent: css`
                    padding: 15px;
                `,
                modalBody: css`
                    border-radius: 8px;
                    background-color: ${getColor("common.accent")};
                `,
            },
            closeButtonIconProps: {
                src: "X",
                size: 24,
            },
            headlineTypographyProps: {
                color: "common.background",
                weight: "bold",
                size: "18px",
                lineHeight: 1,
                transform: "uppercase",
            },
            closeButtonProps: {
                buttonType: "solid",
                color: "common.backgroundContrast",
            },
        },
    },
} as const;

export default shellTheme;
