import PageBreadcrumbs from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { ReactNode } from "react";

interface PageLayoutProps {
    showHeader: boolean;
    header: ReactNode;
    showBreadcrumbs: boolean;
    pageContent: ReactNode;
    showFooter: boolean;
    footer: ReactNode;
}

// This doesn't currently support HMR
const PageLayout = ({ showHeader, header, showBreadcrumbs, pageContent, showFooter, footer }: PageLayoutProps) => {
    return (
        <>
            {showHeader && header}
            {showBreadcrumbs && (
                <Page as="div" background="#bbb">
                    <PageBreadcrumbs />
                </Page>
            )}
            {pageContent}
            {showFooter && footer}
        </>
    );
};

export default PageLayout;
