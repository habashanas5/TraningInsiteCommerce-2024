import { reviewBudgetStyles } from "@insite/content-library/Widgets/Budget/ReviewBudget";
import { css } from "styled-components";

reviewBudgetStyles.filterWrapper = {
    css: css`
        display: block;
        margin: 25px 0 15px 0;
    `,
};

reviewBudgetStyles.select = {
    css: css`
        &&&,
        &&&:focus {
            padding-right: 35px;
        }
    `,
};
