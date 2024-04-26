import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import siteMessage from "@insite/client-framework/SiteMessage";
import { BudgetEnforcementLevel } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps {
    enforcementLevel: BudgetEnforcementLevel;
    extendedStyles?: EnforcementLevelDisplayStyles;
}

type Props = OwnProps;

export interface EnforcementLevelDisplayStyles {
    labelText?: TypographyProps;
    valueText?: TypographyProps;
}

export const enforcementLevelDisplayStyles: EnforcementLevelDisplayStyles = {
    labelText: {
        as: "h3",
        variant: "h6",
        css: css`
            display: inline-block;
        `,
    },
};

const EnforcementLevelDisplay: React.FunctionComponent<Props> = props => {
    const [styles] = React.useState(() => mergeToNew(enforcementLevelDisplayStyles, props.extendedStyles));

    let enforcementText;
    switch (props.enforcementLevel) {
        case "None":
            enforcementText = translate("No Enforcement");
            break;
        case "ShipTo":
            enforcementText = translate("Customer Ship To Level");
            break;
        case "Customer":
            enforcementText = translate("Customer Level");
            break;
        case "User":
            enforcementText = translate("User Level");
            break;
    }

    return (
        <>
            <Typography {...styles.labelText}>{siteMessage("Budget_CurrentEnforcementLevel")}:</Typography>
            <Typography {...styles.valueText}>&nbsp;{enforcementText}</Typography>
        </>
    );
};

export default EnforcementLevelDisplay;
