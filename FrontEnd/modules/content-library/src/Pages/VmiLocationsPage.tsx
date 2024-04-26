import { getCookie } from "@insite/client-framework/Common/Cookies";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocations";
import {
    getVmiLocationsDataView,
    VmiLocationsDataViewContext,
} from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiLocations/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    vmiLocationsDataView: getVmiLocationsDataView(state, state.pages.vmiLocations.getVmiLocationsParameter),
    getVmiLocationsParameter: state.pages.vmiLocations.getVmiLocationsParameter,
});

const mapDispatchToProps = {
    loadVmiLocations,
    updateSearchFields,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const VmiLocationsPage = ({
    id,
    vmiLocationsDataView,
    loadVmiLocations,
    updateSearchFields,
    getVmiLocationsParameter,
}: Props) => {
    useEffect(() => {
        const pageSizeCookie = getCookie("VmiLocations-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== getVmiLocationsParameter.pageSize) {
            updateSearchFields({ pageSize });
            return;
        }

        if (!vmiLocationsDataView.value && !vmiLocationsDataView.isLoading) {
            loadVmiLocations(getVmiLocationsParameter);
        }
    });

    return (
        <Page>
            <VmiLocationsDataViewContext.Provider value={vmiLocationsDataView}>
                <Zone contentId={id} zoneName="Content" />
            </VmiLocationsDataViewContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiLocationsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const LocationsPageContext = "VmiLocationsPage";
