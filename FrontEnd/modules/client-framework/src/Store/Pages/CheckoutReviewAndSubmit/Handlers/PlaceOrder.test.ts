import { SetCartStatus } from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/PlaceOrder";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

type propsType = Parameters<typeof SetCartStatus>[0];

describe("SetCartStatus", () => {
    const getProps = (parameter?: RecursivePartial<propsType["parameter"]>): propsType => {
        return {
            getState: () => ({
                pages: {
                    checkoutReviewAndSubmit: {},
                },
                data: {
                    carts: {
                        isLoading: {},
                        byId: {
                            current: {},
                        },
                    },
                },
            }),
            parameter: parameter ?? {},
        } as RecursivePartial<propsType> as propsType;
    };

    test("sets customerVatNumber to supplied vatNumber", () => {
        const props = getProps({
            vatNumber: "vatNumber",
        });
        SetCartStatus(props);

        expect(props.cartToUpdate.customerVatNumber).toBe("vatNumber");
    });

    test("sets customerVatNumber to empty string", () => {
        const props = getProps();
        SetCartStatus(props);

        expect(props.cartToUpdate.customerVatNumber).toBe("");
    });
});
