import Button from "@insite/mobius/Button";
import baseTheme from "@insite/mobius/globals/baseTheme";
import Icon from "@insite/mobius/Icon";
import Tab from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup/TabGroup";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import Typography from "@insite/mobius/Typography";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";

const tabGenerator = (title, children) => (
    <Tab tabKey={title} key={title} headline={title}>
        {children}
    </Tab>
);
const typeText = text => <Typography as="p">{text}</Typography>;
const themeGenerator = cssOverrides => ({
    ...baseTheme,
    tab: { defaultProps: {}, groupDefaultProps: { cssOverrides } },
    zIndex: {
        tabGroup: 1000,
    },
});

const baseTabs = [tabGenerator("moose", typeText("some info")), tabGenerator("cat", typeText("some other info"))];

describe("TabGroup", () => {
    let props;
    let tabs;
    let theme;
    let mountedWrapper;
    const wrapper = document => {
        if (!mountedWrapper) {
            const options = document ? { attachTo: document.body } : undefined;

            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <TabGroup {...props}>{tabs}</TabGroup>
                </ThemeProvider>,
                options,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        tabs = [];
        mountedWrapper = undefined;
    });

    test("renders each child tab passed to it", () => {
        tabs = baseTabs;
        tabs.push(
            <Tab headline={<Icon src="Mail" />} tabKey="Mail" key="Mail">
                {typeText("Mail lobby")}
            </Tab>,
        );
        expect(wrapper().find(Tab)).toHaveLength(3);
        const root = wrapper();
        const tabGroupRoot = root.find(TabGroup).text();
        expect(tabGroupRoot).toContain("moose");
        expect(tabGroupRoot).toContain("cat");
        expect(root.find(Icon)).toHaveLength(1);
    });

    test("renders the children of each child tab passed to it", () => {
        const text = ["haha I am a text block", "Here's another text block", "Blocktual text", "Button text"];
        const complexChildren = (
            <>
                {typeText(text[0])}
                <Button>{text[1]}</Button>
                {typeText(text[2])}
            </>
        );
        tabs = [tabGenerator("complext", complexChildren), tabGenerator("cat", typeText(text[3]))];

        const root = wrapper();
        expect(root.find(Button)).toHaveLength(1);
        const tabGroupRoot = root.find(TabGroup).text();
        text.forEach(t => expect(tabGroupRoot).toContain(t));
    });

    test("visually hides all but the currently selected tab content", () => {
        tabs = baseTabs;
        wrapper()
            .find('[data-id="tabContent"]')
            .children()
            .forEach(a => {
                if (a.props().hidden) {
                    expect(a).toHaveStyleRule("display", "none");
                }
                if (!a.props().hidden) {
                    expect(a).not.toHaveStyleRule("display", "none");
                }
            });
    });

    test("accepts an initially selected tab through props", () => {
        tabs = baseTabs;
        const current = "moose";
        props = { current };
        wrapper()
            .find('[data-id="tabContent"]')
            .children()
            .forEach(a => {
                if (a.props()["data-title"] === current) {
                    expect(a).not.toHaveStyleRule("display", "none");
                }
            });
    });

    describe("appropriately applies css overrides", () => {
        describe("tabContent", () => {
            test("instance with no theme applies instance", () => {
                tabs = baseTabs;
                props = { cssOverrides: { tabContent: "background: blue;" } };
                expect(wrapper().find('[data-id="tabContent"]')).toHaveStyleRule("background", "blue");
            });
            test("theme with no instance applies theme", () => {
                tabs = baseTabs;
                theme = themeGenerator({ tabContent: "border: 3px solid deeppink;" });
                expect(wrapper().find('[data-id="tabContent"]')).toHaveStyleRule("border", "3px solid deeppink");
            });
            test("theme and instance applies instance", () => {
                tabs = baseTabs;
                theme = themeGenerator({ tabContent: "border: 3px solid deeppink; background: red;" });
                props = { cssOverrides: { tabContent: "background: blue;" } };
                expect(wrapper().find('[data-id="tabContent"]')).toHaveStyleRule("background", "blue");
                expect(wrapper().find('[data-id="tabContent"]')).not.toHaveStyleRule("border", "3px solid deeppink");
                expect(wrapper().find('[data-id="tabContent"]')).not.toHaveStyleRule("background", "red");
            });
        });

        describe("tabGroup", () => {
            test("instance with no theme applies instance", () => {
                tabs = baseTabs;
                props = { cssOverrides: { tabGroup: "color: blue;" } };
                expect(wrapper().find('[data-id="tabGroup"]')).toHaveStyleRule("color", "blue");
            });
            test("theme with no instance applies theme", () => {
                tabs = baseTabs;
                theme = themeGenerator({ tabGroup: "background: coral;" });
                expect(wrapper().find('[data-id="tabGroup"]')).toHaveStyleRule("background", "coral");
            });
            test("theme and instance applies instance", () => {
                tabs = baseTabs;
                theme = themeGenerator({ tabGroup: "display: inline-block; margin: 4px;" });
                props = { cssOverrides: { tabGroup: "margin: 14px 12px;" } };
                expect(wrapper().find('[data-id="tabGroup"]')).toHaveStyleRule("margin", "14px 12px");
                expect(wrapper().find('[data-id="tabGroup"]')).not.toHaveStyleRule("display", "inline-block");
                expect(wrapper().find('[data-id="tabGroup"]')).not.toHaveStyleRule("margin", "4px");
            });
        });

        describe("wrapper", () => {
            test("instance with no theme applies instance", () => {
                tabs = baseTabs;
                props = { cssOverrides: { wrapper: "margin: 13px 1em 1px 12em;" } };
                expect(wrapper().find(TabGroup)).toHaveStyleRule("margin", "13px 1em 1px 12em");
            });
            test("theme with no instance applies theme", () => {
                tabs = baseTabs;
                theme = themeGenerator({ wrapper: "color: azure;" });
                expect(wrapper().find(TabGroup)).toHaveStyleRule("color", "azure");
            });
            test("theme and instance applies instance", () => {
                tabs = baseTabs;
                theme = themeGenerator({ wrapper: "padding: 13em; background: red;" });
                props = { cssOverrides: { wrapper: "background: rebeccapurple;" } };
                expect(wrapper().find(TabGroup)).toHaveStyleRule("background", "rebeccapurple");
                expect(wrapper().find(TabGroup)).not.toHaveStyleRule("padding", "13em");
                expect(wrapper().find(TabGroup)).not.toHaveStyleRule("background", "red");
            });
        });
    });

    describe("accessibility behaviors", () => {
        test("navigates between tabs by arrow key", () => {
            tabs = baseTabs;
            const fn = jest.fn();
            props = { onTabChange: fn };
            wrapper().find('[data-id="tabGroup"]').first().simulate("keyDown", {
                keyCode: 39,
                which: 39,
                key: "right arrow",
            });
            expect(fn).toHaveBeenCalled();
        });
        test("focuses content on down arrow", () => {
            tabs = baseTabs;
            const root = wrapper(document);
            root.find('[data-id="tabGroup"]').first().simulate("keyDown", {
                keyCode: 40,
                which: 40,
                key: "down arrow",
            });

            const elem = root.find('[data-id="tabContent"]').getDOMNode();

            expect(document.activeElement).toEqual(elem);
        });
    });

    test("Test z-index from theme", () => {
        theme = themeGenerator({});
        tabs = baseTabs;
        expect(wrapper().find('[data-id="tabContent"]')).toHaveStyleRule("z-index", "999");
    });
});
