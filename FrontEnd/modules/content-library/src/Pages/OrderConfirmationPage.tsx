import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadCart from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/LoadCart";
import preloadOrderConfirmationData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/PreloadOrderConfirmationData";
import setIsPreloadingData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/SetIsPreloadingData";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import Page from "@insite/mobius/Page";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    loadOrder: loadCart,
    setIsPreloadingData,
    preloadOrderConfirmationData,
};

const mapStateToProps = (state: ApplicationState) => ({
    isPreloadingData: state.pages.orderConfirmation.isPreloadingData,
    location: getLocation(state),
});

type Props = ResolveThunks<typeof mapDispatchToProps> &
    PageProps &
    ReturnType<typeof mapStateToProps> &
    HasToasterContext;

class OrderConfirmationPage extends Component<Props> {
    componentDidMount() {
        const parsedQuery = parseQueryString<{ cartId?: string }>(this.props.location.search);
        const cartId = parsedQuery.cartId;
        if (cartId && !this.props.isPreloadingData) {
            this.props.preloadOrderConfirmationData({
                cartId,
                onSuccess: () => {
                    this.props.setIsPreloadingData({ isPreloadingData: false });
                },
                onError: (errorMessage: string) => {
                    this.props.toaster.addToast({ body: errorMessage, messageType: "danger", timeoutLength: 9000 });
                },
            });
        } else {
            this.props.setIsPreloadingData({ isPreloadingData: false });
        }
    }

    render() {
        return (
            <Page>
                <Zone zoneName="Content" contentId={this.props.id} />
                <AddToListModal />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(OrderConfirmationPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export const OrderConfirmationPageContext = "OrderConfirmationPage";
export default pageModule;
