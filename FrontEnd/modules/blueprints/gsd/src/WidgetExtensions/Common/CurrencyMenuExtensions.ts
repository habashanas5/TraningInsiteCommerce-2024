import { currencyMenuStyles } from "@insite/content-library/Widgets/Common/CurrencyMenu";
import { FormFieldIcon } from "@insite/mobius/FormField";
import { css } from "styled-components";

currencyMenuStyles.currencyWrapper = {
    css: css`
        display: flex;
        margin-bottom: 5px;
        padding-right: 30px; // extra space needed to right
    `,
};

currencyMenuStyles.currencySelect = {
    backgroundColor: "black",
    cssOverrides: {
        formInputWrapper: css`
            width: 100px;
            ${FormFieldIcon} {
                height: 19px; // chevron icon needs to move up
                color: white; // and be white
            }
        `,
        inputSelect: css`
            border: none;
            text-transform: uppercase;
            color: white; // white on black
            height: 23px; // prevent header from getting taller
            line-height: 1; // prevent header from getting taller
        `,
    },
};

currencyMenuStyles.currencySymbol = {
    size: 22,
    css: css`
        margin-top: 3px;
        background-color: black;
        color: white; // change color of text
        line-height: 1; // prevent header from getting taller
    `,
};
