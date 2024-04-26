import { mount } from "enzyme";
import "jest-styled-components";
import Button from "../Button";
import Modal from "./Modal";
import ThemeProvider from "../ThemeProvider";
import Typography from "../Typography";

const React = require("react");

describe("Modal", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Modal {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("calls the close handler when close button is clicked", () => {
        const fn = jest.fn();
        props = {
            isOpen: true,
            children: "children",
            handleClose: fn,
            isCloseable: true,
        };
        wrapper().find(Button).simulate("click");
        expect(fn).toHaveBeenCalled();
    });

    describe("renders children and props as expected", () => {
        describe("headline", () => {
            test("string", () => {
                const headlineText = "moose";
                props = {
                    isOpen: true,
                    headline: headlineText,
                    contentLabel: "mooseId",
                };
                const typography = wrapper().find('[id="modalTitle"]').find(Typography);
                expect(typography).toHaveLength(1);
                expect(typography.text()).toContain(headlineText);
            });
            test("node", () => {
                const headlineChild = "hat";
                props = {
                    isOpen: true,
                    headline: <div data-id="child-headline">{headlineChild}</div>,
                    contentLabel: "mooseId",
                };
                const headline = wrapper().find('[data-id="child-headline"]');
                expect(headline).toHaveLength(1);
                expect(headline.text()).toContain(headlineChild);
            });
        });
        test("children", () => {
            const childrenString = "hello there everyone";
            props = {
                isOpen: true,
                children: <div data-id="child-drawer">{childrenString}</div>,
            };
            const children = wrapper().find('[data-id="child-drawer"]');
            expect(children).toHaveLength(1);
            expect(children.text()).toContain(childrenString);
        });
    });
});
