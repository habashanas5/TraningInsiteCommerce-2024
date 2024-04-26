/**
 * @jest-environment node
 */
import addMaximumScaleToViewport from "@insite/client-framework/Common/Utilities/addMaximumScaleToViewport";
import { JSDOM } from "jsdom";

describe("addMaximumScaleToViewport function", () => {
    test("should add maximum-scale to the viewport in head tag", () => {
        const documentHTML = new JSDOM(`
			<!doctype html>
				<html>
					<head>
						<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
					</head>
					<body>
						<div></div>
					</body>
				</html>
			`);
        global.document = documentHTML.window.document;

        addMaximumScaleToViewport();

        expect(document.querySelector("meta[name=viewport]")!.getAttribute("content")).toBe(
            "width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0",
        );
    });
});
