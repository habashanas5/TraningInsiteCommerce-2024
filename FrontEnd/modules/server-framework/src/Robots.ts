import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Request, Response } from "express";

const robots = async (request: Request, response: Response) => {
    const disallowText = "User-Agent: *\nDisallow: /\n";
    const headers = {
        "x-forwarded-host": request.get("host")!,
    };
    const getPageResponse = await fetch(`${process.env.ISC_API_URL}/api/v2/content/pageByType?type=robotstxtpage`, {
        headers,
    });
    const json = await getPageResponse.json();

    const { status } = getPageResponse;
    if (status !== 200 || !json.page) {
        response
            .status(status)
            .contentType(getPageResponse.headers.get("Content-Type") ?? "text/plain")
            .send("");
        return;
    }

    // look at the two widgets on the page to get the data we need to output
    const contentWidget = json.page.widgets.find((x: WidgetProps) => x.type === "RobotsTxt/RobotsTxtContent");

    // if disallow flag is on, ignore the cms content and return the default disallow text
    const sitemap = contentWidget?.generalFields.sitemap === true;
    const disallow = contentWidget?.generalFields.disallow === true;
    const sitemapIndexText = sitemap ? `sitemap: https://${request.headers.host?.toLowerCase()}/sitemapindex.xml` : "";
    const upperText = disallow ? disallowText : contentWidget?.generalFields.contentField;

    response.contentType("text/plain").send(`${upperText}\n${sitemapIndexText}`);
};

export default robots;
