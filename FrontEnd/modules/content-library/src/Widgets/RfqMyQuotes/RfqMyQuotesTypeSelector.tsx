import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
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
    jobQuoteEnabled: getSettingsCollection(state).quoteSettings.jobQuoteEnabled,
    jobQuotesPageUrl: getPageLinkByPageType(state, "RfqJobQuotesPage")?.url,
});

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps>;

export interface RfqMyQuotesTypeSelectorStyles {
    wrapper?: InjectableCss;
    quoteTypeRadioGroup?: RadioGroupProps;
    quoteTypeRadioButton?: FieldSetPresentationProps<RadioComponentProps>;
}

export const rfqMyQuotesTypeSelectorStyles: RfqMyQuotesTypeSelectorStyles = {
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

const styles = rfqMyQuotesTypeSelectorStyles;

const RfqMyQuotesTypeSelector: FC<Props> = ({ jobQuoteEnabled, history, jobQuotesPageUrl }) => {
    const quoteTypeChangeHandler = () => {
        if (jobQuotesPageUrl) {
            history.push(jobQuotesPageUrl);
        }
    };

    if (!jobQuoteEnabled) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <RadioGroup
                {...styles.quoteTypeRadioGroup}
                label={<VisuallyHidden>{translate("Quote Type")}</VisuallyHidden>}
                value="quote"
                onChangeHandler={quoteTypeChangeHandler}
                data-test-selector="myQuotesTypeRadio"
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
    component: connect(mapStateToProps)(withHistory(RfqMyQuotesTypeSelector)),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Quote Type Selector",
        allowedContexts: [RfqMyQuotesPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
