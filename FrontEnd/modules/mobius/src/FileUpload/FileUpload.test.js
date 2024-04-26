import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import FileUpload from "./FileUpload";
import Icon from "../Icon";
import DisablerContext from "../utilities/DisablerContext";

describe("FileUpload", () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <FileUpload {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    describe("render html elements", () => {
        test("file input field with icon", () => {
            const root = wrapper();
            expect(root.find("input")).toHaveLength(1);
            expect(root.find(Icon)).toHaveLength(1);
        });
        test("file input label if enabled", () => {
            expect(wrapper().find("label")).toHaveLength(1);
        });
        test("file input button if disabled", () => {
            props = { disabled: true };
            expect(wrapper().find("button")).toHaveLength(1);
        });
    });

    describe("functionality", () => {
        test("calls onChange when file is changed", () => {
            const fn = jest.fn();
            props = { onFileChange: fn, inputId: "hat" };
            const file = new File(["(⌐□_□)"], "chucknorris.png", {
                type: "image/png",
            });
            const root = wrapper();
            root.find("input")
                .first()
                .simulate("change", { target: { files: [file] } });
            expect(fn).toHaveBeenCalled();
        });
        test("displays name of file when added", () => {
            const fn = jest.fn();
            props = { onFileChange: fn, inputId: "hat" };
            const file = new File(["(⌐□_□)"], "chucknorris.png", {
                type: "image/png",
            });
            const root = wrapper();
            expect(root.find("input")).toHaveLength(1);
            root.find("input")
                .first()
                .simulate("change", { target: { files: [file] } });
            expect(root.find("input")).toHaveLength(2);
            expect(root.find('input[data-id="visualInput"]').prop("value")).toEqual("chucknorris.png");
        });
        describe("clear button", () => {
            test("appears when file is added", () => {
                props = { inputId: "hat" };
                const file = new File(["(⌐□_□)"], "chucknorris.png", {
                    type: "image/png",
                });
                const root = wrapper();
                expect(root.find(Icon)).toHaveLength(1);
                root.find("input")
                    .first()
                    .simulate("change", { target: { files: [file] } });
                expect(root.find(Icon)).toHaveLength(2);
            });
            test("removes the file visually and in element when clicked", () => {
                props = { inputId: "hat" };
                const file = new File(["(⌐□_□)"], "chucknorris.png", {
                    type: "image/png",
                });
                const root = wrapper();
                root.find("input")
                    .first()
                    .simulate("change", { target: { files: [file] } });
                expect(root.find('input[data-id="visualInput"]').prop("value")).toEqual("chucknorris.png");
                root.find("button").first().simulate("click");
                expect(root.find('input[data-id="visualInput"]').prop("value")).not.toEqual("chucknorris.png");
            });
        });
        describe("is appropriately disabled", () => {
            test("if DisablerContext is true", () => {
                disablerValue = { disable: true };
                const root = wrapper();
                expect(root.find("input[data-id='functionalInput']").prop("disabled")).toBe(true);
                expect(root.find("button").prop("disabled")).toBe(true);
            });
            test("if DisablerContext is false and disabled is true", () => {
                props = { disabled: true };
                disablerValue = { disable: false };
                const root = wrapper();
                expect(root.find("input[data-id='functionalInput']").prop("disabled")).toBe(true);
                expect(root.find("button").prop("disabled")).toBe(true);
            });
            test("if DisablerContext is false and disabled is false", () => {
                disablerValue = { disable: false };
                const root = wrapper();
                expect(root.find("input[data-id='functionalInput']").prop("disabled")).toBe(false);
                // display button is a label when the form is disabled
                expect(root.find("button").exists()).toBe(false);
            });
        });
    });
});
