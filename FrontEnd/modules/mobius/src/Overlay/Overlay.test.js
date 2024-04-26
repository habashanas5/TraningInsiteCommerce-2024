import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { keyframes } from "styled-components";
import Overlay from "./Overlay";
import Scrim from "./Scrim";
import ThemeProvider from "../ThemeProvider";

const propsBuilder = propOverrides => ({
    handleClose: () => {},
    role: "dialog",
    isOpen: true,
    isCloseable: false,
    transition: {
        enabled: true,
        length: 300,
        // stylelint-disable
        overlayEntryKeyframes: keyframes` from { margin-top: -100px; } to { margin-top: 0px; }`,
        overlayExitKeyframes: keyframes` from { margin-top: 0; } to { margin-top: -100px; }`,
        scrimEntryKeyframes: keyframes` from { opacity: 0; } to { opacity: 1; } `,
        scrimExitKeyframes: keyframes` from { opacity: 1; } to { opacity: 0; } `,
        // stylelint-enable
    },
    titleId: "modalTitle",
    zIndexLevel: "modal",
    ...propOverrides,
});

const escKeypress = {
    keyCode: 27,
    which: 27,
    key: "escape",
};

describe("Overlay", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Overlay {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        Overlay.setAppElement("body");
        props = propsBuilder();
        mountedWrapper = undefined;
    });

    test("doesn't render if open prop is false", () => {
        props = propsBuilder({ isOpen: false });
        const root = wrapper().find(Overlay).getDOMNode();
        expect(root).toBeNull();
    });

    test("renders as a div if open prop is true", () => {
        props = propsBuilder();
        const root = wrapper().find(Overlay).getDOMNode();
        expect(root).toBeInstanceOf(HTMLDivElement);
    });

    describe("calls the close handler as expected", () => {
        describe("when esc key is pressed", () => {
            test("and is closeable", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: true,
                });
                wrapper().find(Overlay).simulate("keyDown", escKeypress);
                expect(fn).toHaveBeenCalled();
            });
            test("not when closeOnEsc is false", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    closeOnEsc: false,
                    isCloseable: true,
                });
                wrapper().find(Overlay).simulate("keyDown", escKeypress);
                expect(fn).not.toHaveBeenCalled();
            });
            test("not when isCloseable is false", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: false,
                });
                wrapper().find(Overlay).simulate("keyDown", escKeypress);
                expect(fn).not.toHaveBeenCalled();
            });
        });
        describe("when Scrim is clicked", () => {
            test("and is closeable", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: true,
                });
                wrapper().find(Scrim).simulate("click");
                expect(fn).toHaveBeenCalled();
            });
            test("not when closeOnScrimClick is false", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    closeOnScrimClick: false,
                    isCloseable: true,
                });
                wrapper().find(Scrim).simulate("click");
                expect(fn).not.toHaveBeenCalled();
            });
            test("not when isCloseable is false", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: false,
                });
                wrapper().find(Scrim).simulate("click");
                expect(fn).not.toHaveBeenCalled();
            });
        });
        describe("isCloseable and independent props", () => {
            test("closeable with no scrimClick close", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: true,
                    closeOnScrimClick: false,
                });
                const root = wrapper();
                root.find(Scrim).simulate("click");
                expect(fn).not.toHaveBeenCalled();
                root.find(Overlay).simulate("keyDown", escKeypress);
                expect(fn).toHaveBeenCalled();
            });
            test("closeable with no esc close", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: true,
                    closeOnEsc: false,
                });
                const root = wrapper();
                root.find(Overlay).simulate("keyDown", escKeypress);
                expect(fn).not.toHaveBeenCalled();
                root.find(Scrim).simulate("click");
                expect(fn).toHaveBeenCalled();
            });
            test("when false nothing works", () => {
                const fn = jest.fn();
                props = propsBuilder({
                    handleClose: fn,
                    isCloseable: false,
                });
                const root = wrapper();
                root.find(Overlay).simulate("keyDown", escKeypress);
                expect(fn).not.toHaveBeenCalled();
                root.find(Scrim).simulate("click");
                expect(fn).not.toHaveBeenCalled();
            });
        });
    });
});
