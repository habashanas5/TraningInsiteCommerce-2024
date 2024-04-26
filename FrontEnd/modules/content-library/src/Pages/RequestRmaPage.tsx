import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getOrderState, OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getHomePageUrl, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import displayOrder from "@insite/client-framework/Store/Pages/OrderDetails/Handlers/DisplayOrder";
import setReturnNotes from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SetReturnNotes";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const homePageUrl = getHomePageUrl(state);
    let orderNumber;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ orderNumber: string }>(location.search);
        orderNumber = parsedQuery.orderNumber;
    }

    return {
        orderNumber,
        homePageUrl,
        orderState: getOrderState(state, orderNumber),
        links: state.links,
        nodeId: getCurrentPage(state).nodeId,
        orderDetailsLink: getPageLinkByPageType(state, "OrderDetailsPage"),
        breadcrumbLinks: state.components.breadcrumbs.links,
    };
};

const mapDispatchToProps = {
    setReturnNotes,
    displayOrder,
    setBreadcrumbs,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RequestRmaPage = ({
    id,
    orderNumber,
    orderState,
    links,
    nodeId,
    orderDetailsLink,
    breadcrumbLinks,
    homePageUrl,
    setReturnNotes,
    displayOrder,
    setBreadcrumbs,
}: Props) => {
    useEffect(() => {
        setReturnNotes({ returnNotes: "" });
        if (orderNumber) {
            displayOrder({ orderNumber });
        }
    }, []);

    useEffect(() => {
        if (!breadcrumbLinks && orderNumber) {
            setPageBreadcrumbs();
        }
    }, [breadcrumbLinks]);

    const setPageBreadcrumbs = () => {
        const breadcrumbs = generateLinksFrom(links, nodeId, homePageUrl);
        breadcrumbs.forEach(link => {
            if (link.children === orderDetailsLink?.title) {
                link.href += `?orderNumber=${orderNumber}`;
            }
        });
        setBreadcrumbs({ links: breadcrumbs });
    };

    return (
        <Page>
            <OrderStateContext.Provider value={orderState}>
                <Zone contentId={id} zoneName="Content" />
            </OrderStateContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequestRmaPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const RequestRmaPageContext = "RequestRmaPage";
