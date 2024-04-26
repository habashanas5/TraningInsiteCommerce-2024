import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import loadQuoteIfNeeded from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/LoadQuoteIfNeeded";
import setExpirationDate from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SetExpirationDate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ quoteId?: string }>(search);
    const quoteId = parsedQuery.quoteId;
    return {
        quoteId,
        quoteState: getQuoteState(state, quoteId),
    };
};

const mapDispatchToProps = {
    loadQuoteIfNeeded,
    setExpirationDate,
};

export interface RfqQuoteDetailsPageStyles {
    loadFailedWrapper?: InjectableCss;
    loadFailedText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsPageStyles: RfqQuoteDetailsPageStyles = {
    loadFailedWrapper: {
        css: css`
            display: flex;
            height: 200px;
            justify-content: center;
            align-items: center;
            background-color: ${getColor("common.accent")};
        `,
    },
    loadFailedText: { weight: "bold" },
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RfqQuoteDetailsPage = ({ id, quoteId, quoteState, loadQuoteIfNeeded, setExpirationDate }: Props) => {
    useEffect(() => {
        if (quoteId && !quoteState.isLoading && !quoteState.errorStatusCode) {
            loadQuoteIfNeeded({ quoteId });
        }
    }, [quoteId, quoteState.isLoading, quoteState.value]);

    useEffect(() => {
        setExpirationDate({ expirationDate: undefined });
    }, []);

    const styles = rfqQuoteDetailsPageStyles;

    return (
        <Page>
            {quoteState.errorStatusCode === 404 ? (
                <StyledWrapper {...styles.loadFailedWrapper}>
                    <Typography {...styles.loadFailedText}>{siteMessage("Rfq_OrderNotFound")}</Typography>
                </StyledWrapper>
            ) : (
                <Zone contentId={id} zoneName="Content" />
            )}
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const RfqQuoteDetailsPageContext = "RfqQuoteDetailsPage";
