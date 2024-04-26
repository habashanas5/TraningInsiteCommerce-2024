/**
 * @jest-environment node
 */
import React from "react";
import { renderToString } from "react-dom/server";
import GridContainer from "./GridContainer";

describe("GridContainer", () => {
    test("can be rendered server side", () => {
        const ssr = () => renderToString(<GridContainer />);
        expect(ssr).not.toThrow();
    });
});
