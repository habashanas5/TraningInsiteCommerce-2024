import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadQuotes from "@insite/client-framework/Store/Data/Quotes/Handlers/LoadQuotes";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import CardListHeading from "@insite/content-library/Components/CardListHeading";
import QuoteSummaryCard, { QuoteSummaryCardStyles } from "@insite/content-library/Components/QuoteSummaryCard";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const isAuthenticated = session.isAuthenticated && !session.isGuest;
    return {
        settingsCollection: getSettingsCollection(state),
        session,
        quotesDataView: getQuotesDataView(state, recentQuotesParameter),
        myQuotesPageNavLink: getPageLinkByPageType(state, "RfqMyQuotesPage"),
        canViewQuotes: isAuthenticated && (session.userRoles || "").indexOf("Requisitioner") === -1,
    };
};

const mapDispatchToProps = {
    loadQuotes,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RecentQuotesStyles {
    cardList?: CardListStyles;
    noQuotesGridItem?: GridItemProps;
    noQuotesText?: TypographyPresentationProps;
    cardContainer?: CardContainerStyles;
    quoteSummaryCard?: QuoteSummaryCardStyles;
}

export const recentQuotesStyles: RecentQuotesStyles = {
    noQuotesGridItem: { width: 12 },
};

const recentQuotesParameter = {
    page: 1,
    pageSize: 5,
};

const styles = recentQuotesStyles;

class RecentQuotes extends React.Component<Props> {
    componentDidMount() {
        if (this.props.canViewQuotes && !this.props.quotesDataView.value) {
            this.props.loadQuotes(recentQuotesParameter);
        }
    }

    render() {
        const { settingsCollection, session, quotesDataView, myQuotesPageNavLink, canViewQuotes } = this.props;
        if (!canViewQuotes || !quotesDataView.value) {
            return null;
        }

        const myQuotesPageUrl = myQuotesPageNavLink ? myQuotesPageNavLink.url : undefined;

        return (
            <CardList
                css={css`
                    padding-bottom: 50px;
                `}
                extendedStyles={styles.cardList}
            >
                <CardListHeading heading={translate("Recent Quotes")} viewAllUrl={myQuotesPageUrl} />
                {quotesDataView.value.length === 0 && (
                    <GridItem {...styles.noQuotesGridItem}>
                        <Typography {...styles.noQuotesText}>{siteMessage("Rfq_NoQuotesMessage")}</Typography>
                    </GridItem>
                )}
                {quotesDataView.value.map(quote => (
                    <CardContainer key={quote.id} extendedStyles={styles.cardContainer}>
                        <QuoteSummaryCard
                            quote={quote}
                            session={session}
                            quoteSettings={settingsCollection.quoteSettings}
                            extendedStyles={styles.quoteSummaryCard}
                        />
                    </CardContainer>
                ))}
            </CardList>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RecentQuotes),
    definition: {
        group: "Common",
        icon: "List",
    },
};

export default widgetModule;
