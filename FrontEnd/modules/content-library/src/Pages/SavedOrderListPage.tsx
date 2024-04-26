import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { CartsDataViewContext, getCartsDataView } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCarts from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCarts";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    getCartsApiParameter: state.pages.savedOrderList.getCartsApiParameter,
    savedCartsDataView: getCartsDataView(state, state.pages.savedOrderList.getCartsApiParameter),
});

const mapDispatchToProps = {
    loadCarts,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const SavedOrderListPage = ({ id, getCartsApiParameter, savedCartsDataView, loadCarts }: Props) => {
    useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!savedCartsDataView.value && !savedCartsDataView.isLoading) {
            loadCarts({ apiParameter: getCartsApiParameter });
        }
    });

    return (
        <Page>
            <CartsDataViewContext.Provider value={savedCartsDataView}>
                <Zone contentId={id} zoneName="Content" />
            </CartsDataViewContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SavedOrderListPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const SavedOrderListPageContext = "SavedOrderListPage";
