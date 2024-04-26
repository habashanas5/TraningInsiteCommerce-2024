import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { NewsPageContext } from "@insite/content-library/Pages/NewsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    page: getCurrentPage(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface NewsPageViewStyles {
    authorText?: TypographyProps;
    publishDateText?: TypographyProps;
    newsWrapper?: InjectableCss;
    contentWrapper?: InjectableCss;
    dateAndAuthorWrapper?: InjectableCss;
}

export const newsPageViewStyles: NewsPageViewStyles = {
    newsWrapper: {},
    contentWrapper: {
        css: css`
            margin-top: 8px;
        `,
    },
    authorText: {
        css: css`
            font-weight: bold;
            margin-right: 8px;
        `,
    },
    publishDateText: {
        css: css`
            font-style: italic;
        `,
    },
};

const styles = newsPageViewStyles;

const NewsPageView = ({ page }: Props) => {
    if (!page) {
        return null;
    }

    return (
        <StyledWrapper {...styles.newsWrapper} key={page.id}>
            <StyledWrapper {...styles.dateAndAuthorWrapper}>
                {page.fields["author"] && <Typography {...styles.authorText}>{page.fields["author"]}</Typography>}
                {page.fields["publishDate"] && (
                    <Typography {...styles.publishDateText}>
                        <LocalizedDateTime
                            dateTime={new Date(page.fields["publishDate"])}
                            options={{ year: "numeric", month: "numeric", day: "numeric" }}
                        />
                    </Typography>
                )}
            </StyledWrapper>
            {(page.fields["newsSummary"] || page.fields["newsContent"]) && (
                <StyledWrapper {...styles.contentWrapper}>
                    {parse(page.fields["newsContent"], parserOptions)}
                </StyledWrapper>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(NewsPageView),
    definition: {
        group: "News Page",
        allowedContexts: [NewsPageContext],
    },
};

export default widgetModule;
