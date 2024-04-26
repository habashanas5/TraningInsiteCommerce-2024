import { testHandler } from "@insite/client-framework/HandlerTestHelpers";
import { WriteableState } from "@insite/client-framework/Store/ApplicationState";
import { withDataByIdState } from "@insite/client-framework/Store/Data/DataStateTestHelpers";
import { PopulateCart } from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/UpdateCart";
import { withPagesState } from "@insite/client-framework/Store/Pages/PagesStateTestHelpers";
import { CartModel } from "@insite/client-framework/Types/ApiModels";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("Populate Cart", () => {
    const withCurrentCart = (useState: () => WriteableState, value: RecursivePartial<CartModel> = {}) => {
        withDataByIdState(useState, "carts", "current", value);
    };

    const withEditedCartNotes = (useState: () => WriteableState, value: string | undefined) => {
        withPagesState(useState, "checkoutShipping", {
            editedCartNotes: value,
        });
    };

    const { callHandler, useState } = testHandler(PopulateCart);

    test.each([
        {
            name: "Should set notes to empty string",
            currentNotes: "ExistingNotes",
            editedCartNotes: "",
            expectedNotes: "",
        },

        {
            name: "Should set notes to string value",
            currentNotes: "ExistingNotes",
            editedCartNotes: "NewNotes",
            expectedNotes: "NewNotes",
        },

        {
            name: "Should set notes to existing notes",
            currentNotes: "ExistingNotes",
            editedCartNotes: undefined,
            expectedNotes: "ExistingNotes",
        },
    ])("%s", ({ name, currentNotes, editedCartNotes, expectedNotes }) => {
        withCurrentCart(useState, { notes: currentNotes });
        withEditedCartNotes(useState, editedCartNotes);

        const props = callHandler();

        expect(props.cart.notes).toEqual(expectedNotes);
    });
});
