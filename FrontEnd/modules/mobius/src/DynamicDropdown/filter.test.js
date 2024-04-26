/**
 * @jest-environment node
 */
import filter from "./filter";

describe("filter", () => {
    describe("success cases", () => {
        test("matches value", () => {
            expect(filter({ optionText: "moose" }, "moose")).toEqual(true);
        });
        test("matches data", () => {
            expect(filter({ optionText: "mountain cow", searchString: "moose" }, "moose")).toEqual(true);
        });
        test("case mismatch but letter match", () => {
            expect(filter({ optionText: "MooSe" }, "moose")).toEqual(true);
        });
        test("any part of string", () => {
            expect(filter({ optionText: "Mamooses" }, "moose")).toEqual(true);
            expect(filter({ optionText: "moose-man-mouse-eater" }, "moose")).toEqual(true);
        });
    });
    describe("fail cases", () => {
        test("mismatch value", () => {
            expect(filter({ optionText: "moose" }, "seahorse")).toEqual(false);
        });
        test("mismatch data", () => {
            expect(filter({ optionText: "mountain cow", searchString: "moose" }, "elephant")).toEqual(false);
        });
    });
});
