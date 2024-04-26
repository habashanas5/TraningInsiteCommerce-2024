import { mount } from "enzyme";
import { css } from "styled-components";
import "jest-styled-components";
import React from "react";
import Button from "../Button";
import baseTheme from "../globals/baseTheme";
import Icon from "../Icon";
import Check from "../Icons/Check";
import ThemeProvider from "../ThemeProvider";
import Toast from "./Toast";
import Toaster from "./Toaster";
import ToasterContext from "./ToasterContext";
import Typography from "../Typography";

const defaultBody = "Item(s) added to your cart!";

const defaultToastProps = { messageType: "success", timeout: 1500, body: defaultBody };

/* eslint-disable */
const buildConsumerChildren = toastProps => {
    return ({ addToast }) => (
        <Button
            id="toast-button"
            shape="rounded"
            css={css`
                margin-right: 10px;
            `}
            color="success"
            onClick={() =>
                addToast({
                    messageType: "success",
                    timeout: 15000,
                    ...toastProps,
                })
            }
        >
            Toast Button
        </Button>
    );
};
/* eslint-enable */
const themeGenerator = defaultProps => ({
    ...baseTheme,
    toast: { defaultProps, toasterProps: baseTheme.toast.toasterProps },
});

describe("Toast", () => {
    let consumerChildren;
    let children;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme} createChildGlobals={false}>
                    <ToasterContext.Provider>
                        <Toaster>
                            {children}
                            <ToasterContext.Consumer>{consumerChildren}</ToasterContext.Consumer>
                        </Toaster>
                    </ToasterContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        /* eslint-disable */
        consumerChildren = buildConsumerChildren({ body: defaultBody });
        /* eslint-enable */
        theme = baseTheme;
        children = <div>hi</div>;
        mountedWrapper = undefined;
    });

    describe("render HTML elements", () => {
        describe("toaster", () => {
            test("renders children", () => {
                children = <div id="hat">hat</div>;
                expect(wrapper().find('[id="hat"]').getDOMNode()).toBeInstanceOf(HTMLDivElement);
            });
            test("renders wrapper divs (two)", () => {
                children = <span>hat</span>;
                expect(wrapper().find("div")).toHaveLength(2);
            });
            test("renders toast when passed callback", () => {
                const root = wrapper();
                root.find(Button).simulate("click");
                expect(root.find(Toast)).toHaveLength(1);
            });
        });
        describe("toast", () => {
            test("renders expected icon", () => {
                const root = wrapper();
                setTimeout(() => {
                    root.find(Button).simulate("click");
                    expect(root.find(Icon)).toHaveLength(2);
                    expect(root.find(Check)).toHaveLength(1);
                }, 200);
            });
            test("renders button", () => {
                const root = wrapper();
                root.find(Button).simulate("click");
                expect(root.find(Button)).toHaveLength(2);
                expect(root.find("[src='X']")).toHaveLength(1);
            });
            test("renders body when passed with no children", () => {
                const root = wrapper();
                root.find(Button).simulate("click");
                expect(root.find('[data-id="toast-body"]').find(Typography).text()).toContain(defaultBody);
            });
            test("renders children when passed with body", () => {
                consumerChildren = buildConsumerChildren({
                    body: "hat",
                    children: <div id="moose-man">Moose man</div>,
                });
                const root = wrapper();
                root.find(Button).simulate("click");
                expect(root.find('[id="moose-man"]')).toHaveLength(1);
            });
            test("renders children when passed with no body", () => {
                consumerChildren = buildConsumerChildren({ children: <div id="can-can-man">Moose man</div> });
                const root = wrapper();
                root.find(Button).simulate("click");
                expect(root.find('[id="can-can-man"]')).toHaveLength(1);
            });
        });
    });
    describe("functionality", () => {
        test("ToasterContext provides addToast, removeToast and defaultTimeout", () => {
            consumerChildren = ({ addToast, removeToast, defaultTimeout }) => {
                expect(addToast).toBeInstanceOf(Function);
                expect(removeToast).toBeInstanceOf(Function);
                expect(defaultTimeout).toEqual(3000);
            };
            wrapper();
        });
        test("a maximum of three toasts render at a time", () => {
            const toastProps = { messageType: "success", timeout: 15000, body: "hi there" };
            /* eslint-disable */
            consumerChildren = ({ addToast }) => (
                <Button
                    id="toast-button"
                    shape="rounded"
                    css={css`
                        margin-right: 10px;
                    `}
                    color="success"
                    onClick={() => {
                        addToast(toastProps);
                        addToast(toastProps);
                        addToast(toastProps);
                        addToast(toastProps);
                    }}
                >
                    Toast Button
                </Button>
            );
            /* eslint-enable */
            const root = wrapper();
            root.find(Button).simulate("click");
            expect(root.find(Toast)).toHaveLength(3);
        });
        test("first toast in queue renders after a toast rolls off of the render stack", () => {
            const toastProps = { messageType: "success", timeout: 150, body: "hi there" };
            /* eslint-disable */
            consumerChildren = ({ addToast }) => (
                <Button
                    id="toast-button"
                    shape="rounded"
                    css={css`
                        margin-right: 10px;
                    `}
                    color="success"
                    onClick={() => {
                        addToast(toastProps);
                        addToast(toastProps);
                        addToast(toastProps);
                        addToast({ messageType: "danger", timeout: 1500, body: "whoopsie" });
                    }}
                >
                    Toast Button
                </Button>
            );
            /* eslint-enable */
            const root = wrapper();
            root.find(Button).simulate("click");
            expect(root.find("[src='Check']")).toHaveLength(3);
            expect(root.find("[src='AlertCircle']")).toHaveLength(0);
            setTimeout(() => {
                expect(root.find("[src='Check']")).toHaveLength(2);
                expect(root.find("[src='AlertCircle']")).toHaveLength(1);
            }, 200);
        });
    });
    describe("appropriately applies theme overrides", () => {
        describe("css overrides", () => {
            test("instance with no theme applies instance", () => {
                children = <Toast {...defaultToastProps} cssOverrides={{ toast: "background: red;" }} in={true} />;
                expect(wrapper().find(Toast)).toHaveStyleRule("background", "red");
            });
            test("theme with no instance applies theme", () => {
                children = <Toast {...defaultToastProps} in={true} />;
                theme = themeGenerator({ cssOverrides: { toastBody: "margin-right: 47px;" } });
                expect(wrapper().find('[data-id="toast-body"]')).toHaveStyleRule("margin-right", "47px");
            });
            test("theme and instance applies instance", () => {
                children = (
                    <Toast
                        {...defaultToastProps}
                        cssOverrides={{ toast: "background: orange;", toastBody: "border: 1px dashed yellow;" }}
                        in={true}
                    />
                );
                theme = themeGenerator({ cssOverrides: { toastBody: "border: 3px solid blue;" } });
                const root = wrapper();
                expect(root.find('[data-id="toast-body"]')).toHaveStyleRule("border", "1px dashed yellow");
                expect(root.find('[data-id="toast-body"]')).not.toHaveStyleRule("border", "3px solid blue");
                expect(root.find(Toast)).toHaveStyleRule("background", "orange");
            });
        });
        describe("closeButtonProps", () => {
            test("instance with no theme applies instance", () => {
                children = <Toast {...defaultToastProps} closeButtonProps={{ shape: "rounded" }} in={true} />;
                expect(wrapper().find(Button)).toHaveStyleRule("border-radius", ".5em");
            });
            test("theme with no instance applies theme", () => {
                children = <Toast {...defaultToastProps} in={true} />;
                theme = themeGenerator({ closeButtonProps: { shape: "pill" } });
                expect(wrapper().find(Button)).toHaveStyleRule("border-radius", "20px");
            });
            test("theme and instance applies instance", () => {
                children = (
                    <Toast {...defaultToastProps} closeButtonProps={{ shadow: true, shape: "rounded" }} in={true} />
                );
                theme = themeGenerator({ closeButtonProps: { shadow: false } });
                const root = wrapper();
                expect(root.find(Button)).toHaveStyleRule("box-shadow", baseTheme.shadows[1]);
                expect(root.find(Button)).toHaveStyleRule("border-radius", ".5em");
            });
        });
        describe("iconProps", () => {
            test("instance with no theme applies instance", () => {
                children = <Toast {...defaultToastProps} iconProps={{ size: 35 }} in={true} />;
                setTimeout(() => {
                    expect(wrapper().find(Icon).first()).toHaveStyleRule("height", "35px");
                }, 200);
            });
            test("theme with no instance applies theme", () => {
                children = <Toast {...defaultToastProps} in={true} />;
                theme = themeGenerator({ iconProps: { color: "orange" } });
                setTimeout(() => {
                    expect(wrapper().find(Icon).first()).toHaveStyleRule("color", "orange");
                }, 200);
            });
            test("theme and instance applies instance", () => {
                children = <Toast {...defaultToastProps} iconProps={{ color: "blue", size: 80 }} in={true} />;
                theme = themeGenerator({ iconProps: { size: 52 } });
                const root = wrapper();
                setTimeout(() => {
                    expect(root.find(Icon).first()).toHaveStyleRule("height", "80px");
                    expect(root.find(Icon).first()).not.toHaveStyleRule("height", "52px");
                    expect(root.find(Icon).first()).toHaveStyleRule("color", "blue");
                }, 200);
            });
        });
        describe("bodyTypographyProps", () => {
            test("instance with no theme applies instance", () => {
                children = <Toast {...defaultToastProps} bodyTypographyProps={{ italic: true }} in={true} />;
                expect(wrapper().find(Typography)).toHaveStyleRule("font-style", "italic");
            });
            test("theme with no instance applies theme", () => {
                children = <Toast {...defaultToastProps} in={true} />;
                theme = themeGenerator({ bodyTypographyProps: { color: "primary" } });
                expect(wrapper().find(Typography)).toHaveStyleRule("color", "#275AA8");
            });
            test("theme and instance applies instance", () => {
                children = (
                    <Toast {...defaultToastProps} bodyTypographyProps={{ weight: 400, underline: false }} in={true} />
                );
                theme = themeGenerator({ bodyTypographyProps: { underline: true } });
                const root = wrapper();
                expect(root.find(Typography)).toHaveStyleRule("font-weight", "400");
                expect(root.find(Typography)).not.toHaveStyleRule("text-decoration", "underline");
            });
        });
    });
});
