import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import menuItems, { conciseMenuItems, conciseNames } from "../Menu/menuData";
import PanelMenu from "./PanelMenu";
import PanelRow from "./PanelRow";
import ThemeProvider from "../ThemeProvider";
import Typography from "../Typography";

const triggerText = "hi there I'm a button";

const createProps = moreProps => ({
    menuItems,
    panelTrigger: (
        <PanelRow hasChildren>
            <Typography>{triggerText}</Typography>
        </PanelRow>
    ),
    layer: 0,
    ...moreProps,
});

describe("PanelMenu", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <PanelMenu {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    describe("Renders expected elements", () => {
        test("`nav` rendered by default", () => {
            props = createProps();
            const root = wrapper().find("nav");
            expect(root).toHaveLength(1);
        });
        test("panelTrigger is rendered", () => {
            props = createProps();
            expect(wrapper().text()).toContain(triggerText);
        });
        describe("renders all children up to maxDepth", () => {
            test("Renders all menu items when max depth is less than maxDepth", () => {
                props = createProps({ maxDepth: 4, menuItems: conciseMenuItems });
                const root = wrapper().find(PanelMenu);
                const presentValues = {};
                root.find(Typography).forEach(option => {
                    const value = option.getDOMNode().innerHTML;
                    presentValues[value] = true;
                });
                conciseNames.forEach(c => {
                    expect(presentValues[c]).toBe(true);
                });
            });
            test("Does not render menu items outside of maxDepth", () => {
                props = createProps({ maxDepth: 2, menuItems: conciseMenuItems });
                const root = wrapper().find(PanelMenu);
                const presentValues = {};
                root.find(Typography).forEach(option => {
                    const value = option.getDOMNode().innerHTML;
                    presentValues[value] = true;
                });
                expect(presentValues[conciseNames[0]]).toBe(true);
                expect(presentValues[conciseNames[1]]).toBe(true);
                expect(presentValues[conciseNames[2]]).toBe(undefined);
                expect(presentValues[conciseNames[3]]).toBe(undefined);
            });
        });
    });
    test("calls `closeOverlay` when X icon is clicked", () => {
        const fn = jest.fn();
        props = createProps({
            closeOverlay: fn,
            maxDepth: 1,
        });
        const root = wrapper();
        root.find("[src='X']").first().simulate("click");
        expect(fn).toHaveBeenCalled();
    });
});
