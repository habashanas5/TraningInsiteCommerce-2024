import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import loadCart from "@insite/client-framework/Store/Pages/RequisitionConfirmation/Handlers/LoadCart";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ cartId?: string }>(search);
    const cartId = parsedQuery.cartId;
    return {
        cartId,
    };
};

const mapDispatchToProps = {
    loadCart,
    loadPromotions,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RequisitionConfirmationPage = ({ id, cartId, loadCart, loadPromotions }: Props) => {
    useEffect(() => {
        if (cartId) {
            loadCart({ cartId });
            loadPromotions({ cartId });
        }
    }, [cartId]);

    return (
        <Page data-test-selector="requisitionConfirmation">
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequisitionConfirmationPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "System",
    },
};

export default pageModule;

export const RequisitionConfirmationPageContext = "RequisitionConfirmationPage";
