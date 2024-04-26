import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadOrder from "@insite/client-framework/Store/Pages/OrderStatus/Handlers/LoadOrder";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{
        ordernumber?: string;
        stemail?: string;
        stpostalcode?: string;
        orderNumber?: string;
        stEmail?: string;
        stPostalCode?: string;
    }>(location.search);

    return {
        orderNumber: parsedQuery.orderNumber ?? parsedQuery.ordernumber,
        sTEmail: parsedQuery.stEmail ?? parsedQuery.stemail ?? "",
        sTPostalCode: parsedQuery.stPostalCode ?? parsedQuery.stpostalcode ?? "",
        order: state.pages.orderStatus.order,
        isLoading: state.pages.orderStatus.isLoading,
    };
};

const mapDispatchToProps = {
    loadOrder,
};

type Props = PageProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

class OrderStatusPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        // The share entity (for orders) functionality can use this page
        // to render HTML for PDF generation, so we need to leave this SSR
        // ability so that functionality works.
        this.loadOrderIfNeeded();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.orderNumber !== prevProps.orderNumber ||
            this.props.sTEmail !== prevProps.sTEmail ||
            this.props.sTPostalCode !== prevProps.sTPostalCode
        ) {
            this.loadOrderIfNeeded();
        }
    }

    loadOrderIfNeeded = () => {
        const { orderNumber, sTEmail, sTPostalCode, order, loadOrder, toaster, isLoading } = this.props;
        if (!orderNumber || (!sTEmail && !sTPostalCode)) {
            return;
        }

        if ((order && (order.webOrderNumber === orderNumber || order.erpOrderNumber === orderNumber)) || isLoading) {
            return;
        }

        loadOrder({
            orderNumber,
            sTEmail,
            sTPostalCode,
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
        });
    };

    render() {
        return (
            <Page>
                <Zone contentId={this.props.id} zoneName="Content" />
                <Modals />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(OrderStatusPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const OrderStatusPageContext = "OrderStatusPage";
