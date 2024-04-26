import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { getBudgetYears } from "@insite/client-framework/Store/Data/Budgets/BudgetsSelectors";
import translate from "@insite/client-framework/Translate";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps {
    budgetYear: number;
    extendedStyles?: BudgetYearSelectorStyles;
    onBudgetYearChange: (budgetYear: number) => void;
    dataTestSelector?: string;
}

type Props = OwnProps;

export interface BudgetYearSelectorStyles {
    wrapper?: InjectableCss;
    select?: SelectProps;
}

export const yearSelectorStyles: BudgetYearSelectorStyles = {
    wrapper: {
        css: css`
            display: inline-block;
            margin: 0 30px 15px 0;
        `,
    },
};

const BudgetYearSelector: React.FunctionComponent<Props> = props => {
    const budgetYears = getBudgetYears(5);

    const [styles] = React.useState(() => mergeToNew(yearSelectorStyles, props.extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper}>
            <Select
                label={translate("Select Budget Year")}
                {...styles.select}
                value={props.budgetYear}
                data-test-selector={props.dataTestSelector}
                onChange={(event: React.FormEvent<HTMLSelectElement>) =>
                    props.onBudgetYearChange(Number(event.currentTarget.value))
                }
            >
                {budgetYears.map((budgetYear: number) => (
                    <option key={budgetYear} value={budgetYear}>
                        {budgetYear}
                    </option>
                ))}
            </Select>
        </StyledWrapper>
    );
};

export default BudgetYearSelector;
