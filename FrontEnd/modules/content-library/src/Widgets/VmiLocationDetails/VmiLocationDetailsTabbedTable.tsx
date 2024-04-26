import { getCookie } from "@insite/client-framework/Common/Cookies";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartsDataView } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCarts from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCarts";
import loadVmiBins from "@insite/client-framework/Store/Data/VmiBins/Handlers/LoadVmiBins";
import { getVmiBinsDataView } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import { VmiLocationStateContext } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import resetVmiItemsSelection from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/ResetVmiItemsSelection";
import updateOrderSearchFields from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/UpdateOrderSearchFields";
import updateProductSearchFields from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/UpdateProductSearchFields";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import VmiLocationOrdersTab from "@insite/content-library/Components/VmiLocationOrdersTab";
import VmiLocationProductsTab from "@insite/content-library/Components/VmiLocationProductsTab";
import { VmiLocationDetailsPageContext } from "@insite/content-library/Pages/VmiLocationDetailsPage";
import Tab, { TabPresentationProps } from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    return {
        getVmiBinsParameter: state.pages.vmiLocationDetails.getVmiBinsParameter,
        vmiBinsDataView: getVmiBinsDataView(state, state.pages.vmiLocationDetails.getVmiBinsParameter),
        getVmiOrdersParameter: state.pages.vmiLocationDetails.getVmiOrdersParameter,
        vmiOrdersDataView: getCartsDataView(state, state.pages.vmiLocationDetails.getVmiOrdersParameter),
    };
};

const mapDispatchToProps = {
    updateProductSearchFields,
    loadVmiBins,
    updateOrderSearchFields,
    loadCarts,
    resetVmiItemsSelection,
};

type Props = ReturnType<typeof mapStateToProps> &
    WidgetProps &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface VmiLocationDetailsTabbedTableStyles {
    tabContainer?: TabPresentationProps;
}

export const vmiLocationDetailsTabbedTableStyles: VmiLocationDetailsTabbedTableStyles = {
    tabContainer: {
        css: css`
            text-transform: capitalize;
        `,
    },
};

const styles = vmiLocationDetailsTabbedTableStyles;

const VmiLocationDetailsTabbedTable = ({
    getVmiBinsParameter,
    vmiBinsDataView,
    updateProductSearchFields,
    loadVmiBins,
    getVmiOrdersParameter,
    vmiOrdersDataView,
    updateOrderSearchFields,
    loadCarts,
    resetVmiItemsSelection,
}: Props) => {
    const [currentTab, setCurrentTab] = useState(TableTabKeys.Products);

    const { value: vmiLocation } = useContext(VmiLocationStateContext);

    useEffect(() => {
        if (vmiLocation) {
            loadData(currentTab);
        }
    });

    if (!vmiLocation) {
        return null;
    }

    const loadData = (currentTab: string) => {
        if (currentTab === TableTabKeys.Products) {
            if (getVmiBinsParameter.vmiLocationId !== vmiLocation.id) {
                updateProductSearchFields({ vmiLocationId: vmiLocation.id });
                return;
            }
            if (!vmiBinsDataView.value && !vmiBinsDataView.isLoading) {
                const pageSizeCookie = getCookie("VmiBins-PageSize");
                const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
                if (pageSize && pageSize !== getVmiBinsParameter.pageSize) {
                    updateProductSearchFields({ pageSize });
                    return;
                }
                loadVmiBins(getVmiBinsParameter);
            }
        } else if (currentTab === TableTabKeys.Users) {
            // not implemented yet
        } else if (currentTab === TableTabKeys.Orders) {
            if (getVmiOrdersParameter.vmiLocationId !== vmiLocation.id) {
                updateOrderSearchFields({ vmiLocationId: vmiLocation.id });
                return;
            }
            if (!vmiOrdersDataView.value && !vmiOrdersDataView.isLoading) {
                const pageSizeCookie = getCookie("VmiOrders-PageSize");
                const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
                if (pageSize && pageSize !== getVmiOrdersParameter.pageSize) {
                    updateOrderSearchFields({ pageSize });
                    return;
                }
                loadCarts({
                    apiParameter: getVmiOrdersParameter,
                    onComplete: () => {
                        resetVmiItemsSelection({ tabKey: TableTabKeys.Orders });
                    },
                });
            }
        }
    };

    const onTabChange = (event: React.MouseEvent | React.KeyboardEvent, tabKey?: string) => {
        if (tabKey) {
            loadData(tabKey);
            setCurrentTab(tabKey as TableTabKeys);
        }
    };

    return (
        <TabGroup current={currentTab} onTabChange={onTabChange}>
            <Tab
                {...styles.tabContainer}
                headline={translate("Products")}
                key={TableTabKeys.Products}
                tabKey={TableTabKeys.Products}
            >
                <VmiLocationProductsTab vmiLocationId={vmiLocation.id} />
            </Tab>
            <Tab
                {...styles.tabContainer}
                headline={translate("orders")}
                key={TableTabKeys.Orders}
                tabKey={TableTabKeys.Orders}
            >
                <VmiLocationOrdersTab />
            </Tab>
        </TabGroup>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(VmiLocationDetailsTabbedTable))),
    definition: {
        group: "VMI Location Details",
        displayName: "Vmi Location Tabbed Table",
        allowedContexts: [VmiLocationDetailsPageContext],
    },
};

export default widgetModule;
