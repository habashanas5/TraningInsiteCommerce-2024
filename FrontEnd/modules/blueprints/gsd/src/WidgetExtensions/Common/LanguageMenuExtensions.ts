import { languageMenuStyles } from "@insite/content-library/Widgets/Common/LanguageMenu";
import { FormFieldIcon } from "@insite/mobius/FormField";
import Globe from "@insite/mobius/Icons/Globe";
import { css } from "styled-components";

languageMenuStyles.languageWrapper = {
    css: css`
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        padding-right: 10px;
    `,
};

languageMenuStyles.languageSelect = {
    backgroundColor: "black",
    iconProps: {},
    cssOverrides: {
        formInputWrapper: css`
            width: 100px;
            top: -1px; // fix alignment with other items
            ${FormFieldIcon} {
                height: 17px; // chevron icon needs to move up
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

languageMenuStyles.languageIcon = {
    size: 22,
    src: Globe,
    css: css`
        margin-top: 0px;
    `,
};
