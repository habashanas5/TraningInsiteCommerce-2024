import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/ToggleFiltersOpen";
import updateSearchFields from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    session: getSession(state),
    quotesDataView: getQuotesDataView(state, state.pages.rfqMyQuotes.getQuotesParameter),
    getQuotesParameter: state.pages.rfqMyQuotes.getQuotesParameter,
    jobQuoteEnabled: getSettingsCollection(state).quoteSettings.jobQuoteEnabled,
});

const mapDispatchToProps = {
    toggleFiltersOpen,
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqMyQuotesHeaderStyles {
    container?: GridContainerProps;
    statusFilterGridItem?: GridItemProps;
    statusSelect?: SelectPresentationProps;
    typeFilterGridItem?: GridItemProps;
    typeSelect?: SelectPresentationProps;
    quoteCountGridItem?: GridItemProps;
    quoteCountText?: TypographyPresentationProps;
    emptyGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const rfqMyQuotesHeaderStyles: RfqMyQuotesHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    statusFilterGridItem: {
        width: [12, 6, 4, 3, 2],
    },
    typeFilterGridItem: {
        width: [12, 6, 4, 3, 2],
    },
    quoteCountGridItem: {
        width: 11,
        style: { marginTop: "8px" },
    },
    quoteCountText: { weight: 800 },
    toggleFilterGridItem: {
        width: 1,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
};

const styles = rfqMyQuotesHeaderStyles;

const RfqMyQuotesHeader = ({
    id,
    session,
    quotesDataView,
    getQuotesParameter,
    jobQuoteEnabled,
    toggleFiltersOpen,
    updateSearchFields,
}: Props) => {
    const quotesCount =
        quotesDataView.value && quotesDataView.pagination ? quotesDataView.pagination.totalItemCount : 0;

    const [status, setStatus] = useState(
        getQuotesParameter.statuses && getQuotesParameter.statuses.length > 0 ? getQuotesParameter.statuses[0] : "",
    );
    const statusChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateSearchFields({ statuses: event.target.value ? [event.target.value] : undefined });
    };

    const [type, setType] = useState(getQuotesParameter.types || "");
    const typeChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value;
        if (!newType) {
            updateSearchFields({ types: undefined });
        } else if (newType === "quote" || newType === "job") {
            updateSearchFields({ types: newType });
        }
    };

    useEffect(() => {
        setStatus(
            getQuotesParameter.statuses && getQuotesParameter.statuses.length > 0 ? getQuotesParameter.statuses[0] : "",
        );
        setType(getQuotesParameter.types || "");
    }, [getQuotesParameter]);

    return (
        <>
            <Zone contentId={id} zoneName="Content00" />
            <GridContainer {...styles.container}>
                <GridItem {...styles.statusFilterGridItem}>
                    <Select
                        {...styles.statusSelect}
                        label={translate("Status")}
                        value={status}
                        onChange={statusChangeHandler}
                    >
                        <option value="">{translate("Select")}</option>
                        {session.isSalesPerson && <option value="QuoteCreated">{translate("Created")}</option>}
                        <option value="QuoteRequested">{translate("Requested")}</option>
                        {session.isSalesPerson && <option value="QuoteRejected">{translate("Rejected")}</option>}
                        <option value="QuoteProposed">{translate("Proposed")}</option>
                    </Select>
                </GridItem>
                {jobQuoteEnabled && (
                    <GridItem {...styles.typeFilterGridItem}>
                        <Select
                            {...styles.typeSelect}
                            label={translate("Quote Type")}
                            value={type}
                            onChange={typeChangeHandler}
                        >
                            <option value="">{translate("Select")}</option>
                            <option value="quote">{translate("Sales Quotes")}</option>
                            <option value="job">{translate("Job Quotes")}</option>
                        </Select>
                    </GridItem>
                )}
                <GridItem {...styles.quoteCountGridItem}>
                    <Typography {...styles.quoteCountText} data-test-selector="rfqMyQuotes_count">
                        {quotesCount === 1 && translate("{0} Quote", quotesCount.toString())}
                        {quotesCount > 1 && translate("{0} Quotes", quotesCount.toString())}
                    </Typography>
                </GridItem>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={toggleFiltersOpen} data-test-selector="rfqMyQuotes_toggleFilter">
                        <VisuallyHidden>{translate("Toggle Filter")}</VisuallyHidden>
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqMyQuotesHeader),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Page Header",
        allowedContexts: [RfqMyQuotesPageContext],
    },
};

export default widgetModule;
