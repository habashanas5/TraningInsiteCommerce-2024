import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { loadPagesForParent } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import updateLoadParameter from "@insite/client-framework/Store/Pages/NewsList/Handlers/UpdateLoadParameter";
import translate from "@insite/client-framework/Translate";
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { NewsListPageContext } from "@insite/content-library/Pages/NewsListPage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import convertToNumberIfString from "@insite/mobius/utilities/convertToNumberIfString";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import sortBy from "lodash/sortBy";
import truncate from "lodash/truncate";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    defaultPageSize = "defaultPageSize",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.defaultPageSize]: number;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: WidgetProps) => {
    const pages = getDataView(state.data.pages, { parentNodeId: getCurrentPage(state).nodeId });
    let links: SafeDictionary<PageLinkModel> = {};
    if (pages.value) {
        links = pages.value.reduce(
            (links, page) => ({ ...links, [page.nodeId]: getPageLinkByNodeId(state, page.nodeId) }),
            {},
        );
    }
    return {
        parentNodeId: getCurrentPage(state).nodeId,
        location: getLocation(state),
        pages,
        links,
        parameter: state.pages.newsList.getNewsPagesParameters[getCurrentPage(state).nodeId] ?? {
            parentNodeId: getCurrentPage(state).nodeId,
        },
    };
};

const mapDispatchToProps = {
    loadPagesForParent,
    updateLoadParameter,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface NewsListViewStyles {
    titleText?: TypographyProps;
    authorText?: TypographyProps;
    publishDateText?: TypographyProps;
    listWrapper?: InjectableCss;
    newsWrapper?: InjectableCss;
    summaryWrapper?: InjectableCss;
    dateAndAuthorWrapper?: InjectableCss;
    readMoreLink?: LinkPresentationProps;
    pagination?: PaginationPresentationProps;
}

export const newsListViewStyles: NewsListViewStyles = {
    titleText: {
        size: 20,
        css: css`
            margin-bottom: 0;
        `,
    },
    newsWrapper: {
        css: css`
            margin-bottom: 15px;
            border-top: 1px solid ${getColor("common.border")};
            padding-top: 15px;
        `,
    },
    pagination: {
        cssOverrides: {
            pagination: css`
                border-top: 1px solid ${getColor("common.border")};
                padding-top: 15px;
            `,
        },
    },
    summaryWrapper: {
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

const styles = newsListViewStyles;

class NewsListView extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        if (!this.props.pages.value && !this.props.pages.isLoading) {
            this.props.loadPagesForParent(this.props.parameter);
        }
        this.checkQueryString();
    }

    componentDidUpdate() {
        if (!this.props.pages.value && !this.props.pages.isLoading) {
            this.props.loadPagesForParent(this.props.parameter);
        }
        this.checkQueryString();
    }

    changePage = (newPageIndex: number) => {
        this.updateQueryString(newPageIndex, this.props.parameter.pageSize);
    };

    changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        this.updateQueryString(1, newPageSize);
    };

    updateQueryString(page: number, pageSize?: number) {
        const {
            history,
            location: { pathname },
        } = this.props;
        let newLocation = `${pathname}?page=${page}`;
        if (pageSize) {
            newLocation += `&pageSize=${pageSize}`;
        }
        history.push(newLocation);
    }

    checkQueryString() {
        const {
            location: { search },
            parameter: { page, pageSize, parentNodeId },
        } = this.props;
        const parsedQueryString = parseQueryString<{ page?: string; pageSize?: string }>(search);
        const newPage = parsedQueryString.page ? convertToNumberIfString(parsedQueryString.page) : undefined;
        const newPageSize = parsedQueryString.pageSize
            ? convertToNumberIfString(parsedQueryString.pageSize)
            : undefined;
        if (newPage !== page || newPageSize !== pageSize) {
            this.props.updateLoadParameter({
                page: newPage,
                pageSize: newPageSize,
                parentNodeId,
            });
        }
    }

    render() {
        const {
            links,
            pages: { value: pages },
            fields: { defaultPageSize },
            parameter,
        } = this.props;

        if (!pages) {
            return null;
        }

        const totalItems = pages.length;
        const page = parameter.page ?? 1;
        const pageSize = parameter.pageSize ?? defaultPageSize;

        const sortedAndPagedPages = sortBy(pages, o => o.fields["publishDate"])
            .reverse()
            .slice((page - 1) * pageSize, page * pageSize);

        return (
            <StyledWrapper {...styles.listWrapper}>
                {sortedAndPagedPages.map((page: PageProps) => (
                    <StyledWrapper {...styles.newsWrapper} key={page.id}>
                        <Typography variant="h2" {...styles.titleText}>
                            <Link href={links[page.nodeId]?.url}>{page.fields["title"]}</Link>
                        </Typography>
                        <StyledWrapper {...styles.dateAndAuthorWrapper}>
                            {page.fields["author"] && (
                                <Typography {...styles.authorText}>{page.fields["author"]}</Typography>
                            )}
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
                            <StyledWrapper {...styles.summaryWrapper}>
                                {parse(
                                    page.fields["newsSummary"] || truncate(page.fields["newsContent"], { length: 500 }),
                                    parserOptions,
                                )}
                            </StyledWrapper>
                        )}
                        <Link href={links[page.nodeId]?.url} {...styles.readMoreLink}>
                            {translate("Read More")}
                        </Link>
                    </StyledWrapper>
                ))}
                {totalItems > defaultPageSize && (
                    <Pagination
                        resultsCount={totalItems}
                        currentPage={page}
                        resultsPerPage={pageSize}
                        resultsPerPageOptions={[
                            defaultPageSize,
                            defaultPageSize * 2,
                            defaultPageSize * 3,
                            defaultPageSize * 4,
                        ]}
                        onChangePage={this.changePage}
                        onChangeResultsPerPage={this.changeResultsPerPage}
                        pageSizeCookie="NewsList-PageSize"
                        {...styles.pagination}
                    />
                )}
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(NewsListView)),
    definition: {
        group: "News List",
        allowedContexts: [NewsListPageContext],
        fieldDefinitions: [
            {
                name: fields.defaultPageSize,
                editorTemplate: "IntegerField",
                defaultValue: 5,
                fieldType: "General",
                min: 1,
                max: 20,
            },
        ],
    },
};

export default widgetModule;
