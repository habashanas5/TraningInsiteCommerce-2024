import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = ({
    pages: {
        signIn: { isSigningInAsGuest },
    },
    context: { isSigningIn },
}: ApplicationState) => ({
    // This means the loading overlay shows until the browser redirects
    showLoadingOverlay: isSigningIn || isSigningInAsGuest,
});

type Props = PageProps & ReturnType<typeof mapStateToProps>;

const SignInPage = ({ id, showLoadingOverlay }: Props) => (
    <LoadingOverlay
        loading={showLoadingOverlay}
        css={css`
            width: 100%;
        `}
    >
        <Page data-test-selector="signIn">
            <Zone contentId={id} zoneName="Content" />
        </Page>
    </LoadingOverlay>
);

const pageModule: PageModule = {
    component: connect(mapStateToProps)(SignInPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const SignInPageContext = "SignInPage";
