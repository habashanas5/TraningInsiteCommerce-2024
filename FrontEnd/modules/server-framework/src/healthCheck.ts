import { generateDataIfNeeded } from "@insite/server-framework/PageRenderer";
import { Request, Response } from "express";

// No matter how frequently and concurrently the Spire health check is used, only one back-end API call happens concurrently.
let activeQuickPing: Promise<{ status: number; text: () => Promise<string> }> | undefined;
let activeSiteGeneration: ReturnType<typeof generateDataIfNeeded> | undefined;

const healthCheck = async (request: Request, response: Response) => {
    const quickPing =
        activeQuickPing ??
        (activeQuickPing = fetch(`${process.env.ISC_API_URL}/QuickPing.aspx`)
            .catch(() => {
                activeQuickPing = undefined;
                return {
                    status: 500,
                    text: () => Promise.resolve(""),
                };
            })
            .then(value => {
                value.text(); // Consume the data to fully complete the request, don't need to wait for this.
                activeQuickPing = undefined;
                return value;
            }));

    const siteGeneration = activeSiteGeneration ?? (activeSiteGeneration = generateDataIfNeeded(request));

    // Instead of immediately awaiting the APIs, we defer that to below so they run in parallel.

    const checks = {
        quickPing: (await quickPing).status === 200,
        siteGeneration: !(await siteGeneration).websiteIsClassic,
    };

    const allChecksPassed = (Object.keys(checks) as unknown as (keyof typeof checks)[]).reduce(
        (result, key) => result && checks[key],
        true,
    );

    response.status(allChecksPassed ? 200 : 500).json({
        nodeVersion: process.version, // Resolves any ambiguity about what version of Node is being used.
        checks,
    });
};

export default healthCheck;
