import { SafeDictionary } from "@insite/client-framework/Common/Types";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import * as React from "react";
import { connect } from "react-redux";

const enum fields {
    layout = "layout",
    links = "links",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.layout]: "grid" | "list";
        [fields.links]: HasFields[];
    };
}

const mobileLinkListActionTypes = [
    { displayName: "Categories", value: "Categories" },
    { displayName: "Quick Order", value: "QuickOrder" },
    { displayName: "Brands", value: "Brands" },
    { displayName: "Search", value: "Search" },
    { displayName: "Order History", value: "OrderHistory" },
    { displayName: "Lists", value: "Lists" },
    { displayName: "Saved Orders", value: "SavedOrders" },
    { displayName: "Location Finder", value: "LocationFinder" },
    { displayName: "Saved Payments", value: "SavedPayments" },
    { displayName: "Invoices", value: "Invoices" },
    { displayName: "Request for Quote", value: "Quotes" },
    { displayName: "Change Customer", value: "ChangeCustomer" },
    { displayName: "View Account on Website", value: "ViewAccountOnWebsite" },
    { displayName: "Settings", value: "Settings" },
    { displayName: "Sign Out", value: "SignOut" },
    { displayName: "Custom", value: "Custom" },
    { displayName: "Vendor Managed Inventory", value: "VendorManagedInventory" },
];

const displayNameByTypeCache: SafeDictionary<string> = {};
const mobileLinkListActionDisplayNameByType = (type: string) => {
    if (displayNameByTypeCache[type]) {
        return displayNameByTypeCache[type];
    }

    for (const action of mobileLinkListActionTypes) {
        if (action.value === type) {
            displayNameByTypeCache[action.value] = action.displayName;
            return action.displayName;
        }
    }

    return type;
};

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    return {
        links: ownProps.fields.links,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const LinkList: React.FC<Props> = ({ links }) => {
    return (
        <>
            {links.map(link => (
                <div key={link.fields.text + link.fields.type}>
                    {link.fields.text || mobileLinkListActionDisplayNameByType(link.fields.type)}
                </div>
            ))}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(LinkList),
    definition: {
        group: "Mobile",
        icon: "LinkList",
        fieldDefinitions: [
            {
                name: fields.layout,
                editorTemplate: "DropDownField",
                defaultValue: "list",
                fieldType: "General",
                options: [
                    {
                        displayName: "Grid",
                        value: "grid",
                    },
                    {
                        displayName: "List",
                        value: "list",
                    },
                ],
                hideEmptyOption: true,
                isRequired: true,
            },
            {
                name: fields.links,
                editorTemplate: "ListField",
                getDisplay: (item: HasFields) => {
                    return item.fields.text || mobileLinkListActionDisplayNameByType(item.fields.type);
                },
                defaultValue: [],
                fieldType: "General",
                fieldDefinitions: [
                    {
                        name: "icon",
                        editorTemplate: "ImagePickerField",
                        defaultValue: "",
                    },
                    {
                        name: "type",
                        editorTemplate: "DropDownField",
                        options: mobileLinkListActionTypes,
                        defaultValue: "",
                        isRequired: true,
                        customFilter: (item, page) => {
                            return page.type === "Mobile/Account" || item.value !== "ViewAccountOnWebsite";
                        },
                    },
                    {
                        name: "url",
                        editorTemplate: "TextField",
                        defaultValue: "",
                        isRequired: true,
                        isVisible: item => item.fields.type === "Custom",
                    },
                    {
                        name: "text",
                        editorTemplate: "TextField",
                        defaultValue: "",
                        isRequired: true,
                        isVisible: item => item.fields.type === "Custom",
                    },
                ],
            },
        ],
    },
};

export default widgetModule;
