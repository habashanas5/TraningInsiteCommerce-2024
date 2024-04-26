import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";
import * as React from "react";

export const productErpNumberStyles: SearchTextFieldStyles = {};
const styles = productErpNumberStyles;

const OrderHistorySearchFieldProductErpNumber: React.FunctionComponent<WidgetProps> = () => {
    return (
        <SearchTextField
            styles={styles}
            parameterField="productErpNumber"
            label="Product"
            inputType="text"
            placeholder={translate("Enter keyword or item #")}
        />
    );
};

const widgetModule: WidgetModule = {
    component: OrderHistorySearchFieldProductErpNumber,
    definition: {
        isDeprecated: true,
        group: "Order History",
        displayName: "Product ERP Number",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
