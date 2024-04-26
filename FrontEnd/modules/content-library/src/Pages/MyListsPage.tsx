import { getCookie } from "@insite/client-framework/Common/Cookies";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    wishListsDataView: getWishListsDataView(state, state.pages.myLists.getWishListsParameter),
    getWishListsParameter: state.pages.myLists.getWishListsParameter,
});

const mapDispatchToProps = {
    updateLoadParameter,
    loadWishLists,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps;

const MyListsPage = ({ id, wishListsDataView, getWishListsParameter, updateLoadParameter, loadWishLists }: Props) => {
    useEffect(() => {
        const pageSizeCookie = getCookie("Lists-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== getWishListsParameter.pageSize) {
            updateLoadParameter({ pageSize });
            return;
        }

        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!wishListsDataView.isLoading && !wishListsDataView.value) {
            loadWishLists();
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
            <Modals />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const MyListsPageContext = "MyListsPage";
