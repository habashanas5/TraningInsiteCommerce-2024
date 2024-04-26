import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";
import * as React from "react";

export const orderTotalStyles: SearchTextFieldStyles = {};
const styles = orderTotalStyles;

const OrderHistorySearchFieldOrderTotal: React.FunctionComponent<WidgetProps> = () => {
    return (
        <SearchTextField
            testSelector="orderHistory_filterOrderTotal"
            styles={styles}
            parameterField="orderTotal"
            label="Amount"
            inputType="number"
            placeholder=""
        />
    );
};

const widgetModule: WidgetModule = {
    component: OrderHistorySearchFieldOrderTotal,
    definition: {
        group: "Order History",
        allowedContexts: [OrderHistoryPageContext],
        displayName: "Order Total",
    },
};

export default widgetModule;
