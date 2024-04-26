import DataTable from "@insite/mobius/DataTable/DataTable";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";

import baseTheme from "@insite/mobius/globals/baseTheme";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

const themeGenerator = newProps => ({
    ...baseTheme,
    dataTable: { ...baseTheme.dataTable, ...newProps },
});

describe("DataTable", () => {
    let props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DataTable {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {
            /* prop: undefined */
        };
        mountedWrapper = undefined;
        theme = { ...baseTheme };
    });

    test("renders as a table by default", () => {
        const root = wrapper().find(DataTable).getDOMNode();
        expect(root instanceof HTMLTableElement).toBe(true);
    });

    describe("applies styling based on props and default", () => {
        describe("props with default", () => {
            test("instance css overrides default css by default", () => {
                props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                    },
                });
                const root = wrapper().find("table");
                expect(root).not.toHaveStyleRule("width", "50%");
                expect(root).toHaveStyleRule("border", "1px solid lime");
            });
            test("instance css overrides default css when instance mergeCss is false, even if default mergeCss is true", () => {
                props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                    mergeCss: false,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                        mergeCss: true,
                    },
                });
                const root = wrapper().find("table");
                expect(root).not.toHaveStyleRule("width", "50%");
                expect(root).toHaveStyleRule("border", "1px solid lime");
            });
            test("merges prop and variant css when mergeCss is true", () => {
                props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                    mergeCss: true,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                    },
                });
                const root = wrapper().find("table");
                expect(root).toHaveStyleRule("width", "50%");
                expect(root).toHaveStyleRule("border", "1px solid lime");
            });
        });
    });
});

describe("Multiple DataTables", () => {
    let dataTable1Props;
    let dataTable2Props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DataTable id="dataTable1" {...dataTable1Props} />
                    <DataTable id="dataTable2" {...dataTable2Props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        dataTable1Props = {
            /* prop: undefined */
        };
        dataTable2Props = {
            /* prop: undefined */
        };
        mountedWrapper = undefined;
        theme = { ...baseTheme };
    });

    describe("applies styling based on props and default", () => {
        describe("props with default", () => {
            test("merges instance and variant css for all instances when default mergeCss is true", () => {
                dataTable1Props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                };
                dataTable2Props = {
                    css: css`
                        border: 2px dashed orange;
                    `,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                        mergeCss: true,
                    },
                });
                const dataTable1 = wrapper().find("#dataTable1");
                const dataTable2 = wrapper().find("#dataTable2");
                expect(dataTable1).toHaveStyleRule("width", "50%");
                expect(dataTable1).toHaveStyleRule("border", "1px solid lime");
                expect(dataTable2).toHaveStyleRule("width", "50%");
                expect(dataTable2).toHaveStyleRule("border", "2px dashed orange");
            });
        });
    });
    describe("Datatable children", () => {
        let propsWithChildren = {},
            themeWithChildren = { ...baseTheme },
            mountedWrapperWithChildren = null;
        const data = returnData();

        const wrapperWithChildren = () => {
            if (!mountedWrapperWithChildren) {
                mountedWrapperWithChildren = mount(
                    <ThemeProvider theme={themeWithChildren}>
                        <DataTable {...propsWithChildren}>
                            <DataTableHead>
                                <DataTableHeader onSortClick={() => console.log("sorting")} tight>
                                    Date
                                </DataTableHeader>
                                <DataTableHeader onSortClick={() => console.log("sorting")} tight title="Order Number">
                                    Order #
                                </DataTableHeader>
                                <DataTableHeader>Ship To</DataTableHeader>
                                <DataTableHeader onSortClick={() => console.log("sorting")} sorted="descending" tight>
                                    Status
                                </DataTableHeader>
                                <DataTableHeader
                                    onSortClick={() => console.log("sorting")}
                                    tight
                                    title="Purchase Order Number"
                                >
                                    PO #
                                </DataTableHeader>
                                <DataTableHeader tight alignX="right">
                                    Order Total
                                </DataTableHeader>
                                <DataTableHeader tight title="reorder"></DataTableHeader>
                            </DataTableHead>
                            <DataTableBody>
                                {data.map(({ date, order, shipTo, status, po, total }) => (
                                    <DataTableRow key={order}>
                                        <DataTableCell>{date}</DataTableCell>
                                        <DataTableCell>{order}</DataTableCell>
                                        <DataTableCell>{shipTo}</DataTableCell>
                                        <DataTableCell>{status}</DataTableCell>
                                        <DataTableCell>{po}</DataTableCell>
                                        <DataTableCell alignX="right">${total}</DataTableCell>
                                        <DataTableCell>
                                            <button>Test button</button>
                                        </DataTableCell>
                                    </DataTableRow>
                                ))}
                            </DataTableBody>
                        </DataTable>
                    </ThemeProvider>,
                );
            }
            return mountedWrapperWithChildren;
        };

        beforeEach(() => {
            propsWithChildren = {};
            themeWithChildren = { ...baseTheme };
            mountedWrapperWithChildren = null;
        });

        test("Renders DataTableHead", () => {
            const wrapper = wrapperWithChildren();

            expect(wrapper.find(DataTableHead)).toHaveLength(1);
        });

        test("Renders DataTableHeader", () => {
            const wrapper = wrapperWithChildren();

            expect(wrapper.find(DataTableHeader)).toHaveLength(7);
        });
        test("DataTableHeader props of second element", () => {
            const wrapper = wrapperWithChildren();

            expect(wrapper.find(DataTableHeader).at(1).props().tight).toBeTruthy();
            expect(wrapper.find(DataTableHeader).at(1).props().title).toEqual("Order Number");
            expect(wrapper.find(DataTableHeader).at(1).text()).toEqual(
                "Order NumberOrder #sort by Order Number in descending order",
            );
        });

        test("Render DataTableBody", () => {
            const wrapper = wrapperWithChildren();

            expect(wrapper.find(DataTableBody)).toHaveLength(1);
        });

        test("Render DataTableRow", () => {
            const wrapper = wrapperWithChildren();

            expect(wrapper.find(DataTableRow)).toHaveLength(returnData().length);
        });

        test("DataTableCell", () => {
            const wrapper = wrapperWithChildren();

            expect(wrapper.find(DataTableCell)).toHaveLength(returnData().length * 7);
        });
    });
});

function returnData() {
    return [
        {
            date: "1/5/2018",
            order: 1234504,
            shipTo: "MFG Co., 123 North Fifth, Minneapolis, MN 55406",
            status: "Submitted",
            po: 10000,
            total: 805.92,
        },
        {
            date: "1/4/2018",
            order: 1234503,
            shipTo: "MFG Co., 123 North Fifth, Minneapolis, MN 55406",
            status: "Shipped",
            po: 10000,
            total: 44.01,
        },
        {
            date: "1/3/2018",
            order: 1234502,
            shipTo: "MFG Co., 123 North Fifth, Minneapolis, MN 55406",
            status: "RMA",
            po: 10000,
            total: 123.45,
        },
        {
            date: "1/2/2018",
            order: 1234501,
            shipTo: "MFG Co., 123 North Fifth, Minneapolis, MN 55406",
            status: "Complete",
            po: 10000,
            total: 44.01,
        },
        {
            date: "1/1/2018",
            order: 1234500,
            shipTo: "MFG Co., 123 North Fifth, Minneapolis, MN 55406",
            status: "Complete",
            po: 10000,
            total: 123.45,
        },
    ];
}
