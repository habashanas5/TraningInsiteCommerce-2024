import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { DataView } from "@insite/client-framework/Store/Data/DataState";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("getAddressFieldsDataView selector", () => {
    const date = Date.now();
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                addressFields: {
                    dataViews: {
                        EMPTY_KEY: {
                            // If you look at getAddressFieldsDataView, you can see that the getDataViewKey is given an empty objects
                            // if you follow through the code, you can see that returns a string of "EMPTY_KEY"
                            fetchedDate: date,
                            isLoading: false,
                            value: {
                                billToAddressFields: {
                                    address1: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    address2: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    address3: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    address4: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    attention: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    city: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    companyName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    contactFullName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    country: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    email: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    fax: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    firstName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    lastName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    phone: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    postalCode: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    state: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    uri: "text",
                                    properties: {
                                        key: "text",
                                    },
                                },
                                shipToAddressFields: {
                                    address1: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    address2: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    address3: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    address4: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    attention: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    city: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    companyName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    contactFullName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    country: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    email: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    fax: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    firstName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    lastName: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    phone: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    postalCode: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    state: {
                                        displayName: "text",
                                        isVisible: true,
                                        uri: "Text",
                                        properties: {
                                            key: "text",
                                        },
                                    },
                                    uri: "text",
                                    properties: {
                                        key: "text",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        return returnState as ApplicationState;
    };

    test("Dataview isLoading property is false", () => {
        const state = initializeState();

        const dataView = getAddressFieldsDataView(state);
        expect(dataView.isLoading).toBe(false);
    });

    test("DataView fetchedDate property is Date", () => {
        const state = initializeState();
        // Here, for some reason, the return value of getAddressFieldsDataView is either the empty dataview or the populated DataView.
        // To make TypeScript happy I casted it as a populated DataView
        const dataView = getAddressFieldsDataView(state) as DataView;
        expect(dataView.fetchedDate).toBe(date);
    });

    test("Dataview value property is an array", () => {
        const state = initializeState();

        const dataView = getAddressFieldsDataView(state);
        expect(dataView.value?.billToAddressFields?.address1?.displayName).toBe("text");
    });
});
