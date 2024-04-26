import { EagerLoadingLogoProvider } from "@insite/client-framework/Common/EagerLoadingLogo";
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
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Link from "@insite/mobius/Link";
import Page, { PageProps as MobiusPageProps } from "@insite/mobius/Page";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
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
    container?: InjectableCss;
    skipToContent?: SkipNavStyles;
    websiteName?: InjectableCss;
}

export const headerStyles: HeaderStyles = {
    page: {
        fullWidth: [true, true, false, false, false],
    },
    container: {
        css: css`
            background-color: ${getColor("secondary.main")};
            display: flex;
            > div:first-child {
                flex-grow: 1;
            }
            > div:last-child {
                max-width: 150px;
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
                                max-width: 100px;
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
                <SkipNav
                    extendedStyles={styles.skipToContent}
                    text={translate("Skip to main content")}
                    destination={afterHeader}
                />
                <EagerLoadingLogoProvider value={true}>
                    <Zone contentId={id} zoneName="SecondaryNavigation" fixed />
                    <StyledWrapper {...styles.container}>
                        <Zone contentId={id} zoneName="MainNavigation" fixed />
                        <Zone contentId={id} zoneName="Cart" fixed />
                    </StyledWrapper>
                    <Zone contentId={id} zoneName="Breadcrumb" />
                </EagerLoadingLogoProvider>
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
