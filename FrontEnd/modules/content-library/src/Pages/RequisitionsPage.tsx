import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadRequisitions from "@insite/client-framework/Store/Data/Requisitions/Handlers/LoadRequisitions";
import { getRequisitionsDataView } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsSelectors";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    requisitionsDataView: getRequisitionsDataView(state, state.pages.requisitions.getRequisitionsParameter),
    getRequisitionsParameter: state.pages.requisitions.getRequisitionsParameter,
});

const mapDispatchToProps = {
    loadRequisitions,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RequisitionsPage = ({ id, requisitionsDataView, getRequisitionsParameter, loadRequisitions }: Props) => {
    useEffect(() => {
        if (!requisitionsDataView.value && !requisitionsDataView.isLoading) {
            loadRequisitions(getRequisitionsParameter);
        }
    }, [requisitionsDataView.value, getRequisitionsParameter]);

    return (
        <Page data-test-selector="requisitions">
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequisitionsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "System",
    },
};

export default pageModule;

export const RequisitionsPageContext = "RequisitionsPage";
