import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import Button from "../Button";
import Icon from "../Icon";
import Menu, { MenuItemText } from "./Menu";
import menuItems, { conciseNames, conciseMenuItems } from "./menuData";
import ThemeProvider from "../ThemeProvider";

const buttonText = "hi there I'm a button";

const createProps = moreProps => ({
    menuItems,
    menuTrigger: <Button>{buttonText}</Button>,
    ...moreProps,
});

describe("Menu", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Menu {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("`nav` rendered by default", () => {
        props = createProps();
        const root = wrapper().find("nav");
        expect(root).toHaveLength(1);
    });
    test("menuTrigger is rendered", () => {
        props = createProps();
        const root = wrapper().find(Button);
        expect(root).toHaveLength(1);
        expect(root.text()).toContain(buttonText);
    });
    describe("renders all children up to maxDepth", () => {
        test("Renders all menu items when max depth is less than maxDepth", () => {
            props = createProps({ maxDepth: 4, menuItems: conciseMenuItems });
            const root = wrapper().find(Menu);
            const presentValues = {};
            root.find(MenuItemText).forEach(option => {
                const value = option.getDOMNode().innerHTML;
                presentValues[value] = true;
            });
            conciseNames.forEach(c => {
                expect(presentValues[c]).toBe(true);
            });
        });
        test("Does not render menu items outside of maxDepth", () => {
            props = createProps({ maxDepth: 2, menuItems: conciseMenuItems });
            const root = wrapper().find(Menu);
            const presentValues = {};
            root.find(MenuItemText).forEach(option => {
                const value = option.getDOMNode().innerHTML;
                presentValues[value] = true;
            });
            expect(presentValues[conciseNames[0]]).toBe(true);
            expect(presentValues[conciseNames[1]]).toBe(true);
            expect(presentValues[conciseNames[2]]).toBe(undefined);
            expect(presentValues[conciseNames[3]]).toBe(undefined);
        });
    });
    test("items with children have chevron icon", () => {
        props = createProps({ maxDepth: 2 });
        const root = wrapper();
        expect(root.find(Icon)).toHaveLength(1);
        expect(root.find("[src='ChevronRight']")).toHaveLength(1);
    });
});
