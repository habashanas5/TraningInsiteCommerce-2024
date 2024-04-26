import { patch } from "@insite/client-framework/Services/ApiService";
import { updateCartLineWithResult } from "@insite/client-framework/Services/CartService";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";

jest.mock("@insite/client-framework/Services/ApiService");

describe("CartService", () => {
    test("should return cartLine from result when updateCartLineWithResult receives 200OK", async () => {
        const expectedResult = { status: 200, cartLine: { id: "expected-cart-line-id" } };
        const mockedDependency = patch as jest.MockedFunction<typeof patch>;
        mockedDependency.mockReturnValueOnce(
            new Promise((resolve, _) => {
                resolve(expectedResult);
            }) as any,
        );

        const value = await updateCartLineWithResult({
            cartId: "cart-id",
            cartLine: {} as CartLineModel,
        });

        expect(value).toEqual({
            successful: true,
            result: expectedResult,
        });
    });

    test("should return error when updateCartLineWithResult receives 404 error", async () => {
        const mockedDependency = patch as jest.MockedFunction<typeof patch>;
        mockedDependency.mockReturnValueOnce(
            new Promise((_, reject) => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ status: 404, errorMessage: "error-message" });
            }) as any,
        );

        const value = await updateCartLineWithResult({
            cartId: "cart-id",
            cartLine: {} as CartLineModel,
        });

        expect(value).toEqual({
            successful: false,
            errorMessage: "error-message",
        });
    });
});
