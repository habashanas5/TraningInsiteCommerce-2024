import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Clickable from "./Clickable";
import DisablerContext from "../utilities/DisablerContext";

describe("Clickable", () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <Clickable {...props} />
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

    test("renders null if no children are provided", () => {
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeNull();
    });

    test("renders a styled span if no href or onClick are provided", () => {
        props = { children: <canvas /> };
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeInstanceOf(HTMLSpanElement);
    });

    test("renders an anchor when an href is provided, regardless of onClick", () => {
        props = {
            children: "children",
            href: "https://insitesoft.com",
            onClick: () => null,
        };
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeInstanceOf(HTMLAnchorElement);
    });

    test("renders a button when an onClick is provided, but no href", () => {
        props.children = "children";
        props.onClick = () => {
            return null;
        };
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeInstanceOf(HTMLButtonElement);
    });

    test("calls the onClick function when the component is clicked", () => {
        const fn = jest.fn();
        props = {
            children: "children",
            onClick: fn,
        };
        wrapper().find(Clickable).simulate("click");
        expect(fn).toHaveBeenCalled();
    });

    describe("is appropriately disabled", () => {
        test("as a link tabIndex -1 if DisablerContext is true", () => {
            props = {
                children: "children",
                href: "https://insitesoft.com",
            };
            disablerValue = { disable: true };
            expect(wrapper().find("a").prop("tabIndex")).toEqual(-1);
        });
        describe("as a button", () => {
            test("if DisablerContext is true", () => {
                props = { children: "children", onClick: () => null };
                disablerValue = { disable: true };
                expect(wrapper().find("button").prop("disabled")).toBe(true);
            });
            test("if DisablerContext is false and disabled is true", () => {
                props = { children: "children", onClick: () => null, disabled: true };
                disablerValue = { disable: false };
                expect(wrapper().find("button").prop("disabled")).toBe(true);
            });
            test("if DisablerContext is false and disabled is false", () => {
                props = { children: "children", onClick: () => null, disabled: false };
                disablerValue = { disable: false };
                expect(wrapper().find("button").prop("disabled")).toBe(false);
            });
        });
    });
});
