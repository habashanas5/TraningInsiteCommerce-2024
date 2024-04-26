import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import dismissRfqUpdates from "@insite/client-framework/Store/Context/Handlers/DismissRfqUpdates";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Link from "@insite/mobius/Link";
import Page, { PageProps as MobiusPageProps } from "@insite/mobius/Page";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    siteName: state.context.website.name,
    session: getSession(state),
    myAccountPageUrl: getPageLinkByPageType(state, "MyAccountPage")?.url,
});

const mapDispatchToProps = {
    dismissRfqUpdates,
};

type Props = PageProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface HeaderStyles {
    page?: MobiusPageProps;
    topHeader?: InjectableCss;
    container?: InjectableCss;
    skipToContent?: SkipNavStyles;
    websiteName?: InjectableCss;
}

export const headerStyles: HeaderStyles = {
    page: {
        fullWidth: [true, true, true, true, true], // make the header full width and control the margins with container css
        padding: 0,
        css: css`
            background-color: #f3f3f3;
        `,
    },
    topHeader: {
        css: css`
            width: 100%;
            background-color: black;
        `,
    },
    container: {
        css: css`
            width: 100%;
            margin: 0 auto;
            ${({ theme }) => {
                const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
                return breakpointMediaQueries(theme, [
                    css`
                        max-width: ${maxWidths[1]}px;
                    `,
                    css`
                        max-width: ${maxWidths[1]}px;
                    `,
                    css`
                        max-width: ${maxWidths[2]}px;
                    `,
                    css`
                        max-width: ${maxWidths[3]}px;
                    `,
                    css`
                        max-width: ${maxWidths[4]}px;
                    `,
                ]);
            }}
            padding-bottom: 0;
            padding-right: 5px;
            display: flex;
            > div:first-child {
                flex-grow: 1;
            }
            > div:last-child {
                max-width: 200px; /* make cart wider for translated names */
                display: flex;
                align-items: center;
                justify-content: center;
                height: auto;
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(
                        theme,
                        [
                            null,
                            null,
                            css`
                                max-width: 50px;
                            `,
                        ],
                        "max",
                    )}
            }
        `,
    },
    websiteName: {
        css: css`
            @media print {
                display: block;
            }
            font-size: 12px;
            padding-left: 15px;
            display: none;
        `,
    },
};

const styles = headerStyles;

const Header = ({ id, siteName, session, toaster, history, myAccountPageUrl, dismissRfqUpdates }: Props) => {
    const viewMyDashboardClickHandler = () => {
        if (myAccountPageUrl) {
            history.push(myAccountPageUrl);
        }
    };

    useEffect(() => {
        if (session.hasRfqUpdates) {
            toaster.addToast({
                body: (
                    <>
                        <Typography>{translate("You have new quote information.")}</Typography>
                        <Link onClick={viewMyDashboardClickHandler}>{translate("View My Dashboard")}</Link>
                    </>
                ),
                messageType: "info",
                timeoutLength: 1000 * 60 * 60 * 24 * 365,
                onClose: () => {
                    dismissRfqUpdates();
                },
            });
        }
    }, []);

    const afterHeader = React.createRef<HTMLSpanElement>();
    return (
        <>
            {siteName && <Typography {...styles.websiteName}>{siteName}</Typography>}
            <Page as="header" {...styles.page}>
                <StyledWrapper {...styles.topHeader}>
                    <SkipNav
                        extendedStyles={styles.skipToContent}
                        text={translate("Skip to main content")}
                        destination={afterHeader}
                    />
                    <Zone contentId={id} zoneName="SecondaryNavigation" />
                </StyledWrapper>
                <Zone contentId={id} zoneName="LogoAndSearch" />
                <StyledWrapper {...styles.container}>
                    <Zone contentId={id} zoneName="MainNavigation" />
                    <Zone contentId={id} zoneName="Cart" />
                </StyledWrapper>
                <Zone contentId={id} zoneName="Breadcrumb" />
                <span ref={afterHeader} tabIndex={-1} />
            </Page>
        </>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(Header))),
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export const HeaderContext = "HeaderContext";

export default pageModule;
