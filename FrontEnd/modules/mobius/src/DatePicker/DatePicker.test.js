import "jest-styled-components";
import "jest-canvas-mock";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import DatePicker, { DatePickerIcon } from "./DatePicker";
import Icon from "../Icon";
import DisablerContext from "../utilities/DisablerContext";
import { FormFieldStyle } from "@insite/mobius/FormField";

describe("DatePicker", () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <DatePicker {...props} />
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

    test("displays a calendar icon by default", () => {
        expect(wrapper().find(Icon).find("[src='Calendar']")).toHaveLength(1);
    });

    test("renders the placeholder text", () => {
        props = {
            placeholders: {
                yearPlaceholder: "year",
                monthPlaceholder: "mese",
                dayPlaceholder: "jour",
                hourPlaceholder: "hr",
            },
        };
        const root = wrapper();
        expect(root.find('input[name="month"]').prop("placeholder")).toEqual("mese");
        expect(root.find('input[name="day"]').prop("placeholder")).toEqual("jour");
        expect(root.find('input[name="year"]').prop("placeholder")).toEqual("year");
        expect(root.find('input[name="hour12"]')).toHaveLength(0);
        expect(root.find('input[name="minute"]')).toHaveLength(0);
        expect(root.find('input[name="second"]')).toHaveLength(0);
    });

    describe("initial rendering", () => {
        test("renders an initial date based on the prop", () => {
            props = { selectedDay: new Date(2018, 1, 12) };
            expect(wrapper().find('input[name="datetime"]').prop("value")).toEqual("2018-02-12T00:00");
        });
    });

    test("onChange is called", () => {
        const fn = jest.fn();
        props = { format: "dd/MM/y", selectedDay: new Date(2018, 1, 12), onDayChange: fn };
        const root = wrapper();
        root.find("button").first().simulate("click");
        expect(root.find('input[name="datetime"]').prop("value")).toEqual("");
        expect(fn).toHaveBeenCalled();
    });

    describe("date validation", () => {
        test("invalid if you choose a disabled day", () => {
            props = {
                selectedDay: new Date(2020, 0, 11),
                dateTimePickerProps: {
                    tileDisabled: ({ date }) => {
                        const dayNum = date.getDay();
                        return dayNum === 0 || dayNum === 6;
                    },
                },
            };
            expect(wrapper().find('div[role="group"]').prop("aria-invalid")).toEqual(true);
        });

        test("invalid if you choose a day before the minDate", () => {
            props = {
                selectedDay: new Date(2019, 8, 23),
                dateTimePickerProps: { minDate: new Date(2020, 0, 11) },
            };
            expect(wrapper().find('div[role="group"]').prop("aria-invalid")).toEqual(true);
        });

        test("invalid if you choose a day after the maxDate", () => {
            props = {
                selectedDay: new Date(2020, 8, 23),
                dateTimePickerProps: { maxDate: new Date(2019, 9, 11) },
            };
            expect(wrapper().find('div[role="group"]').prop("aria-invalid")).toEqual(true);
        });

        describe("required", () => {
            test("becomes invalid if day is cleared", () => {
                props = { selectedDay: new Date(2018, 1, 12), required: true };
                const root = wrapper();
                expect(root.find('div[role="group"]').prop("aria-invalid")).toEqual(false);
                root.find("button").first().simulate("click");
                expect(root.find('input[name="datetime"]').prop("value")).toEqual("");
                expect(root.find('div[role="group"]').prop("aria-invalid")).toEqual(true);
            });

            test("invalid when starts empty", () => {
                props = { selectedDay: undefined, required: true };
                expect(wrapper().find('div[role="group"]').prop("aria-invalid")).toEqual(true);
            });
        });
    });

    describe("is appropriately disabled", () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            const root = wrapper();
            expect(root.find("input[name='month']").prop("disabled")).toBe(true);
            expect(root.find("input[name='day']").prop("disabled")).toBe(true);
            expect(root.find("input[name='year']").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            const root = wrapper();
            expect(root.find("input[name='month']").prop("disabled")).toBe(true);
            expect(root.find("input[name='day']").prop("disabled")).toBe(true);
            expect(root.find("input[name='year']").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            const root = wrapper();
            expect(root.find("input[name='month']").prop("disabled")).toBe(false);
            expect(root.find("input[name='day']").prop("disabled")).toBe(false);
            expect(root.find("input[name='year']").prop("disabled")).toBe(false);
        });
    });
    describe("Background color", () => {
        test("On FormFieldStyle", () => {
            props = { backgroundColor: "green" };
            const root = wrapper();
            expect(root.find(FormFieldStyle).prop("_backgroundColor")).toBe("green");
        });
        test("On DatePickerIcon", () => {
            props = { backgroundColor: "green" };
            const root = wrapper();
            const datePickerIcons = root.find(DatePickerIcon);
            const clearIcon = datePickerIcons.at(0);
            const calendarIcon = datePickerIcons.at(1);
            expect(clearIcon.prop("_backgroundColor")).toBe("green");
            expect(calendarIcon.prop("_backgroundColor")).toBe("green");
        });
    });
});
