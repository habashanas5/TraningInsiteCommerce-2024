import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import CookiePrivacyPolicyPopup from "@insite/content-library/Components/CookiePrivacyPolicyPopup";
import Page, { PageProps as MobiusPageProps } from "@insite/mobius/Page";
import * as React from "react";

export interface FooterStyles {
    page?: MobiusPageProps;
}

export const footerStyles: FooterStyles = {};
const styles = footerStyles;

const Footer = ({ id }: PageProps) => (
    <Page as="footer" {...styles.page}>
        <Zone contentId={id} zoneName="Content" />
        <CookiePrivacyPolicyPopup />
    </Page>
);

const pageModule: PageModule = {
    component: Footer,
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export default pageModule;
export const FooterContext = "Footer";
