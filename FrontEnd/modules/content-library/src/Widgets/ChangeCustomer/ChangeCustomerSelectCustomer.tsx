import { GetBillTosApiParameter, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ChangeCustomerPageContext } from "@insite/content-library/Pages/ChangeCustomerPage";
import ChangeCustomerSelectCustomerContainer, {
    ChangeCustomerSelectCustomerContainerStyles,
} from "@insite/content-library/Widgets/ChangeCustomer/ChangeCustomerSelectCustomerContainer";
import React, { FC, useState } from "react";

enum fields {
    defaultCustomerChangedMessage = "defaultCustomerChangedMessage",
}

interface Props extends WidgetProps {
    fields: {
        [fields.defaultCustomerChangedMessage]: string;
    };
}

export interface ChangeCustomerSelectCustomerStyles {
    container?: ChangeCustomerSelectCustomerContainerStyles;
}

export const changeCustomerSelectCustomerStyles: ChangeCustomerSelectCustomerStyles = {};

const styles = changeCustomerSelectCustomerStyles;

const ChangeCustomerSelectCustomer: FC<Props> = ({ fields }) => {
    const [billTosParameter, setBillTosParameter] = useState<GetBillTosApiParameter>({
        page: 1,
        pageSize: 20,
        expand: ["shipTos"],
    });
    const [shipTosParameter, setShipTosParameter] = useState<GetShipTosApiParameter>({
        page: 1,
        pageSize: 20,
        expand: ["validation", "excludeShowAll", "excludeOneTime"],
    });

    return (
        <ChangeCustomerSelectCustomerContainer
            extendedStyles={styles.container}
            billTosParameter={billTosParameter}
            setBillTosParameter={setBillTosParameter}
            shipTosParameter={shipTosParameter}
            setShipTosParameter={setShipTosParameter}
            defaultCustomerChangedMessage={fields.defaultCustomerChangedMessage}
        />
    );
};

const widgetModule: WidgetModule = {
    component: ChangeCustomerSelectCustomer,
    definition: {
        group: "Change Customer",
        allowedContexts: [ChangeCustomerPageContext],
        fieldDefinitions: [
            {
                defaultValue:
                    "If you would like to change your defaults in the future, please visit your Account Settings page.",
                displayName: "Default Customer Changed Message",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                name: fields.defaultCustomerChangedMessage,
            },
        ],
    },
};

export default widgetModule;
