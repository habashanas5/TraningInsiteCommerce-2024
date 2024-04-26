import translate from "@insite/client-framework/Translate";

test("Translate should handle {0} parameters", () => {
    const value = translate("{0} and {1}", "dog", "cat");

    expect(value).toEqual("dog and cat");
});
