import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { clearSearchHistory, getSearchHistory } from "@insite/client-framework/Services/AutocompleteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import Clock from "@insite/mobius/Icons/Clock";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    focusedQuery?: string;
    goToUrl: (url: string) => void;
    extendedStyles?: SearchHistoryStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    searchHistoryEnabled: getSettingsCollection(state).searchSettings.searchHistoryEnabled,
    searchPath: getSettingsCollection(state).searchSettings.searchPath,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface SearchHistoryStyles {
    headerText?: TypographyPresentationProps;
    wrapper?: InjectableCss;
    itemWrapper?: InjectableCss;
    icon?: IconPresentationProps;
    link?: LinkPresentationProps;
    focusedLink?: LinkPresentationProps;
    clearLink?: LinkPresentationProps;
}

export const searchHistoryStyles: SearchHistoryStyles = {
    headerText: {
        weight: "bold",
        css: css`
            text-align: left;
            margin: 10px 0 5px 0;
        `,
    },
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 250px;
            padding: 0 20px 15px 20px;
        `,
    },
    itemWrapper: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
    icon: {
        src: Clock,
        css: css`
            margin-right: 10px;
        `,
    },
    link: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 5px 0;
            `,
        },
        css: css`
            width: 100%;
            overflow: hidden;
        `,
    },
    focusedLink: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 5px 0;
            `,
        },
        css: css`
            width: 100%;
            overflow: hidden;
            background-color: lightgray;
        `,
    },
    clearLink: {
        typographyProps: {
            css: css`
                width: 100%;
                text-align: right;
                margin-top: 10px;
            `,
        },
    },
};

const styles = searchHistoryStyles;

class SearchHistory extends React.Component<Props> {
    private readonly styles: SearchHistoryStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(styles, props.extendedStyles);
    }

    clearLinkClickHandler = () => {
        clearSearchHistory();
        this.forceUpdate();
    };

    render() {
        if (!this.props.searchHistoryEnabled) {
            return null;
        }

        const searchHistory = getSearchHistory();
        if (searchHistory.length === 0) {
            return null;
        }

        const styles = this.styles;
        return (
            <StyledWrapper {...styles.wrapper}>
                <Typography {...styles.headerText}>{translate("Search History")}</Typography>
                {searchHistory.map(searchHistoryItem => (
                    <StyledWrapper {...styles.itemWrapper} key={searchHistoryItem.query}>
                        <IconMemo {...styles.icon} />
                        <Link
                            {...(this.props.focusedQuery === searchHistoryItem.query
                                ? styles.focusedLink
                                : styles.link)}
                            onClick={() =>
                                this.props.goToUrl(`/${this.props.searchPath}?query=${searchHistoryItem.query}`)
                            }
                        >
                            {searchHistoryItem.query}
                        </Link>
                    </StyledWrapper>
                ))}
                <Link {...styles.clearLink} onClick={this.clearLinkClickHandler}>
                    {translate("Clear Search History")}
                </Link>
            </StyledWrapper>
        );
    }
}

export default connect(mapStateToProps)(SearchHistory);
