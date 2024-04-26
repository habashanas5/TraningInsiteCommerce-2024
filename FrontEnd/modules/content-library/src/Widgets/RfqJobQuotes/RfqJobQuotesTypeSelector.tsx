import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqJobQuotesPageContext } from "@insite/content-library/Pages/RfqJobQuotesPage";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import FieldSetPresentationProps from "@insite/mobius/utilities/fieldSetProps";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    myQuotesPageUrl: getPageLinkByPageType(state, "RfqMyQuotesPage")?.url,
});

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps>;

export interface RfqJobQuotesTypeSelectorStyles {
    wrapper?: InjectableCss;
    quoteTypeRadioGroup?: RadioGroupProps;
    quoteTypeRadioButton?: FieldSetPresentationProps<RadioComponentProps>;
}

export const rfqJobQuotesTypeSelectorStyles: RfqJobQuotesTypeSelectorStyles = {
    quoteTypeRadioGroup: {
        css: css`
            display: inline-block;
            padding-bottom: 20px;
            width: 100%;
            flex-direction: row;
            & > div {
                margin-right: 20px;
                display: inline-flex;
            }
        `,
    },
};

const styles = rfqJobQuotesTypeSelectorStyles;

const RfqJobQuotesTypeSelector = ({ history, myQuotesPageUrl }: Props) => {
    const quoteTypeChangeHandler = () => {
        if (myQuotesPageUrl) {
            history.push(myQuotesPageUrl);
        }
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            <RadioGroup
                {...styles.quoteTypeRadioGroup}
                label={<VisuallyHidden>{translate("Quote Type")}</VisuallyHidden>}
                value="job"
                onChangeHandler={quoteTypeChangeHandler}
                data-test-selector="jobQuotesTypeRadio"
            >
                <Radio {...styles.quoteTypeRadioButton} value="quote">
                    {translate("Pending")}
                </Radio>
                <Radio {...styles.quoteTypeRadioButton} value="job">
                    {translate("Active Jobs")}
                </Radio>
            </RadioGroup>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(RfqJobQuotesTypeSelector)),
    definition: {
        group: "RFQ Job Quotes",
        displayName: "Quote Type Selector",
        allowedContexts: [RfqJobQuotesPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
