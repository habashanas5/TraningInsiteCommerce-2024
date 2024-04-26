import { ButtonProps } from "@insite/mobius/Button";
import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import { css } from "styled-components";

const PaginationPresentationPropsDefault: ComponentThemeProps["pagination"]["defaultProps"] = {
    buttonProps: {
        sizeVariant: "small",
        color: "text.main",
        hoverMode: "darken",
        buttonType: "outline",
        typographyProps: { size: 15, weight: 400, lineHeight: "20px" },
        css: css<ButtonProps>`
            border: none;
            &:not(:disabled):hover {
                color: ${({ theme }) => resolveColor("text.main", theme)};
                background: ${({ theme }) => resolveColor("common.border", theme)};
                border-color: ${({ theme }) => resolveColor("common.border", theme)};
            }
        `,
    },
    cssOverrides: {
        ellipsis: css`
            margin: 0 2px;
        `,
        currentButton: css<any>`
            &:hover {
                background: ${({ theme }) => resolveColor("primary", theme)};
                border-color: ${({ theme }) => resolveColor("primary", theme)};
                color: ${({ theme }) => resolveColor("primary.contrast", theme)};
            }
        `,
    },
    currentPageButtonVariant: "primary",
    selectProps: {
        cssOverrides: {
            formField: css`
                width: 240px;
                padding-right: 15px;
            `,
            formInputWrapper: css`
                max-width: 75px;
            `,
        },
        labelProps: {
            css: css`
                width: 155px;
            `,
        },
    },
    navIconsSrc: {
        firstPage: "ChevronsLeft",
        previousPage: "ChevronLeft",
        nextPage: "ChevronRight",
        lastPage: "ChevronsRight",
    },
};

export default PaginationPresentationPropsDefault;
